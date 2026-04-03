import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
const PhotosPage = () => <div><h1>Photos</h1></div>;
const CallPage = () => <div><h1>Call</h1></div>;
const FavoritesPage = () => <div><h1>Favorites</h1></div>;
const SettingsPage = () => <div><h1>Settings</h1></div>;
const SupportPage = () => <div><h1>Support</h1></div>;

function App() {
  return (
    <BrowserRouter>
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
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/photos" element={<PhotosPage />} />
                  <Route path="/add-friend" element={<AddFriendPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/messages" element={<ChatListPage />} />
                  <Route path="/chat/:userId" element={<ChatPage />} />
                  <Route path="/friends" element={<FriendsPage />} />
                  <Route path="/call" element={<CallPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/profile" element={<MyProfile />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/comments/:postId" element={<CommentsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
