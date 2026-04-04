import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdHouse,
  MdWallpaper,
  MdPersonAdd,
  MdNotificationsActive,
  MdChat,
  MdGroup,
  MdCall,
} from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';

const tutorialList = [
  {
    title: 'Home Feed Tutorial',
    iconTitle: 'Icon: House',
    icon: <MdHouse size={40} color="#1a6b3a" />,
    items: [
      {
        subTitle: 'Your Home Feed',
        text: '• Post, share, download and save posts, photos & videos\n\n• Like, comment and interact with either friends or the whole world',
      },
    ],
  },
  {
    title: 'Photo Library Tutorial',
    iconTitle: 'Icon: Image',
    icon: <MdWallpaper size={40} color="#1a6b3a" />,
    items: [
      {
        subTitle: 'Your Photo & Video Library',
        text: '• Upload, download and save your photos & videos\n\n• See thumbnails of all your saved photos and videos',
      },
    ],
  },
  {
    title: 'Friends Tutorial',
    iconTitle: 'Icon: User + Avatar',
    icon: <MdPersonAdd size={40} color="#1a6b3a" />,
    items: [
      {
        subTitle: 'Your Friends Screen',
        text: '• See all your friends in one quick view\n\n• Select up to 4 top friends to place in your custom profile\n\n• Select friends to text chat, audio call, and video call\n\n• See results of "Friend Request" button, and "Sent Requests" button below',
      },
      {
        subTitle: '"Friend Requests" button returns the following screen',
        text: '• Displays friend requests sent to you',
      },
      {
        subTitle: '"Sent Requests" button returns the following screen',
        text: '• Displays friend requests that you have sent to others\n\n• You can cancel a sent friend request at any time prior to it being accepted or declined',
      },
    ],
  },
  {
    title: 'Notification Tutorial',
    iconTitle: 'Icon: Bell',
    icon: <MdNotificationsActive size={40} color="#1a6b3a" />,
    items: [
      {
        subTitle: 'Your Notifications Screen',
        text: "• Get notified when your friends come online, go live, create a post, or upon other actions\n\n• You'll be notified when a friend starts a call or video chat with you, or with a group you're in",
      },
    ],
  },
  {
    title: 'Chat Tutorial',
    iconTitle: 'Icon: Text Bubble',
    icon: <MdChat size={40} color="#1a6b3a" />,
    items: [
      {
        subTitle: 'Your Text, Audio, Video Chat Screen',
        text: '• Go to this screen when you want to text, call, or video chat with a friend\n\n• Clicking on the phone icon will start an audio call. Clicking on the camera icon will start a video call\n\n• You can turn your camera or mic on and off with the lower controls\n\n• Clicking the lower image icon will take you to your photo library to select photos or videos to attach to your chat',
      },
    ],
  },
  {
    title: 'Group Tutorial',
    iconTitle: 'Icon: Two Avatars',
    icon: <MdGroup size={40} color="#1a6b3a" />,
    items: [
      {
        subTitle: 'Your Group Screen',
        text: '• See a complete list of all the groups you have joined\n\n• Click the phone icon to start an audio call with a group\n\n• Click the camera icon to start a video call with your group\n\n• Click the clock to schedule a group call anytime in the future\n\n• Click the "Join Group" button to join a new group\n\n• Click on "Create Group" button to form a new group',
      },
      {
        subTitle: 'Request to join a new group by clicking "Join"',
        text: '',
      },
      {
        subTitle: 'Create a new group by entering the group name and a short description',
        text: '',
      },
    ],
  },
  {
    title: 'Call Tutorial',
    iconTitle: 'Icon: Phone',
    icon: <MdCall size={40} color="#1a6b3a" />,
    items: [
      {
        subTitle: 'Your Live and Future Call Screens\n\nTo host a live audio or video call with your friends, or with your groups:',
        text: '• In the 1st card: Click the "friends" icon to host an audio or video call now, with one or more friends\n\n• In the 1st card: Click the "group" icon to host an audio or video group call now',
      },
      {
        subTitle: 'To schedule a future audio or video call with your friends, or with a groups:',
        text: '• In the 2nd card: Click the "friends" icon to schedule an audio or video call in the future, with one or more friends\n\n• In the 2nd card: Click on the "group" icon to form a new group',
      },
    ],
  },
  {
    title: 'Changing Profiles Tutorial',
    iconTitle: 'Icon: Heart',
    icon: <FaHeart size={36} color="red" />,
    items: [
      {
        subTitle: 'Your Flirting Connection\n\nTo access the FriendLinq Flirting/Dating platform, click the "Heart" icon in the lower right corner of the bottom navigation bar',
        text: '• By clicking the "Heart" icon, the app will take you into the Flirting/Dating platform, if you are already a registered user\n\n• If you\'re not registered on the Flirting/Dating platform, clicking the icon will take you to the registration page\n\n• If you\'re a registered user of both platforms, clicking the icon will seamlessly switch you back and forth between the two platforms',
      },
    ],
  },
];

