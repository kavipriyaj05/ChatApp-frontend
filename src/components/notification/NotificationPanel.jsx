import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  closeNotificationPanel,
} from '../../features/notification/notificationSlice';
import {
  FiX, FiCheckCircle, FiMessageSquare, FiUsers,
  FiSmile, FiAtSign, FiBell, FiTrash2,
} from 'react-icons/fi';
import './NotificationPanel.css';

const TYPE_ICONS = {
  NEW_MESSAGE: FiMessageSquare,
  GROUP_INVITE: FiUsers,
  REACTION: FiSmile,
  MENTION: FiAtSign,
  SYSTEM: FiBell,
};

const TYPE_COLORS = {
  NEW_MESSAGE: '#7c83ff',
  GROUP_INVITE: '#63dcbe',
  REACTION: '#ffb347',
  MENTION: '#ff6b9d',
  SYSTEM: '#a78bfa',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationPanel() {
  const dispatch = useDispatch();
  const { notifications, panelOpen, loading, unreadCount } = useSelector(
    (s) => s.notification
  );

  useEffect(() => {
    if (panelOpen) {
      dispatch(fetchNotifications());
    }
  }, [panelOpen, dispatch]);

  if (!panelOpen) return null;

  const Icon = (type) => TYPE_ICONS[type] || FiBell;

  return (
    <>
      <div
        className="notif-panel__backdrop"
        onClick={() => dispatch(closeNotificationPanel())}
      />
      <div className="notif-panel" id="notification-panel">
        {/* Header */}
        <div className="notif-panel__header">
          <div className="notif-panel__title-row">
            <h3 className="notif-panel__title">Notifications</h3>
            {unreadCount > 0 && (
              <span className="notif-panel__count">{unreadCount}</span>
            )}
          </div>
          <div className="notif-panel__header-actions">
            {unreadCount > 0 && (
              <button
                className="notif-panel__mark-all"
                onClick={() => dispatch(markAllAsRead())}
                id="notif-mark-all-read"
              >
                <FiCheckCircle /> Mark all read
              </button>
            )}
            <button
              className="notif-panel__close"
              onClick={() => dispatch(closeNotificationPanel())}
              id="notif-panel-close"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="notif-panel__list">
          {loading && notifications.length === 0 && (
            <div className="notif-panel__loading">
              <span className="notif-panel__spinner" />
              Loading…
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="notif-panel__empty">
              <FiBell size={36} />
              <p>No notifications yet</p>
            </div>
          )}

          {notifications.map((notif) => {
            const NotifIcon = Icon(notif.type);
            const color = TYPE_COLORS[notif.type] || '#7c83ff';
            return (
              <div
                key={notif.id}
                className={`notif-panel__item ${!notif.isRead ? 'notif-panel__item--unread' : ''}`}
                id={`notification-item-${notif.id}`}
              >
                <div
                  className="notif-panel__item-icon"
                  style={{ background: `${color}18`, color }}
                >
                  <NotifIcon size={16} />
                </div>
                <div className="notif-panel__item-body">
                  <p className="notif-panel__item-text">{notif.content}</p>
                  <span className="notif-panel__item-time">
                    {timeAgo(notif.createdAt)}
                  </span>
                </div>
                <div className="notif-panel__item-actions">
                  {!notif.isRead && (
                    <button
                      className="notif-panel__item-btn"
                      onClick={() => dispatch(markAsRead(notif.id))}
                      title="Mark as read"
                    >
                      <FiCheckCircle />
                    </button>
                  )}
                  <button
                    className="notif-panel__item-btn notif-panel__item-btn--del"
                    onClick={() => dispatch(deleteNotification(notif.id))}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
