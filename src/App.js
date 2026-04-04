import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import SignUpCommon from './pages/SignUpCommon';
import ChooseUserType from './pages/ChooseUserType';
import MyProfile from './pages/MyProfile';
import EditProfile from './pages/EditProfile';
import UserProfile from './pages/UserProfile';
import FriendsPage from './pages/Friends';
import AddFriendPage from './pages/AddFriend';
import CommentsPage from './pages/Comments';
import ChatListPage from './pages/ChatList';
import ChatPage from './pages/Chat';
import NotificationsPage from './pages/Notifications';
// Groups lazy-loaded below
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Portfolio from './pages/Portfolio';
import PrivatePortfolio from './pages/PrivatePortfolio';
// Marketplace lazy-loaded below
import MarketplaceDetail from './pages/MarketplaceDetail';
// Subscription lazy-loaded below
import Settings from './pages/Settings';
import Support from './pages/Support';
import { ChooseTutorial, TutorialViewer } from './pages/Tutorials';
// Call and LiveStream lazy-loaded below
import FavoritesPage from './pages/Favorites';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Features from './pages/Features';
import FAQ from './pages/FAQ';
import Safety from './pages/Safety';
import PublicSupport from './pages/PublicSupport';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Lazy-loaded heavy components — code-split to reduce initial bundle
const CallPage = React.lazy(() => import('./pages/Call'));
const LiveStream = React.lazy(() => import('./pages/LiveStream'));
const GroupsPage = React.lazy(() => import('./pages/Groups'));
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const Subscription = React.lazy(() => import('./pages/Subscription'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <SignUpCommon />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <VerifyOtp />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/support" element={<PublicSupport />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/register/user-type"
          element={
            <ProtectedRoute>
              <ChooseUserType />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <React.Suspense fallback={<div style={{padding:'40px',textAlign:'center'}}>Loading...</div>}>
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/photos" element={<Portfolio />} />
                  <Route path="/add-friend" element={<AddFriendPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/messages" element={<ChatListPage />} />
                  <Route path="/chat/:userId" element={<ChatPage />} />
                  <Route path="/friends" element={<FriendsPage />} />
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/call" element={<CallPage />} />
                  <Route path="/live/:channelName" element={<LiveStream />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/profile" element={<MyProfile />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/comments/:postId" element={<CommentsPage />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/private-portfolio" element={<PrivatePortfolio />} />
                  <Route path="/private-portfolio/:friendId" element={<PrivatePortfolio />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/marketplace/:itemId" element={<MarketplaceDetail />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/choose-tutorial" element={<ChooseTutorial />} />
                  <Route path="/tutorials" element={<TutorialViewer />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
                </React.Suspense>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
