import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import { getNotifications } from '../../actions/notification_actions';
import * as actionTypes from '../../actions/actions_types';
import IncomingCallOverlay from '../IncomingCallOverlay';

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);

  // Fetch notification count on mount
  useEffect(() => {
    (async () => {
      const res = await getNotifications(0, 1);
      if (res?.statusCode === 200) {
        dispatch({
          type: actionTypes.GET_NOTIFICATION_SUCCESS,
          getNotificationData: res.data,
        });
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsDesktop(window.innerWidth > 900);
      if (window.innerWidth > 900) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <style>{responsiveCSS}</style>
      <TopNav onMenuToggle={() => setSidebarOpen((o) => !o)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main role="main" style={{
        paddingTop: 0,
        paddingBottom: isMobile ? 60 : 0,
        minHeight: 'calc(100vh - 56px)',
      }}>
        {children}
      </main>
      {isMobile && <BottomNav />}
      <IncomingCallOverlay />
    </>
  );
};

const responsiveCSS = `
  /* Mobile: show hamburger, hide desktop nav links */
  @media (max-width: 768px) {
    .topnav-links { display: none !important; }
    .topnav-hamburger { display: flex !important; }
  }

  /* Tablet: show hamburger + some links */
  @media (min-width: 769px) and (max-width: 900px) {
    .topnav-links { display: none !important; }
    .topnav-hamburger { display: flex !important; }
  }

  /* Desktop: show nav links, hide hamburger */
  @media (min-width: 901px) {
    .topnav-links { display: flex !important; }
    .topnav-hamburger { display: none !important; }
  }
`;

export default AppLayout;
