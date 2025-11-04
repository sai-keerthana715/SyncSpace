import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import Workspace from './pages/Workspace';

// Admin pages
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageUsers from './pages/admin/ManageUsers';
import CreateWorkspace from './pages/admin/CreateWorkspace';
import AssignWorkspace from './pages/admin/AssignWorkspace';
import NotificationsPage from './pages/admin/NotificationsPage';
import ChatPage from './pages/admin/ChatPage';

// Member pages
import MemberDashboard from './pages/member/MemberDashboard';
import MyWorkspaces from './pages/member/MyWorkspaces';
import MemberNotifications from './pages/member/MemberNotifications';
import MemberChat from './pages/member/MemberChat';
import KanbanBoard from './pages/member/KanbanBoard';
import DocumentEditor from './pages/member/DocumentEditor';

// Layout components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MemberSidebar from './components/MemberSidebar';
import MemberHeader from './components/MemberHeader';

// Admin layout wrapper
function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

// Member layout wrapper
function MemberLayout({ children }) {
  return (
    <div className="flex">
      <MemberSidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">
        <MemberHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workspace/:id" element={<Workspace />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={<AdminLayout><DashboardOverview /></AdminLayout>}
        />
        <Route
          path="/admin/manage-users"
          element={<AdminLayout><ManageUsers /></AdminLayout>}
        />
        <Route
          path="/admin/create-workspace"
          element={<AdminLayout><CreateWorkspace /></AdminLayout>}
        />
        <Route
          path="/admin/assign-workspace"
          element={<AdminLayout><AssignWorkspace /></AdminLayout>}
        />
        <Route
          path="/admin/notifications"
          element={<AdminLayout><NotificationsPage /></AdminLayout>}
        />
        <Route
          path="/admin/chat"
          element={<AdminLayout><ChatPage /></AdminLayout>}
        />

        {/* Member routes */}
        <Route
          path="/member/dashboard"
          element={<MemberLayout><MemberDashboard /></MemberLayout>}
        />
        <Route
          path="/member/workspaces"
          element={<MemberLayout><MyWorkspaces /></MemberLayout>}
        />
        <Route
          path="/member/notifications"
          element={<MemberLayout><MemberNotifications /></MemberLayout>}
        />
        <Route
          path="/member/chat"
          element={<MemberLayout><MemberChat /></MemberLayout>}
        />
        <Route
          path="/workspace/:id/kanban"
          element={<MemberLayout><KanbanBoard /></MemberLayout>}
        />
        <Route
  path="/member/workspace/:workspaceId/document/:docId"
  element={<MemberLayout><DocumentEditor /></MemberLayout>}
/>

      </Routes>
    </BrowserRouter>
  );
}
