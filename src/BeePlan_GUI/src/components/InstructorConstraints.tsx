import { useState } from 'react';
import { Upload, Save } from 'lucide-react';
import { Button } from './ui/button';

const instructors = [
  'Dr. Smith',
  'Dr. Johnson', 
  'Dr. Brown',
  'Dr. Yılmaz',
  'Dr. Demir',
  'Dr. Kaya',
  'Dr. Öztürk'
];

const timeSlots = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00'
];

const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

export function InstructorConstraints() {
  const [selectedInstructor, setSelectedInstructor] = useState(instructors[0]);
  const [unavailableSlots, setUnavailableSlots] = useState<Record<string, boolean>>({
    'Cuma-13:00-14:00': true,
    'Cuma-14:00-15:00': true,
  });

  const toggleSlot = (day: string, time: string) => {
    const key = `${day}-${time}`;
    setUnavailableSlots(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-900">👨‍🏫 Öğretim Elemanı Kısıtları</h3>
          <p className="text-sm text-gray-600 mt-1">
            Her öğretim elemanının müsait olmadığı saatleri işaretleyin
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            CSV/JSON Yükle
          </Button>
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4" />
            Kaydet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Instructor List */}
        <div className="col-span-1 bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-sm text-gray-700 mb-3">Öğretim Elemanları</h4>
          <div className="space-y-1">
            {instructors.map((instructor) => (
              <button
                key={instructor}
                onClick={() => setSelectedInstructor(instructor)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedInstructor === instructor
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {instructor}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Grid */}
        <div className="col-span-4 bg-white rounded-lg border border-gray-200 p-4">
          <div className="mb-4">
            <h4 className="text-gray-900">Haftalık Müsaitlik Tablosu</h4>
            <p className="text-sm text-gray-600 mt-1">
              <strong>{selectedInstructor}</strong> - Kırmızı hücreler müsait olmayan saatleri gösterir
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 min-w-[100px]">
                    Saat
                  </th>
                  {days.map(day => (
                    <th key={day} className="border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                      {time}
                    </td>
                    {days.map(day => {
                      const key = `${day}-${time}`;
                      const isUnavailable = unavailableSlots[key];
                      const isFridayExamBlock = day === 'Cuma' && (time === '13:00-14:00' || time === '14:00-15:00');
                      
                      return (
                        <td 
                          key={day}
                          className="border border-gray-300 p-1"
                        >
                          <button
                            onClick={() => !isFridayExamBlock && toggleSlot(day, time)}
                            disabled={isFridayExamBlock}
                            className={`w-full h-12 rounded transition-colors ${
                              isFridayExamBlock
                                ? 'bg-gray-300 cursor-not-allowed'
                                : isUnavailable
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-100 hover:bg-green-200'
                            }`}
                            title={
                              isFridayExamBlock 
                                ? 'Sınav Bloğu - Ders konulamaz' 
                                : isUnavailable 
                                ? 'Müsait Değil' 
                                : 'Müsait'
                            }
                          >
                            {isFridayExamBlock && (
                              <span className="text-xs text-gray-600">🚫 Sınav</span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-6 mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 border border-gray-300 rounded"></div>
              <span className="text-sm text-gray-700">Müsait</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Müsait Değil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <span className="text-sm text-gray-700">Sınav Bloğu (Otomatik)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
