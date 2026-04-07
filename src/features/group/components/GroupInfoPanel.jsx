import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGroupDetails,
  fetchGroupMembers,
  updateGroupInfo,
  deleteGroupById,
  addGroupMember,
  setShowInfoPanel,
} from '../groupSlice';
import MemberList from './MemberList';
import SearchBar from './SearchBar';
import './GroupInfoPanel.css';

export default function GroupInfoPanel({ groupId, onDeleted }) {
  const dispatch = useDispatch();
  const { selectedGroup, selectedGroupLoading, members, membersLoading } = useSelector((state) => state.group);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', avatar: '' });
  const [showAddMember, setShowAddMember] = useState(false);
  const [toast, setToast] = useState(null);
  const currentUserId = useSelector((s) => s.auth.user?.id);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupDetails(groupId));
      dispatch(fetchGroupMembers(groupId));
    }
  }, [groupId, dispatch]);

  useEffect(() => {
    if (selectedGroup) {
      setForm({
        name: selectedGroup.name || '',
        description: selectedGroup.description || '',
        avatar: selectedGroup.avatar || '',
      });
    }
  }, [selectedGroup]);

  const isAdmin = members.some(
    (m) => Number(m.userId) === Number(currentUserId) && m.role === 'ADMIN'
  );

  const handleSave = () => {
    dispatch(updateGroupInfo({ groupId, groupData: form }));
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this group permanently?')) {
      dispatch(deleteGroupById(groupId));
      if (onDeleted) onDeleted();
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddUser = async (user) => {
    try {
      await dispatch(addGroupMember({ groupId, userId: user.id })).unwrap();
      dispatch(fetchGroupMembers(groupId));
      dispatch(fetchGroupDetails(groupId));
      showToast(`${user.username} added to the group!`);
    } catch (err) {
      showToast(`Failed to add member: ${err}`, 'error');
    }
  };

  if (selectedGroupLoading) {
    return (
      <div className="group-info-panel" id="group-info-panel">
        <div className="group-info-panel__loader"><span className="group-info-panel__spinner" /></div>
      </div>
    );
  }

  if (!selectedGroup) return null;

  return (
    <div className="group-info-panel" id="group-info-panel">
      <header className="group-info-panel__header">
        <h2 className="group-info-panel__title">Group Info</h2>
        <button
          className="group-info-panel__close"
          onClick={() => dispatch(setShowInfoPanel(false))}
        >
          ✕
        </button>
      </header>

      <div className="group-info-panel__body">
        {/* Avatar */}
        <div className="group-info-panel__avatar-section">
          <div className="group-info-panel__avatar">
            {selectedGroup.avatar ? (
              <img
                src={selectedGroup.avatar}
                alt=""
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <span
              className="group-info-panel__avatar-fallback"
              style={{ display: selectedGroup.avatar ? 'none' : 'flex' }}
            >
              {selectedGroup.name?.[0]?.toUpperCase() || '#'}
            </span>
          </div>
        </div>

        {/* Info */}
        {editing ? (
          <div className="group-info-panel__form">
            <input
              className="group-info-panel__input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Group name"
              id="edit-group-name"
            />
            <textarea
              className="group-info-panel__textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              rows={3}
              id="edit-group-desc"
            />
            <input
              className="group-info-panel__input"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              placeholder="Avatar URL"
              id="edit-group-avatar"
            />
            <div className="group-info-panel__form-actions">
              <button className="btn btn--primary" onClick={handleSave} id="save-group-btn">Save</button>
              <button className="btn btn--ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="group-info-panel__details">
            <h3 className="group-info-panel__name">{selectedGroup.name}</h3>
            <p className="group-info-panel__desc">{selectedGroup.description || 'No description'}</p>
            <p className="group-info-panel__meta">{selectedGroup.memberCount} members</p>
            {isAdmin && (
              <div className="group-info-panel__admin-actions">
                <button className="btn btn--secondary" onClick={() => setEditing(true)} id="edit-group-btn">Edit</button>
                <button className="btn btn--danger" onClick={handleDelete} id="delete-group-btn">Delete Group</button>
              </div>
            )}
          </div>
        )}

        {/* Add Member */}
        {isAdmin && (
          <div className="group-info-panel__add-member">
            <button
              className="btn btn--secondary btn--full"
              onClick={() => setShowAddMember(!showAddMember)}
              id="toggle-add-member-btn"
            >
              {showAddMember ? 'Cancel' : '+ Add Member'}
            </button>
            {showAddMember && <SearchBar onSelectUser={handleAddUser} />}
          </div>
        )}

        {/* Members */}
        {membersLoading ? (
          <div className="group-info-panel__loader"><span className="group-info-panel__spinner" /></div>
        ) : (
          <MemberList
            members={members}
            groupId={groupId}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          padding: '12px 20px', borderRadius: 10,
          background: toast.type === 'error' ? '#ef4444' : '#22c55e',
          color: '#fff', fontWeight: 600, fontSize: 14,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.3s ease'
        }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}
    </div>
  );
}
