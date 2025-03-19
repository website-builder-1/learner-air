
import React, { useState, useMemo } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userService } from "@/services/UserService";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const StudentSearch = () => {
  const { user } = useAuth();
  const [nameSearch, setNameSearch] = useState('');
  const [selectedYearGroup, setSelectedYearGroup] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');

  // Get all users
  const allUsers = useMemo(() => userService.getAllUsers(), []);

  // Filter students only
  const allStudents = useMemo(() => {
    return allUsers.filter(user => user.role === 'student');
  }, [allUsers]);

  // Get unique year groups and classes for filter dropdowns
  const yearGroups = useMemo(() => {
    const years = [...new Set(allStudents.map(student => student.yearGroup).filter(Boolean))];
    return years.sort();
  }, [allStudents]);

  const classes = useMemo(() => {
    let filteredStudents = allStudents;
    
    // If year group is selected, only show classes from that year
    if (selectedYearGroup) {
      filteredStudents = allStudents.filter(student => student.yearGroup === selectedYearGroup);
    }
    
    const uniqueClasses = [...new Set(filteredStudents.map(student => student.class).filter(Boolean))];
    return uniqueClasses.sort();
  }, [allStudents, selectedYearGroup]);

  // Filter students based on search criteria
  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      // Filter by name/surname
      const nameMatch = !nameSearch || 
        student.fullName.toLowerCase().includes(nameSearch.toLowerCase());
      
      // Filter by year group
      const yearMatch = !selectedYearGroup || 
        student.yearGroup === selectedYearGroup;
      
      // Filter by class
      const classMatch = !selectedClass || 
        student.class === selectedClass;
      
      return nameMatch && yearMatch && classMatch;
    });
  }, [allStudents, nameSearch, selectedYearGroup, selectedClass]);

  // Reset filters
  const resetFilters = () => {
    setNameSearch('');
    setSelectedYearGroup('');
    setSelectedClass('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Student Search</h1>
      
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Name search */}
          <div className="space-y-2">
            <Label htmlFor="nameSearch">Name / Surname</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="nameSearch"
                type="text"
                placeholder="Search by name..."
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {/* Year group filter */}
          <div className="space-y-2">
            <Label htmlFor="yearGroup">Year Group</Label>
            <Select value={selectedYearGroup} onValueChange={setSelectedYearGroup}>
              <SelectTrigger id="yearGroup">
                <SelectValue placeholder="Select year group" />
              </SelectTrigger>
              <SelectContent>
                {yearGroups.map(year => (
                  <SelectItem key={year} value={year}>
                    Year {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Class filter */}
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Reset button */}
          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="w-full md:w-auto"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Results */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Search Results ({filteredStudents.length} students)
        </h2>
        
        {filteredStudents.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Year Group</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.fullName}</TableCell>
                    <TableCell>{student.yearGroup || '-'}</TableCell>
                    <TableCell>{student.class || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link to={`/student-profile/${student.id}`}>View Profile</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">No students match your search criteria</p>
            <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSearch;
