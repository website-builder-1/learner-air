
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Book, Award, Bell, UserPlus, CheckCircle, BarChart } from 'lucide-react';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className="glass-card p-6 flex flex-col transition-all duration-500 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      <div className="rounded-full w-12 h-12 bg-learner-100 flex items-center justify-center mb-4">
        <Icon className="text-learner-600" size={22} />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 text-sm flex-grow">{description}</p>
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();
  const [heroVisible, setHeroVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Features data
  const features = [
    {
      icon: UserPlus,
      title: "User Management",
      description: "Easily add and manage teachers and students with customizable permission levels."
    },
    {
      icon: Award,
      title: "Rewards & Sanctions",
      description: "Track student behavior with a comprehensive reward and sanction system."
    },
    {
      icon: Bell,
      title: "Announcements",
      description: "Share important information targeted to specific groups or the entire school."
    },
    {
      icon: Book,
      title: "Homework Tracking",
      description: "Assign and track homework completion for improved student accountability."
    },
    {
      icon: BarChart,
      title: "Performance Insights",
      description: "Gain valuable insights into student performance and behavior patterns."
    },
    {
      icon: CheckCircle,
      title: "Permission Controls",
      description: "Fine-grained permission settings for teachers based on responsibilities."
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="pt-24 pb-24 lg:pt-32">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div 
              className="inline-block px-3 py-1 mb-4 border border-learner-100 rounded-full bg-learner-50 text-learner-700 text-sm font-medium animate-fade-in"
            >
              Modern School Management
            </div>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-6 tracking-tight"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              <span className="text-gray-900">Elevate your school with</span>
              <span className="text-learner-600 block md:inline"> Learner Air</span>
            </h1>
            <p 
              className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: '0.1s',
              }}
            >
              A comprehensive platform that seamlessly connects administrators, teachers, and students
              for a more efficient and collaborative educational environment.
            </p>
            <div
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: '0.2s',
              }}
            >
              {user ? (
                <Button asChild size="lg" className="bg-learner-500 hover:bg-learner-600 text-white">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    Go to Dashboard <ArrowRight size={16} />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-learner-500 hover:bg-learner-600 text-white">
                  <Link to="/login" className="flex items-center gap-2">
                    Get Started <ArrowRight size={16} />
                  </Link>
                </Button>
              )}
            </div>
          </div>
          
          {/* Hero Image */}
          <div 
            className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
              transitionDelay: '0.3s',
            }}
          >
            <div className="glass-effect absolute inset-0 z-10 opacity-20"></div>
            {/* Placeholder dashboard image */}
            <div className="bg-gradient-to-br from-white to-learner-50 h-[500px] flex items-center justify-center">
              <div className="max-w-4xl w-full p-8 rounded-xl border border-gray-100 bg-white/80 shadow-soft">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Welcome back</div>
                    <div className="text-xl font-medium">Headteacher Dashboard</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-learner-100"></div>
                    <div className="h-8 w-8 rounded-full bg-learner-200"></div>
                    <div className="h-8 w-8 rounded-full bg-learner-300"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-white rounded-lg border border-gray-100">
                    <div className="text-sm font-medium text-gray-500">Students</div>
                    <div className="text-2xl font-medium">1,248</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-100">
                    <div className="text-sm font-medium text-gray-500">Teachers</div>
                    <div className="text-2xl font-medium">64</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-100">
                    <div className="text-sm font-medium text-gray-500">Classes</div>
                    <div className="text-2xl font-medium">48</div>
                  </div>
                </div>
                <div className="h-40 rounded-lg bg-white border border-gray-100 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 w-20 bg-learner-100 rounded-md"></div>
                  <div className="h-6 w-20 bg-learner-200 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">
              Features designed for modern education
            </h2>
            <p className="text-lg text-gray-500">
              Everything you need to streamline your school's management process in one powerful platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={150 * index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container px-4 mx-auto">
          <div className="glass-panel max-w-4xl mx-auto p-12 text-center">
            <h2 className="text-3xl font-display font-medium mb-4">
              Ready to transform your school?
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Join educational institutions across the country that are streamlining their 
              administration and creating better learning environments.
            </p>
            <Button size="lg" className="bg-learner-500 hover:bg-learner-600 text-white px-8">
              <Link to="/login">Start your journey</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
