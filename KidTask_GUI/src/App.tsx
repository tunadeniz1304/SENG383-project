import { useState } from 'react';
import { RoleSelection } from './components/RoleSelection';
import { ChildDashboard } from './components/ChildDashboard';
import { TaskPanel } from './components/TaskPanel';
import { WishPanel } from './components/WishPanel';

export type Role = 'child' | 'parent' | 'teacher' | null;
export type View = 'home' | 'tasks' | 'wishes';
export type TaskType = 'daily' | 'weekly';
export type TaskStatus = 'pending' | 'completed' | 'approved';
export type WishStatus = 'pending' | 'approved' | 'rejected';

export interface Task {
  id: string;
  title: string;
  points: number;
  dueDate: string;
  type: TaskType;
  status: TaskStatus;
  rating?: number;
}

export interface Wish {
  id: string;
  title: string;
  pointCost: number;
  status: WishStatus;
}

export default function App() {
  const [role, setRole] = useState<Role>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [childPoints, setChildPoints] = useState(850);
  const [childLevel, setChildLevel] = useState(5);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Clean your room',
      points: 50,
      dueDate: '2025-11-12',
      type: 'daily',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Complete homework',
      points: 100,
      dueDate: '2025-11-12',
      type: 'daily',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Read for 30 minutes',
      points: 75,
      dueDate: '2025-11-15',
      type: 'weekly',
      status: 'completed',
    },
    {
      id: '4',
      title: 'Help with dishes',
      points: 40,
      dueDate: '2025-11-12',
      type: 'daily',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Practice piano',
      points: 60,
      dueDate: '2025-11-18',
      type: 'weekly',
      status: 'pending',
    },
  ]);

  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: '1',
      title: 'New video game',
      pointCost: 500,
      status: 'approved',
    },
    {
      id: '2',
      title: 'Trip to the zoo',
      pointCost: 300,
      status: 'pending',
    },
    {
      id: '3',
      title: 'Extra screen time (1 hour)',
      pointCost: 150,
      status: 'approved',
    },
    {
      id: '4',
      title: 'Sleepover with friends',
      pointCost: 400,
      status: 'pending',
    },
  ]);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setCurrentView('home');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: 'completed' as TaskStatus } : task
    ));
  };

  const handleTaskApprove = (taskId: string, rating: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const earnedPoints = Math.round(task.points * (rating / 5));
      setChildPoints(prev => prev + earnedPoints);
      
      // Level up logic (every 1000 points = 1 level)
      const newTotalPoints = childPoints + earnedPoints;
      const newLevel = Math.floor(newTotalPoints / 1000) + 1;
      if (newLevel > childLevel) {
        setChildLevel(newLevel);
      }
    }

    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: 'approved' as TaskStatus, rating } : task
    ));
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      status: 'pending',
    };
    setTasks([...tasks, newTask]);
  };

  const handleWishApprove = (wishId: string) => {
    setWishes(wishes.map(wish =>
      wish.id === wishId ? { ...wish, status: 'approved' as WishStatus } : wish
    ));
  };

  const handleWishReject = (wishId: string) => {
    setWishes(wishes.map(wish =>
      wish.id === wishId ? { ...wish, status: 'rejected' as WishStatus } : wish
    ));
  };

  const handleAddWish = (wish: Omit<Wish, 'id' | 'status'>) => {
    const newWish: Wish = {
      ...wish,
      id: Date.now().toString(),
      status: 'pending',
    };
    setWishes([...newWish, ...wishes]);
  };

  const handleRedeemWish = (wishId: string) => {
    const wish = wishes.find(w => w.id === wishId);
    if (wish && wish.status === 'approved' && childPoints >= wish.pointCost) {
      setChildPoints(prev => prev - wish.pointCost);
      setWishes(wishes.filter(w => w.id !== wishId));
    }
  };

  const handleBackToRoleSelection = () => {
    setRole(null);
    setCurrentView('home');
  };

  if (!role) {
    return <RoleSelection onSelectRole={handleRoleSelect} />;
  }

  if (role === 'child') {
    if (currentView === 'home') {
      return (
        <ChildDashboard
          points={childPoints}
          level={childLevel}
          onNavigate={handleViewChange}
          onBackToRoles={handleBackToRoleSelection}
        />
      );
    } else if (currentView === 'tasks') {
      return (
        <TaskPanel
          role={role}
          tasks={tasks}
          onTaskComplete={handleTaskComplete}
          onBackToHome={() => handleViewChange('home')}
        />
      );
    } else if (currentView === 'wishes') {
      return (
        <WishPanel
          role={role}
          wishes={wishes}
          childPoints={childPoints}
          onAddWish={handleAddWish}
          onRedeemWish={handleRedeemWish}
          onBackToHome={() => handleViewChange('home')}
        />
      );
    }
  }

  if (role === 'parent' || role === 'teacher') {
    if (currentView === 'home' || currentView === 'tasks') {
      return (
        <TaskPanel
          role={role}
          tasks={tasks}
          onTaskComplete={handleTaskComplete}
          onTaskApprove={handleTaskApprove}
          onAddTask={handleAddTask}
          onBackToRoles={handleBackToRoleSelection}
          onNavigateToWishes={() => handleViewChange('wishes')}
        />
      );
    } else if (currentView === 'wishes') {
      return (
        <WishPanel
          role={role}
          wishes={wishes}
          childPoints={childPoints}
          onWishApprove={handleWishApprove}
          onWishReject={handleWishReject}
          onBackToTasks={() => handleViewChange('tasks')}
        />
      );
    }
  }

  return null;
}
