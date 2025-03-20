
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect already logged in users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-medium mb-2">Welcome back</h1>
          <p className="text-gray-500">
            Sign in to access your Learner Air account
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
