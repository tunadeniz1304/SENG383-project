import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

const timeSlots = [
  '08:40-09:30',
  '09:40-10:30',
  '10:40-11:30',
  '11:40-12:30',
  '12:40-13:30',
  '13:40-14:30',
  '14:40-15:30',
  '15:40-16:30',
  '16:40-17:30'
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Sample schedule data
const sampleSchedule = {
  '1': {
    'Monday': {
      '08:40-09:30': { course: 'CENG 101', instructor: 'Dr. Smith', room: 'A101', type: 'theory' },
      '09:40-10:30': { course: 'CENG 101', instructor: 'Dr. Smith', room: 'A101', type: 'theory' },
      '10:40-11:30': { course: 'MATH 101', instructor: 'Dr. Johnson', room: 'B202', type: 'theory' },
    },
    'Tuesday': {
      '10:40-11:30': { course: 'CENG 101 Lab', instructor: 'Dr. Smith', room: 'Lab 1', type: 'lab' },
      '11:40-12:30': { course: 'CENG 101 Lab', instructor: 'Dr. Smith', room: 'Lab 1', type: 'lab' },
    },
    'Friday': {
      '08:40-09:30': { course: 'PHYS 101', instructor: 'Dr. Brown', room: 'C303', type: 'theory' },
    }
  }
};

export function ScheduleView() {
  const [selectedYear, setSelectedYear] = useState('1');
  const schedule = sampleSchedule[selectedYear as keyof typeof sampleSchedule] || {};

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Weekly Schedule</h2>
          <p className="text-gray-500 text-sm">View and manage course timetable</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">No conflicts detected</span>
          </div>
          
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
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
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 p-4 bg-white rounded-lg border border-gray-200">
        <span className="text-sm text-gray-600">Legend:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
          <span className="text-sm text-gray-700">Theory</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
          <span className="text-sm text-gray-700">Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-sm text-gray-700">Conflict</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-sm text-gray-700">Friday Exam Block</span>
        </div>
      </div>

      {/* Timetable */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm text-gray-700 w-32">Time</th>
                {days.map(day => (
                  <th key={day} className="px-4 py-3 text-left text-sm text-gray-700 min-w-[180px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, index) => {
                const isFridayExamBlock = time >= '13:20' && time <= '15:10';
                
                return (
                  <tr key={time} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{time}</td>
                    {days.map(day => {
                      const cell = schedule[day]?.[time];
                      const isExamBlock = day === 'Friday' && isFridayExamBlock;
                      
                      return (
                        <td key={day} className="px-2 py-2">
                          {isExamBlock ? (
                            <div className="bg-gray-100 border border-gray-300 rounded p-2 h-full min-h-[60px] flex items-center justify-center">
                              <span className="text-xs text-gray-500">Exam Block</span>
                            </div>
                          ) : cell ? (
                            <div 
                              className={`rounded p-2 h-full min-h-[60px] ${
                                cell.type === 'lab' 
                                  ? 'bg-purple-50 border border-purple-300' 
                                  : 'bg-blue-50 border border-blue-300'
                              }`}
                            >
                              <div className="text-sm text-gray-900">{cell.course}</div>
                              <div className="text-xs text-gray-600 mt-1">{cell.instructor}</div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500">{cell.room}</span>
                                <Badge variant={cell.type === 'lab' ? 'default' : 'secondary'} className="text-xs">
                                  {cell.type}
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full min-h-[60px]"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
