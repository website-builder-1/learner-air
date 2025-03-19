
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import StudentProfile from "./pages/StudentProfile";
import Announcements from "./pages/Announcements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role-based route component
const RoleRoute = ({ 
  children, 
  roles = [], 
  permissions = [] 
}: { 
  children: React.ReactNode, 
  roles?: string[], 
  permissions?: string[] 
}) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  const hasRequiredRole = roles.length === 0 || roles.includes(user.role);
  const hasRequiredPermission = permissions.length === 0 || 
    permissions.some(permission => user.permissions.includes(permission as any));
  
  if (!hasRequiredRole || !hasRequiredPermission) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppWithAuth = () => (
  <BrowserRouter>
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
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
                <ProtectedRoute>
                  <RoleRoute 
                    roles={['headteacher', 'teacher']} 
                    permissions={['add_users']}
                  >
                    <Users />
                  </RoleRoute>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/student-profile/:id" 
              element={
                <ProtectedRoute>
                  <StudentProfile />
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
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppWithAuth />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
