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

  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isStudentSearchOpen, setIsStudentSearchOpen] = useState(false);
  
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
    points: 1,
    studentId: '',
    quantity: 1
  });

  const [sanctionForm, setSanctionForm] = useState({
    description: '',
    sanctionType: 'Lunchtime Detention',
    studentId: '',
    studentSearch: ''
  });

  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);



