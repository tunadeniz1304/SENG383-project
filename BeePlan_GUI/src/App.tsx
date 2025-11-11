import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Calendar, Users, Building2, Settings, FileText, Play } from 'lucide-react';
import { ScheduleView } from './components/ScheduleView';
import { CourseManagement } from './components/CourseManagement';
import { InstructorManagement } from './components/InstructorManagement';
import { ClassroomManagement } from './components/ClassroomManagement';
import { SchedulingRules } from './components/SchedulingRules';
import { ReportsView } from './components/ReportsView';
import { InputManagement } from './components/InputManagement';
import { OutputReporting } from './components/OutputReporting';

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [activeSection, setActiveSection] = useState('input'); // 'input' or 'output'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-white text-2xl">BeePlan: Ders Programı Oluşturma Sistemi</h1>
              <p className="text-amber-100 text-sm">Akıllı Ders Çizelgeleme Platformu</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 text-white bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm">
              CSV/JSON Yükle
            </button>
          </div>
        </div>
      </header>

      {/* Main Section Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveSection('input')}
              className={`px-8 py-4 transition-all relative ${
                activeSection === 'input'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">📥 Veri Giriş ve Yönetimi</span>
            </button>
            
            <button
              onClick={() => setActiveSection('output')}
              className={`px-8 py-4 transition-all relative ${
                activeSection === 'output'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">📊 Çizelge ve Raporlama</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="h-[calc(100vh-165px)] overflow-auto">
        {activeSection === 'input' ? (
          <InputManagement activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <OutputReporting />
        )}
      </main>
    </div>
  );
}