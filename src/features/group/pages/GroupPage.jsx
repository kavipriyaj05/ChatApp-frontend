import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatList from '../components/ChatList';
import GroupInfoPanel from '../components/GroupInfoPanel';
import GroupChatWindow from '../components/GroupChatWindow';
import {
  createNewGroup,
  setShowCreateModal,
  setShowInfoPanel,
  clearSelectedGroup,
} from '../groupSlice';
import './GroupPage.css';

export default function GroupPage() {
  const dispatch = useDispatch();
  const { showCreateModal, showInfoPanel, selectedGroup } = useSelector((state) => state.group);
  const [activeItem, setActiveItem] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });

  const handleSelect = (item) => {
    setActiveItem(item);
    if (item.type === 'GROUP') {
      dispatch(setShowInfoPanel(true));
    } else {
      dispatch(setShowInfoPanel(false));
      dispatch(clearSelectedGroup());
    }
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroup.name.trim()) return;
    dispatch(createNewGroup(newGroup));
    setNewGroup({ name: '', description: '' });
  };

  return (
    <div className="group-page" id="group-page">
      {/* Sidebar */}
      <ChatList activeId={activeItem?.id} onSelect={handleSelect} />

      {/* Main Content Area */}
      <main className="group-page__main">
        {activeItem ? (
          <div className="group-page__content">
            <header className="group-page__content-header">
              <div className="group-page__content-info">
                <h2 className="group-page__content-name">{activeItem.name}</h2>
                <span className="group-page__content-type">
                  {activeItem.type === 'GROUP' ? 'Group Chat' : 'Direct Message'}
                </span>
              </div>
              {activeItem.type === 'GROUP' && (
                <button
                  className="btn btn--ghost"
                  onClick={() => dispatch(setShowInfoPanel(!showInfoPanel))}
                  id="toggle-info-panel-btn"
                >
                  ℹ️ Info
                </button>
              )}
            </header>

            {/* Group Chat Window */}
            <GroupChatWindow groupId={activeItem.id} groupName={activeItem.name} />
          </div>
        ) : (
          <div className="group-page__welcome">
            <div className="group-page__welcome-content">
              <span className="group-page__welcome-icon">👋</span>
              <h2>Welcome to LiveChat</h2>
              <p>Select a conversation from the sidebar or create a new group to get started</p>
            </div>
          </div>
        )}
      </main>

      {/* Group Info Panel */}
      {showInfoPanel && activeItem?.type === 'GROUP' && (
        <GroupInfoPanel
          groupId={activeItem.id}
          onDeleted={() => {
            setActiveItem(null);
            dispatch(setShowInfoPanel(false));
          }}
        />
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => dispatch(setShowCreateModal(false))}>
          <div className="modal" onClick={(e) => e.stopPropagation()} id="create-group-modal">
            <header className="modal__header">
              <h2 className="modal__title">Create New Group</h2>
              <button className="modal__close" onClick={() => dispatch(setShowCreateModal(false))}>✕</button>
            </header>
            <form className="modal__body" onSubmit={handleCreateGroup}>
              <div className="modal__field">
                <label className="modal__label" htmlFor="new-group-name">Group Name *</label>
                <input
                  id="new-group-name"
                  className="modal__input"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div className="modal__field">
                <label className="modal__label" htmlFor="new-group-desc">Description</label>
                <textarea
                  id="new-group-desc"
                  className="modal__textarea"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="What's this group about?"
                  rows={3}
                />
              </div>
              <div className="modal__actions">
                <button type="button" className="btn btn--ghost" onClick={() => dispatch(setShowCreateModal(false))}>Cancel</button>
                <button type="submit" className="btn btn--primary" id="submit-create-group">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
