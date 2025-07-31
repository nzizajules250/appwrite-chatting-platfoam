"use client";

import { useEffect, useState } from 'react';
import { account, databases, client } from '@/lib/appwrite'; // Import client for realtime
import ChatListItem from '@/components/ChatListItem';

// Replace with your actual Database ID and Collections IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID; // You need to add this to your .env.local
const CHATS_COLLECTION_ID = 'chats'; // Replace with your actual chats collection ID
const MESSAGES_COLLECTION_ID = 'messages'; // Replace with your actual messages collection ID

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]); // State for messages
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null); // State to track the selected chat

  useEffect(() => {
    const fetchUserAndChats = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);

        // Fetch chats for the current user
        const response = await databases.listDocuments(
          DATABASE_ID,
          CHATS_COLLECTION_ID
          // Add queries here to filter chats by the current user
        );
        setChats(response.documents);

      } catch (error) {
        console.error('Error fetching user or chats:', error);
        setError(error.message);
        if (error.code === 401) {
             window.location.href = '/login';
        }
      }
      setLoading(false);
    };

    fetchUserAndChats();
  }, []);

  // Realtime subscription for messages in the selected chat
  useEffect(() => {
    if (selectedChat) {
      const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents`, response => {
        if (response.events.includes(`databases.*.collections.*.documents.*.create`)) {
          // Handle new message creation
          // You'll want to filter messages here to only include those for the selected chat
          console.log('New message created:', response.payload);
          // Update the messages state
          // setMessages(prevMessages => [...prevMessages, response.payload]); // Example for adding new message
        } else if (response.events.includes(`databases.*.collections.*.documents.*.update`)) {
          // Handle message updates
          console.log('Message updated:', response.payload);
          // Update the messages state
        } else if (response.events.includes(`databases.*.collections.*.documents.*.delete`)) {
          // Handle message deletions
          console.log('Message deleted:', response.payload);
          // Update the messages state
        }
      });

      // Clean up the subscription on component unmount or when selectedChat changes
      return () => {
        unsubscribe();
      };
    }
  }, [selectedChat]); // Resubscribe when selectedChat changes

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Here you would also fetch existing messages for the selected chat
    // fetchMessagesForChat(chat.$id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error: {error}</div>;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="chat-container">
      <div className="left-sidebar">{/* Left Sidebar Content */}</div>
      <div className="middle-section">
        <h2>Chats</h2>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div key={chat.$id} onClick={() => handleChatSelect(chat)}>
              <ChatListItem chat={chat} />
            </div>
          ))
        ) : (
          <p>No chats found.</p>
        )}
      </div>
      <div className="main-chat-window">
        {/* Main Chat Window Content */}
        {selectedChat ? (
          <div>
            <h3>Chatting with: {selectedChat.name}</h3>
            {/* Display messages here */}
            {/* {messages.map(message => <div key={message.$id}>{message.content}</div>)} */}
            {/* Message input area */}
          </div>
        ) : (
          <p>Select a chat to start messaging.</p>
        )}
      </div>
      <div className="right-sidebar">{/* Right Sidebar Content */}</div>
    </div>
  );
}
