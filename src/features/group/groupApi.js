import axiosInstance from '../../services/axiosInstance';

// ========================
// GROUP ENDPOINTS
// ========================

export const createGroup = async (groupData) => {
  const response = await axiosInstance.post('/api/groups', groupData);
  return response.data;
};

export const getGroup = async (groupId) => {
  const response = await axiosInstance.get(`/api/groups/${groupId}`);
  return response.data;
};

export const updateGroup = async (groupId, groupData) => {
  const response = await axiosInstance.put(`/api/groups/${groupId}`, groupData);
  return response.data;
};

export const deleteGroup = async (groupId) => {
  const response = await axiosInstance.delete(`/api/groups/${groupId}`);
  return response.data;
};

export const addMember = async (groupId, userId) => {
  const response = await axiosInstance.post(`/api/groups/${groupId}/members`, { userId });
  return response.data;
};

export const removeMember = async (groupId, userId) => {
  const response = await axiosInstance.delete(`/api/groups/${groupId}/members/${userId}`);
  return response.data;
};

export const updateMemberRole = async (groupId, userId, role) => {
  const response = await axiosInstance.put(`/api/groups/${groupId}/members/${userId}/role`, { role });
  return response.data;
};

export const getGroupMembers = async (groupId) => {
  const response = await axiosInstance.get(`/api/groups/${groupId}/members`);
  return response.data;
};

// ========================
// USER ENDPOINTS
// ========================

export const searchUsers = async (query) => {
  const response = await axiosInstance.get(`/api/users/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const getUserStatus = async (userId) => {
  const response = await axiosInstance.get(`/api/users/${userId}/status`);
  return response.data;
};

export const getChatList = async () => {
  const response = await axiosInstance.get('/api/users/me/chats');
  return response.data;
};
