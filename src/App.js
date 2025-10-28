import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Regular user pages
import Login from './pages/Login';
import Register from './pages/Register';
import MemberDashboard from './pages/member/MemberDashboard';
import Workspace from './pages/Workspace';

// Admin pages
import DashboardOverview from './pages/admin/DashboardOverview';
import ManageUsers from './pages/admin/ManageUsers';
import CreateWorkspace from './pages/admin/CreateWorkspace';
import AssignWorkspace from './pages/admin/AssignWorkspace';
import NotificationsPage from './pages/admin/NotificationsPage';
import ChatPage from './pages/admin/ChatPage';

// Member pages
import MemberSidebar from './components/MemberSidebar';
import MemberHeader from './components/MemberHeader';
import MyWorkspaces from './pages/member/MyWorkspaces';
import MemberNotifications from './pages/member/MemberNotifications';
import MemberChat from './pages/member/MemberChat';


// Shared layout components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Admin Layout wrapper: shows Sidebar + Header + inner page
function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 min-h-screen bg-gray-50">  {/* <-- Added margin-left */}
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
// Member Layout
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


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public/User routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/member-dashboard" element={<MemberDashboard />} />
        <Route path="/workspace/:id" element={<Workspace />} />

        {/* Admin routes (wrapped in Sidebar + Header layout) */}
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
        {/* Member Routes */}
<Route path="/member/dashboard" element={<MemberLayout><MemberDashboard /></MemberLayout>} />
<Route path="/member/workspaces" element={<MemberLayout><MyWorkspaces /></MemberLayout>} />
<Route path="/member/notifications" element={<MemberLayout><MemberNotifications /></MemberLayout>} />
<Route path="/member/chat" element={<MemberLayout><MemberChat /></MemberLayout>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
