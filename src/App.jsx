import { Routes, Route, Navigate } from 'react-router-dom';
import GroupPage from './features/group/pages/GroupPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/groups" replace />} />
      <Route path="/groups" element={<GroupPage />} />
      <Route path="/groups/:groupId" element={<GroupPage />} />
    </Routes>
  );
}

export default App;
