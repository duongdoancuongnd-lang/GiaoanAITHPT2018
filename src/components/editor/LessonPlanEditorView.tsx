import React, { useState } from 'react';
import { 
  Save, 
  Download, 
  Printer, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Lock, 
  Unlock, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Layers, 
  Check, 
  Share2, 
  RefreshCw,
  Calendar,
  Clock,
  BookOpen,
  Award
} from 'lucide-react';
import { LessonPlan, TeacherProfile, Activity } from '../../types';
import { exportService } from '../../services/exportService';

interface LessonPlanEditorViewProps {
  plan: LessonPlan;
  profile: TeacherProfile;
  onSavePlan: (updatedPlan: LessonPlan) => void;
  onBack: () => void;
  onOpenQualityCheck: (plan: LessonPlan) => void;
  onOpenUpgradeModal: (plan: LessonPlan) => void;
}

export const LessonPlanEditorView: React.FC<LessonPlanEditorViewProps> = ({
  plan,
  profile,
  onSavePlan,
  onBack,
  onOpenQualityCheck,
  onOpenUpgradeModal,
}) => {
  const [currentPlan, setCurrentPlan] = useState<LessonPlan>({ ...plan });
  const [activeTemplate, setActiveTemplate] = useState<string>(plan.templateType || '5512_standard');
  const [lockedSections, setLockedSections] = useState<Record<string, boolean>>({});
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);

  const toggleLock = (sectionKey: string) => {
    setLockedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleSave = () => {
    const updated = {
      ...currentPlan,
      templateType: activeTemplate as any,
      updatedAt: new Date().toISOString(),
    };
    onSavePlan(updated);
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 2000);
  };

  const handleExportDocx = async () => {
    await exportService.exportLessonPlanToDocx(currentPlan, profile);
  };

  const handleCopyClipboard = async () => {
    const success = await exportService.copyLessonPlanToClipboard(currentPlan);
    if (success) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBumpYear = () => {
    const years = ['2024 - 2025', '2025 - 2026', '2026 - 2027', '2027 - 2028'];
    const currentIdx = years.indexOf(currentPlan.schoolYear);
    const nextYear = years[currentIdx + 1] || '2026 - 2027';
    setCurrentPlan(prev => ({
      ...prev,
      schoolYear: nextYear,
      title: `${prev.title.replace(/\(Năm học [^)]+\)/, '')} (Năm học ${nextYear})`
    }));
  };

  // Add / Remove Activity helpers
  const handleAddActivity = () => {
    const newAct: Activity = {
      id: `act_${Date.now()}`,
      phase: 'extension',
      title: `Hoạt động ${currentPlan.activities.length + 1}: Mở rộng và Dự án học tập`,
      durationMinutes: 10,
      objectives: 'Phát triển năng lực tự học và tư duy sáng tạo thông qua bài toán thực tiễn.',
      content: 'Học sinh thực hiện nhiệm vụ khám phá liên môn hoặc ứng dụng thực tế.',
      product: 'Bản thiết kế hoặc sản phẩm số của học sinh.',
      execution: {
        assignTask: 'GV nêu rõ câu hỏi nghiên cứu và cung cấp tài liệu tham khảo.',
        doTask: 'HS tự lập kế hoạch và phân công nhiệm vụ nhóm.',
        reportDiscuss: 'Trình bày sản phẩm tại không gian triển lãm học tập của lớp.',
        concludeAssess: 'GV và học sinh cùng đánh giá theo Rubric tiêu chí.'
      }
    };

    setCurrentPlan(prev => ({
      ...prev,
      activities: [...prev.activities, newAct]
    }));
  };

  const handleDeleteActivity = (actId: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== actId)
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Sticky Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs sticky top-18 z-20 flex flex-wrap items-center justify-between gap-3">
        {/* Left Back and Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h1 className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-md">
              {currentPlan.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-blue-600">{currentPlan.subjectName} {currentPlan.gradeName}</span>
              <span>•</span>
              <span>{currentPlan.textbookSetName}</span>
              <span>•</span>
              <span>{currentPlan.durationPeriods} tiết ({currentPlan.durationMinutes}p)</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Quality Check */}
          <button
            id="btn-editor-quality-check"
            type="button"
            onClick={() => onOpenQualityCheck(currentPlan)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold transition-colors"
            title="Kiểm tra 15 tiêu chí sư phạm theo Công văn 5512"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kiểm Tra 15 Tiêu Chí</span>
          </button>

          {/* AI 3-Dimension Upgrade */}
          <button
            id="btn-editor-ai-upgrade"
            type="button"
            onClick={() => onOpenUpgradeModal(currentPlan)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-300 text-purple-800 bg-purple-50 hover:bg-purple-100 text-xs font-semibold transition-colors"
            title="Nâng cấp KHBD theo 3 chiều: Tốt hơn - Khác đi - Ngược lại"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Nâng Cấp</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            type="button"
            onClick={handleCopyClipboard}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Sao chép toàn bộ văn bản"
          >
            {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Print / PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="In / Xuất file PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Export DOCX */}
          <button
            id="btn-editor-export-docx"
            type="button"
            onClick={handleExportDocx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            title="Tải tệp Microsoft Word chuẩn A4"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Word (.docx)</span>
          </button>

          {/* Save Plan Button */}
          <button
            id="btn-editor-save-plan"
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            {isSavedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{isSavedSuccess ? 'Đã lưu!' : 'Lưu bài dạy'}</span>
          </button>
        </div>
      </div>

      {/* Template Selector Bar */}
      <div className="bg-slate-100 p-2 rounded-xl border border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-bold text-slate-600 px-2 shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Mẫu Giáo Án:</span>
        </span>
        {[
          { id: '5512_standard', label: 'Mẫu 1: Chuẩn CV 5512' },
          { id: '3_parts', label: 'Mẫu 2: Cấu trúc 3 Phần' },
          { id: 'table_4cols', label: 'Mẫu 3: Bảng 4 Cột' },
          { id: 'detailed_table', label: 'Mẫu 4: Chi Tiết 4 Cột' },
          { id: 'digital_competency', label: 'Mẫu 5: Năng Lực Số' },
          { id: 'stem_steam', label: 'Mẫu 6: STEM / STEAM' },
          { id: 'ai_integrated', label: 'Mẫu 7: Có Ứng Dụng AI' },
        ].map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => setActiveTemplate(tpl.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
              activeTemplate === tpl.id
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            {tpl.label}
          </button>
        ))}
      </div>

      {/* Main Document Body (Styled for standard Vietnamese Lesson Plan Layout) */}
      <div 
        id="lesson-plan-print-area"
        className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-12 shadow-sm font-times max-w-4xl mx-auto space-y-8 text-slate-900"
      >
        {/* Header Quốc hiệu & Trường */}
        <div className="grid grid-cols-2 text-center text-xs sm:text-sm font-bold border-b border-slate-200 pb-6">
          <div>
            <input
              type="text"
              value={currentPlan.schoolName.toUpperCase()}
              onChange={(e) => setCurrentPlan({ ...currentPlan, schoolName: e.target.value })}
              className="w-full text-center font-bold uppercase border-none focus:ring-1 focus:ring-blue-400 p-1"
            />
            <input
              type="text"
              value={`TỔ: ${currentPlan.department.toUpperCase()}`}
              onChange={(e) => setCurrentPlan({ ...currentPlan, department: e.target.value.replace(/^TỔ:\s*/i, '') })}
              className="w-full text-center font-bold text-xs uppercase border-none focus:ring-1 focus:ring-blue-400 p-1 mt-0.5"
            />
            <div className="text-xs text-slate-600 font-normal mt-1">
              GV: <input
                type="text"
                value={currentPlan.teacherName}
                onChange={(e) => setCurrentPlan({ ...currentPlan, teacherName: e.target.value })}
                className="font-medium text-xs border-b border-slate-300 focus:ring-1 focus:ring-blue-400 p-0.5 text-center"
              />
            </div>
          </div>

          <div>
            <p className="font-bold text-xs sm:text-sm">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold text-xs sm:text-sm underline">Độc lập - Tự do - Hạnh phúc</p>
            <div className="text-xs text-slate-500 italic mt-2 flex items-center justify-center gap-1">
              <span>Năm học:</span>
              <input
                type="text"
                value={currentPlan.schoolYear}
                onChange={(e) => setCurrentPlan({ ...currentPlan, schoolYear: e.target.value })}
                className="w-24 text-center text-xs italic border-b border-slate-300 focus:ring-1 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={handleBumpYear}
                className="text-[10px] text-blue-600 underline font-sans ml-1 hover:text-blue-800"
                title="Tạo phiên bản cho năm học tiếp theo"
              >
                (Tăng năm học)
              </button>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide">
            KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
          </h2>
          <textarea
            rows={1}
            value={currentPlan.title.toUpperCase()}
            onChange={(e) => setCurrentPlan({ ...currentPlan, title: e.target.value })}
            className="w-full text-center font-bold text-base sm:text-lg uppercase text-blue-950 border-none focus:ring-1 focus:ring-blue-400 resize-none"
          />
          <p className="text-xs sm:text-sm italic text-slate-600">
            Môn học: {currentPlan.subjectName} | Lớp: {currentPlan.gradeName} | Bộ sách: {currentPlan.textbookSetName}
          </p>
          <p className="text-xs italic text-slate-500">
            Thời lượng: {currentPlan.durationPeriods} tiết ({currentPlan.durationMinutes} phút)
          </p>
        </div>

        {/* I. MỤC TIÊU */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <h3 className="font-bold text-sm sm:text-base uppercase text-blue-900">
              I. MỤC TIÊU
            </h3>
            <button
              type="button"
              onClick={() => toggleLock('objectives')}
              className={`p-1 rounded text-xs flex items-center gap-1 font-sans ${
                lockedSections['objectives'] ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-slate-600'
              }`}
              title={lockedSections['objectives'] ? 'Đã khóa nội dung (AI sẽ không ghi đè)' : 'Chưa khóa nội dung'}
            >
              {lockedSections['objectives'] ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{lockedSections['objectives'] ? 'Đã Khóa' : 'Khóa mục'}</span>
            </button>
          </div>

          {/* 1. Kiến thức */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs sm:text-sm">1. Về kiến thức:</h4>
            {currentPlan.objectives.knowledge.map((k, idx) => (
              <div key={idx} className="flex items-start gap-2 pl-4">
                <span className="font-bold text-xs mt-1">•</span>
                <textarea
                  rows={2}
                  value={k}
                  onChange={(e) => {
                    const copy = [...currentPlan.objectives.knowledge];
                    copy[idx] = e.target.value;
                    setCurrentPlan({
                      ...currentPlan,
                      objectives: { ...currentPlan.objectives, knowledge: copy }
                    });
                  }}
                  className="flex-1 text-xs sm:text-sm border-none bg-slate-50/50 p-1.5 rounded focus:bg-white focus:ring-1 focus:ring-blue-400 resize-none"
                />
              </div>
            ))}
          </div>

          {/* 2. Năng lực */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs sm:text-sm">2. Về năng lực:</h4>
            
            <div className="pl-4 space-y-2">
              <p className="font-semibold text-xs italic">a) Năng lực chung:</p>
              {currentPlan.objectives.generalCompetencies.selfAutonomy.map((c, i) => (
                <div key={`sa_${i}`} className="flex items-start gap-2 pl-4">
                  <span className="text-xs font-bold mt-1">• Tự chủ và tự học:</span>
                  <textarea
                    rows={1}
                    value={c}
                    onChange={(e) => {
                      const copy = [...currentPlan.objectives.generalCompetencies.selfAutonomy];
                      copy[i] = e.target.value;
                      setCurrentPlan({
                        ...currentPlan,
                        objectives: {
                          ...currentPlan.objectives,
                          generalCompetencies: { ...currentPlan.objectives.generalCompetencies, selfAutonomy: copy }
                        }
                      });
                    }}
                    className="flex-1 text-xs sm:text-sm border-none bg-slate-50/50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-400 resize-none"
                  />
                </div>
              ))}

              {currentPlan.objectives.generalCompetencies.communication.map((c, i) => (
                <div key={`comm_${i}`} className="flex items-start gap-2 pl-4">
                  <span className="text-xs font-bold mt-1">• Giao tiếp và hợp tác:</span>
                  <textarea
                    rows={1}
                    value={c}
                    onChange={(e) => {
                      const copy = [...currentPlan.objectives.generalCompetencies.communication];
                      copy[i] = e.target.value;
                      setCurrentPlan({
                        ...currentPlan,
                        objectives: {
                          ...currentPlan.objectives,
                          generalCompetencies: { ...currentPlan.objectives.generalCompetencies, communication: copy }
                        }
                      });
                    }}
                    className="flex-1 text-xs sm:text-sm border-none bg-slate-50/50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-400 resize-none"
                  />
                </div>
              ))}

              {currentPlan.objectives.generalCompetencies.problemSolving.map((c, i) => (
                <div key={`ps_${i}`} className="flex items-start gap-2 pl-4">
                  <span className="text-xs font-bold mt-1">• Giải quyết vấn đề & sáng tạo:</span>
                  <textarea
                    rows={1}
                    value={c}
                    onChange={(e) => {
                      const copy = [...currentPlan.objectives.generalCompetencies.problemSolving];
                      copy[i] = e.target.value;
                      setCurrentPlan({
                        ...currentPlan,
                        objectives: {
                          ...currentPlan.objectives,
                          generalCompetencies: { ...currentPlan.objectives.generalCompetencies, problemSolving: copy }
                        }
                      });
                    }}
                    className="flex-1 text-xs sm:text-sm border-none bg-slate-50/50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-400 resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="pl-4 space-y-2 mt-2">
              <p className="font-semibold text-xs italic">b) Năng lực đặc thù ({currentPlan.subjectName}):</p>
              {currentPlan.objectives.specificCompetencies.map((sc, i) => (
                <div key={`sc_${i}`} className="flex items-start gap-2 pl-4">
                  <span className="font-bold text-xs mt-1">•</span>
                  <textarea
                    rows={1}
                    value={sc}
                    onChange={(e) => {
                      const copy = [...currentPlan.objectives.specificCompetencies];
                      copy[i] = e.target.value;
                      setCurrentPlan({
                        ...currentPlan,
                        objectives: { ...currentPlan.objectives, specificCompetencies: copy }
                      });
                    }}
                    className="flex-1 text-xs sm:text-sm border-none bg-slate-50/50 p-1.5 rounded focus:bg-white focus:ring-1 focus:ring-blue-400 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Phẩm chất */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs sm:text-sm">3. Về phẩm chất:</h4>
            <div className="pl-4 space-y-1.5">
              {currentPlan.objectives.qualities.diligence?.map((q, i) => (
                <div key={`d_${i}`} className="text-xs sm:text-sm flex items-center gap-2">
                  <span className="font-bold">• Chăm chỉ:</span>
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => {
                      const copy = { ...currentPlan.objectives.qualities, diligence: [e.target.value] };
                      setCurrentPlan({ ...currentPlan, objectives: { ...currentPlan.objectives, qualities: copy } });
                    }}
                    className="flex-1 border-none bg-transparent p-0.5 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              ))}
              {currentPlan.objectives.qualities.honesty?.map((q, i) => (
                <div key={`h_${i}`} className="text-xs sm:text-sm flex items-center gap-2">
                  <span className="font-bold">• Trung thực:</span>
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => {
                      const copy = { ...currentPlan.objectives.qualities, honesty: [e.target.value] };
                      setCurrentPlan({ ...currentPlan, objectives: { ...currentPlan.objectives, qualities: copy } });
                    }}
                    className="flex-1 border-none bg-transparent p-0.5 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              ))}
              {currentPlan.objectives.qualities.responsibility?.map((q, i) => (
                <div key={`r_${i}`} className="text-xs sm:text-sm flex items-center gap-2">
                  <span className="font-bold">• Trách nhiệm:</span>
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => {
                      const copy = { ...currentPlan.objectives.qualities, responsibility: [e.target.value] };
                      setCurrentPlan({ ...currentPlan, objectives: { ...currentPlan.objectives, qualities: copy } });
                    }}
                    className="flex-1 border-none bg-transparent p-0.5 focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm sm:text-base uppercase text-blue-900 border-b border-slate-300 pb-1">
            II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
          </h3>
          <div className="pl-4 space-y-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <span className="font-bold shrink-0">1. Giáo viên:</span>
              <input
                type="text"
                value={currentPlan.equipment.teacher.join('; ')}
                onChange={(e) => setCurrentPlan({
                  ...currentPlan,
                  equipment: { ...currentPlan.equipment, teacher: e.target.value.split('; ') }
                })}
                className="flex-1 border-none bg-slate-50/50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold shrink-0">2. Học sinh:</span>
              <input
                type="text"
                value={currentPlan.equipment.student.join('; ')}
                onChange={(e) => setCurrentPlan({
                  ...currentPlan,
                  equipment: { ...currentPlan.equipment, student: e.target.value.split('; ') }
                })}
                className="flex-1 border-none bg-slate-50/50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold shrink-0">3. Thiết bị số:</span>
              <input
                type="text"
                value={currentPlan.equipment.digitalLearningMaterials.join('; ')}
                onChange={(e) => setCurrentPlan({
                  ...currentPlan,
                  equipment: { ...currentPlan.equipment, digitalLearningMaterials: e.target.value.split('; ') }
                })}
                className="flex-1 border-none bg-slate-50/50 p-1 rounded focus:bg-white focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* III. TIẾN TRÌNH DẠY HỌC */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <h3 className="font-bold text-sm sm:text-base uppercase text-blue-900">
              III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG CHUẨN 5512)
            </h3>
            <button
              type="button"
              onClick={handleAddActivity}
              className="text-xs text-blue-600 hover:text-blue-800 font-sans font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Hoạt Động Mới</span>
            </button>
          </div>

          {currentPlan.activities.map((act, actIdx) => (
            <div key={act.id || actIdx} className="space-y-3 border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50/40">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <input
                  type="text"
                  value={act.title}
                  onChange={(e) => {
                    const copy = [...currentPlan.activities];
                    copy[actIdx].title = e.target.value;
                    setCurrentPlan({ ...currentPlan, activities: copy });
                  }}
                  className="font-bold text-sm sm:text-base text-blue-900 uppercase border-none bg-transparent focus:ring-1 focus:ring-blue-400 w-3/4"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-sans">
                    {act.durationMinutes} phút
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteActivity(act.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Xóa hoạt động này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mục tiêu, Nội dung, Sản phẩm */}
              <div className="space-y-2 text-xs sm:text-sm pl-2">
                <div className="flex items-start gap-2">
                  <span className="font-bold shrink-0">a) Mục tiêu:</span>
                  <textarea
                    rows={1}
                    value={act.objectives}
                    onChange={(e) => {
                      const copy = [...currentPlan.activities];
                      copy[actIdx].objectives = e.target.value;
                      setCurrentPlan({ ...currentPlan, activities: copy });
                    }}
                    className="flex-1 border-none bg-transparent p-0 focus:ring-1 focus:ring-blue-400 resize-none"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-bold shrink-0">b) Nội dung:</span>
                  <textarea
                    rows={1}
                    value={act.content}
                    onChange={(e) => {
                      const copy = [...currentPlan.activities];
                      copy[actIdx].content = e.target.value;
                      setCurrentPlan({ ...currentPlan, activities: copy });
                    }}
                    className="flex-1 border-none bg-transparent p-0 focus:ring-1 focus:ring-blue-400 resize-none"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-bold shrink-0">c) Sản phẩm:</span>
                  <textarea
                    rows={1}
                    value={act.product}
                    onChange={(e) => {
                      const copy = [...currentPlan.activities];
                      copy[actIdx].product = e.target.value;
                      setCurrentPlan({ ...currentPlan, activities: copy });
                    }}
                    className="flex-1 border-none bg-transparent p-0 focus:ring-1 focus:ring-blue-400 resize-none"
                  />
                </div>
              </div>

              {/* Tổ chức thực hiện (4 Bước Chuẩn Sư Phạm) */}
              <div className="pt-2">
                <p className="font-bold text-xs sm:text-sm mb-2">d) Tổ chức thực hiện:</p>
                
                {/* 2-column or 4-step Table */}
                <div className="border border-slate-300 rounded-lg overflow-hidden bg-white text-xs sm:text-sm">
                  <div className="grid grid-cols-3 bg-slate-100 font-bold border-b border-slate-300 p-2 text-center">
                    <div className="col-span-1">Hoạt động của GV & HS</div>
                    <div className="col-span-2">Dự kiến sản phẩm / Nội dung chi tiết</div>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {/* Bước 1 */}
                    <div className="grid grid-cols-3 p-2.5 gap-3">
                      <div className="col-span-1 font-bold text-blue-900">
                        Bước 1: Giao nhiệm vụ học tập
                      </div>
                      <div className="col-span-2">
                        <textarea
                          rows={2}
                          value={act.execution.assignTask}
                          onChange={(e) => {
                            const copy = [...currentPlan.activities];
                            copy[actIdx].execution.assignTask = e.target.value;
                            setCurrentPlan({ ...currentPlan, activities: copy });
                          }}
                          className="w-full border-none p-0 focus:outline-hidden text-xs resize-none"
                        />
                      </div>
                    </div>

                    {/* Bước 2 */}
                    <div className="grid grid-cols-3 p-2.5 gap-3">
                      <div className="col-span-1 font-bold text-indigo-900">
                        Bước 2: Thực hiện nhiệm vụ
                      </div>
                      <div className="col-span-2">
                        <textarea
                          rows={2}
                          value={act.execution.doTask}
                          onChange={(e) => {
                            const copy = [...currentPlan.activities];
                            copy[actIdx].execution.doTask = e.target.value;
                            setCurrentPlan({ ...currentPlan, activities: copy });
                          }}
                          className="w-full border-none p-0 focus:outline-hidden text-xs resize-none"
                        />
                      </div>
                    </div>

                    {/* Bước 3 */}
                    <div className="grid grid-cols-3 p-2.5 gap-3">
                      <div className="col-span-1 font-bold text-purple-900">
                        Bước 3: Báo cáo - Thảo luận
                      </div>
                      <div className="col-span-2">
                        <textarea
                          rows={2}
                          value={act.execution.reportDiscuss}
                          onChange={(e) => {
                            const copy = [...currentPlan.activities];
                            copy[actIdx].execution.reportDiscuss = e.target.value;
                            setCurrentPlan({ ...currentPlan, activities: copy });
                          }}
                          className="w-full border-none p-0 focus:outline-hidden text-xs resize-none"
                        />
                      </div>
                    </div>

                    {/* Bước 4 */}
                    <div className="grid grid-cols-3 p-2.5 gap-3">
                      <div className="col-span-1 font-bold text-emerald-900">
                        Bước 4: Kết luận - Nhận định
                      </div>
                      <div className="col-span-2">
                        <textarea
                          rows={2}
                          value={act.execution.concludeAssess}
                          onChange={(e) => {
                            const copy = [...currentPlan.activities];
                            copy[actIdx].execution.concludeAssess = e.target.value;
                            setCurrentPlan({ ...currentPlan, activities: copy });
                          }}
                          className="w-full border-none p-0 focus:outline-hidden text-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Phê duyệt & Ký tên */}
        <div className="grid grid-cols-2 text-center text-xs sm:text-sm font-bold pt-8">
          <div>
            <p>DUYỆT CỦA TỔ CHUYÊN MÔN</p>
            <div className="h-16"></div>
          </div>
          <div>
            <p>GIÁO VIÊN SOẠN BÀI</p>
            <p className="font-normal italic text-xs">(Kí và ghi rõ họ tên)</p>
            <div className="h-12"></div>
            <p>{currentPlan.teacherName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