function ChooseTutorial() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img
          src="/logo192.png"
          alt="Logo"
          style={styles.logo}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <h1 style={styles.welcomeTitle}>Welcome to Friendlinq</h1>
        <p style={styles.welcomeBody}>
          Your all in one platform for{'\n'}connecting and sharing
        </p>
        <p style={styles.tourText}>
          Let's take a quick tour of{'\n'}what you can do here.
        </p>
        <button
          style={styles.mainBtn}
          onClick={() => navigate('/tutorials')}
        >
          Start Tour
        </button>
        <button
          style={styles.mainBtn}
          onClick={() => navigate('/home')}
        >
          Exit Tutorial
        </button>
      </div>
    </div>
  );
}

function TutorialViewer() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const currentItem = tutorialList[index];

  return (
    <div style={styles.container}>
      <div style={{ width: '90%', maxWidth: 600, margin: '0 auto', paddingBottom: 40 }}>
        <div style={{ textAlign: 'center' }}>
          <img
            src="/logo192.png"
            alt="Logo"
            style={styles.logo}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {currentItem && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={styles.tutTitle}>{currentItem.title}</h2>
            <p style={styles.iconTitle}>{currentItem.iconTitle}</p>
            <div style={{ marginBottom: 16 }}>{currentItem.icon}</div>

            {currentItem.items.map((item, i) => (
              <div key={i} style={styles.tutCard}>
                <h3 style={styles.subTitle}>{item.subTitle}</h3>
                {item.text && (
                  <p style={styles.tutBody}>
                    {item.text.split('\n').map((line, j) => (
                      <React.Fragment key={j}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={styles.navRow}>
          <button
            style={{ ...styles.navBtn, flex: 1, marginRight: 15 }}
            onClick={() => {
              if (index === 0) navigate(-1);
              else setIndex(index - 1);
            }}
          >
            Back
          </button>
          <button
            style={{ ...styles.navBtn, flex: 1 }}
            onClick={() => {
              if (index === tutorialList.length - 1) navigate('/home');
              else setIndex(index + 1);
            }}
          >
            {index === tutorialList.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>

        {index < tutorialList.length - 1 && (
          <button
            style={{ ...styles.navBtn, width: '100%', marginTop: 12 }}
            onClick={() => navigate('/home')}
          >
            Exit Tutorial
          </button>
        )}

        {/* Progress indicator */}
        <div style={styles.progress}>
          {tutorialList.map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: i === index ? '#1a6b3a' : '#ccc',
                margin: '0 3px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    padding: 16,
  },
  content: {
    maxWidth: 500,
    margin: '0 auto',
    textAlign: 'center',
    paddingTop: 20,
  },
  logo: {
    height: 80,
    width: 80,
    objectFit: 'contain',
    marginTop: 5,
  },
  welcomeTitle: {
    color: '#333',
    fontSize: 24,
    marginTop: 10,
    fontWeight: 'bold',
  },
  welcomeBody: {
    color: '#333',
    fontSize: 18,
    marginTop: 30,
    fontWeight: 'bold',
    whiteSpace: 'pre-line',
  },
  tourText: {
    color: '#333',
    fontSize: 20,
    marginTop: 40,
    fontWeight: 'bold',
    whiteSpace: 'pre-line',
  },
  mainBtn: {
    display: 'block',
    width: '90%',
    maxWidth: 400,
    margin: '20px auto 0',
    height: 50,
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 40,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tutTitle: {
    color: '#333',
    fontSize: 22,
    marginTop: 10,
    fontWeight: 'bold',
  },
  iconTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  tutCard: {
    textAlign: 'left',
    padding: '12px 20px',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  subTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    whiteSpace: 'pre-line',
  },
  tutBody: {
    color: '#333',
    fontSize: 16,
    lineHeight: 1.5,
    margin: 0,
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  navBtn: {
    height: 50,
    backgroundColor: '#1a6b3a',
    color: '#fff',
    border: 'none',
    borderRadius: 40,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },
};

export { ChooseTutorial, TutorialViewer };
export default TutorialViewer;
