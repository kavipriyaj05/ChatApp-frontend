import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../../services/axiosInstance';
import { uploadMedia } from '../../media/mediaSlice';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import './GroupChatWindow.css';

const EMOJI_LIST = ['😀','😂','❤️','👍','🎉','🔥','😍','🤔','😢','👋','💯','🙏','😎','🥳','✨','💪'];

export default function GroupChatWindow({ groupId, groupName }) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const stompRef = useRef(null);
  const fileInputRef = useRef(null);
  const authUser = useSelector((s) => s.auth.user);

  // Load message history
  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    setMessages([]);
    axiosInstance
      .get(`/api/groups/${groupId}/messages?page=0&size=50`)
      .then((res) => setMessages(res.data || []))
      .catch((err) => console.error('Failed to load group messages:', err))
      .finally(() => setLoading(false));
  }, [groupId]);

  // WebSocket subscription for real-time group messages
  useEffect(() => {
    if (!groupId) return;

    const token = localStorage.getItem('accessToken');
    const client = new Client({
      webSocketFactory: () => new SockJS(`/ws?token=${token}`),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/group.${groupId}`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        });
      },
      onStompError: (frame) => {
        console.error('Group WS error:', frame.headers?.message);
      },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [groupId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send text message ────────────────────────────────────────
  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!input.trim() || !groupId) return;

    const payload = {
      content: input.trim(),
      messageType: 'TEXT',
    };

    try {
      await axiosInstance.post(`/api/groups/${groupId}/messages`, payload);
      setInput('');
    } catch (err) {
      console.error('Failed to send group message:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Emoji picker ─────────────────────────────────────────────
  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji);
    setShowEmoji(false);
  };

  // ── File attachment ──────────────────────────────────────────
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await dispatch(uploadMedia(file)).unwrap();
      const isImage = file.type.startsWith('image/');
      const payload = {
        content: isImage ? result.url : `📎 ${result.fileName}`,
        messageType: isImage ? 'IMAGE' : 'FILE',
        mediaId: result.id,
      };
      await axiosInstance.post(`/api/groups/${groupId}/messages`, payload);
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // ── Render message content ───────────────────────────────────
  const renderContent = (msg) => {
    if (msg.messageType === 'IMAGE' && msg.content) {
      return (
        <img
          src={msg.content}
          alt="shared"
          style={{ maxWidth: 220, borderRadius: 8, display: 'block' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      );
    }
    if (msg.messageType === 'FILE' && msg.mediaId) {
      return (
        <a
          href={`/api/media/file/${msg.mediaId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group-chat-window__file-link"
        >
          📎 Download File
        </a>
      );
    }
    return msg.content;
  };

  return (
    <div className="group-chat-window">
      {/* Messages area */}
      <div className="group-chat-window__messages">
        {loading && (
          <div className="group-chat-window__loader">
            <span className="group-chat-window__spinner" />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="group-chat-window__empty">
            <span className="group-chat-window__empty-icon">💬</span>
            <h3>No messages yet</h3>
            <p>Start a conversation in <strong>{groupName}</strong></p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = Number(msg.senderId) === Number(authUser?.id);
          return (
            <div
              key={msg.id}
              className={`group-chat-window__msg ${isMe ? 'group-chat-window__msg--me' : ''}`}
            >
              {!isMe && (
                <div className="group-chat-window__msg-avatar">
                  {msg.senderProfilePicture ? (
                    <img src={msg.senderProfilePicture} alt="" />
                  ) : (
                    <span>{msg.senderUsername?.[0]?.toUpperCase() || '?'}</span>
                  )}
                </div>
              )}
              <div className="group-chat-window__msg-body">
                {!isMe && (
                  <span className="group-chat-window__msg-sender">{msg.senderUsername}</span>
                )}
                <div className="group-chat-window__msg-bubble">
                  {renderContent(msg)}
                </div>
                <span className="group-chat-window__msg-time">
                  {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form className="group-chat-window__input-bar" onSubmit={handleSend}>
        {/* Emoji Picker Popup */}
        {showEmoji && (
          <div className="group-chat-window__emoji-picker">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="group-chat-window__emoji-btn"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Emoji button */}
        <button
          type="button"
          className="group-chat-window__action-btn"
          title="Emoji"
          onClick={() => setShowEmoji(!showEmoji)}
          style={{ background: showEmoji ? 'rgba(99,102,241,0.2)' : undefined }}
        >
          😊
        </button>

        <input
          type="text"
          className="group-chat-window__input"
          placeholder={uploading ? 'Uploading file…' : 'Type a message...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          disabled={uploading}
        />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        />

        {/* File attach button */}
        <button
          type="button"
          className="group-chat-window__action-btn"
          title="Attach file"
          onClick={handleFileClick}
          disabled={uploading}
        >
          {uploading ? '⏳' : '📎'}
        </button>

        <button type="submit" className="group-chat-window__send-btn" disabled={!input.trim() && !uploading}>
          ➤
        </button>
      </form>
    </div>
  );
}
