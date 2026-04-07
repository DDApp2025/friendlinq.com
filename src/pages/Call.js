import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { nodeApi, dotnetApi } from "../api/axios";
import SOCKET from "../api/socket";
import normalizeImg from "../utils/normalizeImg";
import { firstName } from "../utils/displayName";
import { GET_GROUP_LIST, GET_FRIENDS_LIST, GET_GROUP_MEMBERS } from "../api/config";
import {
  agoraClient,
  joinChannel,
  createLocalTracks,
  publishTracks,
  leaveChannel as agoraLeave,
  createScreenTrack,
} from "../api/webrtc";
import {
  Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Monitor, X,
  UserPlus, Users, Clock, PhoneCall, ArrowLeft, Search, CheckSquare, Square,
  Edit2, Trash2,
} from "lucide-react";

const IDLE = "idle";
const OUTGOING = "outgoing";
const INCOMING = "incoming";
const ACTIVE = "active";

export default function CallPage() {
  const store = useSelector((s) => s);
  const token = store.authReducer.login_access_token;
  const myProfile = store.authReducer.getProfileData;
  const myId = myProfile?._id;

  /* call state */
  const [callState, setCallState] = useState(IDLE);
  const [callType, setCallType] = useState("video");
  const [channelName, setChannelName] = useState("");
  const [remoteUser, setRemoteUser] = useState(null);
  const [incomingData, setIncomingData] = useState(null);

  /* in-call */
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [userJoined, setUserJoined] = useState(false);

  /* IDLE pickers — "now" vs "schedule", "friends" vs "groups" */
  const [picker, setPicker] = useState(null); // null | "now-friends" | "now-groups" | "sched-friends" | "sched-groups"

  /* local friends + groups data (loaded directly, not from redux) */
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);

  /* select-friends screen state */
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedCallType, setSelectedCallType] = useState("video");
  const [searchText, setSearchText] = useState("");

  /* schedule form (shown after friends selected for schedule) */
  const [schedFriends, setSchedFriends] = useState([]);
  const [schedTitle, setSchedTitle] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedCallType, setSchedCallType] = useState("video");
  const [loadingSched, setLoadingSched] = useState(false);

  /* scheduled calls (persisted in localStorage) */
  const [myScheduledCalls, setMyScheduledCalls] = useState(() => {
    try { return JSON.parse(localStorage.getItem("scheduledCalls") || "[]"); } catch { return []; }
  });
  const [editingCall, setEditingCall] = useState(null); // scheduled call being edited

  const saveScheduledCalls = (list) => { setMyScheduledCalls(list); localStorage.setItem("scheduledCalls", JSON.stringify(list)); };

  /* schedule form for group */
  const [schedGroup, setSchedGroup] = useState(null); // group object when scheduling a group call

  /* refs */
  const localTracksRef = useRef(null);
  const screenTrackRef = useRef(null);
  const localVideoRef = useRef(null);
  const timerRef = useRef(null);
  const ringtoneRef = useRef(null);

  /* ── load friends (direct API) ── */
  const loadFriends = async () => {
    setLoadingFriends(true);
    try {
      const fd = new FormData();
      fd.append("status", "Accepted");
      fd.append("skip", "0");
      fd.append("limit", "100");
      const res = await nodeApi.post(GET_FRIENDS_LIST, fd);
      if (res.data?.statusCode === 200) {
        const raw = res.data.data?.friendList || res.data.data?.myFriendList || [];
        const list = raw.map((f) => ({
          ...f,
          imageURL: typeof f.imageURL === "object" ? f.imageURL : { thumbnail: f.imageURL, original: f.imageURL },
        }));
        setFriends(list);
      }
    } catch (e) { console.error("loadFriends", e); }
    setLoadingFriends(false);
  };

  /* ── load groups (same approach as Groups page) ── */
  const findArray = (obj, depth = 0) => {
    if (depth > 3) return null;
    if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === "object") return obj;
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      for (const val of Object.values(obj)) {
        const found = findArray(val, depth + 1);
        if (found) return found;
      }
    }
    return null;
  };

  const loadGroups = async () => {
    setLoadingGroups(true);
    try {
      const res = await dotnetApi.post(GET_GROUP_LIST, { authorization: token });
      const list = findArray(res.data) || [];
      setGroups(Array.isArray(list) ? list : []);
    } catch (e) { console.error("loadGroups", e); }
    setLoadingGroups(false);
  };

  /* load on mount */
  useEffect(() => {
    if (token) { loadFriends(); loadGroups(); }
  }, [token]);

  /* ── Socket.IO signaling ── */
  useEffect(() => {
    if (!myId) return;
    const handleIncoming = (data) => { if (callState === IDLE) { setIncomingData(data); setCallState(INCOMING); playRingtone(); } };
    const handleAR = (data) => { if (data?.status === "3") cleanup(); };
    SOCKET.on("callToUser", handleIncoming);
    SOCKET.on("acceptReject", handleAR);
    return () => { SOCKET.off("callToUser", handleIncoming); SOCKET.off("acceptReject", handleAR); };
  }, [myId, callState]);

  /* timer */
  useEffect(() => {
    if (userJoined) timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [userJoined]);

  /* Agora events */
  useEffect(() => {
    const onPub = async (user, mt) => {
      await agoraClient.subscribe(user, mt);
      if (mt === "video") { setRemoteUsers((p) => { const e = p.find((u) => u.uid === user.uid); return e ? p.map((u) => u.uid === user.uid ? user : u) : [...p, user]; }); stopRingtone(); setUserJoined(true); }
      if (mt === "audio") { user.audioTrack?.play(); stopRingtone(); setUserJoined(true); }
    };
    const onUnpub = (user, mt) => { if (mt === "video") setRemoteUsers((p) => p.filter((u) => u.uid !== user.uid)); };
    const onLeft = (user) => setRemoteUsers((p) => p.filter((u) => u.uid !== user.uid));
    agoraClient.on("user-published", onPub); agoraClient.on("user-unpublished", onUnpub); agoraClient.on("user-left", onLeft);
    return () => { agoraClient.off("user-published", onPub); agoraClient.off("user-unpublished", onUnpub); agoraClient.off("user-left", onLeft); };
  }, []);

  /* local video */
  useEffect(() => {
    if (localTracksRef.current?.videoTrack && localVideoRef.current && (callState === ACTIVE || callState === OUTGOING))
      localTracksRef.current.videoTrack.play(localVideoRef.current);
  }, [callState, isVideoOff]);

  const remoteVideoCb = useCallback((el, user) => { if (el && user?.videoTrack) user.videoTrack.play(el); }, []);

  /* incoming from overlay */
  useEffect(() => {
    const s = sessionStorage.getItem("incomingCallData");
    if (s) { sessionStorage.removeItem("incomingCallData"); try { setIncomingData(JSON.parse(s)); setCallState(INCOMING); } catch (e) {} }
  }, []);

  /* ── helpers ── */
  const playRingtone = () => { try { ringtoneRef.current = new Audio("/ringtone.mp3"); ringtoneRef.current.loop = true; ringtoneRef.current.play().catch(() => {}); } catch (e) {} };
  const stopRingtone = () => { try { ringtoneRef.current?.pause(); ringtoneRef.current = null; } catch (e) {} };
  const fmtTime = (s) => Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);

  const cleanup = async () => {
    stopRingtone(); if (timerRef.current) clearInterval(timerRef.current);
    try { if (screenTrackRef.current) { screenTrackRef.current.stop(); screenTrackRef.current.close(); screenTrackRef.current = null; } await agoraLeave(localTracksRef.current); } catch (e) {}
    localTracksRef.current = null; setCallState(IDLE); setRemoteUsers([]); setTimer(0); setUserJoined(false);
    setIsMuted(false); setIsVideoOff(false); setIsScreenSharing(false); setRemoteUser(null); setIncomingData(null); setChannelName("");
  };

  /* ── call actions ── */
  const startCall = async (friend, type) => {
    const ch = Date.now().toString(); setCallType(type); setChannelName(ch); setRemoteUser(friend); setCallState(OUTGOING);
    try {
      await joinChannel(ch); const tracks = await createLocalTracks(type); localTracksRef.current = tracks; await publishTracks(tracks);
      SOCKET.emit("callToUser", { callerId: myId, receiverId: friend._id, type, token: null, channel_name: ch, name: myProfile?.fullName, callerImage: myProfile?.imageURL?.original, callType: type, channelName: ch });
      playRingtone();
    } catch (e) { console.error("startCall", e); alert("Could not start call. Check camera/mic permissions."); cleanup(); }
  };

  const startCallWithSelected = (sel, type) => {
    if (!sel.length) return alert("Select at least 1 friend.");
    setPicker(null);
    startCall(sel[0], type);
  };

  const startGroupCall = async (group, type) => {
    setPicker(null);
    try {
      const fd = new FormData();
      fd.append("groupId", group._id);
      fd.append("skip", "0");
      fd.append("limit", "100");
      const res = await nodeApi.post(GET_GROUP_MEMBERS, fd);
      if (res.data?.statusCode === 200) {
        const memberList = res.data.data?.groupMemberList || [];
        const others = memberList
          .filter((m) => m?.groupMemberId?._id !== myId)
          .map((m) => ({
            _id: m.groupMemberId?._id,
            fullName: m.groupMemberId?.fullName,
            email: m.groupMemberId?.email,
            imageURL: m.groupMemberId?.imageURL,
          }));
        if (others.length === 0) return alert("No other members in this group.");
        startCall(others[0], type);
      } else {
        alert(res.data?.message || "Could not load group members.");
      }
    } catch (e) {
      console.error("startGroupCall", e);
      alert("Failed to load group members.");
    }
  };

  const acceptCall = async () => {
    stopRingtone(); const d = incomingData; const ch = d?.channel_name || d?.channelName; const t = d?.type || d?.callType || "audio";
    setCallType(t); setChannelName(ch); setCallState(ACTIVE);
    try { await joinChannel(ch); const tracks = await createLocalTracks(t); localTracksRef.current = tracks; await publishTracks(tracks); SOCKET.emit("callStatus", { callerId: myId, receiverId: d?.callerId, status: "2", channel_name: ch }); }
    catch (e) { console.error("acceptCall", e); alert("Could not join call."); cleanup(); }
  };

  const declineCall = () => { stopRingtone(); const d = incomingData; SOCKET.emit("callStatus", { callerId: myId, receiverId: d?.callerId, status: "3", channel_name: d?.channel_name || d?.channelName }); setCallState(IDLE); setIncomingData(null); };

  const endCall = async () => { SOCKET.emit("callStatus", { callerId: myId, receiverId: remoteUser?._id || incomingData?.callerId, status: "5", channel_name: channelName }); await cleanup(); };

  const toggleMute = () => { const t = localTracksRef.current?.audioTrack; if (t) { t.setEnabled(isMuted); setIsMuted(!isMuted); } };
  const toggleVideo = () => { const t = localTracksRef.current?.videoTrack; if (t) { t.setEnabled(isVideoOff); setIsVideoOff(!isVideoOff); } };
  const toggleScreen = async () => {
    try {
      if (isScreenSharing) { if (screenTrackRef.current) { await agoraClient.unpublish(screenTrackRef.current); screenTrackRef.current.stop(); screenTrackRef.current.close(); screenTrackRef.current = null; } if (localTracksRef.current?.videoTrack) await agoraClient.publish(localTracksRef.current.videoTrack); setIsScreenSharing(false); }
      else { const st = await createScreenTrack(); screenTrackRef.current = st; if (localTracksRef.current?.videoTrack) await agoraClient.unpublish(localTracksRef.current.videoTrack); await agoraClient.publish(st); st.on("track-ended", async () => { await agoraClient.unpublish(st); st.close(); screenTrackRef.current = null; if (localTracksRef.current?.videoTrack) await agoraClient.publish(localTracksRef.current.videoTrack); setIsScreenSharing(false); }); setIsScreenSharing(true); }
    } catch (e) { console.error("screen share", e); }
  };

  /* ── schedule call ── */
  const scheduleCall = async () => {
    if (!schedTitle.trim()) return alert("Enter a call title.");
    if (!schedDate) return alert("Select a date and time.");
    if (!schedFriends.length) return alert("Select at least 1 friend.");
    const emails = [...schedFriends.map((f) => f.email), myProfile?.email].join(",");
    const names = [...schedFriends.map((f) => firstName(f.fullName)), firstName(myProfile?.fullName)].join(",");
    const channelId = Date.now().toString() + Math.floor(Math.random() * 100);
    const fd = new FormData();
    fd.append("title", schedTitle); fd.append("emails", emails); fd.append("names", names);
    fd.append("channelId", channelId);
    fd.append("scheduleDate", new Date(schedDate).toISOString());
    fd.append("callType", schedCallType); fd.append("inviteLink", ""); fd.append("hostId", myId);
    setLoadingSched(true);
    try {
      const res = await nodeApi.post("/api/v1/call/schedule", fd);
      if (res.data?.statusCode === 200) {
        const newCall = { id: channelId, title: schedTitle, date: new Date(schedDate).toISOString(), callType: schedCallType, names: names, emails: emails, groupName: schedGroup?.groupName || schedGroup?.GroupName || null, createdAt: new Date().toISOString() };
        saveScheduledCalls([...myScheduledCalls, newCall]);
        alert("Invitation sent successfully."); setSchedTitle(""); setSchedDate(""); setSchedFriends([]); setSchedGroup(null); setPicker(null);
      }
      else alert(res.data?.message || "Something went wrong!");
    } catch (e) { alert("Failed to schedule call."); }
    setLoadingSched(false);
  };

  /* ═══════════════ RENDER ═══════════════ */

  /* ── INCOMING ── */
  if (callState === INCOMING) {
    const d = incomingData; const ci = d?.callerImage || d?.userDP; const bg = ci ? normalizeImg(ci) : null;
    return (
      <div style={S.full}>{bg && <img src={bg} alt="" style={S.bgImg} />}<div style={S.overlay} />
        <div style={S.incomingWrap}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            {(d?.callType === "audio" || d?.type === "audio") ? <h2 style={S.callerName}>{firstName(d?.name)} is Calling You...</h2> : <h2 style={S.callerName}>Video Call From {firstName(d?.name)}</h2>}
          </div>
          <div style={{ display: "flex", gap: 60 }}>
            <button onClick={acceptCall} style={S.acceptBtn}><Phone size={32} color="#fff" /><span style={{ color: "#fff", marginTop: 4, fontSize: 12 }}>Accept</span></button>
            <button onClick={declineCall} style={S.declineBtn}><PhoneOff size={32} color="#fff" /><span style={{ color: "#fff", marginTop: 4, fontSize: 12 }}>Decline</span></button>
          </div>
        </div>
      </div>
    );
  }

  /* ── OUTGOING / ACTIVE ── */
  if (callState === OUTGOING || callState === ACTIVE) {
    const fi = remoteUser?.imageURL ? normalizeImg(remoteUser.imageURL?.original || remoteUser.imageURL) : null;
    return (
      <div style={S.full}>
        {callType === "audio" && fi && <img src={fi} alt="" style={S.bgImg} />}
        {callType === "audio" && <div style={S.overlay} />}
        {callType === "video" && <div style={S.remoteWrap}>{remoteUsers.length === 0 && <div style={S.waitText}>{callState === OUTGOING ? `Calling ${firstName(remoteUser?.fullName)}...` : "Waiting..."}</div>}{remoteUsers.map((u) => <div key={u.uid} ref={(el) => remoteVideoCb(el, u)} style={S.remoteVid} />)}</div>}
        {callType === "video" && !isVideoOff && <div ref={localVideoRef} style={remoteUsers.length > 0 ? S.localSmall : S.localFull} />}
        <div style={S.timerBar}><span style={S.timerTxt}>{userJoined ? fmtTime(timer) : callState === OUTGOING ? `Calling ${firstName(remoteUser?.fullName)}...` : "Connecting..."}</span></div>
        <div style={S.ctrlBar}>
          <button onClick={toggleMute} style={S.ctrlBtn}>{isMuted ? <MicOff size={24} color="#fff" /> : <Mic size={24} color="#fff" />}</button>
          {callType === "video" && <button onClick={toggleVideo} style={S.ctrlBtn}>{isVideoOff ? <VideoOff size={24} color="#fff" /> : <Video size={24} color="#fff" />}</button>}
          {callType === "video" && <button onClick={toggleScreen} style={S.ctrlBtn}>{isScreenSharing ? <X size={24} color="#fff" /> : <Monitor size={24} color="#fff" />}</button>}
          <button onClick={endCall} style={S.endBtn}><PhoneOff size={28} color="#fff" /></button>
        </div>
      </div>
    );
  }

  /* ── SELECT FRIENDS SCREEN (now or schedule) ── */
  if (picker === "now-friends" || picker === "sched-friends") {
    const isNow = picker === "now-friends";
    const filtered = searchText ? friends.filter((f) => f.fullName?.toLowerCase().includes(searchText.toLowerCase())) : friends;
    return (
      <div style={S.page}>
        {/* header */}
        <div style={S.pickerHeader}>
          <button onClick={() => { setPicker(null); setSelectedFriends([]); setSearchText(""); }} style={S.backBtn}><ArrowLeft size={24} color="#1a6b3a" /></button>
          <h2 style={S.pickerTitle}>My Friends</h2>
          <div style={{ width: 40 }} />
        </div>

        {/* Start Call / Send Invitation button */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
          <button
            onClick={() => {
              if (!selectedFriends.length) return alert("Select at least 1 friend.");
              if (isNow) { startCallWithSelected(selectedFriends, selectedCallType); }
              else { setSchedFriends(selectedFriends); setPicker("sched-form"); setSearchText(""); }
            }}
            style={S.greenPill}
          >
            {isNow ? "Start Call" : "Send Invitation"}
          </button>
        </div>

        {/* Audio / Video toggle */}
        <div style={S.radioRow}>
          <label style={S.radioLabel} onClick={() => setSelectedCallType("audio")}>
            <span style={{ ...S.radioDot, border: "2px solid #333" }}>{selectedCallType === "audio" && <span style={S.radioFill} />}</span> Audio
          </label>
          <label style={S.radioLabel} onClick={() => setSelectedCallType("video")}>
            <span style={{ ...S.radioDot, border: "2px solid #333" }}>{selectedCallType === "video" && <span style={S.radioFill} />}</span> Video
          </label>
        </div>

        {/* search bar */}
        <div style={S.searchBar}>
          <Search size={16} color="#999" />
          <input type="text" placeholder="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} style={S.searchInput} />
          {searchText && <button onClick={() => setSearchText("")} style={S.searchClear}><X size={14} color="#666" /></button>}
        </div>

        {/* friends list */}
        <div style={S.listScroll}>
          {loadingFriends && <p style={{ padding: 16, color: "#888" }}>Loading...</p>}
          {!loadingFriends && filtered.length === 0 && <p style={{ padding: 16, color: "#888" }}>No friends found.</p>}
          {filtered.map((f) => {
            const sel = selectedFriends.find((s) => s._id === f._id);
            const img = f?.imageURL?.thumbnail ? normalizeImg(f.imageURL.thumbnail) : null;
            return (
              <div key={f._id} onClick={() => {
                setSelectedFriends((prev) => {
                  if (prev.find((s) => s._id === f._id)) return prev.filter((s) => s._id !== f._id);
                  if (prev.length >= 20) { alert("Maximum 20 friends."); return prev; }
                  return [...prev, f];
                });
              }} style={S.friendRow}>
                {img ? <img src={img} alt="" style={S.friendAvatar} /> : <div style={S.friendAvatarPH}>{firstName(f.fullName)[0]}</div>}
                <div style={{ flex: 1, marginLeft: 10 }}>
                  <div style={{ fontSize: 15, fontWeight: "600" }}>{firstName(f.fullName)}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{f.email || ""}</div>
                </div>
                {sel ? <CheckSquare size={22} color="#1a6b3a" /> : <Square size={22} color="#999" />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── SELECT A GROUP SCREEN ── */
  if (picker === "now-groups" || picker === "sched-groups") {
    const isNow = picker === "now-groups";
    return (
      <div style={S.page}>
        <div style={S.pickerHeader}>
          <button onClick={() => setPicker(null)} style={S.backBtn}><ArrowLeft size={24} color="#1a6b3a" /></button>
          <h2 style={S.pickerTitle}>{isNow ? "Select a Group" : "Schedule a Group Call"}</h2>
          <div style={{ width: 40 }} />
        </div>
        {!isNow && <p style={{ fontSize: 12, color: "#666", padding: "8px 16px 0", margin: 0 }}>
          Schedule an audio or video call with one of your groups for a future date/time:
        </p>}
        <div style={S.listScroll}>
          {loadingGroups && <p style={{ padding: 16, color: "#888" }}>Loading...</p>}
          {!loadingGroups && groups.length === 0 && <p style={{ padding: 16, color: "#888" }}>No groups found.</p>}
          {groups.map((g, i) => {
            const name = g.groupName || g.GroupName || "Group";
            const desc = g.groupDescription || g.GroupDescription || "";
            const created = g.updatedAt || g.createdAt || g.CreatedAt || g.dateCreated || "";
            const icon = g.ExtraElements?.profileImage;
            const iconUrl = icon ? normalizeImg(icon) : null;
            return (
              <div key={g._id || i} style={S.groupRow}>
                <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 10 }}>
                  {iconUrl ? <img src={iconUrl} alt="" style={S.friendAvatar} /> : <div style={S.friendAvatarPH}><Users size={18} color="#fff" /></div>}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: "600", color: "#1a6b3a" }}>{name}</div>
                    {created && <div style={{ fontSize: 11, color: "#888" }}>{new Date(created).toLocaleDateString()}</div>}
                    {desc && <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{desc}</div>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {isNow ? (
                    <>
                      <button onClick={() => startGroupCall(g, "audio")} style={S.iconBtn} title="Audio Call"><Phone size={18} color="#1a6b3a" /></button>
                      <button onClick={() => startGroupCall(g, "video")} style={S.iconBtn} title="Video Call"><Video size={18} color="#1a6b3a" /></button>
                    </>
                  ) : (
                    <button onClick={() => { setSchedGroup(g); setSchedTitle(name + " Call"); setSchedDate(""); setSchedCallType("video"); setSchedFriends([]); setPicker("sched-group-form"); }} style={S.iconBtn} title="Schedule Call"><Clock size={18} color="#1a6b3a" /></button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── SCHEDULE FORM (after friends selected) ── */
  if (picker === "sched-form") {
    return (
      <div style={S.page}>
        <div style={S.pickerHeader}>
          <button onClick={() => { setPicker(null); setSchedFriends([]); }} style={S.backBtn}><ArrowLeft size={24} color="#1a6b3a" /></button>
          <h2 style={S.pickerTitle}>Schedule Call</h2>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ padding: 16 }}>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
            {schedFriends.length} participant{schedFriends.length > 1 ? "s" : ""}: {schedFriends.map((f) => firstName(f.fullName || f.email)).join(", ")}
          </p>
          <label style={S.label}>Call Title</label>
          <input type="text" placeholder="Enter call title" value={schedTitle} onChange={(e) => setSchedTitle(e.target.value)} style={S.input} />
          <label style={{ ...S.label, marginTop: 10 }}>Date & Time</label>
          <input type="datetime-local" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} style={S.input} />
          <label style={{ ...S.label, marginTop: 10 }}>Call Type</label>
          <div style={{ ...S.radioRow, marginTop: 4 }}>
            <label style={S.radioLabel} onClick={() => setSchedCallType("audio")}>
              <span style={{ ...S.radioDot, border: "2px solid #333" }}>{schedCallType === "audio" && <span style={S.radioFill} />}</span> Audio
            </label>
            <label style={S.radioLabel} onClick={() => setSchedCallType("video")}>
              <span style={{ ...S.radioDot, border: "2px solid #333" }}>{schedCallType === "video" && <span style={S.radioFill} />}</span> Video
            </label>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => { setPicker(null); setSchedFriends([]); }} style={S.cancelBtn}>Cancel</button>
            <button onClick={scheduleCall} disabled={loadingSched} style={S.greenPill}>{loadingSched ? "Sending..." : "Send Invitation"}</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── GROUP SCHEDULE FORM ── */
  if (picker === "sched-group-form") {
    const gName = schedGroup?.groupName || schedGroup?.GroupName || "Group";
    return (
      <div style={S.page}>
        <div style={S.pickerHeader}>
          <button onClick={() => { setPicker(null); setSchedGroup(null); }} style={S.backBtn}><ArrowLeft size={24} color="#1a6b3a" /></button>
          <h2 style={S.pickerTitle}>Schedule Group Call</h2>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ padding: 16 }}>
          <p style={{ fontSize: 14, color: "#1a6b3a", fontWeight: "bold", marginBottom: 12 }}>Group: {gName}</p>
          <label style={S.label}>Call Title</label>
          <input type="text" placeholder="Enter call title" value={schedTitle} onChange={(e) => setSchedTitle(e.target.value)} style={S.input} />
          <label style={{ ...S.label, marginTop: 10 }}>Date & Time</label>
          <input type="datetime-local" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} style={S.input} />
          <label style={{ ...S.label, marginTop: 10 }}>Call Type</label>
          <div style={{ ...S.radioRow, marginTop: 4 }}>
            <label style={S.radioLabel} onClick={() => setSchedCallType("audio")}><span style={{ ...S.radioDot, border: "2px solid #333" }}>{schedCallType === "audio" && <span style={S.radioFill} />}</span> Audio</label>
            <label style={S.radioLabel} onClick={() => setSchedCallType("video")}><span style={{ ...S.radioDot, border: "2px solid #333" }}>{schedCallType === "video" && <span style={S.radioFill} />}</span> Video</label>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => { setPicker(null); setSchedGroup(null); }} style={S.cancelBtn}>Cancel</button>
            <button onClick={async () => {
              if (!schedTitle.trim()) return alert("Enter a call title.");
              if (!schedDate) return alert("Select a date and time.");
              const channelId = Date.now().toString() + Math.floor(Math.random() * 100);
              const fd = new FormData();
              fd.append("title", schedTitle); fd.append("emails", myProfile?.email || "");
              fd.append("names", gName); fd.append("channelId", channelId);
              fd.append("scheduleDate", new Date(schedDate).toISOString());
              fd.append("callType", schedCallType); fd.append("inviteLink", ""); fd.append("hostId", myId);
              setLoadingSched(true);
              try {
                const res = await nodeApi.post("/api/v1/call/schedule", fd);
                if (res.data?.statusCode === 200) {
                  const nc = { id: channelId, title: schedTitle, date: new Date(schedDate).toISOString(), callType: schedCallType, names: gName, groupName: gName, createdAt: new Date().toISOString() };
                  saveScheduledCalls([...myScheduledCalls, nc]);
                  alert("Group call scheduled successfully."); setSchedTitle(""); setSchedDate(""); setSchedGroup(null); setPicker(null);
                } else alert(res.data?.message || "Something went wrong!");
              } catch (e) { alert("Failed to schedule call."); }
              setLoadingSched(false);
            }} disabled={loadingSched} style={S.greenPill}>{loadingSched ? "Sending..." : "Send Invitation"}</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── EDIT SCHEDULED CALL ── */
  if (editingCall) {
    return (
      <div style={S.page}>
        <div style={S.pickerHeader}>
          <button onClick={() => setEditingCall(null)} style={S.backBtn}><ArrowLeft size={24} color="#1a6b3a" /></button>
          <h2 style={S.pickerTitle}>Edit Scheduled Call</h2>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ padding: 16 }}>
          <label style={S.label}>Call Title</label>
          <input type="text" value={editingCall.title} onChange={(e) => setEditingCall({ ...editingCall, title: e.target.value })} style={S.input} />
          <label style={{ ...S.label, marginTop: 10 }}>Date & Time</label>
          <input type="datetime-local" value={editingCall.date ? new Date(editingCall.date).toISOString().slice(0, 16) : ""} onChange={(e) => setEditingCall({ ...editingCall, date: new Date(e.target.value).toISOString() })} style={S.input} />
          <label style={{ ...S.label, marginTop: 10 }}>Call Type</label>
          <div style={{ ...S.radioRow, marginTop: 4 }}>
            <label style={S.radioLabel} onClick={() => setEditingCall({ ...editingCall, callType: "audio" })}><span style={{ ...S.radioDot, border: "2px solid #333" }}>{editingCall.callType === "audio" && <span style={S.radioFill} />}</span> Audio</label>
            <label style={S.radioLabel} onClick={() => setEditingCall({ ...editingCall, callType: "video" })}><span style={{ ...S.radioDot, border: "2px solid #333" }}>{editingCall.callType === "video" && <span style={S.radioFill} />}</span> Video</label>
          </div>
          <p style={{ fontSize: 13, color: "#666", marginTop: 10 }}>Participants: {editingCall.names || editingCall.groupName || "N/A"}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={() => setEditingCall(null)} style={S.cancelBtn}>Cancel</button>
            <button onClick={() => {
              const updated = myScheduledCalls.map((c) => c.id === editingCall.id ? editingCall : c);
              saveScheduledCalls(updated);
              setEditingCall(null);
              alert("Scheduled call updated.");
            }} style={S.greenPill}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── IDLE LANDING — matches RN call_screen.js ── */
  return (
    <div style={S.container}>
      <h1 style={S.pageTitle}>Connect with Audio or Video Calls</h1>

      {/* NOW section */}
      <div style={S.section}>
        <div style={S.secHeader}>
          <span style={S.secHeaderText}>Host a Voice or Video Call <span style={{ fontSize: 18 }}>Now</span></span>
        </div>
        <div style={S.secBody}>
          <p style={S.chooseLabel}>Choose Participants</p>
          <div style={S.twoBtn}>
            <button onClick={() => { setPicker("now-friends"); setSelectedFriends([]); setSelectedCallType("video"); setSearchText(""); }} style={S.greenPillRow}><span style={S.pillTxt}>Select Friends</span><UserPlus size={18} color="#fff" /></button>
            <button onClick={() => setPicker("now-groups")} style={S.greenPillRow}><span style={S.pillTxt}>Select a Group</span><Users size={18} color="#fff" /></button>
          </div>
        </div>
      </div>

      {/* SCHEDULE section */}
      <div style={{ ...S.section, marginTop: 24 }}>
        <div style={S.secHeader}>
          <span style={S.secHeaderText}><span style={{ fontSize: 18 }}>Schedule</span> a future Voice or Video Call</span>
        </div>
        <div style={S.secBody}>
          <p style={S.chooseLabel}>Choose Participants</p>
          <div style={S.twoBtn}>
            <button onClick={() => { setPicker("sched-friends"); setSelectedFriends([]); setSelectedCallType("video"); setSearchText(""); }} style={S.greenPillRow}><span style={S.pillTxt}>Select Friends</span><UserPlus size={18} color="#fff" /></button>
            <button onClick={() => setPicker("sched-groups")} style={S.greenPillRow}><span style={S.pillTxt}>Select a Group</span><Users size={18} color="#fff" /></button>
          </div>
        </div>
      </div>

      {/* UPCOMING SCHEDULED CALLS */}
      {myScheduledCalls.length > 0 && (
        <div style={{ ...S.section, marginTop: 24 }}>
          <div style={S.secHeader}>
            <span style={S.secHeaderText}>Upcoming Scheduled Calls</span>
          </div>
          <div style={S.secBody}>
            {myScheduledCalls
              .filter((c) => new Date(c.date) > new Date(Date.now() - 86400000)) // show past 24h + future
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((c) => {
                const isPast = new Date(c.date) < new Date();
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0", opacity: isPast ? 0.5 : 1 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: "600" }}>{c.title || "Untitled"}</div>
                      <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                        {new Date(c.date).toLocaleString()} — {c.callType === "video" ? "Video" : "Audio"}
                        {c.groupName ? ` — Group: ${c.groupName}` : ""}
                      </div>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{c.names || ""}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {!isPast && (
                        <button onClick={() => setEditingCall({ ...c })} style={S.iconBtn} title="Edit"><Edit2 size={16} color="#1a6b3a" /></button>
                      )}
                      <button onClick={() => {
                        if (window.confirm("Delete this scheduled call?")) {
                          saveScheduledCalls(myScheduledCalls.filter((x) => x.id !== c.id));
                        }
                      }} style={S.iconBtn} title="Delete"><Trash2 size={16} color="#d32f2f" /></button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ STYLES ═══════════════ */
const S = {
  container: { padding: 20, maxWidth: 600, margin: "0 auto" },
  pageTitle: { color: "#1a6b3a", fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  page: { minHeight: "100vh", backgroundColor: "#fff" },

  /* sections */
  section: { borderRadius: 10, overflow: "hidden", marginHorizontal: 20 },
  secHeader: { backgroundColor: "#1a6b3a", padding: "12px 16px" },
  secHeaderText: { color: "#fff", fontSize: 14, fontWeight: "bold", textAlign: "center", display: "block" },
  secBody: { padding: 16, backgroundColor: "#fff", border: "1px solid #e0e0e0", borderTop: "none", borderRadius: "0 0 10px 10px" },
  chooseLabel: { fontWeight: "bold", fontSize: 14, textAlign: "center", marginBottom: 10 },
  twoBtn: { display: "flex", gap: 10, justifyContent: "space-between" },
  greenPillRow: { display: "flex", alignItems: "center", gap: 6, backgroundColor: "#1a6b3a", color: "#fff", border: "none", borderRadius: 7, padding: "8px 14px", cursor: "pointer", fontSize: 14, fontWeight: "bold" },
  pillTxt: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  /* picker header */
  pickerHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 8px", borderBottom: "1px solid #ddd", height: 50 },
  pickerTitle: { color: "#1a6b3a", fontSize: 22, fontWeight: "bold", margin: 0 },
  backBtn: { background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", alignItems: "center" },

  /* green pill button */
  greenPill: { backgroundColor: "#1a6b3a", color: "#fff", border: "none", borderRadius: 25, padding: "10px 24px", cursor: "pointer", fontSize: 16, fontWeight: "bold" },

  /* radio */
  radioRow: { display: "flex", gap: 30, justifyContent: "center", padding: "6px 0" },
  radioLabel: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 15 },
  radioDot: { width: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" },
  radioFill: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#000", display: "block" },

  /* search */
  searchBar: { display: "flex", alignItems: "center", gap: 6, margin: "8px 16px", padding: "6px 10px", backgroundColor: "#f0f0f0", borderRadius: 15 },
  searchInput: { flex: 1, border: "none", background: "none", outline: "none", fontSize: 14, padding: "4px 0" },
  searchClear: { background: "none", border: "none", cursor: "pointer", padding: 2 },

  /* lists */
  listScroll: { flex: 1, overflowY: "auto" },
  friendRow: { display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #eee", cursor: "pointer" },
  friendAvatar: { width: 50, height: 50, borderRadius: 25, objectFit: "cover", backgroundColor: "#eee" },
  friendAvatarPH: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#1a6b3a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 20 },
  groupRow: { display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #eee" },
  iconBtn: { background: "none", border: "1px solid #ddd", borderRadius: 8, padding: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },

  /* schedule form */
  label: { fontWeight: "bold", fontSize: 13 },
  input: { padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 14, width: "100%", boxSizing: "border-box", marginTop: 4 },
  cancelBtn: { padding: "8px 20px", border: "1px solid #ccc", borderRadius: 20, backgroundColor: "#fff", cursor: "pointer", fontSize: 14 },

  /* full screen call */
  full: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#111", zIndex: 9999, display: "flex", flexDirection: "column" },
  bgImg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" },
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)" },
  incomingWrap: { position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 60, alignItems: "center" },
  callerName: { color: "#fff", fontSize: 24, fontWeight: "bold", textShadow: "0 2px 8px rgba(0,0,0,0.5)" },
  acceptBtn: { width: 70, height: 70, borderRadius: "50%", backgroundColor: "#4caf50", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  declineBtn: { width: 70, height: 70, borderRadius: "50%", backgroundColor: "#f44336", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  remoteWrap: { flex: 1, position: "relative", backgroundColor: "#111" },
  remoteVid: { width: "100%", height: "100%", position: "absolute", top: 0, left: 0 },
  waitText: { color: "#aaa", fontSize: 20, fontWeight: "600", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
  localFull: { flex: 1 },
  localSmall: { position: "absolute", top: 20, right: 20, width: 160, height: 120, borderRadius: 8, overflow: "hidden", zIndex: 10, border: "2px solid #fff" },
  timerBar: { position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", zIndex: 11 },
  timerTxt: { color: "#ccc", fontSize: 18, fontWeight: "600", textShadow: "0 1px 4px rgba(0,0,0,0.5)" },
  ctrlBar: { position: "absolute", bottom: 30, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 16, zIndex: 11 },
  ctrlBtn: { width: 50, height: 50, borderRadius: "50%", backgroundColor: "rgba(34,34,34,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  endBtn: { width: 64, height: 64, borderRadius: "50%", backgroundColor: "rgba(238,34,34,0.75)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
};
