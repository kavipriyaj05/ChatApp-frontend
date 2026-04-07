import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';
import { createOrGetChat } from '../chatApi';
import '../../../styles/chat.css';

const UserSearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((s) => s.auth);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [startingChat, setStartingChat] = useState(null);

  const handleSearch = useCallback(async (q) => {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get('/api/users/search', { params: { q } });
      // Filter out the current user
      setResults(data.filter((u) => u.id !== authUser?.id));
    } catch (err) {
      setError('Failed to search users');
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [authUser]);

  const handleStartChat = async (targetUserId) => {
    setStartingChat(targetUserId);
    try {
      const chat = await dispatch(createOrGetChat(targetUserId));
      if (chat?.id) {
        navigate(`/chat/${chat.id}`);
      } else {
        navigate('/chat');
      }
    } catch (err) {
      setError('Failed to start conversation');
    } finally {
      setStartingChat(null);
    }
  };

  return (
    <div className="chat-page">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 600, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => navigate('/chat')}
            style={{
              background: 'var(--bg-bubble-in)', border: 'none', color: 'var(--text-primary)',
              borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>New Conversation</h1>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: 20 }}>
          <input
            id="user-search-input"
            type="text"
            placeholder="Search by username or email…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            className="sidebar-search-input"
            style={{ fontSize: 15, padding: '12px 18px' }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 14, marginBottom: 12 }}>{error}</div>
        )}

        {/* Loading */}
        {searching && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
            <div className="spinner-small" style={{ marginRight: 8 }} /> Searching…
          </div>
        )}

        {/* Results */}
        {!searching && query.length >= 2 && results.length === 0 && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>
            No users found matching "{query}"
          </div>
        )}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {results.map((user) => (
            <li
              key={user.id}
              id={`user-result-${user.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderBottom: '1px solid var(--border)',
                cursor: 'pointer', borderRadius: 'var(--radius-sm)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79,70,229,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {/* Avatar */}
              <div className="sidebar-item-avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} />
                ) : (
                  <span className="avatar-initials">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
                  {user.username}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {user.email}
                </div>
              </div>

              {/* Start Chat Button */}
              <button
                onClick={() => handleStartChat(user.id)}
                disabled={startingChat === user.id}
                style={{
                  background: 'var(--accent)', color: '#fff', border: 'none',
                  padding: '8px 18px', borderRadius: 'var(--radius-lg)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  opacity: startingChat === user.id ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {startingChat === user.id ? 'Starting…' : '💬 Chat'}
              </button>
            </li>
          ))}
        </ul>

        {/* Empty state */}
        {query.length < 2 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔍</div>
            <p style={{ fontSize: 15 }}>Type at least 2 characters to search for users</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearchPage;
