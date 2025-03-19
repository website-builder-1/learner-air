
import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Search,
  Plus,
  ChevronDown,
  Calendar,
  User,
  Users,
  School,
  Target,
  MoreHorizontal,
  Trash2,
  PenSquare,
  Check
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data for announcements
const INITIAL_ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'School Closure - Staff Training Day',
    content: 'Please be informed that the school will be closed on Friday, September 20th for a staff training day. Classes will resume as normal on Monday, September 23rd. Thank you for your understanding.',
    date: '2023-09-12',
    author: 'Head Teacher',
    authorId: '1',
    target: 'all',
    targetSpecific: null
  },
  {
    id: '2',
    title: 'Science Fair Registration Open',
    content: 'Registration for the annual Science Fair is now open! Students interested in participating should register by October 5th. For more details, please see the Science Department or check the school website.',
    date: '2023-09-10',
    author: 'Ms. Davis',
    authorId: '2',
    target: 'students',
    targetSpecific: null
  },
  {
    id: '3',
    title: 'Year 10 Parents Evening',
    content: 'A reminder that Year 10 Parents Evening will be held next Thursday from 4:30pm to 7:00pm in the main hall. Appointment schedules have been sent home with students.',
    date: '2023-09-05',
    author: 'Head Teacher',
    authorId: '1',
    target: 'year',
    targetSpecific: '10'
  }
];

// Get announcements from localStorage or use initial data
const getAnnouncements = () => {
  const stored = localStorage.getItem('announcements');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
  return INITIAL_ANNOUNCEMENTS;
};

