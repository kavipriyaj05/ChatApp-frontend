import { useSelector, useDispatch } from 'react-redux';
import { deleteMedia } from './features/media/mediaSlice';
import { FiUploadCloud, FiBell, FiSmile, FiInfo } from 'react-icons/fi';

import MediaUpload from './components/media/MediaUpload';
import MediaPreview from './components/media/MediaPreview';
import NotificationBell from './components/notification/NotificationBell';
import NotificationPanel from './components/notification/NotificationPanel';
import EmojiReactionPicker from './components/reaction/EmojiReactionPicker';
import ReactionDisplay from './components/reaction/ReactionDisplay';

import './App.css';

function App() {
  const dispatch = useDispatch();
  const { uploadedFiles } = useSelector((s) => s.media);

  const handleDelete = (id) => dispatch(deleteMedia(id));

  return (
    <div className="app">
      {/* ── Top Bar ──────────────────────────────────────────── */}
      <header className="app-topbar">
        <div className="app-topbar__brand">
          <div className="app-topbar__logo">LC</div>
          <span className="app-topbar__name">LiveChat</span>
        </div>
        <div className="app-topbar__actions">
          <NotificationBell />
        </div>
      </header>

      {/* ── Notification Panel (slide-in) ────────────────────── */}
      <NotificationPanel />

      {/* ── Demo Page ────────────────────────────────────────── */}
      <main className="demo-page">
        <h1 className="demo-page__title">Kavi's Module</h1>
        <p className="demo-page__subtitle">
          Media Upload · Notifications · Message Reactions
        </p>

        {/* Info */}
        <div className="demo-info">
          <FiInfo size={18} className="demo-info__icon" />
          <p className="demo-info__text">
            This page showcases <strong>Kavi's frontend components</strong> —
            the media upload system, notification panel (click the bell icon ↗),
            and emoji reaction system. These integrate with the backend
            <strong> /api/media</strong>, <strong>/api/notifications</strong>,
            and <strong>/api/reactions</strong> endpoints.
          </p>
        </div>

        {/* ── 1. Media Upload ────────────────────────────────── */}
        <section className="demo-section" id="section-media-upload">
          <div className="demo-section__header">
            <div className="demo-section__icon demo-section__icon--media">
              <FiUploadCloud />
            </div>
            <h2 className="demo-section__title">Media Upload</h2>
          </div>
          <div className="demo-section__card">
            <MediaUpload
              onUploadComplete={(file) =>
                console.log('Upload complete:', file)
              }
            />
            {uploadedFiles.length > 0 && (
              <div className="demo-uploaded-grid">
                {uploadedFiles.map((file) => (
                  <MediaPreview
                    key={file.id}
                    media={file}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── 2. Notifications ───────────────────────────────── */}
        <section className="demo-section" id="section-notifications">
          <div className="demo-section__header">
            <div className="demo-section__icon demo-section__icon--notif">
              <FiBell />
            </div>
            <h2 className="demo-section__title">Notifications</h2>
          </div>
          <div className="demo-section__card">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Click the <strong>bell icon</strong> in the top-right corner to
              open the notification panel. Notifications arrive in real-time
              via WebSocket and are persisted through the REST API.
            </p>
          </div>
        </section>

        {/* ── 3. Message Reactions ───────────────────────────── */}
        <section className="demo-section" id="section-reactions">
          <div className="demo-section__header">
            <div className="demo-section__icon demo-section__icon--reaction">
              <FiSmile />
            </div>
            <h2 className="demo-section__title">Message Reactions</h2>
          </div>
          <div className="demo-section__card">
            {/* Mock message with reaction support */}
            <div className="demo-message">
              <div className="demo-message__avatar">K</div>
              <div className="demo-message__body">
                <div className="demo-message__bubble">
                  <p className="demo-message__text">
                    Hey team! 🎉 The new media upload feature is live. Try
                    dragging and dropping files above!
                  </p>
                </div>
                <div className="demo-message__meta">
                  <span className="demo-message__time">2:30 PM</span>
                  <EmojiReactionPicker messageId={1} position="bottom" />
                </div>
                <ReactionDisplay messageId={1} currentUserId={1} />
              </div>
            </div>

            <div className="demo-message" style={{ marginTop: '1.25rem' }}>
              <div className="demo-message__avatar" style={{ background: 'linear-gradient(135deg, #63dcbe, #4acd9f)' }}>M</div>
              <div className="demo-message__body">
                <div className="demo-message__bubble" style={{ background: 'rgba(99, 220, 190, 0.1)', borderColor: 'rgba(99, 220, 190, 0.15)' }}>
                  <p className="demo-message__text">
                    Looks awesome! The drag-and-drop feels really smooth 🚀
                  </p>
                </div>
                <div className="demo-message__meta">
                  <span className="demo-message__time">2:32 PM</span>
                  <EmojiReactionPicker messageId={2} position="bottom" />
                </div>
                <ReactionDisplay messageId={2} currentUserId={1} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
