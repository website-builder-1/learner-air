
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Award, 
  AlertTriangle, 
  Calendar, 
  Download,
  User,
  Filter
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface Activity {
  id: string;
  type: 'reward' | 'sanction';
  description: string;
  points?: number;
  sanctionType?: string;
  teacherId: string;
  teacherName: string;
  date: string;
  studentId?: string;
  studentName?: string;
  yearGroup?: string;
  class?: string;
}

const ActivityPage = () => {
  const { user, hasPermission } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [filterType, setFilterType] = useState<'all' | 'reward' | 'sanction'>('all');
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterYearGroup, setFilterYearGroup] = useState<string>('');
  const [filterClass, setFilterClass] = useState<string>('');
  
  // Statistics
  const [stats, setStats] = useState({
    totalRewards: 0,
    totalSanctions: 0,
    yearGroupStats: {} as Record<string, { rewards: number, sanctions: number }>,
    classStats: {} as Record<string, { rewards: number, sanctions: number }>,
    sanctionTypeStats: {} as Record<string, number>,
  });

  useEffect(() => {
    if (!user) return;
    
    // Load activities
    const loadActivities = () => {
      const stored = localStorage.getItem('student_activities');
      if (stored) {
        const allActivities = JSON.parse(stored);
        
        // Enhance activities with student info
        const enhancedActivities = allActivities.map((activity: Activity) => {
          const student = users.find(u => u.id === activity.id);
          if (student) {
            return {
              ...activity,
              studentId: student.id,
              studentName: student.fullName,
              yearGroup: student.yearGroup,
              class: student.class
            };
          }
          return activity;
        });
        
        setActivities(enhancedActivities);
        setFilteredActivities(enhancedActivities);
      }
    };
    
    // Load users
    const loadUsers = () => {
      const stored = localStorage.getItem('users');
      if (stored) {
        const allUsers = JSON.parse(stored);
        setUsers(allUsers);
        
        // After loading users, load activities
        loadActivities();
      }
    };
    
    loadUsers();
    setLoading(false);
  }, [user]);

  // Apply filters when any filter changes
  useEffect(() => {
    if (activities.length === 0) return;
    
    let filtered = [...activities];
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }
    
    // Filter by date
    if (filterDate) {
      const dateStr = format(filterDate, 'yyyy-MM-dd');
      filtered = filtered.filter(activity => activity.date === dateStr);
    }
    
    // Filter by year group
    if (filterYearGroup) {
      filtered = filtered.filter(activity => activity.yearGroup === filterYearGroup);
    }
    
    // Filter by class
    if (filterClass) {
      filtered = filtered.filter(activity => activity.class === filterClass);
    }
    
    setFilteredActivities(filtered);
    calculateStats(filtered);
  }, [activities, filterType, filterDate, filterYearGroup, filterClass]);

  // Calculate statistics based on filtered activities
  const calculateStats = (filteredActivities: Activity[]) => {
    const stats = {
      totalRewards: 0,
      totalSanctions: 0,
      yearGroupStats: {} as Record<string, { rewards: number, sanctions: number }>,
      classStats: {} as Record<string, { rewards: number, sanctions: number }>,
      sanctionTypeStats: {} as Record<string, number>,
    };
    
    filteredActivities.forEach(activity => {
      // Count total rewards and sanctions
      if (activity.type === 'reward') {
        stats.totalRewards++;
      } else {
        stats.totalSanctions++;
        
        // Track sanction types
        if (activity.sanctionType) {
          stats.sanctionTypeStats[activity.sanctionType] = 
            (stats.sanctionTypeStats[activity.sanctionType] || 0) + 1;
        }
      }
      
      // Track by year group
      if (activity.yearGroup) {
        if (!stats.yearGroupStats[activity.yearGroup]) {
          stats.yearGroupStats[activity.yearGroup] = { rewards: 0, sanctions: 0 };
        }
        
        if (activity.type === 'reward') {
          stats.yearGroupStats[activity.yearGroup].rewards++;
        } else {
          stats.yearGroupStats[activity.yearGroup].sanctions++;
        }
      }
      
      // Track by class
      if (activity.class) {
        if (!stats.classStats[activity.class]) {
          stats.classStats[activity.class] = { rewards: 0, sanctions: 0 };
        }
        
        if (activity.type === 'reward') {
          stats.classStats[activity.class].rewards++;
        } else {
          stats.classStats[activity.class].sanctions++;
        }
      }
    });
    
    setStats(stats);
  };

  // Get unique year groups and classes for filters
  const getYearGroups = () => {
    const yearGroups = new Set<string>();
    users.forEach(user => {
      if (user.yearGroup) yearGroups.add(user.yearGroup);
    });
    return Array.from(yearGroups).sort();
  };
  
  const getClasses = () => {
    const classes = new Set<string>();
    users.forEach(user => {
      if (user.class) classes.add(user.class);
    });
    return Array.from(classes).sort();
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterType('all');
    setFilterDate(undefined);
    setFilterYearGroup('');
    setFilterClass('');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-medium mb-2">
          Activity Tracking
        </h1>
        <p className="text-gray-500">
          Track and analyze student rewards and sanctions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - filters and stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Filter size={18} /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Activity Type</label>
                <Select value={filterType} onValueChange={(value: 'all' | 'reward' | 'sanction') => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="reward">Rewards Only</SelectItem>
                    <SelectItem value="sanction">Sanctions Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {filterDate ? format(filterDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={filterDate}
                      onSelect={setFilterDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Year Group</label>
                <Select value={filterYearGroup} onValueChange={setFilterYearGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Year Groups</SelectItem>
                    {getYearGroups().map(year => (
                      <SelectItem key={year} value={year}>Year {year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Class</label>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    {getClasses().map(cls => (
                      <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset Filters
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <Award size={16} />
                      <span className="font-medium">Rewards</span>
                    </div>
                    <div className="text-2xl font-medium">{stats.totalRewards}</div>
                  </div>
                  
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-600 mb-1">
                      <AlertTriangle size={16} />
                      <span className="font-medium">Sanctions</span>
                    </div>
                    <div className="text-2xl font-medium">{stats.totalSanctions}</div>
                  </div>
                </div>
                
                {Object.keys(stats.sanctionTypeStats).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Sanction Types</h3>
                    <div className="space-y-2">
                      {Object.entries(stats.sanctionTypeStats)
                        .sort(([, a], [, b]) => b - a)
                        .map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-sm">{type}</span>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - activity list */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="list">
            <TabsList className="mb-4">
              <TabsTrigger value="list">Activity List</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="mx-auto h-12 w-12 text-gray-300 mb-3 flex items-center justify-center">
                    {filterType === 'reward' ? <Award size={36} /> : 
                     filterType === 'sanction' ? <AlertTriangle size={36} /> :
                     <Calendar size={36} />}
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No activities found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      Showing {filteredActivities.length} activities
                    </span>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download size={16} /> Export
                    </Button>
                  </div>
                  
                  {filteredActivities.map((activity, index) => (
                    <Card key={`${activity.id}-${index}`} className={`border-l-4 ${activity.type === 'reward' ? 'border-l-green-500' : 'border-l-amber-500'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {activity.type === 'reward' ? 
                                <Award className="text-green-500" size={18} /> : 
                                <AlertTriangle className="text-amber-500" size={18} />
                              }
                              <span className={`text-sm font-medium ${activity.type === 'reward' ? 'text-green-600' : 'text-amber-600'}`}>
                                {activity.type === 'reward' ? 
                                  `Reward • ${activity.points || 1} points` : 
                                  `Sanction • ${activity.sanctionType || 'General'}`}
                              </span>
                            </div>
                            <p className="font-medium mb-1">{activity.description}</p>
                            <div className="flex gap-6 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <User size={14} />
                                {activity.studentName || 'Unknown Student'}
                              </span>
                              {activity.yearGroup && (
                                <span>Year {activity.yearGroup}</span>
                              )}
                              {activity.class && (
                                <span>Class {activity.class}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(activity.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Distribution</CardTitle>
                  <CardDescription>
                    Breakdown by year group and class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(stats.yearGroupStats).length > 0 ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">By Year Group</h3>
                        <div className="space-y-3">
                          {Object.entries(stats.yearGroupStats).map(([yearGroup, data]) => (
                            <div key={yearGroup} className="bg-gray-50 p-3 rounded-lg">
                              <div className="font-medium mb-2">Year {yearGroup}</div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                  <span className="text-sm">Rewards: {data.rewards}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                                  <span className="text-sm">Sanctions: {data.sanctions}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {Object.keys(stats.classStats).length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">By Class</h3>
                          <div className="space-y-3">
                            {Object.entries(stats.classStats).map(([className, data]) => (
                              <div key={className} className="bg-gray-50 p-3 rounded-lg">
                                <div className="font-medium mb-2">Class {className}</div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm">Rewards: {data.rewards}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                                    <span className="text-sm">Sanctions: {data.sanctions}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No data available for the selected filters</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
