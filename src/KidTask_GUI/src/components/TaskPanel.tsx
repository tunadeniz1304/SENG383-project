import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Plus, Filter, Star } from 'lucide-react';
import type { Role, Task, TaskType } from '../App';

interface TaskPanelProps {
  role: Role;
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskApprove?: (taskId: string, rating: number) => void;
  onAddTask?: (task: Omit<Task, 'id' | 'status'>) => void;
  onBackToHome?: () => void;
  onBackToRoles?: () => void;
  onNavigateToWishes?: () => void;
}

export function TaskPanel({
  role,
  tasks,
  onTaskComplete,
  onTaskApprove,
  onAddTask,
  onBackToHome,
  onBackToRoles,
  onNavigateToWishes,
}: TaskPanelProps) {
  const [filter, setFilter] = useState<TaskType | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [ratingTaskId, setRatingTaskId] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(5);

  const [newTask, setNewTask] = useState({
    title: '',
    points: 50,
    dueDate: '',
    type: 'daily' as TaskType,
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.type === filter;
  });

  const handleAddTask = () => {
    if (newTask.title && newTask.dueDate && onAddTask) {
      onAddTask(newTask);
      setNewTask({
        title: '',
        points: 50,
        dueDate: '',
        type: 'daily',
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleApproveTask = (taskId: string) => {
    if (onTaskApprove) {
      onTaskApprove(taskId, selectedRating);
      setRatingTaskId(null);
      setSelectedRating(5);
    }
  };

  const getRoleColor = () => {
    if (role === 'child') return 'purple';
    if (role === 'parent') return 'blue';
    return 'green';
  };

  const roleColor = getRoleColor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBackToHome || onBackToRoles}
            className={`text-${roleColor}-600`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {role === 'child' ? 'Back to Dashboard' : 'Change Role'}
          </Button>

          {(role === 'parent' || role === 'teacher') && onNavigateToWishes && (
            <Button
              variant="outline"
              onClick={onNavigateToWishes}
              className={`border-${roleColor}-400`}
            >
              View Wishes
            </Button>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-${roleColor}-600 mb-2`}>
            {role === 'child' ? 'My Tasks' : 'Task Management'}
          </h1>
          <p className="text-gray-600">
            {role === 'child'
              ? 'Complete tasks to earn points!'
              : 'Manage and approve tasks'}
          </p>
        </div>

        {/* Filter and Add Task Controls */}
        <Card className="p-6 mb-6 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? `bg-${roleColor}-600 hover:bg-${roleColor}-700` : ''}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'daily' ? 'default' : 'outline'}
                  onClick={() => setFilter('daily')}
                  className={filter === 'daily' ? `bg-${roleColor}-600 hover:bg-${roleColor}-700` : ''}
                >
                  Daily
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'weekly' ? 'default' : 'outline'}
                  onClick={() => setFilter('weekly')}
                  className={filter === 'weekly' ? `bg-${roleColor}-600 hover:bg-${roleColor}-700` : ''}
                >
                  Weekly
                </Button>
              </div>
            </div>

            {(role === 'parent' || role === 'teacher') && onAddTask && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className={`bg-${roleColor}-600 hover:bg-${roleColor}-700`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="e.g., Clean your room"
                      />
                    </div>
                    <div>
                      <Label htmlFor="points">Points</Label>
                      <Input
                        id="points"
                        type="number"
                        value={newTask.points}
                        onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Task Type</Label>
                      <Select
                        value={newTask.type}
                        onValueChange={(value) => setNewTask({ ...newTask, type: value as TaskType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                    <Button
                      onClick={handleAddTask}
                      className={`w-full bg-${roleColor}-600 hover:bg-${roleColor}-700`}
                    >
                      Add Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </Card>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="p-8 text-center bg-white">
              <p className="text-gray-500">No tasks found</p>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="p-6 bg-white hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-gray-800">{task.title}</h3>
                      <Badge
                        variant={task.type === 'daily' ? 'default' : 'secondary'}
                        className={task.type === 'daily' ? 'bg-orange-500' : 'bg-blue-500'}
                      >
                        {task.type}
                      </Badge>
                      {task.status === 'completed' && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                          Pending Approval
                        </Badge>
                      )}
                      {task.status === 'approved' && (
                        <Badge className="bg-green-500">
                          Approved
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className={`text-${roleColor}-600`}>
                        {task.points} points
                      </span>
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      {task.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {task.rating}/5
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {role === 'child' && task.status === 'pending' && (
                      <Button
                        onClick={() => onTaskComplete(task.id)}
                        className={`bg-${roleColor}-600 hover:bg-${roleColor}-700`}
                      >
                        Mark Complete
                      </Button>
                    )}

                    {(role === 'parent' || role === 'teacher') && task.status === 'completed' && (
                      <Dialog open={ratingTaskId === task.id} onOpenChange={(open) => !open && setRatingTaskId(null)}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setRatingTaskId(task.id)}
                            className={`bg-${roleColor}-600 hover:bg-${roleColor}-700`}
                          >
                            Approve & Rate
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Approve and Rate Task</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <p className="text-gray-600">{task.title}</p>
                            <div>
                              <Label>Rating (affects points earned)</Label>
                              <div className="flex gap-2 mt-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    onClick={() => setSelectedRating(rating)}
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`w-8 h-8 ${
                                        rating <= selectedRating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Points earned: {Math.round(task.points * (selectedRating / 5))} / {task.points}
                              </p>
                            </div>
                            <Button
                              onClick={() => handleApproveTask(task.id)}
                              className={`w-full bg-${roleColor}-600 hover:bg-${roleColor}-700`}
                            >
                              Approve Task
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
