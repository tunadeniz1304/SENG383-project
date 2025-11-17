import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { CheckSquare, Gift, Trophy, ArrowLeft } from 'lucide-react';
import type { View } from '../App';

interface ChildDashboardProps {
  points: number;
  level: number;
  onNavigate: (view: View) => void;
  onBackToRoles: () => void;
}

export function ChildDashboard({ points, level, onNavigate, onBackToRoles }: ChildDashboardProps) {
  // Calculate progress to next level (every 1000 points = 1 level)
  const pointsInCurrentLevel = points % 1000;
  const progressPercent = (pointsInCurrentLevel / 1000) * 100;
  const pointsToNextLevel = 1000 - pointsInCurrentLevel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBackToRoles}
            className="text-purple-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Change Role
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-purple-600 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Keep up the great work!</p>
        </div>

        {/* Level and Points Display */}
        <Card className="p-8 mb-8 bg-white shadow-lg">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mb-4">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-purple-600 mb-1">Level {level}</h2>
            <p className="text-gray-600">{points} Total Points</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress to Level {level + 1}</span>
              <span>{pointsToNextLevel} points to go</span>
            </div>
            <Progress value={progressPercent} className="h-4" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{pointsInCurrentLevel} points</span>
              <span>1000 points</span>
            </div>
          </div>
        </Card>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-400 bg-white"
            onClick={() => onNavigate('tasks')}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-purple-600 mb-2">My Tasks</h3>
                <p className="text-gray-600 text-sm">
                  View and complete your daily and weekly tasks
                </p>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                View Tasks
              </Button>
            </div>
          </Card>

          <Card
            className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-pink-400 bg-white"
            onClick={() => onNavigate('wishes')}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                <Gift className="w-8 h-8 text-pink-600" />
              </div>
              <div>
                <h3 className="text-pink-600 mb-2">My Wishes</h3>
                <p className="text-gray-600 text-sm">
                  Add wishes and redeem them with your points
                </p>
              </div>
              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                View Wishes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
