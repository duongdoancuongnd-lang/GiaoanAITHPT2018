import React, { useState } from 'react';
import { 
  User, 
  School, 
  BookOpen, 
  Settings, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Layers,
  Sparkles
} from 'lucide-react';
import { TeacherProfile, Subject, Grade, TextbookSet } from '../../types';
import { storageService } from '../../services/storageService';

interface ProfileSettingsViewProps {
  profile: TeacherProfile;
  subjects: Subject[];
  grades: Grade[];
  textbookSets: TextbookSet[];
  onSaveProfile: (profile: TeacherProfile) => void;
  onRefreshData: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  profile,
  subjects,
  grades,
  textbookSets,
  onSaveProfile,
  onRefreshData,
}) => {
  const [formData, setFormData] = useState<TeacherProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [backupMsg, setBackupMsg] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleToggleGrade = (gradeId: string) => {
    const exists = formData.teachingGrades.includes(gradeId);
    let updated: string[];
    if (exists) {
      updated = formData.teachingGrades.filter(g => g !== gradeId);
    } else {
      updated = [...formData.teachingGrades, gradeId];
    }
    setFormData({ ...formData, teachingGrades: updated });
  };

  const handleBackup = () => {
    const jsonStr = storageService.exportAllDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_giao_an_ai_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMsg('Đã tải xuống tệp sao lưu dữ liệu thành công!');
    setTimeout(() => setBackupMsg(''), 3000);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = storageService.importDataFromJson(content);
      if (ok) {
        setBackupMsg('Khôi phục dữ liệu thành công! Đang tải lại...');
        setTimeout(() => {
          onRefreshData();
          setBackupMsg('');
        }, 1500);
      } else {
        setBackupMsg('Lỗi: Tệp JSON không hợp lệ.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn đặt lại dữ liệu mẫu ban đầu? Toàn bộ giáo án hiện tại sẽ được thay bằng bộ mẫu chuẩn.')) {
      storageService.clearAll();
      onRefreshData();
      setBackupMsg('Đã khôi phục dữ liệu mẫu thành công!');
      setTimeout(() => setBackupMsg(''), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <span>Hồ Sơ Giáo Viên & Thiết Lập Hệ Thống</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Thông tin tự động điền vào tiêu đề giáo án và tùy chỉnh cấu hình soạn bài
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-blue-600" />
            <span>Thông Tin Cá Nhân & Trường Học</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên giáo viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Học vị / Chức danh
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ví dụ: Thạc sĩ, Giáo viên cốt cán..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên trường THPT <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tổ chuyên môn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tỉnh / Thành phố
              </label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Năm học mặc định
              </label>
              <select
                value={formData.schoolYear}
                onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="2024 - 2025">2024 - 2025</option>
                <option value="2025 - 2026">2025 - 2026</option>
                <option value="2026 - 2027">2026 - 2027</option>
                <option value="2027 - 2028">2027 - 2028</option>
              </select>
            </div>
          </div>
        </div>

        {/* Teaching Subjects & Textbook Preferences */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Chuyên Môn Giảng Dạy & Bộ Sách Mặc Định</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Môn học chính
              </label>
              <select
                value={formData.primarySubjectId}
                onChange={(e) => setFormData({ ...formData, primarySubjectId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bộ sách giáo khoa ưa thích
              </label>
              <select
                value={formData.defaultTextbookSetId}
                onChange={(e) => setFormData({ ...formData, defaultTextbookSetId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                {textbookSets.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Khối lớp đang phụ trách giảng dạy
            </label>
            <div className="flex items-center gap-3">
              {grades.map((g) => {
                const isSelected = formData.teachingGrades.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleToggleGrade(g.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Đã lưu cài đặt thành công!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thông Tin Hồ Sơ</span>
          </button>
        </div>
      </form>

      {/* Backup and Data Persistence Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Sao Lưu & Khôi Phục Dữ Liệu An Toàn</span>
        </h2>

        {backupMsg && (
          <div className="p-3 bg-blue-50 text-blue-800 text-xs font-medium rounded-lg border border-blue-200">
            {backupMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleBackup}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Tải Tệp Sao Lưu (JSON)</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Khôi Phục Từ Tệp JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100 text-red-700 text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Đặt Lại Dữ Liệu Mẫu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
