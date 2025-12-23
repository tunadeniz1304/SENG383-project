import { useState } from "react";
import {
  Play,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const timeSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
];

const days = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
];

// Sample schedule data
const scheduleData = {
  "1": {
    Pazartesi: {
      "09:00-10:00": {
        course: "MATH 157",
        instructor: "Dr. Johnson",
        room: "A101",
      },
      "10:00-11:00": {
        course: "MATH 157",
        instructor: "Dr. Johnson",
        room: "A101",
      },
      "11:00-12:00": {
        course: "PHYS 131",
        instructor: "Dr. Brown",
        room: "B201",
      },
    },
    Salı: {
      "09:00-10:00": {
        course: "ENG 121",
        instructor: "Dr. Smith",
        room: "A102",
      },
      "10:00-11:00": {
        course: "SENG 101",
        instructor: "Dr. Demir",
        room: "A101",
      },
      "14:00-15:00": {
        course: "SENG 101 Lab",
        instructor: "Dr. Demir",
        room: "Lab 1",
        type: "lab",
      },
      "15:00-16:00": {
        course: "SENG 101 Lab",
        instructor: "Dr. Demir",
        room: "Lab 1",
        type: "lab",
      },
    },
  },
  "2": {
    Pazartesi: {
      "09:00-10:00": {
        course: "SENG 201",
        instructor: "Dr. Kaya",
        room: "A101",
      },
      "10:00-11:00": {
        course: "MATH 223",
        instructor: "Dr. Johnson",
        room: "B201",
      },
    },
  },
};

const violations = [
  {
    type: "error",
    title: "Kapasite Sorunu",
    message: "Lab 3 kapasite aşımı",
    details: "SENG 301 Lab - 45 öğrenci / 40 kapasite",
    time: "14:32",
  },
  {
    type: "warning",
    title: "Öğretim Elemanı Çakışması",
    message: "Dr. Smith - Pazartesi 5 saat ders",
    details: "Günlük 4 saat limitini aşıyor",
    time: "14:32",
  },
  {
    type: "warning",
    title: "Program Boşluğu",
    message: "2. Sınıf - Çarşamba 2 saatlik boşluk",
    details: "11:00-13:00 arası boş",
    time: "14:32",
  },
];

export function OutputReporting() {
  const [selectedYear, setSelectedYear] = useState("1");
  const [showReport, setShowReport] = useState(false);
  const schedule =
    scheduleData[selectedYear as keyof typeof scheduleData] ||
    {};

  return (
    <div className="p-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-2">
            📊 Çizelge ve Raporlama
          </h2>
          <p className="text-gray-600 text-sm">
            Oluşturulan ders programını görüntüleyin ve
            doğrulama raporlarını inceleyin
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowReport(!showReport)}
          >
            <FileText className="w-4 h-4" />
            View Report
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg">
            <Play className="w-5 h-5" />
            Generate Schedule
          </Button>
        </div>
      </div>

      {/* Year Selection */}
      <div className="flex gap-2 mb-6">
        {["1", "2", "3", "4"].map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-6 py-3 rounded-lg transition-all ${
              selectedYear === year
                ? "bg-amber-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border border-gray-300 hover:border-amber-300"
            }`}
          >
            {year}. Sınıf
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3">
          <h3 className="text-white">
            Haftalık Ders Çizelgesi - {selectedYear}. Sınıf
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="border border-gray-300 px-4 py-3 text-sm text-gray-700 min-w-[100px]">
                  Saat
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="border border-gray-300 px-4 py-3 text-sm text-gray-700 min-w-[180px]"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => {
                const isFridayExamBlock =
                  time === "13:00-14:00" ||
                  time === "14:00-15:00";

                return (
                  <tr key={time} className="hover:bg-amber-50">
                    <td className="border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      {time}
                    </td>
                    {days.map((day) => {
                      const cell = schedule[day]?.[time];
                      const isExamBlock =
                        day === "Cuma" && isFridayExamBlock;

                      return (
                        <td
                          key={day}
                          className="border border-gray-300 p-2"
                        >
                          {isExamBlock ? (
                            <div className="bg-gray-300 rounded p-3 h-20 flex items-center justify-center">
                              <div className="text-center">
                                <span className="text-xs text-gray-600">
                                  🚫 Sınav Bloğu
                                </span>
                              </div>
                            </div>
                          ) : cell ? (
                            <div
                              className={`rounded p-3 h-20 flex flex-col justify-between shadow-sm ${
                                cell.type === "lab"
                                  ? "bg-purple-100 border-2 border-purple-400"
                                  : "bg-blue-100 border-2 border-blue-400"
                              }`}
                            >
                              <div>
                                <div className="text-sm text-gray-900">
                                  {cell.course}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {cell.instructor}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {cell.room}
                              </div>
                            </div>
                          ) : (
                            <div className="h-20"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center gap-6">
          <span className="text-sm text-gray-700">
            Gösterge:
          </span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 border-2 border-blue-400 rounded"></div>
            <span className="text-sm text-gray-700">
              Teorik Ders
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-100 border-2 border-purple-400 rounded"></div>
            <span className="text-sm text-gray-700">
              Lab Dersi
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <span className="text-sm text-gray-700">
              Sınav Bloğu
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-100 border-2 border-red-400 rounded"></div>
            <span className="text-sm text-gray-700">
              Çakışma
            </span>
          </div>
        </div>
      </div>

      {/* Validation Report */}
      {showReport && (
        <div className="bg-white rounded-lg border-2 border-blue-300 shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-900">
                  Doğrulama Raporu
                </h3>
                <p className="text-sm text-gray-600">
                  Kural ihlalleri ve uyarılar
                </p>
              </div>
            </div>

            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              PDF İndir
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">
                  Başarılı Kontroller
                </span>
              </div>
              <p className="text-2xl text-green-700">12</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-sm text-gray-700">
                  Uyarılar
                </span>
              </div>
              <p className="text-2xl text-amber-700">
                {
                  violations.filter((v) => v.type === "warning")
                    .length
                }
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-700">
                  Hatalar
                </span>
              </div>
              <p className="text-2xl text-red-700">
                {
                  violations.filter((v) => v.type === "error")
                    .length
                }
              </p>
            </div>
          </div>

          {/* Violations List */}
          <div className="space-y-3">
            {violations.map((violation, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-lg p-4 ${
                  violation.type === "error"
                    ? "bg-red-50 border-red-500"
                    : "bg-amber-50 border-amber-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      violation.type === "error"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={`text-sm ${
                          violation.type === "error"
                            ? "text-red-900"
                            : "text-amber-900"
                        }`}
                      >
                        {violation.title}
                      </h4>
                      <Badge
                        variant={
                          violation.type === "error"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {violation.type === "error"
                          ? "Hata"
                          : "Uyarı"}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-auto">
                        {violation.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm mb-1 ${
                        violation.type === "error"
                          ? "text-red-800"
                          : "text-amber-800"
                      }`}
                    >
                      {violation.message}
                    </p>
                    <p className="text-sm text-gray-600">
                      {violation.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}