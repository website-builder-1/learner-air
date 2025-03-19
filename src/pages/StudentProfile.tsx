
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  ArrowLeft, 
  Award, 
  BadgeAlert, 
  Calendar, 
  CheckCircle, 
  Clock, 
  User,
  XCircle,
  BookOpen,
  BarChart
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/UserService';

// Define the student profile interface
interface StudentProfile {
  id: string;
  fullName: string;
  username: string;
  yearGroup?: string;
  class?: string;
}

// Define activity interfaces
interface Activity {
  id: string;
  type: 'reward' | 'sanction';
  description: string;
  points: number;
  teacherId: string;
  teacherName: string;
  date: string;
}

// Get activities from localStorage or initialize
const getActivities = (): Activity[] => {
  const stored = localStorage.getItem('student_activities');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Sample data
  const sampleActivities: Activity[] = [
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
      points: 2,
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
const saveActivities = (activities: Activity[]) => {
  localStorage.setItem('student_activities', JSON.stringify(activities));
};

// Format date for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  
  // Form data for rewards/sanctions
  const [formData, setFormData] = useState({
    description: '',
    points: 1,
  });
  
  // Load student data and activities
  useEffect(() => {
    if (!id) return;
    
    // Get student data
    const studentData = userService.getUserById(id);
    if (studentData && studentData.role === 'student') {
      setStudent(studentData as StudentProfile);
    } else {
      toast.error('Student not found');
      navigate('/dashboard');
      return;
    }
    
    // Get activities for this student
    const allActivities = getActivities();
    const studentActivities = allActivities.filter(activity => activity.id === id);
    setActivities(studentActivities);
    
    setLoading(false);
  }, [id, navigate]);
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      description: '',
      points: 1
    });
  };
  
  // Calculate total points
  const calculatePoints = (type: 'reward' | 'sanction') => {
    return activities
      .filter(activity => activity.type === type)
      .reduce((sum, activity) => sum + activity.points, 0);
  };
  
  // Handle form changes
  const handleChange = (field: string, value: any) => {
    setFormData({...formData, [field]: value});
  };
  
  // Add a reward
  const handleAddReward = () => {
    if (!student || !user) return;
    
    if (!formData.description) {
      toast.error('Please enter a description');
      return;
    }
    
    const newReward: Activity = {
      id: student.id,
      type: 'reward',
      description: formData.description,
      points: formData.points,
      teacherId: user.id,
      teacherName: user.fullName,
      date: new Date().toISOString().split('T')[0]
    };
    
    const allActivities = getActivities();
    const updatedActivities = [newReward, ...allActivities];
    saveActivities(updatedActivities);
    
    // Update local state
    setActivities(prevActivities => [newReward, ...prevActivities]);
    
    toast.success('Reward added successfully');
    setIsRewardModalOpen(false);
    resetFormData();
  };
  
  // Add a sanction
  const handleAddSanction = () => {
    if (!student || !user) return;
    
    if (!formData.description) {
      toast.error('Please enter a description');
      return;
    }
    
    const newSanction: Activity = {
      id: student.id,
      type: 'sanction',
      description: formData.description,
      points: formData.points,
      teacherId: user.id,
      teacherName: user.fullName,
      date: new Date().toISOString().split('T')[0]
    };
    
    const allActivities = getActivities();
    const updatedActivities = [newSanction, ...allActivities];
    saveActivities(updatedActivities);
    
    // Update local state
    setActivities(prevActivities => [newSanction, ...prevActivities]);
    
    toast.success('Sanction added successfully');
    setIsSanctionModalOpen(false);
    resetFormData();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading student profile...</p>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 mb-4">Student not found</p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const rewardsTotal = calculatePoints('reward');
  const sanctionsTotal = calculatePoints('sanction');
  const netPoints = rewardsTotal - sanctionsTotal;
  
  return (
    <div className="pt-8 pb-16">
      <div className="container px-4 mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 inline-flex items-center gap-2 hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Student info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-20 h-20 rounded-full bg-learner-100 flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-learner-500" />
                </div>
                <CardTitle className="text-2xl">{student.fullName}</CardTitle>
                <CardDescription className="text-gray-500">
                  Student
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-t border-b py-4 my-4">
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Username</dt>
                      <dd className="font-medium">{student.username}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Year Group</dt>
                      <dd className="font-medium">{student.yearGroup || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Class</dt>
                      <dd className="font-medium">{student.class || '—'}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center">
                    <div className="text-learner-700 font-bold text-2xl">{activities.length}</div>
                    <div className="text-xs text-gray-500">Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600 font-bold text-2xl">{rewardsTotal}</div>
                    <div className="text-xs text-gray-500">Reward Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-amber-600 font-bold text-2xl">{sanctionsTotal}</div>
                    <div className="text-xs text-gray-500">Sanction Points</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white" 
                    onClick={() => setIsRewardModalOpen(true)}
                    disabled={!user?.permissions.includes('set_rewards') && user?.role !== 'headteacher'}
                  >
                    <Award className="mr-2 h-4 w-4" /> Add Reward
                  </Button>
                  <Button 
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" 
                    onClick={() => setIsSanctionModalOpen(true)}
                    disabled={!user?.permissions.includes('set_sanctions') && user?.role !== 'headteacher'}
                  >
                    <BadgeAlert className="mr-2 h-4 w-4" /> Add Sanction
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Overview</CardTitle>
                <CardDescription>
                  Activity history and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Points Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-3">Points Summary</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${netPoints >= 0 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                        <span className="font-medium">Total Balance:</span>
                      </div>
                      <span className={`font-bold ${netPoints >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                        {netPoints}
                      </span>
                    </div>
                  </div>
                  
                  {/* Activity Tabs */}
                  <Tabs defaultValue="all">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="all">All Activity</TabsTrigger>
                      <TabsTrigger value="rewards">Rewards</TabsTrigger>
                      <TabsTrigger value="sanctions">Sanctions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-4">
                      {activities.length === 0 ? (
                        <div className="text-center py-8">
                          <BarChart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-gray-500">No activity recorded yet</p>
                        </div>
                      ) : (
                        activities.map((activity, index) => (
                          <ActivityCard key={`${activity.id}-${index}`} activity={activity} />
                        ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="rewards" className="space-y-4">
                      {activities.filter(a => a.type === 'reward').length === 0 ? (
                        <div className="text-center py-8">
                          <Award className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-gray-500">No rewards recorded yet</p>
                        </div>
                      ) : (
                        activities
                          .filter(a => a.type === 'reward')
                          .map((activity, index) => (
                            <ActivityCard key={`${activity.id}-reward-${index}`} activity={activity} />
                          ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="sanctions" className="space-y-4">
                      {activities.filter(a => a.type === 'sanction').length === 0 ? (
                        <div className="text-center py-8">
                          <BadgeAlert className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                          <p className="text-gray-500">No sanctions recorded yet</p>
                        </div>
                      ) : (
                        activities
                          .filter(a => a.type === 'sanction')
                          .map((activity, index) => (
                            <ActivityCard key={`${activity.id}-sanction-${index}`} activity={activity} />
                          ))
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Add Reward Modal */}
        <Dialog open={isRewardModalOpen} onOpenChange={setIsRewardModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Reward</DialogTitle>
              <DialogDescription>
                Recognize positive behavior and achievements
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the positive behavior or achievement"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="points">Points</Label>
                <Select 
                  value={formData.points.toString()} 
                  onValueChange={(value) => handleChange('points', parseInt(value))}
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
                onClick={handleAddReward}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Add Reward
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Add Sanction Modal */}
        <Dialog open={isSanctionModalOpen} onOpenChange={setIsSanctionModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Sanction</DialogTitle>
              <DialogDescription>
                Document behavior that needs improvement
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sanctionDescription">Description</Label>
                <Textarea
                  id="sanctionDescription"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the behavior requiring improvement"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sanctionPoints">Points</Label>
                <Select 
                  value={formData.points.toString()} 
                  onValueChange={(value) => handleChange('points', parseInt(value))}
                >
                  <SelectTrigger id="sanctionPoints">
                    <SelectValue placeholder="Select points" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Point Values</SelectLabel>
                      <SelectItem value="1">1 Point</SelectItem>
                      <SelectItem value="2">2 Points</SelectItem>
                      <SelectItem value="3">3 Points</SelectItem>
                      <SelectItem value="5">5 Points</SelectItem>
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
                onClick={handleAddSanction}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <XCircle className="mr-2 h-4 w-4" /> Add Sanction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Activity card component
const ActivityCard = ({ activity }: { activity: Activity }) => {
  const isReward = activity.type === 'reward';
  
  return (
    <Card className={`border-l-4 ${isReward ? 'border-l-green-500' : 'border-l-amber-500'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isReward ? 
                <Award className="text-green-500" size={18} /> : 
                <BadgeAlert className="text-amber-500" size={18} />
              }
              <span className={`text-sm font-medium ${isReward ? 'text-green-600' : 'text-amber-600'}`}>
                {isReward ? 'Reward' : 'Sanction'} • {activity.points} points
              </span>
            </div>
            <p className="font-medium mb-1">{activity.description}</p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{activity.teacherName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(activity.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfile;
