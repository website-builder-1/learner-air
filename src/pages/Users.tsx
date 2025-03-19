
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { useAuth, Permission, UserRole } from '@/context/AuthContext';
import { userService } from '@/services/UserService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Permission option list
const permissionOptions: { value: Permission; label: string }[] = [
  { value: 'add_users', label: 'Add & manage users' },
  { value: 'view_all_users', label: 'View all users' },
  { value: 'view_user_credentials', label: 'View login credentials' },
  { value: 'manage_permissions', label: 'Manage user permissions' },
  { value: 'set_homework', label: 'Assign homework' },
  { value: 'set_sanctions', label: 'Issue sanctions' },
  { value: 'set_rewards', label: 'Issue rewards' },
  { value: 'make_announcements', label: 'Make announcements' },
];

// Tab interface
interface Tab {
  value: 'all' | 'teachers' | 'students';
  label: string;
}

const tabs: Tab[] = [
  { value: 'all', label: 'All Users' },
  { value: 'teachers', label: 'Teachers' },
  { value: 'students', label: 'Students' },
];

const Users = () => {
  const { user, hasPermission } = useAuth();
  const [users, setUsers] = useState(userService.getAllUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab['value']>('all');
  const [showPasswordsMap, setShowPasswordsMap] = useState<Record<string, boolean>>({});
  
  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isViewCredentialsOpen, setIsViewCredentialsOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    password: '',
    fullName: '',
    role: 'student' as UserRole,
    permissions: [] as Permission[],
    yearGroup: '',
    class: ''
  });
  
  // Get all credentials when viewing them
  const [credentials, setCredentials] = useState<{ id: string; username: string; password: string; fullName: string }[]>([]);
  
  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      username: '',
      password: '',
      fullName: '',
      role: 'student',
      permissions: [],
      yearGroup: '',
      class: ''
    });
  };
  
  // Open add user modal
  const openAddUserModal = () => {
    resetForm();
    setIsAddUserOpen(true);
  };
  
  // Open edit user modal
  const openEditUserModal = (userId: string) => {
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      setFormData({
        id: userToEdit.id,
        username: userToEdit.username,
        password: '', // We don't display password
        fullName: userToEdit.fullName,
        role: userToEdit.role,
        permissions: [...userToEdit.permissions],
        yearGroup: userToEdit.yearGroup || '',
        class: userToEdit.class || ''
      });
      setIsEditUserOpen(true);
    }
  };
  
  // Open delete user modal
  const openDeleteUserModal = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete) {
      setFormData({...formData, id: userId, fullName: userToDelete.fullName});
      setIsDeleteUserOpen(true);
    }
  };
  
  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData({...formData, [field]: value});
  };
  
  // Toggle permission in form
  const togglePermission = (permission: Permission) => {
    if (formData.permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permission)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission]
      });
    }
  };
  
  // Create user
  const handleCreateUser = () => {
    if (!formData.username || !formData.password || !formData.fullName) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const success = userService.createUser({
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role,
      permissions: formData.permissions,
      yearGroup: formData.yearGroup,
      class: formData.class
    });
    
    if (success) {
      setIsAddUserOpen(false);
      resetForm();
      setUsers(userService.getAllUsers()); // Refresh user list
    }
  };
  
  // Update user
  const handleUpdateUser = () => {
    if (!formData.fullName) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const updateData = {
      fullName: formData.fullName,
      role: formData.role,
      permissions: formData.permissions,
      yearGroup: formData.yearGroup,
      class: formData.class
    };
    
    // Add password to update only if it was provided
    if (formData.password) {
      Object.assign(updateData, { password: formData.password });
    }
    
    const success = userService.updateUser(formData.id, updateData);
    
    if (success) {
      setIsEditUserOpen(false);
      resetForm();
      setUsers(userService.getAllUsers()); // Refresh user list
    }
  };
  
  // Delete user
  const handleDeleteUser = () => {
    if (user?.id === formData.id) {
      toast.error("You cannot delete your own account");
      return;
    }
    
    const success = userService.deleteUser(formData.id);
    
    if (success) {
      setIsDeleteUserOpen(false);
      resetForm();
      setUsers(userService.getAllUsers()); // Refresh user list
    }
  };
  
  // View credentials
  const handleViewCredentials = () => {
    if (hasPermission('view_user_credentials')) {
      const userCredentials = userService.getUserCredentials();
      setCredentials(userCredentials);
      setIsViewCredentialsOpen(true);
    } else {
      toast.error("You don't have permission to view credentials");
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (userId: string) => {
    setShowPasswordsMap(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };
  
  // Filter users based on search and active tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || user.role === activeTab.slice(0, -1); // Remove 's' from tab name to match role
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="pt-8 pb-16">
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-medium mb-2">
            User Management
          </h1>
          <p className="text-gray-500">
            Add, edit, and manage users in your organization
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Users</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={openAddUserModal}
                  className="bg-learner-500 hover:bg-learner-600 transition-colors flex items-center gap-1"
                >
                  <UserPlus size={16} /> Add User
                </Button>
                {hasPermission('view_user_credentials') && (
                  <Button 
                    variant="outline" 
                    onClick={handleViewCredentials}
                    className="border-learner-200 text-learner-700 hover:bg-learner-50"
                  >
                    View Credentials
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Tabs */}
            <div className="flex space-x-1 border-b mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.value
                      ? 'border-learner-500 text-learner-700'
                      : 'border-transparent text-gray-600 hover:text-learner-600 hover:border-learner-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Users table */}
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Username</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      {activeTab === 'students' ? 'Year / Class' : 'Permissions'}
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{user.fullName}</td>
                        <td className="px-4 py-3 text-gray-500">{user.username}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            user.role === 'headteacher' 
                              ? 'bg-purple-100 text-purple-700' 
                              : user.role === 'teacher'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {user.role === 'student' ? (
                            <span className="text-gray-500">
                              {user.yearGroup ? `Year ${user.yearGroup}` : '—'} 
                              {user.class ? ` / ${user.class}` : ''}
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {user.permissions.length > 0 ? (
                                <>
                                  {user.permissions.length > 2 ? (
                                    <>
                                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                                        {user.permissions[0].split('_').join(' ')}
                                      </span>
                                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                                        {user.permissions[1].split('_').join(' ')}
                                      </span>
                                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                                        +{user.permissions.length - 2} more
                                      </span>
                                    </>
                                  ) : (
                                    user.permissions.map((permission, index) => (
                                      <span 
                                        key={index} 
                                        className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs"
                                      >
                                        {permission.split('_').join(' ')}
                                      </span>
                                    ))
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400">No permissions</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openEditUserModal(user.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openDeleteUserModal(user.id)}
                                className="text-red-600 focus:text-red-600"
                                disabled={user.id === '1'} // Prevent deleting the main headteacher
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Add User Modal */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and set their permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Jane Smith"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="jsmith"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleChange('role', value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User Roles</SelectLabel>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.role === 'student' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="yearGroup">Year Group</Label>
                    <Input
                      id="yearGroup"
                      value={formData.yearGroup}
                      onChange={(e) => handleChange('yearGroup', e.target.value)}
                      placeholder="10"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="class">Class</Label>
                    <Input
                      id="class"
                      value={formData.class}
                      onChange={(e) => handleChange('class', e.target.value)}
                      placeholder="10A"
                    />
                  </div>
                </div>
              )}
              
              {formData.role === 'teacher' && (
                <div className="grid gap-2">
                  <Label className="mb-1">Permissions</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {permissionOptions.map((permission) => (
                      <div key={permission.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={permission.value} 
                          checked={formData.permissions.includes(permission.value)}
                          onCheckedChange={() => togglePermission(permission.value)}
                        />
                        <label
                          htmlFor={permission.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateUser}
                className="bg-learner-500 hover:bg-learner-600"
              >
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit User Modal */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user details and permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editFullName">Full Name</Label>
                <Input
                  id="editFullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="editUsername">Username</Label>
                <Input
                  id="editUsername"
                  value={formData.username}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Username cannot be changed</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="editPassword">New Password (leave blank to keep current)</Label>
                <Input
                  id="editPassword"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="editRole">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleChange('role', value as UserRole)}
                  disabled={formData.id === '1'} // Don't allow changing headteacher role
                >
                  <SelectTrigger id="editRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User Roles</SelectLabel>
                      {formData.id === '1' ? (
                        <SelectItem value="headteacher">Headteacher</SelectItem>
                      ) : (
                        <>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.role === 'student' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editYearGroup">Year Group</Label>
                    <Input
                      id="editYearGroup"
                      value={formData.yearGroup}
                      onChange={(e) => handleChange('yearGroup', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="editClass">Class</Label>
                    <Input
                      id="editClass"
                      value={formData.class}
                      onChange={(e) => handleChange('class', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {(formData.role === 'teacher' || formData.role === 'headteacher') && (
                <div className="grid gap-2">
                  <Label className="mb-1">Permissions</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {permissionOptions.map((permission) => (
                      <div key={permission.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`edit-${permission.value}`} 
                          checked={formData.permissions.includes(permission.value)}
                          onCheckedChange={() => togglePermission(permission.value)}
                          disabled={formData.id === '1'} // Don't allow changing headteacher permissions
                        />
                        <label
                          htmlFor={`edit-${permission.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formData.id === '1' && (
                    <p className="text-xs text-gray-500">Headteacher permissions cannot be changed</p>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateUser}
                className="bg-learner-500 hover:bg-learner-600"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete User Confirmation Modal */}
        <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-center font-medium">{formData.fullName}</p>
            </div>
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button 
                onClick={handleDeleteUser}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* View Credentials Modal */}
        <Dialog open={isViewCredentialsOpen} onOpenChange={setIsViewCredentialsOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>User Credentials</DialogTitle>
              <DialogDescription>
                View all user login credentials. Handle with care.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Name</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Username</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {credentials.map((cred) => (
                      <tr key={cred.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{cred.fullName}</td>
                        <td className="px-4 py-2 text-gray-500">{cred.username}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {showPasswordsMap[cred.id] ? (
                              <span>{cred.password}</span>
                            ) : (
                              <span>••••••••</span>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => togglePasswordVisibility(cred.id)}
                            >
                              {showPasswordsMap[cred.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsViewCredentialsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Users;
