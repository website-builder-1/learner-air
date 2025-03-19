
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  AlertTriangle, 
  Bell, 
  Users, 
  BookOpen, 
  UserPlus, 
  Settings,
  Calendar,
  ChevronRight,
  BarChart,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStaggeredEntrance } from '@/utils/animations';

// Sample data for demonstration purposes
const SAMPLE_ACTIVITIES = [
  {
    id: '1',
    type: 'reward',
    description: 'Outstanding contribution in science class',
    date: '2023-09-15',
    teacher: 'Mr. Smith',
    points: 5
  },
  {
    id: '2',
    type: 'sanction',
    description: 'Late submission of homework',
    date: '2023-09-10',
    teacher: 'Ms. Johnson',
    points: 2
  },
  {
    id: '3',
    type: 'reward',
    description: 'Helping a classmate with math problems',
    date: '2023-09-05',
    teacher: 'Mr. Williams',
    points: 3
  }
];

const SAMPLE_ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'School Closure - Staff Training Day',
    date: '2023-09-20',
    author: 'Headteacher',
    target: 'All'
  },
  {
    id: '2',
    title: 'Science Fair Registration Open',
    date: '2023-09-18',
    author: 'Ms. Davis',
    target: 'All Students'
  }
];

// Activity card component for student dashboard
const ActivityCard = ({ activity }: { activity: typeof SAMPLE_ACTIVITIES[0] }) => {
  const isReward = activity.type === 'reward';
  
  return (
    <Card className={`border-l-4 ${isReward ? 'border-l-green-500' : 'border-l-amber-500'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isReward ? 
                <Award className="text-green-500" size={18} /> : 
                <AlertTriangle className="text-amber-500" size={18} />
              }
              <span className={`text-sm font-medium ${isReward ? 'text-green-600' : 'text-amber-600'}`}>
                {isReward ? 'Reward' : 'Sanction'} • {activity.points} points
              </span>
            </div>
            <p className="font-medium mb-1">{activity.description}</p>
            <div className="text-sm text-gray-500">
              Issued by {activity.teacher}
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {new Date(activity.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short'
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Announcement card component
const AnnouncementCard = ({ announcement }: { announcement: typeof SAMPLE_ANNOUNCEMENTS[0] }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Bell className="text-learner-500" size={18} />
            <span className="text-sm font-medium text-learner-600">
              Announcement
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {new Date(announcement.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short'
            })}
          </div>
        </div>
        <h4 className="font-medium mb-1">{announcement.title}</h4>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            By {announcement.author}
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {announcement.target}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Quick action component
const QuickAction = ({ 
  icon: Icon, 
  label, 
  to, 
  color = 'text-gray-500'
}: { 
  icon: React.ElementType; 
  label: string; 
  to: string; 
  color?: string;
}) => {
  return (
    <Link to={to} className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
      <div className={`w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </Link>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const getStaggeredStyle = useStaggeredEntrance(5);

  if (!user) return null;

  return (
    <div className="pt-8 pb-16">
      <div className="container px-4 mx-auto">
        {/* Welcome header */}
        <div className="mb-8" style={getStaggeredStyle(0)}>
          <h1 className="text-2xl md:text-3xl font-display font-medium mb-2">
            Welcome back, {user.fullName}
          </h1>
          <p className="text-gray-500">
            {user.role === 'headteacher' && 'Manage your school with these tools'}
            {user.role === 'teacher' && 'Track your students and their progress'}
            {user.role === 'student' && 'Track your rewards, sanctions, and announcements'}
          </p>
        </div>

        {/* Quick actions */}
        <div className="mb-8 bg-gray-50 rounded-xl p-6" style={getStaggeredStyle(1)}>
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {user.role === 'headteacher' && (
              <>
                <QuickAction icon={UserPlus} label="Add User" to="/users" color="text-learner-500" />
                <QuickAction icon={Users} label="Manage Users" to="/users" />
                <QuickAction icon={Settings} label="Settings" to="/dashboard" />
                <QuickAction icon={Calendar} label="Calendar" to="/dashboard" />
                <QuickAction icon={BarChart} label="Reports" to="/dashboard" />
                <QuickAction icon={Bell} label="Announcements" to="/announcements" />
              </>
            )}
            {user.role === 'teacher' && (
              <>
                <QuickAction icon={Users} label="Students" to="/student-search" color="text-learner-500" />
                <QuickAction icon={BookOpen} label="Homework" to="/dashboard" />
                <QuickAction icon={Bell} label="Announcements" to="/announcements" />
                <QuickAction icon={Award} label="Rewards" to="/dashboard" />
                <QuickAction icon={AlertTriangle} label="Sanctions" to="/dashboard" />
              </>
            )}
            {user.role === 'student' && (
              <>
                <QuickAction icon={Bell} label="Announcements" to="/announcements" color="text-learner-500" />
                <QuickAction icon={BookOpen} label="Homework" to="/dashboard" />
                <QuickAction icon={Award} label="Rewards" to="/dashboard" />
              </>
            )}
          </div>
        </div>

        {/* Main content - varies by role */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Activity Feed */}
            {user.role === 'student' && (
              <Card style={getStaggeredStyle(2)}>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent rewards and sanctions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {SAMPLE_ACTIVITIES.map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                  
                  <div className="text-center pt-2">
                    <Button variant="ghost" className="text-learner-500 hover:text-learner-600 hover:bg-learner-50">
                      View all activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Headteacher & Teacher Stats */}
            {(user.role === 'headteacher' || user.role === 'teacher') && (
              <Card style={getStaggeredStyle(2)}>
                <CardHeader className="pb-2">
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    {user.role === 'headteacher' ? 'School-wide statistics' : 'Your class statistics'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Students</div>
                      <div className="text-2xl font-medium">{user.role === 'headteacher' ? '1,248' : '28'}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        {user.role === 'headteacher' ? 'Teachers' : 'Classes'}
                      </div>
                      <div className="text-2xl font-medium">{user.role === 'headteacher' ? '64' : '3'}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Rewards</div>
                      <div className="text-2xl font-medium">284</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Sanctions</div>
                      <div className="text-2xl font-medium">45</div>
                    </div>
                  </div>

                  <h3 className="font-medium mb-3">Recent Performance</h3>
                  <div className="h-36 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Performance chart placeholder</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Announcements for all roles */}
            <Card style={getStaggeredStyle(3)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Announcements</CardTitle>
                  <Link to="/announcements" className="text-sm text-learner-500 flex items-center gap-1">
                    View all <ChevronRight size={14} />
                  </Link>
                </div>
                <CardDescription>Latest updates and news</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {SAMPLE_ANNOUNCEMENTS.map(announcement => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </CardContent>
            </Card>
            
            {/* Role-specific widgets */}
            {user.role === 'headteacher' && (
              <Card style={getStaggeredStyle(4)}>
                <CardHeader className="pb-2">
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Important system information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <CheckCircle className="text-green-500" size={18} />
                      <span>User accounts</span>
                    </div>
                    <span className="text-sm text-green-500">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <CheckCircle className="text-green-500" size={18} />
                      <span>Announcements</span>
                    </div>
                    <span className="text-sm text-green-500">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <CheckCircle className="text-green-500" size={18} />
                      <span>Activity tracking</span>
                    </div>
                    <span className="text-sm text-green-500">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <XCircle className="text-amber-500" size={18} />
                      <span>Report generator</span>
                    </div>
                    <span className="text-sm text-amber-500">Maintenance</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {user.role === 'teacher' && (
              <Card style={getStaggeredStyle(4)}>
                <CardHeader className="pb-2">
                  <CardTitle>To-Do List</CardTitle>
                  <CardDescription>Your pending tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border border-gray-300"></div>
                    <span>Grade science homework</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border border-gray-300"></div>
                    <span>Prepare lesson plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded border border-gray-300"></div>
                    <span>Call parent of John D.</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {user.role === 'student' && (
              <Card style={getStaggeredStyle(4)}>
                <CardHeader className="pb-2">
                  <CardTitle>Homework Due</CardTitle>
                  <CardDescription>Your upcoming assignments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Math - Algebra Problems</div>
                        <div className="text-sm text-gray-500">Sets 4-6 on page 128</div>
                      </div>
                      <div className="text-sm text-amber-600">Tomorrow</div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">English - Essay</div>
                        <div className="text-sm text-gray-500">Comparison of themes</div>
                      </div>
                      <div className="text-sm text-gray-500">3 days</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
