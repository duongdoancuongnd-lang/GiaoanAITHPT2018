import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Check, 
  FolderPlus,
  ArrowRight
} from 'lucide-react';
import { Subject, Grade, TextbookSet, Chapter, Lesson } from '../../types';

interface CurriculumManagerViewProps {
  subjects: Subject[];
  grades: Grade[];
  textbookSets: TextbookSet[];
  chapters: Chapter[];
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onAddChapter: (chapter: Chapter) => void;
  onAddLesson: (chapterId: string, lesson: Lesson) => void;
  onStartLessonPlanForLesson: (subject: Subject, grade: Grade, textbook: TextbookSet, lessonTitle: string) => void;
}

export const CurriculumManagerView: React.FC<CurriculumManagerViewProps> = ({
  subjects,
  grades,
  textbookSets,
  chapters,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onAddChapter,
  onAddLesson,
  onStartLessonPlanForLesson,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub_math');
  const [selectedGradeId, setSelectedGradeId] = useState<string>('g10');
  const [selectedTextbookId, setSelectedTextbookId] = useState<string>('kntt');
  const [activeTab, setActiveTab] = useState<'curriculum' | 'subjects_crud' | 'textbooks_crud'>('curriculum');

  // Modal / Form state for Add Subject
  const [showAddSubjectModal, setShowAddSubjectModal] = useState<boolean>(false);
  const [newSubName, setNewSubName] = useState<string>('');
  const [newSubCode, setNewSubCode] = useState<string>('');
  const [newSubCategory, setNewSubCategory] = useState<any>('basic');
  const [newSubCompetencies, setNewSubCompetencies] = useState<string>('');

  // Form state for Add Chapter
  const [showAddChapterModal, setShowAddChapterModal] = useState<boolean>(false);
  const [newChapterTitle, setNewChapterTitle] = useState<string>('');
  const [newChapterNum, setNewChapterNum] = useState<number>(1);

  // Form state for Add Lesson
  const [showAddLessonModal, setShowAddLessonModal] = useState<boolean>(false);
  const [targetChapterId, setTargetChapterId] = useState<string>('');
  const [newLessonTitle, setNewLessonTitle] = useState<string>('');
  const [newLessonPeriods, setNewLessonPeriods] = useState<number>(2);
  const [newLessonYccd, setNewLessonYccd] = useState<string>('');

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const currentGrade = grades.find(g => g.id === selectedGradeId) || grades[0];
  const currentTextbook = textbookSets.find(t => t.id === selectedTextbookId) || textbookSets[0];

  const currentChapters = chapters.filter(
    c => c.subjectId === selectedSubjectId && c.gradeId === selectedGradeId
  );

  const handleSaveNewSubject = () => {
    if (!newSubName.trim()) return;
    const newSubject: Subject = {
      id: `sub_custom_${Date.now()}`,
      name: newSubName.trim(),
      code: newSubCode.trim() || newSubName.toLowerCase().replace(/\s+/g, '_'),
      isCompulsory: false,
      category: 'science',
      iconName: 'BookOpen',
      specificCompetencies: newSubCompetencies.split('\n').filter(Boolean),
    };
    onAddSubject(newSubject);
    setShowAddSubjectModal(false);
    setNewSubName('');
    setNewSubCode('');
    setNewSubCompetencies('');
  };

  const handleSaveNewChapter = () => {
    if (!newChapterTitle.trim()) return;
    const newChapter: Chapter = {
      id: `ch_${Date.now()}`,
      subjectId: selectedSubjectId,
      gradeId: selectedGradeId,
      textbookSetId: selectedTextbookId,
      order: newChapterNum,
      title: newChapterTitle.trim(),
      lessons: [],
    };
    onAddChapter(newChapter);
    setShowAddChapterModal(false);
    setNewChapterTitle('');
  };

  const handleSaveNewLesson = () => {
    if (!newLessonTitle.trim() || !targetChapterId) return;
    const newLesson: Lesson = {
      id: `les_${Date.now()}`,
      chapterId: targetChapterId,
      subjectId: selectedSubjectId,
      gradeId: selectedGradeId,
      textbookSetId: selectedTextbookId,
      title: newLessonTitle.trim(),
      periodCount: newLessonPeriods,
      learningOutcomes: newLessonYccd.split('\n').filter(Boolean),
      coreKnowledge: ['Khái niệm và phương pháp giải toán'],
    };
    onAddLesson(targetChapterId, newLesson);
    setShowAddLessonModal(false);
    setNewLessonTitle('');
    setNewLessonYccd('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>Chương Trình Giáo Dục Phổ Thông 2018 (THPT)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Khung 17 môn học, bộ sách giáo khoa và danh mục Yêu cầu cần đạt chuẩn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('curriculum')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'curriculum' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            Chương Trình & Bài Học
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subjects_crud')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'subjects_crud' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            Quản Lý 17 Môn Học
          </button>
        </div>
      </div>

      {activeTab === 'curriculum' ? (
        <div className="space-y-5">
          {/* Filter selectors */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">1. Chọn Môn Học</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">2. Chọn Khối Lớp</label>
              <select
                value={selectedGradeId}
                onChange={(e) => setSelectedGradeId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">3. Chọn Bộ Sách</label>
              <select
                value={selectedTextbookId}
                onChange={(e) => setSelectedTextbookId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              >
                {textbookSets.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Overview Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase">
                  Môn: {currentSubject.name} - {currentGrade.name}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1.5">
                  Bộ Sách: {currentTextbook.name}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Đơn vị xuất bản: {currentTextbook.publisher} • Năm áp dụng: {currentTextbook.publishedYear}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddChapterModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 text-xs font-semibold shadow-xs"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Thêm Chương / Chủ Đề</span>
              </button>
            </div>

            {/* Specific competencies tags */}
            <div className="mt-4 pt-3 border-t border-blue-200/70">
              <span className="text-[11px] font-bold text-blue-900 block mb-1.5">
                Năng Lực Đặc Thù Môn {currentSubject.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentSubject.specificCompetencies.map((comp, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-white border border-blue-200 text-[11px] text-slate-700 font-medium"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chapters & Lessons Accordion List */}
          <div className="space-y-4">
            {currentChapters.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Chưa có bài học cụ thể cho môn này</h3>
                <p className="text-xs text-slate-500">
                  Thầy/Cô có thể tự thêm Chương và Bài học hoặc nhấp "Soạn giáo án mới" để AI tự động tạo.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(true)}
                  className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Chương Đầu Tiên</span>
                </button>
              </div>
            ) : (
              currentChapters.map((ch) => (
                <div key={ch.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  {/* Chapter Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        Chương {ch.order}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{ch.title}</h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTargetChapterId(ch.id);
                        setShowAddLessonModal(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-medium"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-600" />
                      <span>Thêm Bài Học</span>
                    </button>
                  </div>

                  {/* Lessons list in chapter */}
                  <div className="divide-y divide-slate-100 p-2">
                    {ch.lessons.map((les) => (
                      <div
                        key={les.id}
                        className="p-3 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {les.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              {les.periodCount} tiết
                            </span>
                          </div>

                          {les.learningOutcomes?.length > 0 && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              YCCĐ: {les.learningOutcomes[0]}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onStartLessonPlanForLesson(currentSubject, currentGrade, currentTextbook, les.title)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition-colors shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Soạn KHBD Ngay</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* SUBJECTS CRUD TAB */
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Danh Mục 17 Môn Học Cấp THPT (CTGDPT 2018)</h2>
              <p className="text-xs text-slate-500">Toàn quyền thêm mới, cập nhật năng lực đặc thù hoặc xóa môn học tùy biến.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddSubjectModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Môn Học Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600">Mã: {s.code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-200 text-slate-700">
                      {s.isCompulsory ? 'Bắt buộc' : 'Lựa chọn'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{s.name}</h3>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Cấp học: THPT (Lớp 10, Lớp 11, Lớp 12)
                  </div>
                  <div className="text-[11px] text-slate-600 mt-2 bg-white p-2 rounded border border-slate-200">
                    <span className="font-bold block mb-1">Năng lực đặc thù:</span>
                    <p className="line-clamp-2">{s.specificCompetencies.join('; ')}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  {s.id.startsWith('sub_custom_') && (
                    <button
                      type="button"
                      onClick={() => onDeleteSubject(s.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold"
                    >
                      Xóa môn
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Chapter */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Thêm Chương / Chủ Đề Mới</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số thứ tự chương</label>
              <input
                type="number"
                min={1}
                value={newChapterNum}
                onChange={(e) => setNewChapterNum(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên chương / chủ đề</label>
              <input
                type="text"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                placeholder="Ví dụ: Chương I: Mệnh đề và tập hợp"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddChapterModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveNewChapter}
                className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg"
              >
                Lưu Chương
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Lesson */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Thêm Bài Học Vào Chương</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên bài học</label>
              <input
                type="text"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                placeholder="Ví dụ: Bài 1: Mệnh đề toán học"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số tiết</label>
              <input
                type="number"
                min={1}
                value={newLessonPeriods}
                onChange={(e) => setNewLessonPeriods(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Yêu cầu cần đạt (mỗi dòng 1 ý)</label>
              <textarea
                rows={3}
                value={newLessonYccd}
                onChange={(e) => setNewLessonYccd(e.target.value)}
                placeholder="Ví dụ: Nhận biết được mệnh đề toán học..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddLessonModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveNewLesson}
                className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg"
              >
                Lưu Bài Học
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Custom Subject */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Thêm Môn Học / Chuyên Đề Mới</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên môn học</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Ví dụ: Chuyên đề Trí tuệ nhân tạo"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã môn học</label>
                <input
                  type="text"
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  placeholder="Ví dụ: AI_SPEC"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Năng lực đặc thù (mỗi dòng 1 năng lực)</label>
              <textarea
                rows={3}
                value={newSubCompetencies}
                onChange={(e) => setNewSubCompetencies(e.target.value)}
                placeholder="Ví dụ: Năng lực tư duy tính toán..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddSubjectModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveNewSubject}
                className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg"
              >
                Lưu Môn Học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
