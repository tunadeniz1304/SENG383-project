import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const rules = [
  {
    id: 1,
    title: 'Max Hoca Dersi',
    description: 'Günde en fazla 4 saat teorik ders',
    details: 'Her öğretim elemanına 1 gün içerisinde lisansüstü dersler de dahil olmak üzere en fazla 4 saatlik ders planlanmalıdır.',
    type: 'critical'
  },
  {
    id: 2,
    title: 'Lab Sırası',
    description: 'Lab, teorik dersten sonra olmalı',
    details: 'Lab dersleri, dersin teorik saatinden önce olmamalıdır. Lab seansları ilgili teorik dersten sonra planlanmalıdır.',
    type: 'critical'
  },
  {
    id: 3,
    title: 'Cuma Kısıtı',
    description: 'Cuma 13:20-15:10 arasına ders konulamaz (Sınav Bloğu)',
    details: 'Cuma günü 13:20-15:10 zaman aralığı sınav bloğu olarak ayrılmıştır ve bu saatlere hiçbir ders planlanamaz.',
    type: 'critical'
  },
  {
    id: 4,
    title: 'Lab Kapasitesi',
    description: 'Max 40 öğrenci/şube',
    details: 'Lab derslerinde 1 şubede en fazla 40 öğrenci olabilir. Daha fazla öğrenci varsa yeni şube açılmalıdır.',
    type: 'critical'
  },
  {
    id: 5,
    title: 'Ortak Dersler Önceliği',
    description: 'PHYS, MATH, ENG dersleri öncelikli',
    details: 'Öncelikle ortak derslerin (PHYS, MATH, ENG) programı dikkate alınmalıdır.',
    type: 'important'
  },
  {
    id: 6,
    title: '3. Sınıf Seçmeli Dersler',
    description: 'Teknik seçmeli dersleri seçebilme',
    details: '3. sınıfların teknik seçmeli dersleri seçebilmesine dikkat edilecektir. Zorunlu dersler seçmeli ders saatleriyle çakışmamalıdır.',
    type: 'important'
  },
  {
    id: 7,
    title: 'CENG Seçmeli Program',
    description: 'Seçmeli ders programı koordinasyonu',
    details: 'CENG seçmeli ders programı dikkate alınmalı ve CENG ile SENG seçmeli dersleri çakışmamalıdır.',
    type: 'important'
  },
  {
    id: 8,
    title: 'Ders Kotaları',
    description: 'Kontenjan yönetimi',
    details: 'Ders kotaları ve diğer bölümlere ayrılacak olan kotalar belirlenmelidir.',
    type: 'info'
  },
];

export function RulesViewer() {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-gray-900">⚙️ Kural Görüntüleyici</h3>
        <p className="text-sm text-gray-600 mt-1">
          Algoritmada gözetilecek ana kısıtların listesi (Bu kurallar otomatik uygulanır)
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm text-amber-900 mb-1">Önemli Bilgi</h4>
            <p className="text-sm text-amber-800">
              Bu kurallar otomatik olarak algoritma tarafından uygulanır. Kullanıcı tarafından 
              düzenlenemez ve her program oluşturma işleminde kontrol edilir.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div 
            key={rule.id} 
            className={`bg-white rounded-lg border-2 p-5 shadow-sm ${
              rule.type === 'critical' 
                ? 'border-red-200 hover:border-red-300' 
                : rule.type === 'important'
                ? 'border-amber-200 hover:border-amber-300'
                : 'border-blue-200 hover:border-blue-300'
            } transition-colors`}
          >
            <div className="flex items-start gap-3 mb-3">
              {rule.type === 'critical' ? (
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              ) : rule.type === 'important' ? (
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-gray-900">{rule.title}</h4>
                  {rule.type === 'critical' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                      Kritik
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
              </div>
            </div>
            
            <div className="pl-13">
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-200">
                {rule.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm text-gray-900 mb-3">Kural Seviyeleri</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700"><strong>Kritik:</strong> Mutlaka uygulanmalı</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-sm text-gray-700"><strong>Önemli:</strong> Yüksek öncelikli</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700"><strong>Bilgi:</strong> Dikkate alınmalı</span>
          </div>
        </div>
      </div>
    </div>
  );
}
