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
import PostDetail from './pages/PostDetail';
import LandingPage from './pages/LandingPage';
// PublicSupport now served as static HTML from public/support/index.html
// Contact, Privacy, Terms now served as static HTML from public/[route]/index.html

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
        {/* /about served as static HTML from public/about/index.html */}
        {/* /features served as static HTML from public/features/index.html */}
        {/* /faq served as static HTML from public/faq/index.html */}
        {/* /safety served as static HTML from public/safety/index.html */}
        {/* /support served as static HTML from public/support/index.html */}
        {/* /contact served as static HTML from public/contact/index.html */}
        {/* /privacy served as static HTML from public/privacy/index.html */}
        {/* /terms served as static HTML from public/terms/index.html */}
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
                  <Route path="/post/:postId" element={<PostDetail />} />
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
