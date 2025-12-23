import { Upload, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { CoursesTable } from './CoursesTable';
import { InstructorConstraints } from './InstructorConstraints';
import { ClassroomList } from './ClassroomList';
import { RulesViewer } from './RulesViewer';

interface InputManagementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function InputManagement({ activeTab, setActiveTab }: InputManagementProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Veri Giriş ve Yönetimi</h2>
        <p className="text-gray-600 text-sm">
          Algoritmanın çalışması için gerekli tüm verileri bu bölümde yükleyin ve düzenleyin
        </p>
      </div>

      {/* Sub Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'courses'
              ? 'bg-amber-100 text-amber-700 border border-amber-300'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          📚 Dersler
        </button>
        
        <button
          onClick={() => setActiveTab('instructors')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'instructors'
              ? 'bg-amber-100 text-amber-700 border border-amber-300'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          👨‍🏫 Öğretim Elemanı Kısıtları
        </button>
        
        <button
          onClick={() => setActiveTab('classrooms')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'classrooms'
              ? 'bg-amber-100 text-amber-700 border border-amber-300'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          🏢 Derslik/Lab Listesi
        </button>
        
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'rules'
              ? 'bg-amber-100 text-amber-700 border border-amber-300'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          ⚙️ Kural Görüntüleyici
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="min-h-[500px]">
        {activeTab === 'courses' && <CoursesTable />}
        {activeTab === 'instructors' && <InstructorConstraints />}
        {activeTab === 'classrooms' && <ClassroomList />}
        {activeTab === 'rules' && <RulesViewer />}
      </div>
    </div>
  );
}
