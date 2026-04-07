import { useDispatch } from 'react-redux';
import { removeGroupMember } from '../groupSlice';
import * as groupApi from '../groupApi';
import './MemberList.css';

export default function MemberList({ members, groupId, currentUserId, isAdmin }) {
  const dispatch = useDispatch();

  const handleRemove = (userId) => {
    if (window.confirm('Remove this member from the group?')) {
      dispatch(removeGroupMember({ groupId, userId }));
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await groupApi.updateMemberRole(groupId, userId, newRole);
      // Trigger re-fetch
      window.location.reload(); // Simple approach; will be replaced with proper dispatch
    } catch {
      alert('Failed to update role');
    }
  };

  return (
    <div className="member-list" id="member-list">
      <h3 className="member-list__title">
        Members
        <span className="member-list__count">{members.length}</span>
      </h3>

      <ul className="member-list__ul">
        {members.map((member) => (
          <li key={member.id} className="member-list__item">
            <div className="member-list__avatar">
              <span className="member-list__avatar-fallback">
                {String(member.userId).charAt(0)}
              </span>
            </div>
            <div className="member-list__info">
              <span className="member-list__name">User #{member.userId}</span>
              <span className={`member-list__role member-list__role--${member.role?.toLowerCase()}`}>
                {member.role}
              </span>
            </div>
            {isAdmin && member.userId !== currentUserId && (
              <div className="member-list__actions">
                <select
                  className="member-list__role-select"
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MEMBER">Member</option>
                </select>
                <button
                  className="member-list__remove-btn"
                  onClick={() => handleRemove(member.userId)}
                  title="Remove member"
                >
                  ✕
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
