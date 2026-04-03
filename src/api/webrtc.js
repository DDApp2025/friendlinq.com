import AgoraRTC from "agora-rtc-sdk-ng";

// ICE configuration — copied from RN webrtc.js exactly
export const ICE_SERVERS = [
  {
    urls: "turn:107.180.75.184:3000",
    username: "rearguard",
    credential: "123456",
  },
];

// Agora configuration — copied from RN constants.js
export const AGORA_APP_ID = "dd6dbba5e50d42c7880152591687410d";

// Create Agora client (RTC mode for 1-to-1 or group calls)
export const agoraClient = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

// Join a channel
export const joinChannel = async (channelName, token = null, uid = null) => {
  const joinedUid = await agoraClient.join(AGORA_APP_ID, channelName, token, uid);
  return joinedUid;
};

// Create and publish local tracks
export const createLocalTracks = async (callType = "video") => {
  if (callType === "video") {
    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
    return { audioTrack, videoTrack };
  } else {
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    return { audioTrack, videoTrack: null };
  }
};

// Publish local tracks to the channel
export const publishTracks = async (tracks) => {
  const toPublish = Object.values(tracks).filter(Boolean);
  if (toPublish.length > 0) {
    await agoraClient.publish(toPublish);
  }
};

// Leave the channel and clean up tracks
export const leaveChannel = async (tracks) => {
  if (tracks) {
    Object.values(tracks).forEach((track) => {
      if (track) {
        track.stop();
        track.close();
      }
    });
  }
  await agoraClient.leave();
};

// Screen share — create screen video track
export const createScreenTrack = async () => {
  const screenTrack = await AgoraRTC.createScreenVideoTrack();
  return screenTrack;
};

export default {
  agoraClient,
  AGORA_APP_ID,
  ICE_SERVERS,
  joinChannel,
  createLocalTracks,
  publishTracks,
  leaveChannel,
  createScreenTrack,
};
