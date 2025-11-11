import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Settings, Save } from 'lucide-react';

export function SchedulingRules() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Scheduling Rules & Priorities</h2>
          <p className="text-gray-500 text-sm">Configure constraints and preferences for schedule generation</p>
        </div>
        
        <Button className="gap-2 bg-amber-500 hover:bg-amber-600">
          <Save className="w-4 h-4" />
          Save Rules
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hard Constraints */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-red-600" />
            <h3 className="text-gray-900">Hard Constraints</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">These rules must be satisfied</p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="max-4-hours" defaultChecked disabled />
              <div className="flex-1">
                <Label htmlFor="max-4-hours" className="text-sm text-gray-900">
                  Max 4 hours per day per instructor (Undergraduate)
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Each instructor can teach maximum 4 hours of undergraduate courses per day (including graduate courses for total workload)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="friday-exam" defaultChecked disabled />
              <div className="flex-1">
                <Label htmlFor="friday-exam" className="text-sm text-gray-900">
                  Friday Exam Block (13:20-15:10)
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  No courses can be scheduled during this period on Fridays
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="common-courses-first" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="common-courses-first" className="text-sm text-gray-900">
                  Prioritize Common Courses (PHYS, MATH, ENG)
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Common course schedules must be considered first when planning
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="lab-after-theory" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="lab-after-theory" className="text-sm text-gray-900">
                  Lab sessions must not be before theory hours
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Lab classes scheduled after corresponding theory classes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="lab-capacity" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="lab-capacity" className="text-sm text-gray-900">
                  Lab capacity limit (≤ 40 students per section)
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Ensures labs don't exceed maximum safe capacity
                </p>
                <div className="mt-2">
                  <Label htmlFor="max-capacity" className="text-xs text-gray-600">Maximum capacity:</Label>
                  <Input id="max-capacity" type="number" defaultValue="40" className="mt-1 h-8 text-sm" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="no-overlap-elective" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="no-overlap-elective" className="text-sm text-gray-900">
                  3rd-year students must be able to select technical electives
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Required courses must not overlap with technical elective time slots
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="ceng-seng-elective" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="ceng-seng-elective" className="text-sm text-gray-900">
                  CENG and SENG electives must not overlap
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Allows cross-department elective selection
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="no-projects-in-load" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="no-projects-in-load" className="text-sm text-gray-900">
                  Projects, seminars, studios and thesis excluded from mandatory course load
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  These courses don't count toward the mandatory workload calculation
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="undergrad-priority" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="undergrad-priority" className="text-sm text-gray-900">
                  Undergraduate courses must be prioritized over graduate
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Instructors with heavy loads schedule undergraduate courses first (no 4-hour limit for graduate)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="quota-management" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="quota-management" className="text-sm text-gray-900">
                  Course quotas and department allocations must be set
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Define student limits and quotas reserved for other departments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Soft Constraints / Preferences */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">Soft Constraints (Preferences)</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">These rules are preferred but not required</p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="balanced-workload" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="balanced-workload" className="text-sm text-gray-900">
                  Balance workload before hiring part-time instructors
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Full-time instructor workloads should be distributed proportionally before requesting part-time staff
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="free-day-option" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="free-day-option" className="text-sm text-gray-900">
                  Allow instructors with heavy load to keep one day free
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Instructors can arrange their schedule to have one completely free day
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="parttime-flexibility" />
              <div className="flex-1">
                <Label htmlFor="parttime-flexibility" className="text-sm text-gray-900">
                  Allow flexible scheduling for part-time external instructors
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Part-time instructors from outside university can have flexible day/time constraints
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="consecutive-labs" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="consecutive-labs" className="text-sm text-gray-900">
                  Prefer 2 consecutive lab hours
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Schedule lab sessions in back-to-back time slots when possible
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="minimize-gaps" defaultChecked />
              <div className="flex-1">
                <Label htmlFor="minimize-gaps" className="text-sm text-gray-900">
                  Minimize gaps in daily schedule
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Try to schedule courses consecutively to reduce wait time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="balance-days" />
              <div className="flex-1">
                <Label htmlFor="balance-days" className="text-sm text-gray-900">
                  Balance course load across days
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Distribute courses evenly throughout the week
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox id="same-room" />
              <div className="flex-1">
                <Label htmlFor="same-room" className="text-sm text-gray-900">
                  Use same room for consecutive courses
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Reduce room changes for back-to-back classes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Settings */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Algorithm Settings</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="algorithm">Scheduling Algorithm</Label>
            <select 
              id="algorithm" 
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="backtracking">Backtracking</option>
              <option value="greedy">Greedy Heuristic</option>
              <option value="genetic">Genetic Algorithm</option>
              <option value="constraint">Constraint Satisfaction</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Choose the algorithm for schedule generation
            </p>
          </div>

          <div>
            <Label htmlFor="max-iterations">Max Iterations</Label>
            <Input 
              id="max-iterations" 
              type="number" 
              defaultValue="1000" 
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              Maximum attempts before returning best solution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}