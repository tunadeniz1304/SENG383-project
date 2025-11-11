import { useState } from 'react';
import { Plus, Edit2, Trash2, Building } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';

const sampleRooms = [
  { id: 1, name: 'A101', type: 'Classroom', capacity: 60, building: 'A Block' },
  { id: 2, name: 'A102', type: 'Classroom', capacity: 50, building: 'A Block' },
  { id: 3, name: 'B202', type: 'Classroom', capacity: 80, building: 'B Block' },
  { id: 4, name: 'Lab 1', type: 'Laboratory', capacity: 40, building: 'C Block' },
  { id: 5, name: 'Lab 2', type: 'Laboratory', capacity: 35, building: 'C Block' },
  { id: 6, name: 'Lab 3', type: 'Laboratory', capacity: 40, building: 'C Block' },
];

export function ClassroomManagement() {
  const [rooms, setRooms] = useState(sampleRooms);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const filteredRooms = filterType === 'all' 
    ? rooms 
    : rooms.filter(room => room.type.toLowerCase() === filterType);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Classroom & Lab Management</h2>
          <p className="text-gray-500 text-sm">Manage classrooms, labs, and their capacities</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-amber-500 hover:bg-amber-600">
              <Plus className="w-4 h-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="room-name">Room Name</Label>
                <Input id="room-name" placeholder="e.g., A101" />
              </div>
              
              <div>
                <Label htmlFor="room-type">Type</Label>
                <Select>
                  <SelectTrigger id="room-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classroom">Classroom</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" placeholder="e.g., 40" />
              </div>
              
              <div>
                <Label htmlFor="building">Building</Label>
                <Input id="building" placeholder="e.g., A Block" />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600">
                Add Room
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-gray-600">Filter by type:</span>
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
            className={filterType === 'all' ? 'bg-amber-500 hover:bg-amber-600' : ''}
          >
            All
          </Button>
          <Button
            variant={filterType === 'classroom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('classroom')}
            className={filterType === 'classroom' ? 'bg-amber-500 hover:bg-amber-600' : ''}
          >
            Classrooms
          </Button>
          <Button
            variant={filterType === 'laboratory' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('laboratory')}
            className={filterType === 'laboratory' ? 'bg-amber-500 hover:bg-amber-600' : ''}
          >
            Laboratories
          </Button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-amber-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  room.type === 'Laboratory' 
                    ? 'bg-purple-100' 
                    : 'bg-blue-100'
                }`}>
                  <Building className={`w-5 h-5 ${
                    room.type === 'Laboratory' 
                      ? 'text-purple-600' 
                      : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-gray-900">{room.name}</h3>
                  <p className="text-xs text-gray-500">{room.building}</p>
                </div>
              </div>
              
              <Badge variant={room.type === 'Laboratory' ? 'default' : 'secondary'}>
                {room.type}
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Capacity:</span>
                <span className="text-gray-900">{room.capacity} students</span>
              </div>
              
              {room.type === 'Laboratory' && room.capacity > 40 && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  ⚠️ Exceeds recommended lab capacity (40)
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <Button variant="outline" size="sm" className="flex-1 gap-2">
                <Edit2 className="w-3 h-3" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-2 text-red-600 hover:text-red-700">
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
          <p className="text-gray-900">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Classrooms</p>
          <p className="text-gray-900">{rooms.filter(r => r.type === 'Classroom').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Laboratories</p>
          <p className="text-gray-900">{rooms.filter(r => r.type === 'Laboratory').length}</p>
        </div>
      </div>
    </div>
  );
}
