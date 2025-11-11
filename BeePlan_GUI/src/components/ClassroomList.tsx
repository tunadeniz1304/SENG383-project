import { useState } from 'react';
import { Upload, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const sampleRooms = [
  { id: 1, name: 'A101', capacity: 60, type: 'Derslik', available: true },
  { id: 2, name: 'A102', capacity: 50, type: 'Derslik', available: true },
  { id: 3, name: 'A103', capacity: 80, type: 'Derslik', available: true },
  { id: 4, name: 'B201', capacity: 70, type: 'Derslik', available: true },
  { id: 5, name: 'Lab 1', capacity: 40, type: 'Lab', available: true },
  { id: 6, name: 'Lab 2', capacity: 40, type: 'Lab', available: true },
  { id: 7, name: 'Lab 3', capacity: 35, type: 'Lab', available: true },
  { id: 8, name: 'C301', capacity: 45, type: 'Derslik', available: false },
];

export function ClassroomList() {
  const [rooms, setRooms] = useState(sampleRooms);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-900">🏢 Derslik/Lab Listesi</h3>
          <p className="text-sm text-gray-600 mt-1">
            Derslerin atanacağı mekanların listesi
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            CSV/JSON Yükle
          </Button>
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4" />
            Yeni Mekan Ekle
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Mekan Adı</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Kapasite</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Türü</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">Müsaitlik</th>
              <th className="px-4 py-3 text-left text-sm text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-gray-100 hover:bg-amber-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900">{room.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {room.capacity} kişi
                  {room.type === 'Lab' && room.capacity > 40 && (
                    <span className="ml-2 text-xs text-amber-600">⚠️ Limit aşımı</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={room.type === 'Lab' ? 'default' : 'secondary'}>
                    {room.type}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {room.available ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      ✓ Müsait
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                      ✗ Müsait Değil
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Toplam Mekan</p>
          <p className="text-2xl text-gray-900">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Derslikler</p>
          <p className="text-2xl text-gray-900">{rooms.filter(r => r.type === 'Derslik').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Laboratuvarlar</p>
          <p className="text-2xl text-gray-900">{rooms.filter(r => r.type === 'Lab').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Müsait Mekan</p>
          <p className="text-2xl text-gray-900">{rooms.filter(r => r.available).length}</p>
        </div>
      </div>
    </div>
  );
}
