
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation links vary based on authentication status
  const navItems = user 
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        ...(user.role === 'headteacher' || user.permissions.includes('add_users') ? [{ name: 'Users', path: '/users' }] : []),
        { name: 'Announcements', path: '/announcements' },
        ...(user.role !== 'student' ? [{ name: 'Student Search', path: '/student-search' }] : []),
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Login', path: '/login' },
      ];

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled || user ? 'py-3 glass-effect' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container px-4 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-lg bg-learner-500 flex items-center justify-center">
            <span className="text-white font-display font-bold text-xl">L</span>
          </div>
          <span className="font-display text-xl font-medium whitespace-nowrap">
            Learner <span className="text-learner-500">Air</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                location.pathname === item.path
                  ? 'text-learner-700 bg-learner-50'
                  : 'text-gray-600 hover:text-learner-600 hover:bg-learner-50/50'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="ml-2 gap-2 hover:bg-learner-50"
                >
                  <User size={18} />
                  <span className="font-medium">{user.fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={logout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-white/95 backdrop-blur-sm z-40">
          <nav className="flex flex-col p-5 gap-2">
            {navItems.map((item, i) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-lg text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-learner-700 bg-learner-50'
                    : 'text-gray-600'
                } animate-slide-in-up`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {item.name}
              </Link>
            ))}
            
            {user && (
              <>
                <div className="h-px bg-gray-200 my-2"></div>
                <Button 
                  variant="ghost" 
                  className="justify-start px-4 py-3 h-auto font-medium text-red-600"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

// Moved this function outside of the component to avoid hook ordering issues
export default Header;