// Save announcements to localStorage
const saveAnnouncements = (announcements: any[]) => {
  localStorage.setItem('announcements', JSON.stringify(announcements));
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

// Get target display text
const getTargetDisplay = (target: string, specific?: string | null) => {
  switch (target) {
    case 'all':
      return 'All School';
    case 'teachers':
      return 'All Teachers';
    case 'students':
      return 'All Students';
    case 'year':
      return `Year ${specific}`;
    case 'class':
      return `Class ${specific}`;
    default:
      return 'Unknown';
  }
};

// Target icon component
const TargetIcon = ({ target }: { target: string }) => {
  switch (target) {
    case 'all':
      return <School size={16} />;
    case 'teachers':
      return <User size={16} />;
    case 'students':
      return <Users size={16} />;
    case 'year':
    case 'class':
      return <Target size={16} />;
    default:
      return <Bell size={16} />;
  }
};

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState(getAnnouncements());
  const [searchQuery, setSearchQuery] = useState('');
  const canMakeAnnouncements = user?.permissions.includes('make_announcements') || user?.role === 'headteacher';
  
  // Add/edit announcement modal
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    content: '',
    target: 'all',
    targetSpecific: '',
  });
  
  // Filter announcements based on search
  const filteredAnnouncements = announcements.filter(ann => 
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      id: '',
      title: '',
      content: '',
      target: 'all',
      targetSpecific: '',
    });
  };
  
  // Open the create announcement modal
  const openCreateModal = () => {
    resetFormData();
    setIsEditing(false);
    setIsAnnouncementModalOpen(true);
  };
  
  // Open the edit announcement modal
  const openEditModal = (id: string) => {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      setFormData({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        target: announcement.target,
        targetSpecific: announcement.targetSpecific || '',
      });
      setIsEditing(true);
      setIsAnnouncementModalOpen(true);
    }
  };
  
  // Open the delete confirmation modal
  const openDeleteModal = (id: string) => {
    setFormData({ ...formData, id });
    setIsDeleteModalOpen(true);
  };
  
  // Handle form input changes
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };
  
  // Handle announcement submission
  const handleSubmitAnnouncement = () => {
    // Validate form
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if ((formData.target === 'year' || formData.target === 'class') && !formData.targetSpecific) {
      toast.error('Please specify the target year or class');
      return;
    }
    
    // Create new announcement or update existing one
    if (isEditing) {
      // Update existing announcement
      const updatedAnnouncements = announcements.map(ann => 
        ann.id === formData.id 
          ? { 
              ...ann, 
              title: formData.title, 
              content: formData.content, 
              target: formData.target,
              targetSpecific: formData.targetSpecific || null
            } 
          : ann
      );
      
      setAnnouncements(updatedAnnouncements);
      saveAnnouncements(updatedAnnouncements);
      toast.success('Announcement updated successfully');
    } else {
      // Create new announcement
      const newAnnouncement = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        date: new Date().toISOString().split('T')[0],
        author: user?.fullName || 'Unknown',
        authorId: user?.id || '0',
        target: formData.target,
        targetSpecific: formData.targetSpecific || null
      };
      
      const updatedAnnouncements = [newAnnouncement, ...announcements];
      setAnnouncements(updatedAnnouncements);
      saveAnnouncements(updatedAnnouncements);
      toast.success('Announcement created successfully');
    }
    
    setIsAnnouncementModalOpen(false);
    resetFormData();
  };
  
  // Handle announcement deletion
  const handleDeleteAnnouncement = () => {
    const updatedAnnouncements = announcements.filter(ann => ann.id !== formData.id);
    setAnnouncements(updatedAnnouncements);
    saveAnnouncements(updatedAnnouncements);
    setIsDeleteModalOpen(false);
    toast.success('Announcement deleted successfully');
  };

  return (
    <div className="pt-8 pb-16">
      <div className="container px-4 mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-medium mb-2">
              Announcements
            </h1>
            <p className="text-gray-500">
              Stay updated with important school information
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search announcements..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {canMakeAnnouncements && (
              <Button 
                onClick={openCreateModal}
                className="bg-learner-500 hover:bg-learner-600 transition-colors flex items-center gap-1"
              >
                <Plus size={16} /> New Announcement
              </Button>
            )}
          </div>
        </div>
        
        {/* Announcements list */}
        <div className="space-y-6">
          {filteredAnnouncements.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center">
                <Bell className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No announcements found</h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  {searchQuery 
                    ? `No announcements match your search for "${searchQuery}"`
                    : "There are no announcements available at the moment."}
                </p>
                {canMakeAnnouncements && searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="overflow-hidden">
                <div className="flex justify-between items-start p-6">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-medium">{announcement.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{formatDate(announcement.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} />
                        <span>{announcement.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TargetIcon target={announcement.target} />
                        <span>
                          {getTargetDisplay(announcement.target, announcement.targetSpecific)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions dropdown for announcement author */}
                  {(user?.id === announcement.authorId || user?.role === 'headteacher') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditModal(announcement.id)}>
                          <PenSquare className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteModal(announcement.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                <CardContent className="border-t pt-4 pb-6">
                  <p className="text-gray-700 whitespace-pre-line">{announcement.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {/* Create/Edit Announcement Modal */}
        <Dialog open={isAnnouncementModalOpen} onOpenChange={setIsAnnouncementModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? 'Update the announcement details below.'
                  : 'Fill in the details for your new announcement.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter announcement title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Enter announcement content"
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="target">Target Audience</Label>
                <Select 
                  value={formData.target} 
                  onValueChange={(value) => handleChange('target', value)}
                >
                  <SelectTrigger id="target">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Target Audience</SelectLabel>
                      <SelectItem value="all">All School</SelectItem>
                      <SelectItem value="teachers">All Teachers</SelectItem>
                      <SelectItem value="students">All Students</SelectItem>
                      <SelectItem value="year">Specific Year</SelectItem>
                      <SelectItem value="class">Specific Class</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              {(formData.target === 'year' || formData.target === 'class') && (
                <div className="grid gap-2">
                  <Label htmlFor="targetSpecific">
                    {formData.target === 'year' ? 'Year Group' : 'Class Name'}
                  </Label>
                  <Input
                    id="targetSpecific"
                    value={formData.targetSpecific}
                    onChange={(e) => handleChange('targetSpecific', e.target.value)}
                    placeholder={formData.target === 'year' ? 'e.g. 10' : 'e.g. 10A'}
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAnnouncementModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitAnnouncement}
                className="bg-learner-500 hover:bg-learner-600"
              >
                {isEditing ? 'Update' : 'Publish'} Announcement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Announcement</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this announcement? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteAnnouncement}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Announcement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Announcements;
