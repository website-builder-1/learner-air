
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  AlertTriangle, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen,
  User,
  Building,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  type: 'reward' | 'sanction';
  description: string;
  sanctionType?: string;
  teacherId: string;
  teacherName: string;
  date: string;
}

interface Homework {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  class?: string;
  attachments?: any[];
  completed?: boolean;
}

const StudentProfile = () => {
  const { user, hasPermission } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [studentData, setStudentData] = useState(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({
    totalRewards: 0,
    totalSanctions: 0,
    completedHomework: 0,
    pendingHomework: 0
  });

  useEffect(() => {
    if (!id) return;
    
    // Load student data
    const loadStudentData = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const student = users.find(u => u.id === id);
      
      if (!student) {
        toast.error("Student not found");
        navigate('/student-search');
        return;
      }
      
      setStudentData(student);
    };
    
    // Load activities
    const loadActivities = () => {
      const allActivities = JSON.parse(localStorage.getItem('student_activities') || '[]');
      const studentActivities = allActivities.filter(a => a.studentId === id);
      setActivities(studentActivities);
      
      // Calculate stats
      let totalRewards = 0;
      let totalSanctions = 0;
      
      studentActivities.forEach(activity => {
        if (activity.type === 'reward') {
          totalRewards++;
        } else {
          totalSanctions++;
        }
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalRewards,
        totalSanctions
      }));
    };
    
    // Load homeworks
    const loadHomeworks = () => {
      const allHomeworks = JSON.parse(localStorage.getItem('homeworks') || '[]');
      
      // Get completion status
      const completionStatus = JSON.parse(localStorage.getItem(`homework_completion_${id}`) || '{}');
      
      // Mark completed homeworks
      const studentHomeworks = allHomeworks.map(hw => ({
        ...hw,
        completed: completionStatus[hw.id] || false
      }));
      
      setHomeworks(studentHomeworks);
      
      // Count completed and pending homework
      const completed = Object.values(completionStatus).filter(v => v).length;
      const pending = studentHomeworks.length - completed;
      
      // Update stats
      setStats(prev => ({
        ...prev,
        completedHomework: completed,
        pendingHomework: pending
      }));
    };
    
    loadStudentData();
    loadActivities();
    loadHomeworks();
    setLoading(false);
  }, [id, navigate]);

  // Handle deletion of activities
  const handleDeleteActivity = (activity) => {
    const allActivities = JSON.parse(localStorage.getItem('student_activities') || '[]');
    
    // Find exact activity to delete (matching description, date, type)
    const updatedActivities = allActivities.filter(a => 
      !(a.studentId === id && 
        a.date === activity.date && 
        a.description === activity.description &&
        a.type === activity.type)
    );
    
    // Save updated activities
    localStorage.setItem('student_activities', JSON.stringify(updatedActivities));
    
    // Update local state
    const studentActivities = updatedActivities.filter(a => a.studentId === id);
    setActivities(studentActivities);
    
    // Recalculate stats
    let totalRewards = 0;
    let totalSanctions = 0;
    
    studentActivities.forEach(a => {
      if (a.type === 'reward') {
        totalRewards++;
      } else {
        totalSanctions++;
      }
    });
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalRewards,
      totalSanctions
    }));
    
    toast.success(`${activity.type === 'reward' ? 'Reward' : 'Sanction'} deleted successfully`);
  };

  // Format date helper
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Check if user has permission to manage rewards/sanctions
  const canManageRewards = user && (user.role === 'headteacher' || hasPermission('set_rewards'));
  const canManageSanctions = user && (user.role === 'headteacher' || hasPermission('set_sanctions'));

  if (loading || !studentData) {
    return <div className="container mx-auto py-8 px-4 min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => navigate('/student-search')}
        >
          Back to Student Search
        </Button>
        
        <h1 className="text-2xl md:text-3xl font-display font-medium mb-2">
          {studentData.fullName}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
          {studentData.yearGroup && (
            <div className="flex items-center gap-1">
              <Building size={16} />
              <span>Year {studentData.yearGroup}</span>
            </div>
          )}
          {studentData.class && (
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>Class {studentData.class}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Award size={16} />
              <span className="text-sm font-medium">Rewards</span>
            </div>
            <div className="text-2xl font-medium">{stats.totalRewards}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">Sanctions</span>
            </div>
            <div className="text-2xl font-medium">{stats.totalSanctions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <BookOpen size={16} />
              <span className="text-sm font-medium">Homework</span>
            </div>
            <div className="text-2xl font-medium">{stats.completedHomework}</div>
            <div className="text-sm text-gray-500">{stats.pendingHomework} pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="homework">Homework</TabsTrigger>
          <TabsTrigger value="info">Student Info</TabsTrigger>
        </TabsList>
        
        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Rewards and Sanctions</CardTitle>
              <CardDescription>
                Student's activity history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">No activities recorded for this student</p>
                </div>
              ) : (
                activities.map((activity, index) => (
                  <div 
                    key={`${activity.id}-${index}`} 
                    className={`p-4 rounded-lg border ${
                      activity.type === 'reward' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-amber-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {activity.type === 'reward' ? 
                            <Award className="text-green-500" size={18} /> : 
                            <AlertTriangle className="text-amber-500" size={18} />
                          }
                          <span className={`text-sm font-medium ${activity.type === 'reward' ? 'text-green-600' : 'text-amber-600'}`}>
                            {activity.type === 'reward' ? 
                              'Reward' : 
                              `Sanction • ${activity.sanctionType || 'General'}`}
                          </span>
                        </div>
                        <p className="font-medium mb-1">{activity.description}</p>
                        <div className="text-sm text-gray-500 flex items-center gap-4">
                          <span>Issued by {activity.teacherName}</span>
                          <span>{formatDate(activity.date)}</span>
                        </div>
                      </div>
                      
                      {(activity.type === 'reward' && canManageRewards) || 
                       (activity.type === 'sanction' && canManageSanctions) ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteActivity(activity)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Homework Tab */}
        <TabsContent value="homework">
          <Card>
            <CardHeader>
              <CardTitle>Homework</CardTitle>
              <CardDescription>
                Student's homework assignments and completion status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {homeworks.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">No homework assignments found</p>
                </div>
              ) : (
                homeworks.map(homework => (
                  <div 
                    key={homework.id} 
                    className={`p-4 rounded-lg border ${
                      homework.completed ? 'border-l-4 border-l-green-500 bg-green-50' : 'border-l-4 border-l-blue-500'
                    }`}
                  >
                    <div className="font-medium mb-1">{homework.title}</div>
                    <div className="text-sm mb-2">{homework.description}</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Due: {formatDate(homework.dueDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        Subject: {homework.subject}
                      </span>
                      {homework.class && (
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          Class: {homework.class}
                        </span>
                      )}
                      <span className={`flex items-center gap-1 ${
                        homework.completed ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {homework.completed ? (
                          <>
                            <Award size={14} />
                            Completed
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={14} />
                            Pending
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Student Info Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>
                Contact details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Personal Details</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="font-medium text-gray-500 w-24">Full Name:</span>
                      <span>{studentData.fullName}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-medium text-gray-500 w-24">Username:</span>
                      <span>{studentData.username}</span>
                    </div>
                    {studentData.yearGroup && (
                      <div className="flex gap-3">
                        <span className="font-medium text-gray-500 w-24">Year Group:</span>
                        <span>Year {studentData.yearGroup}</span>
                      </div>
                    )}
                    {studentData.class && (
                      <div className="flex gap-3">
                        <span className="font-medium text-gray-500 w-24">Class:</span>
                        <span>{studentData.class}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-500">Email not provided</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-500">Phone not provided</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-gray-500">Address not provided</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Notes</h3>
                <p className="text-gray-500 text-sm">No additional notes available for this student.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfile;
