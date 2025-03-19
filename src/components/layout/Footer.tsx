
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 mt-16 border-t border-gray-100">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-learner-500 flex items-center justify-center">
                <span className="text-white font-display font-bold text-base">L</span>
              </div>
              <span className="font-display text-lg font-medium">
                Learner <span className="text-learner-500">Air</span>
              </span>
            </Link>
            <p className="text-gray-500 max-w-md mb-4">
              Transforming educational management with intuitive tools for administrators, 
              teachers, and students.
            </p>
            <p className="text-sm text-gray-400">
              © {currentYear} Learner Air. All rights reserved.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-500 hover:text-learner-500 transition-colors">Home</Link></li>
                <li><Link to="/login" className="text-gray-500 hover:text-learner-500 transition-colors">Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-display font-medium mb-4">Features</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-500 hover:text-learner-500 transition-colors">User Management</Link></li>
                <li><Link to="/" className="text-gray-500 hover:text-learner-500 transition-colors">Rewards System</Link></li>
                <li><Link to="/" className="text-gray-500 hover:text-learner-500 transition-colors">Announcements</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-display font-medium mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-learner-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-500 hover:text-learner-500 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
