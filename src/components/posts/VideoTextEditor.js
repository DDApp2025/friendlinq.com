// Robert's addition (Nov 6, 2026): the website's "Aa" editor, the same as the app's.
// Write text on a video (size, colour, bold, background box, drag to place), make captions (CC) from the
// speech, and give any text a voice (text to speech). Works for a video being posted (file) and for a
// video already posted (postId). Hands back the overlay object saved with the post as "postOverlay":
//   { v: 1, items: [ { t, x, y, s, c, b, bg, tts? } ], cap?: [ { s, e, t } ] }
import React, { useEffect, useRef, useState } from 'react';
import { nodeApi } from '../../api/axios';

export const OVERLAY_COLORS = ['#FFFFFF', '#000000', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#00C7BE', '#007AFF', '#AF52DE', '#FF2D55'];
const BACKGROUNDS = ['none', 'dark', 'light'];
const BG_LABEL = { none: 'No box', dark: 'Dark box', light: 'Light box' };
export const VOICES = [
  { id: 'Joanna', note: 'woman' },
  { id: 'Matthew', note: 'man' },
  { id: 'Ruth', note: 'woman' },
  { id: 'Stephen', note: 'man' },
  { id: 'Ivy', note: 'girl' },
  { id: 'Kevin', note: 'boy' },
  { id: 'Lupe', note: 'Spanish, woman' },
  { id: 'Pedro', note: 'Spanish, man' },
];
const MIN_S = 0.035;
const MAX_S = 0.16;
const SERVER = 'https://natural.friendlinq.com/';

export function overlayToString(o) {
  if (!o) return '';
  const r = (n) => Math.round(Math.min(Math.max(Number(n) || 0, 0), 1) * 1000) / 1000;
  const items = (o.items || []).filter((it) => it.t && it.t.trim()).map((it) => ({
    t: it.t.slice(0, 300), x: r(it.x), y: r(it.y), s: r(it.s), c: it.c || '#FFFFFF', b: !!it.b, bg: it.bg || 'none',
    ...(it.tts && it.tts.u && it.tts.v ? { tts: { u: it.tts.u, v: it.tts.v, t: String(it.tts.t || it.t).slice(0, 300) } } : {}),
  }));
  const cap = (o.cap || []).filter((c) => c.t && c.t.trim()).map((c) => ({ s: Number(c.s), e: Number(c.e), t: c.t.trim().slice(0, 120) }));
  if (!items.length && !cap.length) return '';
  return JSON.stringify(cap.length ? { v: 1, items, cap } : { v: 1, items });
}

async function makeVoice(text, voice) {
  const res = await nodeApi.post('/api/v1/post/ttsMake', { text, voice });
  const d = res.data;
  if (!d || d.statusCode !== 200 || !d.data || !d.data.url) throw new Error((d && d.message) || 'The voice could not be made.');
  return { u: d.data.url, v: voice, t: text };
}

async function makeCaptions({ file, postId }, isCancelled) {
  const fd = new FormData();
  if (file) fd.append('mediaFile', file, 'caption.mp4');
  else fd.append('postId', postId);
  const start = (await nodeApi.post('/api/v1/post/captionStart', fd)).data;
  if (!start || start.statusCode !== 200 || !start.data || !start.data.jobId) throw new Error((start && start.message) || 'Captions could not be started.');
  const until = Date.now() + 5 * 60 * 1000;
  while (Date.now() < until) {
    await new Promise((r) => setTimeout(r, 3000));
    if (isCancelled()) return null;
    const st = (await nodeApi.get('/api/v1/post/captionStatus?jobId=' + encodeURIComponent(start.data.jobId))).data;
    if (!st || st.statusCode !== 200 || !st.data) throw new Error((st && st.message) || 'Captions could not be read.');
    if (st.data.status === 'done') return st.data.cap || [];
    if (st.data.status === 'failed') throw new Error('Captions could not be made for this video.');
  }
  throw new Error('Captions are taking too long. Please try again.');
}

function playOnce(url) {
  try {
    const a = new Audio(/^(https?|blob):/.test(url) ? url : SERVER + url);
    a.play().catch(() => {});
  } catch (e) {}
}

export default function VideoTextEditor({ open, videoSrc, file, postId, initial, onCancel, onDone }) {
  const frameRef = useRef(null);
  const drag = useRef(null);
  const cancelled = useRef(false);
  const [frame, setFrame] = useState({ w: 300, h: 533 });
  const [items, setItems] = useState([]);
  const [cap, setCap] = useState([]);
  const [sel, setSel] = useState(-1);
  const [busy, setBusy] = useState('');
  const [capOpen, setCapOpen] = useState(false);

  useEffect(() => {
    if (!open) { cancelled.current = true; return; }
    cancelled.current = false;
    setItems(initial && Array.isArray(initial.items) ? initial.items.map((x) => ({ ...x })) : []);
    setCap(initial && Array.isArray(initial.cap) ? initial.cap.map((x) => ({ ...x })) : []);
    setSel(-1);
    setCapOpen(false);
    const fit = () => {
      const h = Math.min(window.innerHeight * 0.62, 620);
      const w = Math.min(h * 9 / 16, window.innerWidth - 40);
      setFrame({ w, h: w * 16 / 9 });
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const move = (e) => {
      const d = drag.current;
      if (!d) return;
      const dx = (e.clientX - d.x0) / frame.w;
      const dy = (e.clientY - d.y0) / frame.h;
      if (Math.abs(e.clientX - d.x0) + Math.abs(e.clientY - d.y0) > 4) d.moved = true;
      setItems((list) => list.map((it, i) => (i === d.i ? { ...it, x: Math.min(Math.max(d.sx + dx, 0.05), 0.95), y: Math.min(Math.max(d.sy + dy, 0.04), 0.96) } : it)));
    };
    const up = () => { drag.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [frame]);

  if (!open) return null;
  const cur = sel >= 0 ? items[sel] : null;
  const update = (patch) => setItems((list) => list.map((x, i) => (i === sel ? { ...x, ...patch } : x)));

  const addText = () => {
    const last = items[items.length - 1];
    setItems((l) => [...l, { t: 'Your text', x: 0.5, y: last ? Math.min(last.y + 0.12, 0.85) : 0.4, s: 0.07, c: '#FFFFFF', b: true, bg: 'none' }]);
    setSel(items.length);
  };

  const startCaptions = async () => {
    if (cap.length) { setCapOpen(true); return; }
    setBusy('Making captions... this takes about a minute');
    try {
      const lines = await makeCaptions({ file, postId }, () => cancelled.current);
      if (lines === null) return;
      if (!lines.length) alert('We could not hear any words in this video.');
      else { setCap(lines); setCapOpen(true); }
    } catch (e) {
      alert(e.message || 'Captions could not be made. Please try again.');
    } finally {
      setBusy('');
    }
  };

  const chooseVoice = async (voice) => {
    if (!cur) return;
    if (!voice) { update({ tts: null }); return; }
    const text = (cur.t || '').trim();
    if (!text) return;
    setBusy('Making the voice...');
    try {
      const tts = await makeVoice(text, voice);
      update({ tts });
      playOnce(tts.u);
    } catch (e) {
      alert(e.message || 'The voice could not be made.');
    } finally {
      setBusy('');
    }
  };

  const done = async () => {
    let list = items.filter((x) => x.t && x.t.trim());
    if (list.some((x) => x.tts && x.tts.v && x.tts.t !== x.t)) {
      setBusy('Updating the voice...');
      try {
        list = await Promise.all(list.map(async (x) => (x.tts && x.tts.v && x.tts.t !== x.t ? { ...x, tts: await makeVoice(x.t.trim(), x.tts.v) } : x)));
      } catch (e) {
        list = list.map((x) => (x.tts && x.tts.t !== x.t ? { ...x, tts: null } : x));
      }
      setBusy('');
    }
    const c = cap.filter((x) => x.t && x.t.trim());
    onDone(list.length || c.length ? { v: 1, items: list, cap: c } : null);
  };

  const now = cap.length ? cap[0].t : '';

  return (
    <div style={st.backdrop}>
      <div style={st.panel}>
        <div style={st.topBar}>
          <button style={st.linkBtn} onClick={onCancel}>Cancel</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={st.aaBtn} onClick={addText} title="Add text"><span style={{ fontSize: 20 }}>A</span><span style={{ fontSize: 14 }}>a</span></button>
            {(file || postId) && (
              <button style={{ ...st.aaBtn, ...(cap.length ? st.on : {}) }} onClick={startCaptions} title="Captions">CC</button>
            )}
          </div>
          <button style={{ ...st.linkBtn, color: '#4FC3F7', fontWeight: 'bold' }} onClick={done} disabled={!!busy}>Done</button>
        </div>

        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div
            ref={frameRef}
            style={{ ...st.frame, width: frame.w, height: frame.h }}
            onPointerDown={(e) => { if (e.target === e.currentTarget || e.target.tagName === 'VIDEO') setSel(-1); }}
          >
            {videoSrc && <video src={videoSrc} muted loop autoPlay playsInline style={st.video} />}
            {items.map((it, i) => {
              const fs = Math.max(10, (it.s || 0.07) * frame.w);
              const box = it.bg === 'dark' ? { background: 'rgba(0,0,0,0.65)', padding: `${fs * 0.15}px ${fs * 0.3}px`, borderRadius: fs * 0.3 }
                : it.bg === 'light' ? { background: 'rgba(255,255,255,0.88)', padding: `${fs * 0.15}px ${fs * 0.3}px`, borderRadius: fs * 0.3 }
                  : { textShadow: '1px 1px 3px rgba(0,0,0,0.75)' };
              return (
                <div
                  key={i}
                  onPointerDown={(e) => { e.preventDefault(); setSel(i); drag.current = { i, x0: e.clientX, y0: e.clientY, sx: it.x, sy: it.y }; }}
                  style={{
                    position: 'absolute', left: it.x * frame.w, top: it.y * frame.h, transform: 'translate(-50%, -50%)',
                    maxWidth: frame.w * 0.9, width: 'max-content', textAlign: 'center', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    color: it.c || '#fff', fontWeight: it.b ? 'bold' : 'normal', fontSize: fs, lineHeight: 1.2, cursor: 'move', userSelect: 'none',
                    outline: i === sel ? '1px dashed #fff' : 'none', outlineOffset: 3, ...box,
                  }}
                >
                  {it.t}{it.tts ? ' 🔊' : ''}
                </div>
              );
            })}
            {now && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: '16%', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={st.capLine}>{now}</span>
              </div>
            )}
            {!items.length && !cap.length && !busy && <div style={st.hint}>Click Aa to write on your video, or CC for captions</div>}
            {busy && <div style={st.hint}>{busy}</div>}
          </div>

          <div style={st.tools}>
            {cur ? (
              <>
                <div style={st.label}>Text</div>
                <textarea value={cur.t} onChange={(e) => update({ t: e.target.value })} rows={2} style={st.input} autoFocus />
                <div style={st.label}>Colour</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {OVERLAY_COLORS.map((c) => (
                    <button key={c} onClick={() => update({ c })} style={{ ...st.swatch, background: c, ...(cur.c === c ? { outline: '3px solid #4FC3F7' } : {}) }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  <button style={st.tool} onClick={() => update({ s: Math.max(MIN_S, (cur.s || 0.07) - 0.012) })}>A-</button>
                  <button style={st.tool} onClick={() => update({ s: Math.min(MAX_S, (cur.s || 0.07) + 0.012) })}>A+</button>
                  <button style={{ ...st.tool, fontWeight: 'bold', ...(cur.b ? st.on : {}) }} onClick={() => update({ b: !cur.b })}>B</button>
                  <button style={st.tool} onClick={() => update({ bg: BACKGROUNDS[(BACKGROUNDS.indexOf(cur.bg || 'none') + 1) % 3] })}>{BG_LABEL[cur.bg || 'none']}</button>
                </div>
                <div style={st.label}>Voice (reads this text aloud)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <button style={{ ...st.chip, ...(!cur.tts ? st.on : {}) }} onClick={() => chooseVoice(null)} disabled={!!busy}>No voice</button>
                  {VOICES.map((v) => (
                    <button key={v.id} style={{ ...st.chip, ...(cur.tts && cur.tts.v === v.id ? st.on : {}) }} onClick={() => chooseVoice(v.id)} disabled={!!busy}>
                      {v.id} <span style={{ opacity: 0.7, fontSize: 11 }}>{v.note}</span>
                    </button>
                  ))}
                  {cur.tts && <button style={st.chip} onClick={() => playOnce(cur.tts.u)}>Play</button>}
                </div>
                <button style={{ ...st.tool, color: '#FF6B6B', marginTop: 12 }} onClick={() => { setItems((l) => l.filter((x, i) => i !== sel)); setSel(-1); }}>Delete this text</button>
              </>
            ) : capOpen && cap.length ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={st.label}>Captions (click a line to fix it)</div>
                  <button style={{ ...st.linkBtn, color: '#FF6B6B', fontSize: 13 }} onClick={() => { setCap([]); setCapOpen(false); }}>Remove</button>
                </div>
                <div style={{ maxHeight: frame.h - 60, overflowY: 'auto' }}>
                  {cap.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ color: '#999', fontSize: 12, width: 34 }}>{Math.floor(c.s / 60)}:{String(Math.floor(c.s % 60)).padStart(2, '0')}</span>
                      <input value={c.t} onChange={(e) => setCap((l) => l.map((x, k) => (k === i ? { ...x, t: e.target.value } : x)))} style={{ ...st.input, margin: 0 }} />
                    </div>
                  ))}
                </div>
                <button style={st.linkBtn} onClick={() => setCapOpen(false)}>Close list</button>
              </>
            ) : (
              <div style={{ color: '#bbb', fontSize: 14, lineHeight: 1.5 }}>
                {items.length ? 'Drag text to move it. Click it to change it, or give it a voice.' : 'Your video will post without text if you click Done.'}
                {cap.length > 0 && <div style={{ marginTop: 8 }}><button style={st.linkBtn} onClick={() => setCapOpen(true)}>Show captions ({cap.length} lines)</button></div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const st = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' },
  panel: { background: '#111', borderRadius: 12, padding: 16, maxWidth: 760, width: '96%', color: '#fff' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  linkBtn: { background: 'none', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer', padding: 6 },
  aaBtn: { background: 'none', border: '2px solid #fff', borderRadius: 8, color: '#fff', fontWeight: 'bold', padding: '2px 12px', cursor: 'pointer', minWidth: 48 },
  on: { background: '#fff', color: '#000', borderColor: '#fff' },
  frame: { position: 'relative', background: '#222', borderRadius: 8, overflow: 'hidden', touchAction: 'none', flex: 'none' },
  video: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  hint: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: 14, fontSize: 14, textAlign: 'center', pointerEvents: 'none' },
  capLine: { maxWidth: '80%', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 15, fontWeight: 600, padding: '3px 8px', borderRadius: 6, textAlign: 'center' },
  tools: { flex: 1, minWidth: 260, maxWidth: 380 },
  label: { color: '#ddd', fontSize: 13, fontWeight: 'bold', margin: '10px 0 6px' },
  input: { width: '100%', boxSizing: 'border-box', background: '#222', color: '#fff', border: '1px solid #555', borderRadius: 6, padding: 6, fontSize: 14 },
  swatch: { width: 26, height: 26, borderRadius: 13, border: '2px solid #555', cursor: 'pointer' },
  tool: { background: 'none', border: '1px solid #777', borderRadius: 8, color: '#fff', padding: '6px 10px', cursor: 'pointer', fontSize: 14 },
  chip: { background: 'none', border: '1px solid #777', borderRadius: 10, color: '#fff', padding: '4px 8px', cursor: 'pointer', fontSize: 13 },
};
