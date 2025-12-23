import { useState } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';

const sampleCourses = [
  // 1st Year Courses
  { id: 1, code: 'PHYS 131', name: 'Physics I / Fizik I', year: 1, semester: 1, theoryHours: 3, labHours: 2, instructor: '', type: 'Common', quota: 0 },
  { id: 2, code: 'TURK 101', name: 'Turkish I / Türk Dili I', year: 1, semester: 1, theoryHours: 2, labHours: 0, instructor: '', type: 'Common', quota: 0 },
  { id: 3, code: 'ENG 121', name: 'Academic English I / Akademik İngilizce I', year: 1, semester: 1, theoryHours: 3, labHours: 0, instructor: '', type: 'Common', quota: 0 },
  { id: 4, code: 'MATH 157', name: 'Calculus for Engineering I / Mühendisler için Genel Matematik I', year: 1, semester: 1, theoryHours: 4, labHours: 0, instructor: '', type: 'Common', quota: 0 },
  { id: 5, code: 'BIO 101', name: 'Introduction to Biology', year: 1, semester: 1, theoryHours: 3, labHours: 0, instructor: '', type: 'Required', quota: 0 },
  { id: 6, code: 'ESR 103', name: 'Ethical Principles and Social Responsibility', year: 1, semester: 1, theoryHours: 1, labHours: 0, instructor: '', type: 'Required', quota: 0 },
  { id: 7, code: 'SENG 101', name: 'Computer Programming I / Bilgisayar Programlama I', year: 1, semester: 1, theoryHours: 3, labHours: 2, instructor: '', type: 'Required', quota: 0 },
  { id: 8, code: 'SENG 102', name: 'Computer Programming II / Bilgisayar Programlama II', year: 1, semester: 2, theoryHours: 3, labHours: 2, instructor: '', type: 'Required', quota: 0 },
  
  // 2nd Year Courses
  { id: 9, code: 'HIST 201', name: 'Principles of Atatürk and History of Turkish Revolution I / Atatürk İlke ve İnkilap Tarihi I', year: 2, semester: 1, theoryHours: 2, labHours: 0, instructor: '', type: 'Common', quota: 0 },
  { id: 10, code: 'MATH 223', name: 'Discrete Structures', year: 2, semester: 1, theoryHours: 3, labHours: 0, instructor: '', type: 'Common', quota: 0 },
  { id: 11, code: 'SENG 201', name: 'Data Structures', year: 2, semester: 1, theoryHours: 3, labHours: 2, instructor: '', type: 'Required', quota: 0 },
  { id: 12, code: 'SENG 203', name: 'Discrete Structures', year: 2, semester: 1, theoryHours: 3, labHours: 0, instructor: '', type: 'Required', quota: 0 },
  { id: 13, code: 'SENG 206', name: 'Software Design', year: 2, semester: 2, theoryHours: 3, labHours: 0, instructor: '', type: 'Required', quota: 0 },
  { id: 14, code: 'SENG 271', name: 'Software Project I / Yazılım Projesi I', year: 2, semester: 2, theoryHours: 2, labHours: 0, instructor: '', type: 'Project', quota: 0 },
  
  // 3rd Year Courses
  { id: 15, code: 'SENG 301', name: 'Software Project Management', year: 3, semester: 1, theoryHours: 2, labHours: 2, instructor: '', type: 'Required', quota: 0 },
  { id: 16, code: 'SENG 303', name: 'Software Testing for Quality Assurance', year: 3, semester: 1, theoryHours: 3, labHours: 0, instructor: '', type: 'Required', quota: 0 },
  { id: 17, code: 'SENG 315', name: 'Concurrent Programming', year: 3, semester: 1, theoryHours: 3, labHours: 0, instructor: '', type: 'Required', quota: 0 },
  { id: 18, code: 'SENG 383', name: 'Software Project III / Yazılım Projesi III', year: 3, semester: 1, theoryHours: 2, labHours: 0, instructor: '', type: 'Project', quota: 0 },
  
  // 4th Year Courses
  { id: 19, code: 'SENG 426', name: 'Formal Methods in Software Development', year: 4, semester: 1, theoryHours: 4, labHours: 0, instructor: '', type: 'Required', quota: 0 },
  { id: 20, code: 'SENG 491', name: 'Graduation Project I / Mezuniyet Projesi I', year: 4, semester: 1, theoryHours: 1, labHours: 4, instructor: '', type: 'Project', quota: 0 },
];

export function CourseManagement() {
  const [courses, setCourses] = useState(sampleCourses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Course Management</h2>
          <p className="text-gray-500 text-sm">Manage department curriculum and course details</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import CSV/JSON
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-amber-500 hover:bg-amber-600">
                <Plus className="w-4 h-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="code">Course Code</Label>
                  <Input id="code" placeholder="e.g., CENG 101" />
                </div>
                
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="name">Course Name</Label>
                  <Input id="name" placeholder="e.g., Introduction to Programming" />
                </div>
                
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select>
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Fall</SelectItem>
                      <SelectItem value="2">Spring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="course-type">Course Type</Label>
                  <Select>
                    <SelectTrigger id="course-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Required">Required</SelectItem>
                      <SelectItem value="Elective">Technical Elective</SelectItem>
                      <SelectItem value="Common">Common Course</SelectItem>
                      <SelectItem value="Project">Project/Seminar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="theory">Theory Hours/Week</Label>
                  <Input id="theory" type="number" placeholder="0" />
                </div>
                
                <div>
                  <Label htmlFor="lab">Lab Hours/Week</Label>
                  <Input id="lab" type="number" placeholder="0" />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Select>
                    <SelectTrigger id="instructor">
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Dr. Smith</SelectItem>
                      <SelectItem value="2">Dr. Johnson</SelectItem>
                      <SelectItem value="3">Dr. Brown</SelectItem>
                      <SelectItem value="4">Dr. Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-500 hover:bg-amber-600">
                  Add Course
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Course Code</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Course Name</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Year</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Semester</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Theory</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Lab</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Quota</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{course.code}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{course.name}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{course.year}. Year</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{course.semester === 1 ? 'Fall' : 'Spring'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={course.type === 'Common' ? 'default' : 'outline'} className={
                    course.type === 'Common' ? 'bg-blue-500' : 
                    course.type === 'Elective' ? 'bg-purple-500' : 
                    course.type === 'Project' ? 'bg-orange-500' : ''
                  }>
                    {course.type}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{course.theoryHours}h</td>
                <td className="px-4 py-3 text-sm text-gray-600">{course.labHours}h</td>
                <td className="px-4 py-3 text-sm text-gray-600">{course.quota || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}