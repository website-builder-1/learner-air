
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStaggeredEntrance } from '@/utils/animations';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample homeworks
const SAMPLE_HOMEWORKS = [
  {
    id: '1',
    title: 'Math - Algebra Problems',
    description: 'Sets 4-6 on page 128',
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    subject: 'Math',
    class: '10A'
  },
  {
    id: '2',
    title: 'English - Essay',
    description: 'Comparison of themes',
    dueDate: new Date(Date.now() + 259200000), // 3 days
    subject: 'English',
    class: '10B'
  },
  {
    id: '3',
    title: 'Science - Lab Report',
    description: 'Write up of chemistry experiment',
    dueDate: new Date(Date.now() + 432000000), // 5 days
    subject: 'Science',
    class: '10A'
  }
];

// Get initial homeworks from localStorage or use sample data
const getHomeworks = () => {
  const stored = localStorage.getItem('homeworks');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('homeworks', JSON.stringify(SAMPLE_HOMEWORKS));
  return SAMPLE_HOMEWORKS;
};

// Sample announcements data
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

// Get activities from localStorage or initialize
const getActivities = () => {
  const stored = localStorage.getItem('student_activities');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Sample data
  const sampleActivities = [
    {
      id: '1',
      type: 'reward',
      description: 'Outstanding contribution in science class',
      points: 5,
      teacherId: '2',
      teacherName: 'John Smith',
      date: '2023-09-15'
    },
    {
      id: '2',
      type: 'sanction',
      description: 'Late submission of homework',
      sanctionType: 'Lunchtime Detention',
      teacherId: '2',
      teacherName: 'John Smith',
      date: '2023-09-10'
    },
    {
      id: '3',
      type: 'reward',
      description: 'Helping a classmate with math problems',
      points: 3,
      teacherId: '2',
      teacherName: 'John Smith',
      date: '2023-09-05'
    }
  ];
  
  localStorage.setItem('student_activities', JSON.stringify(sampleActivities));
  return sampleActivities;
};

// Save activities to localStorage
const saveActivities = (activities) => {
  localStorage.setItem('student_activities', JSON.stringify(activities));
};

// Save homeworks to localStorage
const saveHomeworks = (homeworks) => {
  localStorage.setItem('homeworks', JSON.stringify(homeworks));
};

// Activity card component for student dashboard
const ActivityCard = ({ activity, onDelete }) => {
  const isReward = activity.type === 'reward';
  const { user } = useAuth();
  const canDelete = (isReward && user?.permissions.includes('set_rewards')) || 
                   (!isReward && user?.permissions.includes('set_sanctions')) ||
                   user?.role === 'headteacher';
  
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
                {isReward ? `Reward • ${activity.points} points` : `Sanction • ${activity.sanctionType || 'General'}`}
              </span>
            </div>
            <p className="font-medium mb-1">{activity.description}</p>
            <div className="text-sm text-gray-500">
              Issued by {activity.teacherName}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-sm text-gray-400">
              {new Date(activity.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short'
              })}
            </div>
            {canDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(activity)}
              >
                <Trash2 size={16} />
              </Button>
            )}
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

