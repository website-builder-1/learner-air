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
  Trash2,
  Search,
  Upload,
  FileText,
  Paperclip
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";

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

const getHomeworks = () => {
  const stored = localStorage.getItem('homeworks');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('homeworks', JSON.stringify(SAMPLE_HOMEWORKS));
  return SAMPLE_HOMEWORKS;
};

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

const getActivities = () => {
  const stored = localStorage.getItem('student_activities');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const sampleActivities = [
    {
      id: '1',
      type: 'reward',
      description: 'Outstanding contribution in science class',
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
      teacherId: '2',
      teacherName: 'John Smith',
      date: '2023-09-05'
    }
  ];
  
  localStorage.setItem('student_activities', JSON.stringify(sampleActivities));
  return sampleActivities;
};

const saveActivities = (activities) => {
  localStorage.setItem('student_activities', JSON.stringify(activities));
};

const saveHomeworks = (homeworks) => {
  localStorage.setItem('homeworks', JSON.stringify(homeworks));
};

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
                {isReward ? 'Reward' : `Sanction • ${activity.sanctionType || 'General'}`}
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

const HomeworkCard = ({ homework, onView, onDelete }: { 
  homework: any, 
  onView?: (homework: any) => void,
  onDelete?: (id: string) => void 
}) => {
  const { user, hasPermission } = useAuth();
  const canDeleteHomework = user?.role === 'headteacher' || hasPermission('delete_homework');
  
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
          <div className="flex gap-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(homework)}>View</Button>
            )}
            {onDelete && canDeleteHomework && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(homework.id)}
              >
                <Trash2 size={14} className="mr-1" /> Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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

const FileAttachment = ({ file, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-gray-500" />
        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 rounded-full" 
        onClick={() => onRemove(file)}
      >
        <XCircle size={14} className="text-gray-500" />
      </Button>
    </div>
  );
};

