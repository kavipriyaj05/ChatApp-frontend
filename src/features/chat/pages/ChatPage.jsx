import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  selectChats,
  selectChatsLoading,
  selectActiveChatId,
  setActiveChat,
} from '../chatSlice';
import { fetchAllChats, fetchChatById } from '../chatApi';
import ChatWindow from '../components/ChatWindow';
import '../../../styles/chat.css';

/**
 * Main chat page — two-panel layout:
 *   Left: Sidebar with chat list (contacts/conversations)
 *   Right: ChatWindow for active conversation
 *
 * Owner: Mahalakshmi (Module 2)
 *
 * Note: The full ChatList sidebar is owned by Jeyanth (Module 3).
 * This page renders a simplified internal list until Module 3 is integrated.
 */
const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatId: paramChatId } = useParams();

  const chats = useSelector(selectChats);
  const chatsLoading = useSelector(selectChatsLoading);
  const activeChatId = useSelector(selectActiveChatId);
  const [searchQuery, setSearchQuery] = useState('');

  // Pull current user from Redux state (set by authSlice on login)
  const { user: authUser } = useSelector((s) => s.auth);
  const currentUserId = authUser?.id;

  // ── Fetch chat list on mount ─────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchAllChats());
  }, [dispatch]);

  // ── If navigated with a chatId param, load that chat ─────────────────────
  useEffect(() => {
    if (paramChatId && Number(paramChatId) !== activeChatId) {
      dispatch(fetchChatById(Number(paramChatId))).then((chat) => {
        if (chat) dispatch(setActiveChat(chat));
      });
    }
  }, [paramChatId]);

  const handleSelectChat = (chat) => {
    dispatch(setActiveChat(chat));
    navigate(`/chat/${chat.id}`);
  };

  const filteredChats = chats.filter((c) => {
    const otherName =
      c.participantOneId === currentUserId
        ? c.participantTwoUsername
        : c.participantOneUsername;
    return otherName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherUser = (chat) => {
    if (!chat) return { name: '', pic: null };
    const isOne = chat.participantOneId === currentUserId;
    return {
      name: isOne ? chat.participantTwoUsername : chat.participantOneUsername,
      pic: isOne ? chat.participantTwoProfilePicture : chat.participantOneProfilePicture,
      online: chat.otherUserOnline,
    };
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="chat-page">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="chat-sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {authUser?.profilePicture ? (
                <img src={authUser.profilePicture} alt="me" />
              ) : (
                <span>{authUser?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <h2 className="sidebar-title">Chats</h2>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              className="sidebar-new-chat-btn"
              title="Search Users & New Chat"
              onClick={() => navigate('/users')}
            >
              🔍
            </button>
            <button
              className="sidebar-new-chat-btn"
              title="Create Group"
              onClick={() => navigate('/groups')}
            >
              👥
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="sidebar-search">
          <input
            id="chat-search-input"
            type="text"
            placeholder="Search conversations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sidebar-search-input"
          />
        </div>

        {/* Chat list */}
        <ul className="sidebar-chat-list">
          {chatsLoading && (
            <li className="sidebar-loading">
              <div className="spinner-small" /> Loading chats…
            </li>
          )}
          {!chatsLoading && filteredChats.length === 0 && (
            <li className="sidebar-empty">No conversations yet. Start one!</li>
          )}
          {filteredChats.map((chat) => {
            const other = getOtherUser(chat);
            const isActive = chat.id === activeChatId;
            return (
              <li
                key={chat.id}
                id={`chat-item-${chat.id}`}
                className={`sidebar-chat-item ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectChat(chat)}
              >
                <div className="sidebar-item-avatar">
                  {other.pic ? (
                    <img src={other.pic} alt={other.name} />
                  ) : (
                    <span className="avatar-initials">{other.name?.charAt(0)?.toUpperCase()}</span>
                  )}
                  <span className={`online-dot ${other.online ? 'online' : 'offline'}`} />
                </div>
                <div className="sidebar-item-info">
                  <div className="sidebar-item-top">
                    <span className="sidebar-item-name">{other.name}</span>
                    <span className="sidebar-item-time">{formatTime(chat.lastMessageAt)}</span>
                  </div>
                  <p className="sidebar-item-preview">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* ── RIGHT: CHAT WINDOW ── */}
      <main className="chat-main">
        <ChatWindow currentUserId={currentUserId} />
      </main>
    </div>
  );
};

export default ChatPage;
