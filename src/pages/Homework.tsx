
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Check, 
  Clock,
  FileText,
  Paperclip
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface HomeworkAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface HomeworkItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  class?: string;
  attachments?: HomeworkAttachment[];
  completed?: boolean;
}

const Homework = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load homework data
    const storedHomeworks = localStorage.getItem('homeworks');
    if (storedHomeworks) {
      let allHomeworks = JSON.parse(storedHomeworks);
      
      // Get student completion status
      const completionStatus = localStorage.getItem(`homework_completion_${user.id}`);
      const completedHomeworks = completionStatus ? JSON.parse(completionStatus) : {};
      
      // Mark completed homeworks
      allHomeworks = allHomeworks.map(hw => ({
        ...hw,
        completed: completedHomeworks[hw.id] || false
      }));
      
      setHomeworks(allHomeworks);
    }
    
    setLoading(false);
  }, [user, navigate]);

  const markAsCompleted = (homeworkId: string) => {
    // Update local state
    const updatedHomeworks = homeworks.map(hw => 
      hw.id === homeworkId ? { ...hw, completed: true } : hw
    );
    setHomeworks(updatedHomeworks);
    
    // Save completion status to localStorage
    const completionStatus = localStorage.getItem(`homework_completion_${user?.id}`) || '{}';
    const completedHomeworks = JSON.parse(completionStatus);
    completedHomeworks[homeworkId] = true;
    localStorage.setItem(`homework_completion_${user?.id}`, JSON.stringify(completedHomeworks));
    
    toast.success("Homework marked as completed!");
  };

  // Format due date for display
  const formatDueDate = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff <= 0) return "Due today";
    if (daysDiff === 1) return "Due tomorrow";
    return `Due in ${daysDiff} days`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium mb-2">
          My Homework
        </h1>
        <p className="text-gray-500">
          View and manage your assigned homework
        </p>
      </div>

      {homeworks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No homework assignments</h3>
          <p className="text-gray-500">You don't have any homework assigned at the moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeworks.map((homework) => (
            <Card key={homework.id} className={`${homework.completed ? 'border-green-200 bg-green-50' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{homework.title}</CardTitle>
                  {homework.completed && (
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                      <Check size={14} className="mr-1" /> Completed
                    </div>
                  )}
                </div>
                <CardDescription>{homework.subject} {homework.class && `• Class ${homework.class}`}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-700">{homework.description}</p>
                </div>
                
                {homework.attachments && homework.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Paperclip size={16} className="mr-1" /> Attachments
                    </h4>
                    <div className="space-y-2">
                      {homework.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                          <FileText size={16} className="text-gray-500" />
                          <span className="text-sm truncate">{attachment.name}</span>
                          <a 
                            href={attachment.url} 
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto text-xs text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock size={16} className="mr-1" /> {formatDueDate(homework.dueDate)}
                  </div>
                  {!homework.completed && (
                    <Button 
                      onClick={() => markAsCompleted(homework.id)}
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                    >
                      <Check size={16} className="mr-1" /> Mark as completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Homework;
