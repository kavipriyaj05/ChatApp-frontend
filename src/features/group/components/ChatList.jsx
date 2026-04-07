import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchChatList, setShowCreateModal } from '../groupSlice';
import ChatListItemComponent from './ChatListItem';
import SearchBar from './SearchBar';
import './ChatList.css';

export default function ChatList({ activeId, onSelect }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatList, chatListLoading } = useSelector((state) => state.group);

  useEffect(() => {
    dispatch(fetchChatList());
  }, [dispatch]);

  return (
    <aside className="chat-list" id="chat-list-sidebar">
      <header className="chat-list__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="chat-list__create-btn"
            onClick={() => navigate('/chat')}
            title="Back to Chats"
            style={{ fontSize: 16 }}
          >
            ←
          </button>
          <h2 className="chat-list__title">Groups</h2>
        </div>
        <button
          className="chat-list__create-btn"
          onClick={() => dispatch(setShowCreateModal(true))}
          title="New Group"
          id="create-group-btn"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </header>

      <SearchBar onSelectUser={(user) => onSelect({ id: user.id, name: user.username, type: 'CHAT', isOnline: user.isOnline })} />

      <div className="chat-list__items">
        {chatListLoading ? (
          <div className="chat-list__loader">
            <span className="chat-list__spinner" />
          </div>
        ) : chatList.length === 0 ? (
          <div className="chat-list__empty">
            <p>No conversations yet</p>
            <p className="chat-list__empty-hint">Create a group or search for users to start chatting</p>
          </div>
        ) : (
          chatList.map((item) => (
            <ChatListItemComponent
              key={`${item.type}-${item.id}`}
              item={item}
              isActive={activeId === item.id}
              onClick={() => onSelect(item)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
