import { FileText, Download, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const sampleValidationResults = {
  status: 'warning',
  totalChecks: 15,
  passed: 12,
  warnings: 2,
  errors: 1,
  items: [
    {
      type: 'error',
      category: 'Capacity Violation',
      message: 'Lab 3 exceeds maximum capacity',
      details: 'CENG 301 Lab assigned to Lab 3 (Capacity: 45/40)',
      course: 'CENG 301 Lab',
      timestamp: '2025-11-11 14:32'
    },
    {
      type: 'warning',
      category: 'Instructor Load',
      message: 'Dr. Smith teaching 5 hours on Monday',
      details: 'Exceeds recommended 4 hours per day',
      course: 'Multiple courses',
      timestamp: '2025-11-11 14:32'
    },
    {
      type: 'warning',
      category: 'Gap in Schedule',
      message: '2-hour gap in 2nd year schedule',
      details: 'Gap between 10:30-12:40 on Wednesday',
      course: '2nd Year',
      timestamp: '2025-11-11 14:32'
    },
    {
      type: 'success',
      category: 'Friday Exam Block',
      message: 'No conflicts during exam period',
      details: 'All courses comply with Friday 13:20-15:10 restriction',
      course: 'All years',
      timestamp: '2025-11-11 14:32'
    },
    {
      type: 'success',
      category: 'Lab-Theory Order',
      message: 'All labs scheduled after theory',
      details: 'Lab sessions follow their corresponding theory classes',
      course: 'All courses',
      timestamp: '2025-11-11 14:32'
    },
    {
      type: 'success',
      category: 'Elective Overlap',
      message: 'No CENG/SENG elective conflicts',
      details: 'Students can choose from both department electives',
      course: '3rd & 4th Year',
      timestamp: '2025-11-11 14:32'
    }
  ]
};

export function ReportsView() {
  const { items, totalChecks, passed, warnings, errors } = sampleValidationResults;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Validation Reports</h2>
          <p className="text-gray-500 text-sm">Review scheduling conflicts and violations</p>
        </div>
        
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Checks</p>
              <p className="text-gray-900">{totalChecks}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Passed</p>
              <p className="text-green-700">{passed}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-amber-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Warnings</p>
              <p className="text-amber-700">{warnings}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Errors</p>
              <p className="text-red-700">{errors}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Validation Results */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-gray-900">Validation Results</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.type === 'error' 
                    ? 'bg-red-100' 
                    : item.type === 'warning'
                    ? 'bg-amber-100'
                    : 'bg-green-100'
                }`}>
                  {item.type === 'error' ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : item.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant={
                        item.type === 'error' 
                          ? 'destructive' 
                          : item.type === 'warning'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {item.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{item.timestamp}</span>
                  </div>
                  
                  <h4 className="text-sm text-gray-900 mb-1">{item.message}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Course: {item.course}</span>
                  </div>
                </div>

                {item.type !== 'success' && (
                  <Button variant="outline" size="sm">
                    Fix Issue
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm text-blue-900 mb-1">About Validation</h4>
          <p className="text-sm text-blue-800">
            The validation report checks all scheduling constraints and rules. 
            <strong className="text-blue-900"> Errors</strong> must be resolved before finalizing the schedule, 
            while <strong className="text-blue-900">warnings</strong> are suggestions for improvement.
          </p>
        </div>
      </div>
    </div>
  );
}