// Homework card component
const HomeworkCard = ({ homework, onView }: { homework: any, onView?: (homework: any) => void }) => {
  const today = new Date();
  const dueDate = new Date(homework.dueDate);
  const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
  let dueDateText = `${daysDiff} days`;
  let dueDateClass = "text-gray-500";
  
  if (daysDiff <= 0) {
    dueDateText = "Today";
    dueDateClass = "text-red-600 font-medium";
  } else if (daysDiff === 1) {
    dueDateText = "Tomorrow";
    dueDateClass = "text-amber-600";
  } else if (daysDiff <= 2) {
    dueDateClass = "text-amber-500";
  }
  
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{homework.title}</div>
          <div className="text-sm text-gray-500">{homework.description}</div>
          {homework.class && (
            <div className="text-xs text-gray-400 mt-1">Class: {homework.class}</div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`text-sm ${dueDateClass}`}>{dueDateText}</div>
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(homework)}>View</Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Quick action component
const QuickAction = ({ 
  icon: Icon, 
  label, 
  to, 
  color = 'text-gray-500',
  onClick,
  disabled
}: { 
  icon: React.ElementType; 
  label: string; 
  to?: string; 
  color?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className={`flex flex-col items-center gap-2 transition-transform hover:scale-105 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        disabled={disabled}
      >
        <div className={`w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <span className="text-sm text-gray-600">{label}</span>
      </button>
    );
  }
  
  return (
    <Link to={to || "#"} className={`flex flex-col items-center gap-2 transition-transform hover:scale-105 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className={`w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </Link>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const getStaggeredStyle = useStaggeredEntrance(5);
  const [activities, setActivities] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [usersStats, setUsersStats] = useState({
    students: 0,
    teachers: 0,
    rewards: 0,
    sanctions: 0
  });

  // Modal states
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  
  // Form data
  const [homeworkForm, setHomeworkForm] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    dueDate: ''
  });

  const [rewardForm, setRewardForm] = useState({
    description: '',
    points: 1,
    studentId: ''
  });

  const [sanctionForm, setSanctionForm] = useState({
    description: '',
    sanctionType: 'Lunchtime Detention',
    studentId: ''
  });

  // Load data on component mount
  useEffect(() => {
    // Load activities
    const allActivities = getActivities();
    if (user?.role === 'student') {
      // Filter activities for the current student
      const studentActivities = allActivities.filter(activity => activity.id === user.id);
      setActivities(studentActivities);
    } else {
      // For teachers and headteachers, show all activities
      setActivities(allActivities);
    }

    // Load homeworks
    const allHomeworks = getHomeworks();
    setHomeworks(allHomeworks);

    // Calculate stats
    calculateStats();
  }, [user]);

  // Calculate school-wide statistics
  const calculateStats = () => {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const allActivities = getActivities();
    
    // Count students and teachers
    const students = users.filter(u => u.role === 'student').length;
    const teachers = users.filter(u => u.role === 'teacher' || u.role === 'headteacher').length;
    
    // Count rewards and sanctions
    const rewards = allActivities.filter(a => a.type === 'reward').length;
    const sanctions = allActivities.filter(a => a.type === 'sanction').length;
    
    setUsersStats({
      students,
      teachers,
      rewards,
      sanctions
    });
  };

  // Handle homework form change
  const handleHomeworkFormChange = (field, value) => {
    setHomeworkForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle reward form change
  const handleRewardFormChange = (field, value) => {
    setRewardForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle sanction form change
  const handleSanctionFormChange = (field, value) => {
    setSanctionForm(prev => ({ ...prev, [field]: value }));
  };

  // Create a new homework
  const handleCreateHomework = () => {
    if (!homeworkForm.title || !homeworkForm.description || !homeworkForm.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newHomework = {
      id: Date.now().toString(),
      title: homeworkForm.title,
      description: homeworkForm.description,
      subject: homeworkForm.subject,
      class: homeworkForm.class,
      dueDate: new Date(homeworkForm.dueDate).toISOString()
    };

    const updatedHomeworks = [newHomework, ...homeworks];
    saveHomeworks(updatedHomeworks);
    setHomeworks(updatedHomeworks);
    
    setIsHomeworkModalOpen(false);
    setHomeworkForm({
      title: '',
      description: '',
      subject: '',
      class: '',
      dueDate: ''
    });
    
    toast.success('Homework created successfully');
  };

  // Create a new reward
  const handleCreateReward = () => {
    if (!rewardForm.description || !rewardForm.studentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newReward = {
      id: rewardForm.studentId,
      type: 'reward',
      description: rewardForm.description,
      points: rewardForm.points,
      teacherId: user?.id,
      teacherName: user?.fullName,
      date: new Date().toISOString().split('T')[0]
    };

    const allActivities = getActivities();
    const updatedActivities = [newReward, ...allActivities];
    saveActivities(updatedActivities);
    
    if (user?.role === 'student') {
      // Update the activities shown to the student
      const studentActivities = updatedActivities.filter(activity => activity.id === user.id);
      setActivities(studentActivities);
    } else {
      setActivities(updatedActivities);
    }
    
    setIsRewardModalOpen(false);
    setRewardForm({
      description: '',
      points: 1,
      studentId: ''
    });
    
    // Update statistics
    calculateStats();
    
    toast.success('Reward added successfully');
  };

  // Create a new sanction
  const handleCreateSanction = () => {
    if (!sanctionForm.description || !sanctionForm.studentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newSanction = {
      id: sanctionForm.studentId,
      type: 'sanction',
      description: sanctionForm.description,
      sanctionType: sanctionForm.sanctionType,
      teacherId: user?.id,
      teacherName: user?.fullName,
      date: new Date().toISOString().split('T')[0]
    };

    const allActivities = getActivities();
    const updatedActivities = [newSanction, ...allActivities];
    saveActivities(updatedActivities);
    
    if (user?.role === 'student') {
      // Update the activities shown to the student
      const studentActivities = updatedActivities.filter(activity => activity.id === user.id);
      setActivities(studentActivities);
    } else {
      setActivities(updatedActivities);
    }
    
    setIsSanctionModalOpen(false);
    setSanctionForm({
      description: '',
      sanctionType: 'Lunchtime Detention',
      studentId: ''
    });
    
    // Update statistics
    calculateStats();
    
    toast.success('Sanction added successfully');
  };

  // Delete an activity (reward or sanction)
  const handleDeleteActivity = (activity) => {
    const allActivities = getActivities();
    const updatedActivities = allActivities.filter(a => 
      !(a.id === activity.id && 
        a.date === activity.date && 
        a.description === activity.description)
    );
    
    saveActivities(updatedActivities);
    
    if (user?.role === 'student') {
      // Update the activities shown to the student
      const studentActivities = updatedActivities.filter(a => a.id === user.id);
      setActivities(studentActivities);
    } else {
      setActivities(updatedActivities);
    }
    
    // Update statistics
    calculateStats();
    
    toast.success(`${activity.type === 'reward' ? 'Reward' : 'Sanction'} deleted successfully`);
  };

  // Get all students for the select dropdowns
  const getStudents = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter(u => u.role === 'student');
  };

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
            {user.role === 'student' && 'Track your rewards and announcements'}
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
                <QuickAction 
                  icon={BookOpen} 
                  label="Homework" 
                  color="text-blue-500"
                  onClick={() => setIsHomeworkModalOpen(true)} 
                />
                <QuickAction 
                  icon={Award} 
                  label="Rewards" 
                  color="text-green-500"
                  onClick={() => setIsRewardModalOpen(true)} 
                />
                <QuickAction 
                  icon={AlertTriangle} 
                  label="Sanctions" 
                  color="text-amber-500"
                  onClick={() => setIsSanctionModalOpen(true)} 
                />
                <QuickAction icon={Bell} label="Announcements" to="/announcements" />
              </>
            )}
            {user.role === 'teacher' && (
              <>
                <QuickAction icon={Users} label="Students" to="/student-search" color="text-learner-500" />
                <QuickAction 
                  icon={BookOpen} 
                  label="Homework" 
                  color="text-blue-500"
                  onClick={() => setIsHomeworkModalOpen(true)} 
                />
                <QuickAction icon={Bell} label="Announcements" to="/announcements" />
                <QuickAction 
                  icon={Award} 
                  label="Rewards" 
                  color="text-green-500"
                  onClick={() => setIsRewardModalOpen(true)}
                  disabled={!user.permissions.includes('set_rewards')}
                />
                <QuickAction 
                  icon={AlertTriangle} 
                  label="Sanctions" 
                  color="text-amber-500"
                  onClick={() => setIsSanctionModalOpen(true)}
                  disabled={!user.permissions.includes('set_sanctions')} 
                />
                {user.permissions.includes('add_users') && (
                  <QuickAction icon={UserPlus} label="Manage Users" to="/users" />
                )}
              </>
            )}
            {user.role === 'student' && (
              <>
                <QuickAction icon={Bell} label="Announcements" to="/announcements" color="text-learner-500" />
                <QuickAction icon={BookOpen} label="Homework" color="text-blue-500" />
              </>
            )}
          </div>
        </div>

        {/* Main content - varies by role */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Homework Section */}
            {user.role === 'student' && (
              <Card style={getStaggeredStyle(2)}>
                <CardHeader className="pb-2">
                  <CardTitle>Homework Due</CardTitle>
                  <CardDescription>Your upcoming assignments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {homeworks.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500">No homework assignments due</p>
                    </div>
                  ) : (
                    homeworks.map(homework => (
                      <HomeworkCard key={homework.id} homework={homework} />
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* Teacher Homework Management */}
            {user.role === 'teacher' && (
              <Card style={getStaggeredStyle(2)}>
                <CardHeader className="pb-2">
                  <CardTitle>Homework Management</CardTitle>
                  <CardDescription>Assign and track student homework</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Assigned</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-medium">{homeworks.length}</div>
                        <div className="text-sm text-gray-500">Total assignments</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Pending Grading</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-medium">5</div>
                        <div className="text-sm text-gray-500">Submissions</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-3">Recent Assignments</h3>
                    <div className="space-y-3">
                      {homeworks.slice(0, 3).map(homework => (
                        <div key={homework.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{homework.title}</div>
                            <div className="text-sm text-gray-500">{homework.class || 'All Classes'}</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/homework/${homework.id}`)}>View</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <Button 
                      className="bg-learner-500 hover:bg-learner-600"
                      onClick={() => setIsHomeworkModalOpen(true)}
                    >
                      Create New Assignment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Teacher Rewards & Sanctions */}
            {user.role === 'teacher' && (
              <Card style={getStaggeredStyle(3)}>
                <CardHeader className="pb-2">
                  <CardTitle>Rewards & Sanctions</CardTitle>
                  <CardDescription>Manage student behavior and recognition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Award className="text-green-500" size={18} />
                          Rewards Given
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-medium">{activities.filter(a => a.type === 'reward').length}</div>
                        <div className="text-sm text-gray-500">Total</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="text-amber-500" size={18} />
                          Sanctions Issued
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-medium">{activities.filter(a => a.type === 'sanction').length}</div>
                        <div className="text-sm text-gray-500">Total</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <Button 
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      onClick={() => setIsRewardModalOpen(true)}
                      disabled={!user.permissions.includes('set_rewards')}
                    >
                      <Award className="mr-2" size={16} />
                      Issue Reward
                    </Button>
                    <Button 
                      className="flex-1 bg-amber-500 hover:bg-amber-600"
                      onClick={() => setIsSanctionModalOpen(true)}
                      disabled={!user.permissions.includes('set_sanctions')}
                    >
                      <AlertTriangle className="mr-2" size={16} />
                      Issue Sanction
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Headteacher Stats */}
            {user.role === 'headteacher' && (
              <Card style={getStaggeredStyle(2)}>
                <CardHeader className="pb-2">
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    School-wide statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Students</div>
                      <div className="text-2xl font-medium">{usersStats.students}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">
                        Teachers
                      </div>
                      <div className="text-2xl font-medium">{usersStats.teachers}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Rewards</div>
                      <div className="text-2xl font-medium">{usersStats.rewards}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Sanctions</div>
                      <div className="text-2xl font-medium">{usersStats.sanctions}</div>
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
                    View all <span className="ml-1">→</span>
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
            
            {/* System Status for headteacher */}
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
            
            {/* Student activities (rewards and sanctions for students) */}
            {user.role === 'student' && (
              <Card style={getStaggeredStyle(4)}>
                <CardHeader className="pb-2">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent rewards and sanctions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No activities yet</p>
                    </div>
                  ) : (
                    activities.map((activity, index) => (
                      <ActivityCard 
                        key={`${activity.id}-${index}`} 
                        activity={activity} 
                        onDelete={handleDeleteActivity}
                      />
                    ))
                  )}
                  
                  <div className="text-center pt-2">
                    <Button variant="ghost" className="text-learner-500 hover:text-learner-600 hover:bg-learner-50">
                      View all activity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create Homework Modal */}
      <Dialog open={isHomeworkModalOpen} onOpenChange={setIsHomeworkModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Homework</DialogTitle>
            <DialogDescription>
              Assign homework to students
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={homeworkForm.title}
                onChange={(e) => handleHomeworkFormChange('title', e.target.value)}
                placeholder="Homework title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={homeworkForm.description}
                onChange={(e) => handleHomeworkFormChange('description', e.target.value)}
                placeholder="Detailed instructions for the homework"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={homeworkForm.subject}
                  onChange={(e) => handleHomeworkFormChange('subject', e.target.value)}
                  placeholder="e.g. Math, English"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  value={homeworkForm.class}
                  onChange={(e) => handleHomeworkFormChange('class', e.target.value)}
                  placeholder="e.g. 10A, 11B"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={homeworkForm.dueDate}
                onChange={(e) => handleHomeworkFormChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHomeworkModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateHomework}>
              Create Homework
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Reward Modal */}
      <Dialog open={isRewardModalOpen} onOpenChange={setIsRewardModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Issue Reward</DialogTitle>
            <DialogDescription>
              Recognize positive behavior and achievements
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="studentId">Student</Label>
              <Select 
                value={rewardForm.studentId} 
                onValueChange={(value) => handleRewardFormChange('studentId', value)}
              >
                <SelectTrigger id="studentId">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Students</SelectLabel>
                    {getStudents().map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.fullName} ({student.yearGroup || 'No Year'}, {student.class || 'No Class'})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={rewardForm.description}
                onChange={(e) => handleRewardFormChange('description', e.target.value)}
                placeholder="Describe the positive behavior or achievement"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="points">Points</Label>
              <Select 
                value={rewardForm.points.toString()} 
                onValueChange={(value) => handleRewardFormChange('points', parseInt(value))}
              >
                <SelectTrigger id="points">
                  <SelectValue placeholder="Select points" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Point Values</SelectLabel>
                    <SelectItem value="1">1 Point</SelectItem>
                    <SelectItem value="2">2 Points</SelectItem>
                    <SelectItem value="3">3 Points</SelectItem>
                    <SelectItem value="5">5 Points</SelectItem>
                    <SelectItem value="10">10 Points</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRewardModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateReward}
              className="bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Add Reward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Sanction Modal */}
      <Dialog open={isSanctionModalOpen} onOpenChange={setIsSanctionModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Issue Sanction</DialogTitle>
            <DialogDescription>
              Document behavior that needs improvement
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="studentId">Student</Label>
              <Select 
                value={sanctionForm.studentId} 
                onValueChange={(value) => handleSanctionFormChange('studentId', value)}
              >
                <SelectTrigger id="studentId">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Students</SelectLabel>
                    {getStudents().map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.fullName} ({student.yearGroup || 'No Year'}, {student.class || 'No Class'})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sanctionDescription">Description</Label>
              <Textarea
                id="sanctionDescription"
                value={sanctionForm.description}
                onChange={(e) => handleSanctionFormChange('description', e.target.value)}
                placeholder="Describe the behavior requiring improvement"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="sanctionType">Sanction Type</Label>
              <Select 
                value={sanctionForm.sanctionType} 
                onValueChange={(value) => handleSanctionFormChange('sanctionType', value)}
              >
                <SelectTrigger id="sanctionType">
                  <SelectValue placeholder="Select sanction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sanction Types</SelectLabel>
                    <SelectItem value="Lunchtime Detention">Lunchtime Detention</SelectItem>
                    <SelectItem value="After School Detention">After School Detention</SelectItem>
                    <SelectItem value="Wednesday Detention">Wednesday Detention</SelectItem>
                    <SelectItem value="Internal Inclusion">Internal Inclusion</SelectItem>
                    <SelectItem value="Inclusion">Inclusion</SelectItem>
                    <SelectItem value="Parent Meeting">Parent Meeting</SelectItem>
                    <SelectItem value="Verbal Warning">Verbal Warning</SelectItem>
                    <SelectItem value="Written Warning">Written Warning</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSanctionModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSanction}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <XCircle className="mr-2 h-4 w-4" /> Add Sanction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
