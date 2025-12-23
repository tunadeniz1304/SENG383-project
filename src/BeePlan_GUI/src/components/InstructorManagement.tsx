import { useState } from 'react';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Badge } from './ui/badge';

const sampleInstructors = [
  { 
    id: 1, 
    name: 'Dr. Smith', 
    department: 'Software Engineering',
    type: 'Full-time',
    weeklyLoad: 12,
    availability: {
      'Monday': ['08:40-09:30', '09:40-10:30', '10:40-11:30', '11:40-12:30'],
      'Tuesday': ['08:40-09:30', '09:40-10:30', '10:40-11:30'],
      'Wednesday': ['08:40-09:30', '09:40-10:30', '10:40-11:30', '11:40-12:30'],
      'Thursday': ['08:40-09:30', '09:40-10:30'],
      'Friday': ['08:40-09:30', '09:40-10:30', '10:40-11:30']
    }
  },
  { 
    id: 2, 
    name: 'Dr. Johnson', 
    department: 'Mathematics',
    type: 'Full-time',
    weeklyLoad: 8,
    availability: {
      'Monday': ['10:40-11:30', '11:40-12:30', '14:40-15:30'],
      'Tuesday': ['10:40-11:30', '11:40-12:30'],
      'Wednesday': ['10:40-11:30', '11:40-12:30', '14:40-15:30'],
      'Thursday': ['10:40-11:30', '11:40-12:30'],
      'Friday': ['08:40-09:30', '09:40-10:30']
    }
  },
  { 
    id: 3, 
    name: 'Prof. Williams', 
    department: 'Software Engineering',
    type: 'Part-time',
    weeklyLoad: 4,
    availability: {
      'Monday': [],
      'Tuesday': ['14:40-15:30', '15:40-16:30', '16:40-17:30'],
      'Wednesday': [],
      'Thursday': ['14:40-15:30', '15:40-16:30'],
      'Friday': []
    }
  },
];

const timeSlots = [
  '08:40-09:30',
  '09:40-10:30',
  '10:40-11:30',
  '11:40-12:30',
  '12:40-13:30',
  '14:40-15:30',
  '15:40-16:30',
  '16:40-17:30'
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function InstructorManagement() {
  const [instructors, setInstructors] = useState(sampleInstructors);
  const [selectedInstructor, setSelectedInstructor] = useState(sampleInstructors[0]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Instructor Management</h2>
          <p className="text-gray-500 text-sm">Manage instructors and their availability</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-amber-500 hover:bg-amber-600">
              <Plus className="w-4 h-4" />
              Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Instructor</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="instructor-name">Name</Label>
                <Input id="instructor-name" placeholder="e.g., Dr. Smith" />
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="e.g., Computer Engineering" />
              </div>
              
              <div>
                <Label htmlFor="instructor-type">Type</Label>
                <Select>
                  <SelectTrigger id="instructor-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="parttime">Part-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="weekly-load">Weekly Course Load (hours)</Label>
                <Input id="weekly-load" type="number" placeholder="0" />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600">
                Add Instructor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Instructors List */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">Instructors</h3>
          <div className="space-y-2">
            {instructors.map((instructor) => (
              <button
                key={instructor.id}
                onClick={() => setSelectedInstructor(instructor)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedInstructor.id === instructor.id
                    ? 'bg-amber-50 border border-amber-300'
                    : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-gray-900">{instructor.name}</div>
                  <Badge variant={instructor.type === 'Full-time' ? 'default' : 'secondary'} className="text-xs">
                    {instructor.type}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">{instructor.department}</div>
                <div className="text-xs text-gray-600 mt-1">Load: {instructor.weeklyLoad}h/week</div>
              </button>
            ))}
          </div>
        </div>

        {/* Availability Calendar */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-900">Weekly Availability</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedInstructor.name}</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Clock className="w-4 h-4" />
              Edit Availability
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-xs text-gray-700">Time</th>
                  {days.map(day => (
                    <th key={day} className="px-3 py-2 text-center text-xs text-gray-700">
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-xs text-gray-600">{time}</td>
                    {days.map(day => {
                      const isAvailable = selectedInstructor.availability[day]?.includes(time);
                      return (
                        <td key={day} className="px-3 py-2 text-center">
                          <div className="flex justify-center">
                            <div 
                              className={`w-6 h-6 rounded ${
                                isAvailable 
                                  ? 'bg-green-100 border border-green-400' 
                                  : 'bg-gray-100 border border-gray-300'
                              }`}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-4 mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
              <span className="text-xs text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-xs text-gray-700">Not Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}