
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User, LogOut, BookOpen, Award, Key } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showCredentials = () => {
    // Fetch user credentials from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userCredentials = users.find(u => u.id === user.id);
    
    if (userCredentials) {
      setCredentials(userCredentials);
      setIsCredentialsModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 border-b bg-white z-10">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo and Name */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-learner-500 text-white h-8 w-8 rounded-md flex items-center justify-center text-xl font-semibold">
            L
          </div>
          <div className="font-display font-medium">
            Learner Air
          </div>
        </Link>

        {/* Navigation - Desktop */}
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link to="/dashboard" className="text-sm hover:text-learner-600">
                  Dashboard
                </Link>
                {(user.role === 'headteacher' || user.role === 'teacher') && (
                  <Link to="/users" className="text-sm hover:text-learner-600">
                    Users
                  </Link>
                )}
                <Link to="/announcements" className="text-sm hover:text-learner-600">
                  Announcements
                </Link>
                {user.role === 'student' && (
                  <Link to="/homework" className="text-sm hover:text-learner-600">
                    Homework
                  </Link>
                )}
                {(user.role === 'headteacher' || user.role === 'teacher') && (
                  <Link to="/student-search" className="text-sm hover:text-learner-600">
                    Students
                  </Link>
                )}
              </>
            )}
          </nav>
        )}

        {/* Auth Buttons/User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" size={isMobile ? "icon" : "default"}>
                  <User size={16} />
                  {!isMobile && (
                    <span className="truncate max-w-[120px]">{user.fullName}</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2 text-sm font-medium">{user.fullName}</div>
                <div className="p-2 pt-0 text-xs text-gray-500 capitalize">{user.role}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                {user.role === 'student' && (
                  <DropdownMenuItem asChild>
                    <Link to="/homework" className="cursor-pointer flex items-center">
                      <BookOpen className="mr-2" size={16} />
                      <span>My Homework</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {(user.role === 'headteacher' || user.role === 'teacher') && (
                  <>
                    {user.permissions.includes('set_rewards') && (
                      <DropdownMenuItem asChild>
                        <Link to="/activity" className="cursor-pointer flex items-center">
                          <Award className="mr-2" size={16} />
                          <span>Activity Tracking</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                <DropdownMenuItem onClick={showCredentials} className="cursor-pointer flex items-center">
                  <Key className="mr-2" size={16} />
                  <span>View Login Details</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 flex items-center">
                  <LogOut className="mr-2" size={16} />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/login')} variant="default">
              Sign in
            </Button>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={20} />
            </Button>
          )}
        </div>
      </div>

      {/* User credentials popup */}
      <Dialog open={isCredentialsModalOpen} onOpenChange={setIsCredentialsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Login Credentials</DialogTitle>
            <DialogDescription>
              Keep these details safe and confidential
            </DialogDescription>
          </DialogHeader>
          {credentials && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <div className="p-2 bg-gray-50 rounded border">{credentials.username}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="p-2 bg-gray-50 rounded border">{credentials.password}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <div className="p-2 bg-gray-50 rounded border capitalize">{credentials.role}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsCredentialsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
