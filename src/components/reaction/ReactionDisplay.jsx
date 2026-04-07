import { useSelector, useDispatch } from 'react-redux';
import { removeReaction } from '../../features/reaction/reactionSlice';
import './ReactionDisplay.css';

/**
 * Groups reactions by emoji and renders clickable pills.
 * Clicking your own reaction removes it.
 */
export default function ReactionDisplay({ messageId, currentUserId }) {
  const dispatch = useDispatch();
  const reactions = useSelector(
    (s) => s.reaction.reactionsByMessage[messageId] || []
  );

  if (reactions.length === 0) return null;

  // Group by emoji
  const grouped = {};
  reactions.forEach((r) => {
    if (!grouped[r.emoji]) grouped[r.emoji] = [];
    grouped[r.emoji].push(r);
  });

  const handleClick = (emoji) => {
    // Find the current user's reaction with this emoji
    const myReaction = grouped[emoji]?.find(
      (r) => r.userId === currentUserId
    );
    if (myReaction) {
      dispatch(removeReaction(myReaction.id));
    }
  };

  return (
    <div className="reaction-display" id={`reactions-${messageId}`}>
      {Object.entries(grouped).map(([emoji, list]) => {
        const isMine = list.some((r) => r.userId === currentUserId);
        return (
          <button
            key={emoji}
            className={`reaction-display__pill ${isMine ? 'reaction-display__pill--mine' : ''}`}
            onClick={() => handleClick(emoji)}
            title={list.map((r) => r.username || 'User').join(', ')}
          >
            <span className="reaction-display__emoji">{emoji}</span>
            <span className="reaction-display__count">{list.length}</span>
          </button>
        );
      })}
    </div>
  );
}
