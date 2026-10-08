import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Star, 
  Copy, 
  Download, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { LessonPlan, Subject, Grade, TextbookSet } from '../../types';

interface LessonPlansLibraryViewProps {
  plans: LessonPlan[];
  subjects: Subject[];
  grades: Grade[];
  textbookSets: TextbookSet[];
  onOpenPlan: (plan: LessonPlan) => void;
  onNewPlan: () => void;
  onExportDocx: (plan: LessonPlan) => void;
  onDuplicatePlan: (id: string) => void;
  onDeletePlan: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const LessonPlansLibraryView: React.FC<LessonPlansLibraryViewProps> = ({
  plans,
  subjects,
  grades,
  textbookSets,
  onOpenPlan,
  onNewPlan,
  onExportDocx,
  onDuplicatePlan,
  onDeletePlan,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTextbook, setSelectedTextbook] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredPlans = plans.filter((p) => {
    if (onlyFavorites && !p.isFavorite) return false;
    if (selectedSubject !== 'all' && p.subjectId !== selectedSubject) return false;
    if (selectedGrade !== 'all' && p.gradeId !== selectedGrade) return false;
    if (selectedTextbook !== 'all' && p.textbookSetId !== selectedTextbook) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSub = p.subjectName.toLowerCase().includes(q);
      return matchTitle || matchSub;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Kho Giáo Án Cá Nhân</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý toàn bộ Kế hoạch bài dạy đã soạn ({plans.length} bài)
          </p>
        </div>

        <button
          type="button"
          onClick={onNewPlan}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Soạn Giáo Án Mới</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài dạy theo tên bài, từ khóa, môn học..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* View Switcher & Favorites Toggle */}
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-end">
            <button
              type="button"
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                onlyFavorites
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
              <span>Yêu thích</span>
            </button>

            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dạng lưới thẻ"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dạng danh sách bảng"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả môn học ({subjects.length})</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả khối lớp</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedTextbook}
              onChange={(e) => setSelectedTextbook(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả bộ sách</option>
              {textbookSets.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Plans List or Grid View */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy Kế hoạch bài dạy nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thử thay đổi bộ lọc tìm kiếm hoặc bắt đầu soạn một bài dạy mới.
          </p>
          <button
            type="button"
            onClick={onNewPlan}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Soạn bài mới</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {plan.subjectName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {plan.gradeName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(plan.id)}
                    className="p-1 rounded text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${plan.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                </div>

                <h3
                  onClick={() => onOpenPlan(plan)}
                  className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                  title={plan.title}
                >
                  {plan.title}
                </h3>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Bộ sách: {plan.textbookSetName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{plan.durationPeriods} tiết ({plan.durationMinutes} phút) • {plan.activities.length} HĐ</span>
                  </div>
                  {plan.qualityCheck?.totalScore && (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Thẩm định: {plan.qualityCheck.totalScore}/100đ</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onDuplicatePlan(plan.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    title="Nhân bản bài dạy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeletePlan(plan.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    title="Xóa bài dạy"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onExportDocx(plan)}
                    className="p-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 text-xs font-semibold"
                    title="Xuất Word (.docx)"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenPlan(plan)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    Mở Soạn
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(plan.id)}
                    className="mt-1 text-slate-400 hover:text-amber-500"
                  >
                    <Star className={`w-4 h-4 ${plan.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {plan.subjectName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {plan.gradeName}
                      </span>
                      <span className="text-xs text-slate-500">{plan.textbookSetName}</span>
                    </div>

                    <h3
                      onClick={() => onOpenPlan(plan)}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer truncate max-w-xl"
                    >
                      {plan.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onDuplicatePlan(plan.id)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                    title="Nhân bản"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onExportDocx(plan)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Word</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenPlan(plan)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
