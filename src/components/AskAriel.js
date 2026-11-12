// Ask Ariel, the Friendlinq help chat, same as the app (Robert, November 12, 2026, 9:31 AM). Opens from the Help
// button and from the menu under your picture. Answers come from the Friendlinq server; the conversation is
// kept only while the panel is open.
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const GREEN = '#1a6b3a';
const GREETING =
  "Hi, I'm Ariel, Friendlinq's helper. Ask me anything about using Friendlinq, like how to post a video, find a friend, or switch to Dating Mode.";

async function ask(token, messages) {
  try {
    // Sent as a form, like the website's other requests to this server.
    const fd = new FormData();
    fd.append('messages', JSON.stringify(messages));
    const r = await fetch('https://natural.friendlinq.com/api/v1/help/ariel', {
      method: 'POST',
      headers: { Accept: 'application/json', authorization: token || '' },
      body: fd,
    });
    let j = null;
    try { j = await r.json(); } catch (e) { j = null; }
    if (j && j.statusCode === 200 && j.data && j.data.reply) return { ok: true, text: j.data.reply };
    if (r.status === 404) return { ok: false, text: 'Help chat is not set up yet.' };
    if (r.status === 401 || (j && j.statusCode === 401)) return { ok: false, text: 'Please log out and log in again, then try once more.' };
    return { ok: false, text: (j && j.message) || 'Sorry, I could not answer just now. Please try again in a moment.' };
  } catch (e) {
    return { ok: false, text: "Can't connect right now. Please check your internet and try again." };
  }
}

export default function AskAriel({ open, onClose }) {
  const token = useSelector((s) => s.authReducer && s.authReducer.login_access_token);
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: GREETING, greeting: true }]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, busy]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  if (!open) return null;

  const send = async () => {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...msgs, { role: 'user', content: q.slice(0, 1000) }];
    setMsgs(next);
    setText('');
    setBusy(true);
    const history = next.filter((m) => !m.greeting && !m.error).map((m) => ({ role: m.role, content: m.content }));
    const res = await ask(token, history.slice(-12));
    setBusy(false);
    setMsgs((cur) => [...cur, { role: 'assistant', content: res.text, error: !res.ok }]);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Ask Ariel, Friendlinq help" onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10002, padding: 12 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 480, height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#222', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ width: 38, height: 38, borderRadius: 19, background: GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }} aria-hidden="true">A</div>
          <div style={{ flex: 1, marginLeft: 10 }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: GREEN }}>Ask Ariel</div>
            <div style={{ fontSize: 13, color: '#666' }}>Friendlinq help</div>
          </div>
          <button onClick={onClose} aria-label="Close Ask Ariel" style={{ background: 'none', border: 'none', fontSize: 28, lineHeight: 1, cursor: 'pointer', color: '#444' }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
          {msgs.map((m, i) => {
            const mine = m.role === 'user';
            return (
              <div key={i} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', margin: '5px 0' }}>
                <div style={{ maxWidth: '85%', whiteSpace: 'pre-wrap', fontSize: 16, lineHeight: 1.45, padding: '10px 14px', borderRadius: 16, background: mine ? GREEN : m.error ? '#fdecea' : '#f1f3f2', color: mine ? '#fff' : m.error ? '#9b1c1c' : '#222' }}>
                  {m.content}
                </div>
              </div>
            );
          })}
          {busy ? (
            <div style={{ color: '#666', fontSize: 15, marginTop: 6 }}>Ariel is typing...</div>
          ) : (
            <div style={{ color: '#888', fontSize: 13, marginTop: 10 }}>
              Ariel can make mistakes. For account problems email{' '}
              <a href="mailto:info@friendlinq.com" style={{ color: GREEN, fontWeight: 700 }}>info@friendlinq.com</a>. Never share your password.
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #e5e5e5' }}>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type your question"
            maxLength={1000}
            rows={1}
            style={{ flex: 1, resize: 'none', border: '1px solid #ccc', borderRadius: 22, padding: '11px 14px', fontSize: 16, fontFamily: 'inherit', maxHeight: 120 }}
          />
          <button onClick={send} disabled={busy || !text.trim()}
            style={{ border: 'none', borderRadius: 22, padding: '0 18px', fontSize: 16, fontWeight: 700, color: '#fff', background: busy || !text.trim() ? '#9bbfa8' : GREEN, cursor: busy || !text.trim() ? 'default' : 'pointer' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
