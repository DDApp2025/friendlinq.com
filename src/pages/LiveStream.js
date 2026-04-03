import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { dotnetApi } from '../api/axios';
import {
  GENERATE_AGORA_TOKEN,
  NOTIFY_USERS_FOR_LIVE_STREAMING,
  UPDATE_LIVE_STREAMING_COUNT,
  UPDATE_BROADCAST_ID,
} from '../api/config';
import {
  MdMic, MdMicOff, MdCameraswitch, MdCallEnd,
  MdArrowBack, MdVideocam,
} from 'react-icons/md';
import './LiveStream.css';

const AGORA_APP_ID = 'dd6dbba5e50d42c7880152591687410d';

export default function LiveStream() {
  const { channelName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const profile = useSelector((s) => s.authReducer.getProfileData);
  const token = useSelector((s) => s.authReducer.login_access_token);
  const userId = profile?._id;
  const fullName = profile?.fullName || '';

  const isHost = searchParams.get('host') === '1' || channelName === userId;
  const hostId = isHost ? userId : (searchParams.get('hostId') || channelName);
  const title = searchParams.get('title') || '';

  const [joined, setJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Track the local video track in state so React knows when it's available
  const [localVideoTrack, setLocalVideoTrack] = useState(null);

  const localTracksRef = useRef({ audioTrack: null, videoTrack: null });
  const clientRef = useRef(null);
  const initRef = useRef(false);
  const localVideoElRef = useRef(null);

  // ── Callback ref: plays video whenever BOTH the element AND the track exist ──
  const localVideoRef = useCallback((el) => {
    localVideoElRef.current = el;
    if (el && localTracksRef.current.videoTrack) {
      // Clear any stale children first
      el.innerHTML = '';
      localTracksRef.current.videoTrack.play(el);
    }
  }, [localVideoTrack]); // eslint-disable-line react-hooks/exhaustive-deps
  // ↑ depends on localVideoTrack so the callback re-fires when track arrives

  // ── Fetch Agora token ──
  const fetchAgoraToken = useCallback(async () => {
    try {
      const res = await dotnetApi.post('/Client' + GENERATE_AGORA_TOKEN, {
        authorization: token,
        channelName: channelName,
      });
      if (res.data?.StatusCode === 200 && res.data?.Data) {
        return res.data.Data;
      }
    } catch (err) {
      console.log('Token fetch failed, joining without token:', err.message);
    }
    return null;
  }, [token, channelName]);

  // ── Notify friends ──
  const sendNotification = useCallback(async () => {
    try {
      await dotnetApi.post('/Client' + NOTIFY_USERS_FOR_LIVE_STREAMING, {
        senderId: userId,
        textMessage: `${fullName} is Live now${title ? `, ${title}` : ''}`,
        callId: channelName,
        authorization: token,
      });
    } catch (err) {
      console.log('Failed to send live notification:', err.message);
    }
  }, [userId, fullName, title, channelName, token]);

  // ── Update viewer count ──
  const updateCount = useCallback(async (increase = true, clearAll = false) => {
    try {
      const params = { userId: hostId, authorization: token };
      if (clearAll) params.clearAll = true;
      else if (increase) params.IsAdded = true;
      else params.IsRemoved = true;
      await dotnetApi.post('/Client' + UPDATE_LIVE_STREAMING_COUNT, params);
    } catch (err) {
      console.log('Failed to update count:', err.message);
    }
  }, [hostId, token]);

  // ── Update broadcast ID ──
  const updateBroadcastId = useCallback(async (broadcastId) => {
    try {
      await dotnetApi.post(UPDATE_BROADCAST_ID, {
        broadcastId,
        oldbroadcastId: channelName,
        authorization: token,
      });
    } catch (err) {
      console.log('Failed to update broadcast ID:', err.message);
    }
  }, [channelName, token]);

  // ── Initialize and join Agora live channel ──
  useEffect(() => {
    if (initRef.current || !channelName || !token) return;
    initRef.current = true;

    const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    clientRef.current = client;

    const init = async () => {
      try {
        setLoading(true);
        await client.setClientRole(isHost ? 'host' : 'audience');

        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === 'video') {
            setRemoteUsers((prev) =>
              prev.find((u) => u.uid === user.uid) ? prev : [...prev, user]
            );
          }
          if (mediaType === 'audio' && user.audioTrack) {
            user.audioTrack.play();
          }
        });

        client.on('user-unpublished', (user, mediaType) => {
          if (mediaType === 'video') {
            setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
          }
        });

        client.on('user-left', (user) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });

        const agoraToken = await fetchAgoraToken();
        await client.join(AGORA_APP_ID, channelName, agoraToken, isHost ? 0 : undefined);

        if (isHost) {
          const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
          localTracksRef.current = { audioTrack, videoTrack };
          await client.publish([audioTrack, videoTrack]);

          // Setting state triggers the callback ref to re-fire and play the video
          setLocalVideoTrack(videoTrack);

          // Also directly play on the element if it already exists
          if (localVideoElRef.current) {
            localVideoElRef.current.innerHTML = '';
            videoTrack.play(localVideoElRef.current);
          }

          updateBroadcastId(channelName);
          sendNotification();
        }

        updateCount(true, false);
        setJoined(true);
        setLoading(false);
      } catch (err) {
        console.error('Failed to join live stream:', err);
        setError(err.message || 'Failed to join live stream');
        setLoading(false);
      }
    };

    init();

    return () => {
      const tracks = localTracksRef.current;
      if (tracks.audioTrack) { tracks.audioTrack.stop(); tracks.audioTrack.close(); }
      if (tracks.videoTrack) { tracks.videoTrack.stop(); tracks.videoTrack.close(); }
      localTracksRef.current = { audioTrack: null, videoTrack: null };
      if (isHost) {
        updateBroadcastId('');
        updateCount(false, true);
      } else {
        updateCount(false, false);
      }
      client.leave().catch(() => {});
      client.removeAllListeners();
      clientRef.current = null;
      initRef.current = false;
    };
  }, [channelName, token, isHost]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Play remote video when remoteUsers changes ──
  useEffect(() => {
    remoteUsers.forEach((user) => {
      setTimeout(() => {
        const el = document.getElementById(`remote-video-${user.uid}`);
        if (el && user.videoTrack) {
          user.videoTrack.play(el);
        }
      }, 100);
    });
  }, [remoteUsers]);

  // ── Toggle mute ──
  const toggleMute = async () => {
    const track = localTracksRef.current.audioTrack;
    if (track) {
      await track.setEnabled(isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  // ── Switch camera ──
  const switchCamera = async () => {
    const track = localTracksRef.current.videoTrack;
    if (track) {
      const cameras = await AgoraRTC.getCameras();
      if (cameras.length < 2) return;
      const currentId = track.getTrackLabel();
      const currentIdx = cameras.findIndex((c) => c.label === currentId);
      const nextIdx = (currentIdx + 1) % cameras.length;
      await track.setDevice(cameras[nextIdx].deviceId);
    }
  };

  // ── Leave / end stream ──
  const handleLeave = async () => {
    const tracks = localTracksRef.current;
    if (tracks.audioTrack) { tracks.audioTrack.stop(); tracks.audioTrack.close(); }
    if (tracks.videoTrack) { tracks.videoTrack.stop(); tracks.videoTrack.close(); }
    localTracksRef.current = { audioTrack: null, videoTrack: null };
    setLocalVideoTrack(null);

    if (isHost) {
      await updateBroadcastId('');
      await updateCount(false, true);
    } else {
      await updateCount(false, false);
    }

    const client = clientRef.current;
    if (client) {
      await client.leave().catch(() => {});
      client.removeAllListeners();
    }
    clientRef.current = null;
    initRef.current = false;
    setJoined(false);
    navigate(-1);
  };

  // ── RENDER — video div is ALWAYS in the DOM ──
  return (
    <div className="ls-container">
      {/* Video area — always rendered so the ref target exists */}
      <div className="ls-video-area">
        {isHost ? (
          <div ref={localVideoRef} className="ls-video-player" />
        ) : remoteUsers.length > 0 ? (
          remoteUsers.map((user) => (
            <div
              key={user.uid}
              id={`remote-video-${user.uid}`}
              className="ls-video-player"
            />
          ))
        ) : !loading ? (
          <div className="ls-waiting">
            <MdVideocam size={48} color="#666" />
            <p>Waiting for host to start streaming...</p>
          </div>
        ) : null}
      </div>

      {/* Loading overlay — semi-transparent, on top of the video */}
      {loading && (
        <div className="ls-loading-overlay">
          <div className="ls-spinner" />
          <p>{isHost ? 'Starting broadcast...' : 'Joining stream...'}</p>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="ls-error-overlay">
          <p>{error}</p>
          <button className="ls-btn" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      )}

      {/* Controls overlay — always visible when not loading/error */}
      {!loading && !error && (
        <div className="ls-overlay">
          <div className="ls-top-bar">
            {joined && (isHost || remoteUsers.length > 0) && (
              <span className="ls-live-badge">LIVE</span>
            )}
          </div>

          <div className="ls-bottom-bar">
            {isHost ? (
              <>
                <button className="ls-ctrl-btn" onClick={toggleMute} title={isAudioMuted ? 'Unmute' : 'Mute'}>
                  {isAudioMuted ? <MdMicOff size={24} /> : <MdMic size={24} />}
                </button>
                <button className="ls-ctrl-btn ls-end-btn" onClick={handleLeave} title="End Streaming">
                  <MdCallEnd size={24} />
                </button>
                <button className="ls-ctrl-btn" onClick={switchCamera} title="Switch Camera">
                  <MdCameraswitch size={24} />
                </button>
              </>
            ) : (
              <button className="ls-ctrl-btn" onClick={handleLeave} title="Leave">
                <MdArrowBack size={24} />
                <span style={{ marginLeft: 6 }}>Leave</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
