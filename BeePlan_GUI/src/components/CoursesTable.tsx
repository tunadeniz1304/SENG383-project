import { useState } from 'react';
import { Upload, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const sampleCourses = [
  { id: 1, code: 'PHYS 131', name: 'Physics I / Fizik I', weeklyHours: '3+2', students: 120, sections: 3, instructor: 'Dr. Brown' },
  { id: 2, code: 'TURK 101', name: 'Turkish I / Türk Dili I', weeklyHours: '2+0', students: 120, sections: 3, instructor: 'Dr. Yılmaz' },
  { id: 3, code: 'ENG 121', name: 'Academic English I / Akademik İngilizce I', weeklyHours: '3+0', students: 120, sections: 3, instructor: 'Dr. Smith' },
  { id: 4, code: 'MATH 157', name: 'Calculus for Engineering I', weeklyHours: '4+0', students: 120, sections: 3, instructor: 'Dr. Johnson' },
  { id: 5, code: 'SENG 101', name: 'Computer Programming I / Bilgisayar Programlama I', weeklyHours: '3+2', students: 80, sections: 2, instructor: 'Dr. Demir' },
  { id: 6, code: 'SENG 201', name: 'Data Structures', weeklyHours: '3+2', students: 70, sections: 2, instructor: 'Dr. Kaya' },
  { id: 7, code: 'SENG 301', name: 'Software Project Management', weeklyHours: '2+2', students: 60, sections: 2, instructor: 'Dr. Öztürk' },
  { id: 8, code: 'SENG 426', name: 'Formal Methods in Software Development', weeklyHours: '4+0', students: 40, sections: 1, instructor: 'Dr. Yılmaz' },
];

export function CoursesTable() {
  const [courses, setCourses] = useState(sampleCourses);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-900">📚 Dersler Tablosu</h3>
          <p className="text-sm text-gray-600 mt-1">
            Tüm zorunlu ve seçmeli derslerin listelendiği düzenlenebilir tablo
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            CSV/JSON Yükle
          </Button>
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4" />
            Yeni Ders Ekle
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Ders Kodu</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Ders Adı</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Haftalık Saat</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Öğrenci Sayısı</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Şube Sayısı</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">Öğretim Elemanı</th>
                <th className="px-4 py-3 text-left text-sm text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr 
                  key={course.id} 
                  className={`border-b border-gray-100 hover:bg-amber-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3">
                    <Input 
                      defaultValue={course.code} 
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input 
                      defaultValue={course.name} 
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input 
                      defaultValue={course.weeklyHours} 
                      className="h-8 text-sm w-20"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input 
                      type="number"
                      defaultValue={course.students} 
                      className="h-8 text-sm w-24"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input 
                      type="number"
                      defaultValue={course.sections} 
                      className="h-8 text-sm w-20"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input 
                      defaultValue={course.instructor} 
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8">
                        <Save className="w-3 h-3 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
        💡 <strong>İpucu:</strong> Tablo hücrelerine tıklayarak doğrudan düzenleme yapabilirsiniz. 
        Değişiklikleri kaydetmek için "Kaydet" butonunu kullanın.
      </div>
    </div>
  );
}
