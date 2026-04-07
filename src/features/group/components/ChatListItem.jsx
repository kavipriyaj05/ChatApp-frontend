import OnlineBadge from './OnlineBadge';
import './ChatListItem.css';

export default function ChatListItem({ item, isActive, onClick }) {
  const initial = item.name?.[0]?.toUpperCase() || '#';

  const formatTime = (time) => {
    if (!time) return '';
    const d = new Date(time);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`chat-list-item ${isActive ? 'chat-list-item--active' : ''}`}
      onClick={onClick}
      id={`chat-item-${item.id}`}
    >
      <div className="chat-list-item__avatar">
        {item.avatarUrl ? (
          <img src={item.avatarUrl} alt="" />
        ) : (
          <span className="chat-list-item__avatar-fallback">{initial}</span>
        )}
        {item.type === 'CHAT' && <OnlineBadge isOnline={item.isOnline} />}
      </div>

      <div className="chat-list-item__content">
        <div className="chat-list-item__top">
          <span className="chat-list-item__name">{item.name}</span>
          <span className="chat-list-item__time">{formatTime(item.lastMessageTime)}</span>
        </div>
        <div className="chat-list-item__bottom">
          <span className="chat-list-item__msg">
            {item.lastMessage || (item.type === 'GROUP' ? 'No messages yet' : 'Start a conversation')}
          </span>
          {item.unreadCount > 0 && (
            <span className="chat-list-item__badge">{item.unreadCount > 99 ? '99+' : item.unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}