const CredentialsPopup = ({ open, onClose }) => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    if (open && user) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userCredentials = users.find(u => u.id === user.id);
      if (userCredentials) {
        setCredentials(userCredentials);
      }
    }
  }, [open, user]);

  if (!open || !credentials) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Login Credentials</DialogTitle>
          <DialogDescription>
            Keep these details safe and confidential
          </DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Dashboard = () => {
  const { user, hasPermission } = useAuth();
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

  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isStudentSearchOpen, setIsStudentSearchOpen] = useState(false);
  const [isRewardStudentSearchOpen, setIsRewardStudentSearchOpen] = useState(false);
  
  const [homeworkForm, setHomeworkForm] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    dueDate: '',
    attachments: [] as File[]
  });

  const [rewardForm, setRewardForm] = useState({
    description: '',
    studentId: '',
    studentSearch: ''
  });

  const [sanctionForm, setSanctionForm] = useState({
    description: '',
    sanctionType: 'Lunchtime Detention',
    studentId: '',
    studentSearch: ''
  });

  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [homeworkToDelete, setHomeworkToDelete] = useState(null);

  // Add missing implementation
  useEffect(() => {
    // Load activities
    const loadedActivities = getActivities();
    setActivities(loadedActivities);
    
    // Load homeworks
    const loadedHomeworks = getHomeworks();
    setHomeworks(loadedHomeworks);
    
    // Load user stats
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const stats = {
      students: users.filter(u => u.role === 'student').length,
      teachers: users.filter(u => u.role === 'teacher').length,
      rewards: 0,
      sanctions: 0
    };
    
    // Count rewards and sanctions
    const allActivities = getActivities();
    stats.rewards = allActivities.filter(a => a.type === 'reward').length;
    stats.sanctions = allActivities.filter(a => a.type === 'sanction').length;
    
    setUsersStats(stats);
  }, []);
  
  const handleDeleteActivity = (activity) => {
    // Delete confirmation
    if (window.confirm(`Are you sure you want to delete this ${activity.type}?`)) {
      const updatedActivities = activities.filter(a => a.id !== activity.id);
      setActivities(updatedActivities);
      saveActivities(updatedActivities);
      toast.success(`${activity.type === 'reward' ? 'Reward' : 'Sanction'} deleted successfully`);
    }
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setHomeworkForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files] as File[]
    }));
  };
  
  const handleRemoveFile = (fileToRemove) => {
    setHomeworkForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter(file => file !== fileToRemove)
    }));
  };

  const handleDeleteHomework = (homeworkId) => {
    if (confirm("Are you sure you want to delete this homework assignment?")) {
      const updatedHomeworks = homeworks.filter(hw => hw.id !== homeworkId);
      setHomeworks(updatedHomeworks);
      saveHomeworks(updatedHomeworks);
      toast.success("Homework deleted successfully");
    }
  };

  const filterStudents = (query) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const students = users.filter(u => u.role === 'student');
    return students.filter(s => 
      s.fullName.toLowerCase().includes(query.toLowerCase()) ||
      s.username.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          <QuickAction 
            icon={Users} 
            label="Users" 
            to="/users" 
            color="text-blue-500"
            disabled={!user?.permissions.includes('view_all_users') && user?.role !== 'headteacher'} 
          />
          <QuickAction 
            icon={UserPlus} 
            label="Add User" 
            to="/users/new" 
            color="text-green-500"
            disabled={!user?.permissions.includes('add_users') && user?.role !== 'headteacher'} 
          />
          <QuickAction 
            icon={BookOpen} 
            label="Homework" 
            to="/homework"
            color="text-purple-500" 
          />
          <QuickAction 
            icon={Award} 
            label="Rewards" 
            to="/activity?type=reward"
            color="text-yellow-500" 
          />
          <QuickAction 
            icon={AlertTriangle} 
            label="Sanctions" 
            to="/activity?type=sanction"
            color="text-orange-500" 
          />
          <QuickAction 
            icon={Search} 
            label="Find Student" 
            to="/students/search"
            color="text-learner-500" 
          />
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Dashboard */}
        {user?.role === 'student' && (
          <>
            <div className="lg:col-span-2 space-y-6">
              {/* Homework */}
              <Card style={getStaggeredStyle(0)}>
                <CardHeader className="pb-2">
                  <CardTitle>Your Homework</CardTitle>
                  <CardDescription>Due assignments and tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {homeworks.slice(0, 3).map(homework => (
                      <HomeworkCard 
                        key={homework.id} 
                        homework={homework} 
                        onView={() => navigate(`/homework/${homework.id}`)}
                      />
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" asChild>
                      <Link to="/homework">View All Homework</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Announcements */}
              <Card style={getStaggeredStyle(1)}>
                <CardHeader className="pb-2">
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>Latest updates from school</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {SAMPLE_ANNOUNCEMENTS.map(announcement => (
                      <AnnouncementCard 
                        key={announcement.id} 
                        announcement={announcement} 
                      />
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" asChild>
                      <Link to="/announcements">View All Announcements</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Activity Feed */}
            <div>
              <Card style={getStaggeredStyle(2)}>
                <CardHeader className="pb-2">
                  <CardTitle>Activity Feed</CardTitle>
                  <CardDescription>Your recent rewards and sanctions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.slice(0, 5).map(activity => (
                      <ActivityCard 
                        key={activity.id} 
                        activity={activity}
                        onDelete={handleDeleteActivity}
                      />
                    ))}
                    {activities.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No activities recorded yet
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" asChild>
                      <Link to="/activity">View All Activity</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
        
        {/* Teacher Dashboard */}
        {(user?.role === 'teacher' || user?.role === 'headteacher') && (
          <>
            <div className="lg:col-span-2 space-y-6">
              {/* Teacher Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={getStaggeredStyle(0)}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="mx-auto h-8 w-8 text-learner-500 mb-2" />
                      <div className="text-2xl font-bold">{usersStats.students}</div>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{usersStats.teachers}</div>
                      <p className="text-xs text-muted-foreground">Teachers</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Award className="mx-auto h-8 w-8 text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{usersStats.rewards}</div>
                      <p className="text-xs text-muted-foreground">Rewards</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <AlertTriangle className="mx-auto h-8 w-8 text-amber-500 mb-2" />
                      <div className="text-2xl font-bold">{usersStats.sanctions}</div>
                      <p className="text-xs text-muted-foreground">Sanctions</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Homework Management */}
              <Card style={getStaggeredStyle(1)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Homework Management</CardTitle>
                      <CardDescription>Review and manage assignments</CardDescription>
                    </div>
                    {user?.permissions.includes('set_homework') && (
                      <Button onClick={() => setIsHomeworkModalOpen(true)}>
                        Add Homework
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {homeworks.slice(0, 3).map(homework => (
                      <HomeworkCard 
                        key={homework.id} 
                        homework={homework} 
                        onView={() => navigate(`/homework/${homework.id}`)}
                        onDelete={handleDeleteHomework}
                      />
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" asChild>
                      <Link to="/homework">Manage All Homework</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Activity Management */}
            <div>
              <Card style={getStaggeredStyle(2)}>
                <CardHeader className="pb-2">
                  <CardTitle>Student Activity</CardTitle>
                  <CardDescription>Manage rewards and sanctions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user?.permissions.includes('set_rewards') && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700" 
                        onClick={() => setIsRewardModalOpen(true)}
                      >
                        <Award className="mr-2 h-4 w-4" /> Add Reward
                      </Button>
                    )}
                    
                    {user?.permissions.includes('set_sanctions') && (
                      <Button 
                        className="w-full bg-amber-600 hover:bg-amber-700" 
                        onClick={() => setIsSanctionModalOpen(true)}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" /> Add Sanction
                      </Button>
                    )}
                    
                    <div className="h-[1px] bg-gray-200 my-4"></div>
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
                      {activities.slice(0, 3).map(activity => (
                        <ActivityCard 
                          key={activity.id} 
                          activity={activity}
                          onDelete={handleDeleteActivity}
                        />
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/activity">View All Activity</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      
      {/* Modals */}
      {/* Add Homework Modal */}
      <Dialog open={isHomeworkModalOpen} onOpenChange={setIsHomeworkModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Homework</DialogTitle>
            <DialogDescription>
              Create a new homework assignment for students
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="title">Title</Label>
              <Input
                id="title"
                value={homeworkForm.title}
                onChange={(e) => setHomeworkForm({...homeworkForm, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="description">
                Description
              </Label>
              <Textarea
                id="description"
                value={homeworkForm.description}
                onChange={(e) => setHomeworkForm({...homeworkForm, description: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={homeworkForm.subject}
                onChange={(e) => setHomeworkForm({...homeworkForm, subject: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="class">Class</Label>
              <Input
                id="class"
                value={homeworkForm.class}
                onChange={(e) => setHomeworkForm({...homeworkForm, class: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={homeworkForm.dueDate}
                onChange={(e) => setHomeworkForm({...homeworkForm, dueDate: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="files">Attachments</Label>
              <div className="col-span-3">
                <Label 
                  htmlFor="files" 
                  className="flex items-center gap-2 p-2 border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <Upload size={16} />
                  <span>Upload Files</span>
                  <Input 
                    id="files" 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </Label>
                
                {homeworkForm.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {homeworkForm.attachments.map((file, index) => (
                      <FileAttachment 
                        key={index} 
                        file={file} 
                        onRemove={handleRemoveFile} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHomeworkModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Add homework logic
                const newHomework = {
                  id: Math.random().toString(36).substr(2, 9),
                  title: homeworkForm.title,
                  description: homeworkForm.description,
                  subject: homeworkForm.subject,
                  class: homeworkForm.class,
                  dueDate: homeworkForm.dueDate 
                    ? new Date(homeworkForm.dueDate) 
                    : new Date(Date.now() + 604800000), // Default: 7 days
                  attachments: homeworkForm.attachments.map(file => file.name)
                };
                
                const updatedHomeworks = [...homeworks, newHomework];
                setHomeworks(updatedHomeworks);
                saveHomeworks(updatedHomeworks);
                
                // Reset form
                setHomeworkForm({
                  title: '',
                  description: '',
                  subject: '',
                  class: '',
                  dueDate: '',
                  attachments: []
                });
                
                setIsHomeworkModalOpen(false);
                toast.success('Homework added successfully');
              }}
            >
              Add Homework
            </Button>
          </DialogFooter>
