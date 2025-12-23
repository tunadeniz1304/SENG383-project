import { Card } from './ui/card';
import { Button } from './ui/button';
import { User, Users, GraduationCap } from 'lucide-react';
import type { Role } from '../App';

interface RoleSelectionProps {
  onSelectRole: (role: Role) => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-purple-600 mb-2">Welcome to TaskQuest</h1>
          <p className="text-gray-600">Choose your role to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-400 bg-white"
            onClick={() => onSelectRole('child')}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <h3 className="text-purple-600 mb-2">Child</h3>
                <p className="text-gray-600 text-sm">
                  Complete tasks, earn points, and unlock your wishes!
                </p>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                I'm a Child
              </Button>
            </div>
          </Card>

          <Card
            className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-400 bg-white"
            onClick={() => onSelectRole('parent')}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-blue-600 mb-2">Parent</h3>
                <p className="text-gray-600 text-sm">
                  Create tasks, approve wishes, and track your child's progress.
                </p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                I'm a Parent
              </Button>
            </div>
          </Card>

          <Card
            className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-400 bg-white"
            onClick={() => onSelectRole('teacher')}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-green-600 mb-2">Teacher</h3>
                <p className="text-gray-600 text-sm">
                  Manage tasks and motivate students to achieve their goals.
                </p>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                I'm a Teacher
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
