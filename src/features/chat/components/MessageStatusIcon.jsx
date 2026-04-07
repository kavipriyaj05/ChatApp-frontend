import React from 'react';

/**
 * Renders SENT / DELIVERED / SEEN status ticks on a message.
 * Owner: Mahalakshmi (Module 2)
 *
 * SENT     → single grey tick
 * DELIVERED → double grey tick
 * SEEN     → double blue tick
 */
const MessageStatusIcon = ({ status }) => {
  if (!status) return null;

  if (status === 'SENT') {
    return (
      <span className="msg-status msg-status--sent" title="Sent">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M1 5l4 4L14 1" stroke="#9aa3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    );
  }

  if (status === 'DELIVERED') {
    return (
      <span className="msg-status msg-status--delivered" title="Delivered">
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
          <path d="M1 5l4 4L14 1" stroke="#9aa3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 5l4 4L18 1" stroke="#9aa3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    );
  }

  if (status === 'SEEN') {
    return (
      <span className="msg-status msg-status--seen" title="Seen">
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
          <path d="M1 5l4 4L14 1" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 5l4 4L18 1" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    );
  }

  return null;
};

export default MessageStatusIcon;
