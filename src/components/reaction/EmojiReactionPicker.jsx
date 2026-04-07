import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addReaction } from '../../features/reaction/reactionSlice';
import { FiSmile } from 'react-icons/fi';
import './EmojiReactionPicker.css';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉'];

export default function EmojiReactionPicker({ messageId, position = 'top' }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (emoji) => {
    dispatch(addReaction({ messageId, emoji }));
    setOpen(false);
  };

  return (
    <div className="emoji-picker" ref={pickerRef}>
      <button
        className="emoji-picker__trigger"
        onClick={() => setOpen(!open)}
        aria-label="Add reaction"
        id={`emoji-trigger-${messageId}`}
      >
        <FiSmile />
      </button>

      {open && (
        <div
          className={`emoji-picker__dropdown emoji-picker__dropdown--${position}`}
          id={`emoji-dropdown-${messageId}`}
        >
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className="emoji-picker__emoji"
              onClick={() => handleSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
