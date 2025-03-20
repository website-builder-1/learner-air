
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "sonner";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import Announcements from "./pages/Announcements";
import StudentSearch from "./pages/StudentSearch";
import StudentProfile from "./pages/StudentProfile";
import Homework from "./pages/Homework";
import ActivityPage from "./pages/ActivityPage";
import "./App.css";

// Authenticated route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is empty, allow all authenticated users
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute allowedRoles={['headteacher', 'teacher']}>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/announcements" 
                element={
                  <ProtectedRoute>
                    <Announcements />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student-search" 
                element={
                  <ProtectedRoute allowedRoles={['headteacher', 'teacher']}>
                    <StudentSearch />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/:id" 
                element={
                  <ProtectedRoute allowedRoles={['headteacher', 'teacher']}>
                    <StudentProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/homework" 
                element={
                  <ProtectedRoute>
                    <Homework />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/activity" 
                element={
                  <ProtectedRoute allowedRoles={['headteacher', 'teacher']}>
                    <ActivityPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
