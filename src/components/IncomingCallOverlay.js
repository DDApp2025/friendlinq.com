import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SOCKET from "../api/socket";
import { Phone, PhoneOff } from "lucide-react";
import normalizeImg from "../utils/normalizeImg";
import { firstName } from "../utils/displayName";

export default function IncomingCallOverlay() {
  const navigate = useNavigate();
  const myId = useSelector((s) => s.authReducer?.getProfileData?._id);
  const [incoming, setIncoming] = useState(null);
  const ringtoneRef = useRef(null);

  useEffect(() => {
    if (!myId) return;

    const handleCall = (data) => {
      // Only show if not already on call page
      setIncoming(data);
      try {
        ringtoneRef.current = new Audio("/ringtone.mp3");
        ringtoneRef.current.loop = true;
        ringtoneRef.current.play().catch(() => {});
      } catch (e) {}
    };

    SOCKET.on("callToUser", handleCall);
    return () => SOCKET.off("callToUser", handleCall);
  }, [myId]);

  if (!incoming) return null;

  const stopRingtone = () => {
    try {
      ringtoneRef.current?.pause();
      ringtoneRef.current = null;
    } catch (e) {}
  };

  const accept = () => {
    stopRingtone();
    // Store incoming data in sessionStorage for the Call page to pick up
    sessionStorage.setItem("incomingCallData", JSON.stringify(incoming));
    setIncoming(null);
    navigate("/call");
  };

  const decline = () => {
    stopRingtone();
    SOCKET.emit("callStatus", {
      callerId: myId,
      receiverId: incoming?.callerId,
      status: "3",
      channel_name: incoming?.channel_name || incoming?.channelName,
    });
    setIncoming(null);
  };

  const callerImg = incoming?.callerImage || incoming?.userDP;
  const imgUrl = callerImg ? normalizeImg(callerImg) : null;
  const callerName = firstName(incoming?.name);
  const isVideo = incoming?.type === "video" || incoming?.callType === "video";

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {imgUrl ? (
          <img src={imgUrl} alt="" style={styles.avatar} />
        ) : (
          <div style={styles.avatarPlaceholder}>{callerName[0]}</div>
        )}
        <div style={styles.info}>
          <strong style={{ fontSize: 16 }}>{callerName}</strong>
          <span style={{ color: "#666", fontSize: 13 }}>
            Incoming {isVideo ? "Video" : "Audio"} Call...
          </span>
        </div>
        <div style={styles.buttons}>
          <button onClick={accept} style={styles.acceptBtn}>
            <Phone size={20} color="#fff" />
          </button>
          <button onClick={decline} style={styles.declineBtn}>
            <PhoneOff size={20} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 10000,
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "12px 16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    border: "2px solid #1a6b3a",
    minWidth: 280,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    backgroundColor: "#1a6b3a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  info: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  buttons: {
    display: "flex",
    gap: 8,
  },
  acceptBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    backgroundColor: "#4caf50",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  declineBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    backgroundColor: "#f44336",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
