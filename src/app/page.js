"use client";

import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';
// You will import other necessary Appwrite services (Databases, Storage, Realtime) here later

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
      } catch (error) {
        // If no user is logged in, redirect to login page
        window.location.href = '/login';
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // This case should ideally not be reached due to the redirect in useEffect, but as a fallback
    return null;
  }

  return (
    <div className="chat-container">
      <div className="left-sidebar">{/* Left Sidebar Content */}</div>
      <div className="middle-section">{/* Middle Section Content */}</div>
      <div className="main-chat-window">{/* Main Chat Window Content */}</div>
      <div className="right-sidebar">{/* Right Sidebar Content */}</div>
    </div>
  );
}
