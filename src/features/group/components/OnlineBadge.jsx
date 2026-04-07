import './OnlineBadge.css';

export default function OnlineBadge({ isOnline, size = 'sm' }) {
  return (
    <span
      className={`online-badge online-badge--${size} ${isOnline ? 'online-badge--online' : 'online-badge--offline'}`}
      title={isOnline ? 'Online' : 'Offline'}
    />
  );
}
