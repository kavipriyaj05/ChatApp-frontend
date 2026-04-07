import { useSelector, useDispatch } from 'react-redux';
import { toggleNotificationPanel } from '../../features/notification/notificationSlice';
import { FiBell } from 'react-icons/fi';
import './NotificationBell.css';

export default function NotificationBell() {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((s) => s.notification);

  return (
    <button
      className="notif-bell"
      onClick={() => dispatch(toggleNotificationPanel())}
      aria-label="Notifications"
      id="notification-bell"
    >
      <FiBell className="notif-bell__icon" />
      {unreadCount > 0 && (
        <span className="notif-bell__badge" id="notification-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
      <span className="notif-bell__ping" />
    </button>
  );
}
