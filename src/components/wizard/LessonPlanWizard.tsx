import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  BookOpen, 
  Layers, 
  Cpu, 
  Users, 
  Globe2, 
  Save, 
  RefreshCw, 
  Plus, 
  Trash2, 
  HelpCircle, 
  FileText,
  AlertCircle,
  Clock,
  GraduationCap
} from 'lucide-react';
import { 
  LessonPlan, 
  Subject, 
  Grade, 
  TextbookSet, 
  Chapter, 
  Lesson, 
  TeacherProfile,
  Activity
} from '../../types';
import { aiService } from '../../services/aiService';

interface LessonPlanWizardProps {
  subjects: Subject[];
  grades: Grade[];
  textbookSets: TextbookSet[];
  chapters: Chapter[];
  profile: TeacherProfile;
  onSavePlan: (plan: LessonPlan) => void;
  onCancel: () => void;
}

export const LessonPlanWizard: React.FC<LessonPlanWizardProps> = ({
  subjects,
  grades,
  textbookSets,
  chapters,
  profile,
  onSavePlan,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string>('');

  // Step 1 Form State
  const [schoolName, setSchoolName] = useState<string>(profile.schoolName || 'Trường THPT Chuyên Quốc Học');
  const [department, setDepartment] = useState<string>(profile.department || 'Tổ Toán - Tin');
  const [teacherName, setTeacherName] = useState<string>(profile.fullName || 'Thầy/Cô');
  const [schoolYear, setSchoolYear] = useState<string>(profile.schoolYear || '2025 - 2026');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(profile.primarySubjectId || subjects[0]?.id || 'sub_math');
  const [selectedGradeId, setSelectedGradeId] = useState<string>(profile.teachingGrades[0] || 'g10');
  const [selectedTextbookId, setSelectedTextbookId] = useState<string>(profile.defaultTextbookSetId || 'kntt');
  const [lessonTitle, setLessonTitle] = useState<string>('Vectơ và các phép toán trên vectơ');
  const [durationPeriods, setDurationPeriods] = useState<number>(2);
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [templateType, setTemplateType] = useState<string>('5512_standard');

  // Step 2 & 3: Curriculum, YCCĐ & Objectives
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [knowledgeList, setKnowledgeList] = useState<string[]>([
    'Nhận biết được định nghĩa vectơ, vectơ-không, độ dài của vectơ, hai vectơ cùng phương, cùng hướng, bằng nhau.',
    'Thực hiện được phép cộng hai vectơ (quy tắc ba điểm, quy tắc hình bình hành) và phép trừ hai vectơ.',
    'Vận dụng được kiến thức về vectơ để giải quyết một số bài toán hình học và bài toán thực tế (tổng hợp lực trong Vật lí).'
  ]);
  const [newKnowledgeInput, setNewKnowledgeInput] = useState<string>('');

  // Step 4: Competencies & Qualities
  const [selfAutonomyList, setSelfAutonomyList] = useState<string[]>([
    'Tự đọc SGK và tài liệu hướng dẫn học tập, chủ động ghi chép các khái niệm mới.'
  ]);
  const [communicationList, setCommunicationList] = useState<string[]>([
    'Thảo luận nhóm sôi nổi, lắng nghe và tôn trọng ý kiến phản biện của bạn học.'
  ]);
  const [problemSolvingList, setProblemSolvingList] = useState<string[]>([
    'Phát hiện mối liên hệ giữa bài toán vectơ và hiện tượng tổng hợp lực trong thực tiễn.'
  ]);
  const [specificCompList, setSpecificCompList] = useState<string[]>([]);
  const [qualitiesList, setQualitiesList] = useState<{ [key: string]: string[] }>({
    diligence: ['Chăm chỉ, tích cực tham gia các hoạt động học tập trên lớp.'],
    honesty: ['Trung thực trong việc báo cáo kết quả và tự đánh giá sản phẩm học tập.'],
    responsibility: ['Có trách nhiệm với nhiệm vụ của nhóm và hoàn thành đúng thời hạn.']
  });

  // Step 5: Digital & STEM & Differentiation
  const [digitalEnabled, setDigitalEnabled] = useState<boolean>(true);
  const [stemEnabled, setStemEnabled] = useState<boolean>(true);
  const [differentiationEnabled, setDifferentiationEnabled] = useState<boolean>(true);
  const [teacherNote, setTeacherNote] = useState<string>('Tập trung phát huy tối đa tính chủ động của học sinh thông qua hoạt động nhóm và phiếu học tập số.');

  // Step 6: Activities Plan (generated or customized)
  const [activities, setActivities] = useState<Activity[]>([]);

  // Derived subject & grade details
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const selectedGrade = grades.find(g => g.id === selectedGradeId) || grades[0];
  const selectedTextbook = textbookSets.find(t => t.id === selectedTextbookId) || textbookSets[0];

  // Update specific competencies whenever subject changes
  useEffect(() => {
    if (selectedSubject) {
      setSpecificCompList([...selectedSubject.specificCompetencies]);
    }
  }, [selectedSubjectId]);

  // Handle AI Suggest YCCĐ & Knowledge
  const handleAISuggestOutcomes = async () => {
    setIsGeneratingAI(true);
    setAiStatusMessage('AI đang phân tích Yêu cầu cần đạt CTGDPT 2018...');
    try {
      const res = await aiService.suggestLearningOutcomes({
        subjectName: selectedSubject?.name || 'Toán',
        gradeName: selectedGrade?.name || 'Lớp 10',
        textbookSetName: selectedTextbook?.name || 'Kết nối tri thức',
        lessonTitle: lessonTitle || 'Bài học mới',
      });

      if (res.learningOutcomes?.length) {
        setKnowledgeList(res.learningOutcomes);
      }
      if (res.specificCompetencies?.length) {
        setSpecificCompList(res.specificCompetencies);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
      setAiStatusMessage('');
    }
  };

  // Handle Full AI Lesson Plan Generation
  const handleAIGenerateFullPlan = async () => {
    setIsGeneratingAI(true);
    setAiStatusMessage('Gemini AI đang thiết kế chi tiết 4 hoạt động chuẩn Công văn 5512...');
    try {
      const res = await aiService.generateLessonPlan({
        subjectName: selectedSubject?.name || 'Toán',
        gradeName: selectedGrade?.name || 'Lớp 10',
        textbookSetName: selectedTextbook?.name || 'Kết nối tri thức',
        lessonTitle: lessonTitle,
        durationPeriods,
        durationMinutes,
        learningOutcomes: knowledgeList,
        specificCompetencies: specificCompList,
        digitalIntegration: digitalEnabled,
        stemIntegration: stemEnabled,
        differentiation: differentiationEnabled,
        templateType,
        teacherNote,
      });

      if (res.success && res.data) {
        if (res.data.objectives?.knowledge) {
          setKnowledgeList(res.data.objectives.knowledge);
        }
        if (res.data.activities) {
          setActivities(res.data.activities.map((act: any, idx: number) => ({
            ...act,
            id: `act_gen_${Date.now()}_${idx}`,
          })));
        }
        setCurrentStep(6);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
      setAiStatusMessage('');
    }
  };

  // Final Save handler
  const handleFinalSave = () => {
    const finalActivities: Activity[] = activities.length > 0 ? activities : [
      {
        id: 'act_default_1',
        phase: 'warmup',
        title: 'Hoạt động 1: Khởi động (Mở đầu)',
        durationMinutes: 7,
        objectives: 'Tạo tâm thế và kết nối kiến thức thực tế với bài học mới.',
        content: 'Học sinh tham gia trò chơi tương tác hoặc xem video tình huống.',
        product: 'Câu trả lời miệng hoặc phiếu trả lời nhanh của học sinh.',
        execution: {
          assignTask: 'GV phổ biến thể lệ trò chơi và đặt câu hỏi mở đầu.',
          doTask: 'HS hoạt động cá nhân/cặp đôi, ghi nhanh kết quả.',
          reportDiscuss: 'GV mời đại diện 2-3 học sinh trình bày kết quả.',
          concludeAssess: 'GV nhận xét, chốt vấn đề và dẫn dắt vào bài học mới.'
        }
      },
      {
        id: 'act_default_2',
        phase: 'knowledge',
        title: 'Hoạt động 2: Hình thành kiến thức mới',
        durationMinutes: 48,
        objectives: 'Học sinh lĩnh hội các khái niệm cốt lõi theo YCCĐ của bài.',
        content: 'Học sinh làm việc với SGK và Phiếu học tập theo nhóm.',
        product: 'Sản phẩm hoàn thành trên Phiếu học tập và ghi chép vào vở.',
        execution: {
          assignTask: 'GV giao nhiệm vụ cụ thể cho từng nhóm học sinh.',
          doTask: 'HS nghiên cứu SGK, thảo luận nhóm và hoàn thiện sản phẩm.',
          reportDiscuss: 'Đại diện nhóm báo cáo, các nhóm khác nhận xét, phản biện.',
          concludeAssess: 'GV chuẩn hóa kiến thức trọng tâm, ghi bảng tóm tắt.'
        },
        digitalDetails: {
          enabled: digitalEnabled,
          activityName: 'Thảo luận và trình bày sản phẩm số',
          studentAction: 'Tra cứu thông tin và thiết kế sơ đồ tư duy trên phần mềm',
          digitalTools: ['Canva', 'Padlet', 'GeoGebra'],
          studentProduct: 'Sơ đồ tư duy hoặc bảng tổng hợp số',
          assessmentEvidence: 'Bài nộp trên liên kết lớp học'
        }
      },
      {
        id: 'act_default_3',
        phase: 'practice',
        title: 'Hoạt động 3: Luyện tập (Củng cố)',
        durationMinutes: 20,
        objectives: 'Rèn luyện kĩ năng, củng cố và khắc sâu kiến thức.',
        content: 'Hệ thống bài tập phân hóa từ mức Nhận biết đến Vận dụng.',
        product: 'Lời giải chi tiết trong vở hoặc đáp án trắc nghiệm trên ứng dụng.',
        execution: {
          assignTask: 'GV giao bài tập theo mức độ nhận thức.',
          doTask: 'HS làm việc cá nhân, đổi bài chấm chéo nếu cần.',
          reportDiscuss: 'GV gọi học sinh lên bảng giải, nhận xét trực tiếp.',
          concludeAssess: 'GV phân tích lỗi sai phổ biến và hướng dẫn cách làm tối ưu.'
        }
      },
      {
        id: 'act_default_4',
        phase: 'application',
        title: 'Hoạt động 4: Vận dụng và Mở rộng',
        durationMinutes: 15,
        objectives: 'Vận dụng kiến thức bài học để giải quyết vấn đề thực tiễn.',
        content: 'Nhiệm vụ thực tế, bài toán liên môn hoặc dự án nhỏ tại nhà.',
        product: 'Báo cáo sản phẩm thực tế, video hoặc bài viết ngắn của học sinh.',
        execution: {
          assignTask: 'GV giao nhiệm vụ vận dụng và cung cấp bảng tiêu chí chấm điểm.',
          doTask: 'HS ghi nhận nhiệm vụ, có thể thảo luận ý tưởng ban đầu.',
          reportDiscuss: 'Nộp sản phẩm và báo cáo vào tiết học sau.',
          concludeAssess: 'GV hướng dẫn tự học và dặn dò chuẩn bị bài tiếp theo.'
        }
      }
    ];

    const newPlan: LessonPlan = {
      id: 'lp_' + Date.now(),
      title: lessonTitle,
      schoolName,
      department,
      teacherName,
      schoolYear,
      subjectId: selectedSubjectId,
      subjectName: selectedSubject?.name || 'Môn học',
      gradeId: selectedGradeId,
      gradeName: selectedGrade?.name || 'Lớp 10',
      textbookSetId: selectedTextbookId,
      textbookSetName: selectedTextbook?.name || 'Kết nối tri thức',
      durationPeriods,
      durationMinutes,
      teachDate: new Date().toISOString().split('T')[0],
      templateType: templateType as any,
      isFavorite: false,
      integrations: {
        digitalCompetencyEnabled: digitalEnabled,
        aiInTeachingEnabled: true,
        stemEnabled: stemEnabled,
        differentiationEnabled: differentiationEnabled,
        extensionActivityEnabled: false,
      },
      objectives: {
        knowledge: knowledgeList,
        generalCompetencies: {
          selfAutonomy: selfAutonomyList,
          communication: communicationList,
          problemSolving: problemSolvingList,
        },
        specificCompetencies: specificCompList,
        qualities: qualitiesList,
      },
      equipment: {
        teacher: ['Kế hoạch bài dạy, bài trình chiếu PowerPoint, Phiếu học tập số 1 & 2, máy tính, máy chiếu.'],
        student: [`Sách giáo khoa ${selectedSubject?.name} ${selectedGrade?.name}, vở ghi, đồ dùng học tập.`],
        digitalLearningMaterials: ['Phần mềm tương tác (Quizizz/Padlet), học liệu số minh họa.'],
      },
      activities: finalActivities,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSavePlan(newPlan);
  };

  const steps = [
    { num: 1, title: 'Thông tin chung' },
    { num: 2, title: 'Chọn bài & YCCĐ' },
    { num: 3, title: 'Mục tiêu bài dạy' },
    { num: 4, title: 'Năng lực & Phẩm chất' },
    { num: 5, title: 'Năng lực số & STEM' },
    { num: 6, title: 'Tiến trình 4 hoạt động' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>Trình Soạn Kế Hoạch Bài Dạy Chuẩn 5512</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bám sát Chương trình GDPT 2018 và hướng dẫn Công văn 5512/BGDĐT
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Hủy bỏ
        </button>
      </div>

      {/* 6-Step Visual Indicator */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0 hidden sm:block"></div>
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div 
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[11px] mt-1.5 hidden sm:block font-medium ${
                  isCurrent ? 'text-blue-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Processing Overlay State */}
      {isGeneratingAI && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-sm font-bold text-blue-900">Gemini AI Đang Xử Lý</h3>
          <p className="text-xs text-blue-700 max-w-md mx-auto">{aiStatusMessage}</p>
        </div>
      )}

      {/* Step Content Cards */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
        {/* STEP 1: THÔNG TIN HÀNH CHÍNH & BÀI HỌC */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Bước 1: Thông Tin Hành Chính & Thiết Lập Bài Dạy</h2>
              <p className="text-xs text-slate-500">Khai báo thông tin đơn vị, giáo viên, môn học và thời lượng bài dạy.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Trường THPT</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Trường THPT Chuyên Quốc Học"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tổ Chuyên Môn</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Tổ Toán - Tin học"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ & Tên Giáo Viên Soạn</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Thầy / Cô Nguyễn Văn An"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Năm Học</label>
                <input
                  type="text"
                  value={schoolYear}
                  onChange={(e) => setSchoolYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="2025 - 2026"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Môn Học (17 Môn THPT)</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khối Lớp</label>
                <select
                  value={selectedGradeId}
                  onChange={(e) => setSelectedGradeId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bộ Sách Giáo Khoa</label>
                <select
                  value={selectedTextbookId}
                  onChange={(e) => setSelectedTextbookId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {textbookSets.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Bài Học / Chủ Đề Dạy Học</label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm font-medium border border-blue-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-blue-50/20"
                  placeholder="Ví dụ: Bài 7: Các khái niệm mở đầu về vectơ"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số Tiết Dạy</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={durationPeriods}
                    onChange={(e) => {
                      const p = parseInt(e.target.value, 10) || 1;
                      setDurationPeriods(p);
                      setDurationMinutes(p * 45);
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thời Lượng (Phút)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 45)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mẫu Trình Bày KHBD</label>
                  <select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="5512_standard">Mẫu 1: Chuẩn Công văn 5512 (Chuẩn nhất)</option>
                    <option value="3_parts">Mẫu 2: Cấu trúc 3 Phần (Mục tiêu - TB - Tiến trình)</option>
                    <option value="table_4cols">Mẫu 3: Dạng bảng 4 Cột (GV - HS - SP - ĐG)</option>
                    <option value="detailed_table">Mẫu 4: Chi tiết 4 Cột (Mục tiêu - ND - SP - Tổ chức)</option>
                    <option value="digital_competency">Mẫu 5: Tích hợp Năng lực số</option>
                    <option value="stem_steam">Mẫu 6: Kế hoạch bài dạy STEM/STEAM</option>
                    <option value="ai_integrated">Mẫu 7: Tích hợp Trí tuệ nhân tạo (AI)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CHỌN CHƯƠNG TRÌNH & YCCĐ GỢI Ý */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Bước 2: Xác Định Yêu Cầu Cần Đạt & Kiến Thức Trọng Tâm</h2>
                <p className="text-xs text-slate-500">Đối chiếu chuẩn CTGDPT 2018 của Bộ Giáo dục & Đào tạo.</p>
              </div>
              <button
                type="button"
                onClick={handleAISuggestOutcomes}
                disabled={isGeneratingAI}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Gợi ý YCCĐ chuẩn 2018</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Môn {selectedSubject?.name} - {selectedGrade?.name} ({selectedTextbook?.name})</span>
              </div>
              <p className="text-xs text-slate-600">
                Bài học: <strong className="text-slate-900">{lessonTitle}</strong>
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800">
                  Danh Sách Yêu Cầu Cần Đạt (Kiến thức & Kĩ năng)
                </label>
                <span className="text-[11px] text-slate-500">{knowledgeList.length} mục tiêu</span>
              </div>

              <div className="space-y-2">
                {knowledgeList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-blue-600 mt-1">{idx + 1}.</span>
                    <textarea
                      rows={2}
                      value={item}
                      onChange={(e) => {
                        const copy = [...knowledgeList];
                        copy[idx] = e.target.value;
                        setKnowledgeList(copy);
                      }}
                      className="flex-1 text-xs text-slate-800 border-none focus:outline-hidden resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => setKnowledgeList(knowledgeList.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Xóa mục tiêu này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add knowledge input */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={newKnowledgeInput}
                  onChange={(e) => setNewKnowledgeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newKnowledgeInput.trim()) {
                      setKnowledgeList([...knowledgeList, newKnowledgeInput.trim()]);
                      setNewKnowledgeInput('');
                    }
                  }}
                  placeholder="Thêm YCCĐ / mục tiêu kiến thức mới..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newKnowledgeInput.trim()) {
                      setKnowledgeList([...knowledgeList, newKnowledgeInput.trim()]);
                      setNewKnowledgeInput('');
                    }
                  }}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MỤC TIÊU PHẨM CHẤT & NĂNG LỰC CHUNG */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Bước 3: Xây Dựng Năng Lực Chung & Phẩm Chất Người Học</h2>
              <p className="text-xs text-slate-500">Quy định rõ hành vi học sinh biểu hiện trong bài dạy.</p>
            </div>

            {/* 3 General Competencies */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-900 mb-1">1. Năng Lực Tự Chủ & Tự Học</h3>
                <textarea
                  rows={2}
                  value={selfAutonomyList.join('\n')}
                  onChange={(e) => setSelfAutonomyList(e.target.value.split('\n').filter(Boolean))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-900 mb-1">2. Năng Lực Giao Tiếp & Hợp Tác</h3>
                <textarea
                  rows={2}
                  value={communicationList.join('\n')}
                  onChange={(e) => setCommunicationList(e.target.value.split('\n').filter(Boolean))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-900 mb-1">3. Năng Lực Giải Quyết Vấn Đề & Sáng Tạo</h3>
                <textarea
                  rows={2}
                  value={problemSolvingList.join('\n')}
                  onChange={(e) => setProblemSolvingList(e.target.value.split('\n').filter(Boolean))}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 5 Qualities */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30">
              <h3 className="text-xs font-bold text-blue-900 mb-2">5 Phẩm Chất Chủ Yếu (Chăm chỉ, Trung thực, Trách nhiệm, Nhân ái, Yêu nước)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Chăm chỉ</label>
                  <input
                    type="text"
                    value={qualitiesList.diligence?.[0] || ''}
                    onChange={(e) => setQualitiesList({ ...qualitiesList, diligence: [e.target.value] })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Trung thực</label>
                  <input
                    type="text"
                    value={qualitiesList.honesty?.[0] || ''}
                    onChange={(e) => setQualitiesList({ ...qualitiesList, honesty: [e.target.value] })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Trách nhiệm</label>
                  <input
                    type="text"
                    value={qualitiesList.responsibility?.[0] || ''}
                    onChange={(e) => setQualitiesList({ ...qualitiesList, responsibility: [e.target.value] })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: NĂNG LỰC ĐẶC THÙ THEO MÔN */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Bước 4: Năng Lực Đặc Thù Môn {selectedSubject?.name}
              </h2>
              <p className="text-xs text-slate-500">
                Chuẩn hóa theo đúng ma trận năng lực chuyên biệt của môn học trong CTGDPT 2018.
              </p>
            </div>

            <div className="space-y-2">
              {specificCompList.map((comp, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-indigo-600 mt-1">NL{idx + 1}:</span>
                  <textarea
                    rows={2}
                    value={comp}
                    onChange={(e) => {
                      const copy = [...specificCompList];
                      copy[idx] = e.target.value;
                      setSpecificCompList(copy);
                    }}
                    className="flex-1 text-xs text-slate-800 border-none bg-transparent focus:outline-hidden resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSpecificCompList(specificCompList.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSpecificCompList([...specificCompList, 'Năng lực vận dụng công cụ và kiến thức môn học vào thực tế.'])}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm năng lực đặc thù</span>
            </button>
          </div>
        )}

        {/* STEP 5: TÍCH HỢP NĂNG LỰC SỐ, STEM, PHÂN HÓA */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Bước 5: Tích Hợp Năng Lực Số, STEM/STEAM & Phân Hóa</h2>
              <p className="text-xs text-slate-500">Cấu hình các thành tố sư phạm hiện đại đáp ứng đổi mới giáo dục.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Digital Competency Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                digitalEnabled ? 'border-blue-400 bg-blue-50/40 ring-2 ring-blue-100' : 'border-slate-200 bg-slate-50/50 opacity-75'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900">Năng Lực Số (DigCompEdu)</h3>
                  </div>
                  <input
                    type="checkbox"
                    checked={digitalEnabled}
                    onChange={(e) => setDigitalEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Tự động đề xuất công cụ số (GeoGebra, Quizizz, Canva, Padlet) và minh chứng sản phẩm số của học sinh.
                </p>
              </div>

              {/* STEM / STEAM Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                stemEnabled ? 'border-purple-400 bg-purple-50/40 ring-2 ring-purple-100' : 'border-slate-200 bg-slate-50/50 opacity-75'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    <h3 className="text-xs font-bold text-slate-900">Định Hướng STEM/STEAM</h3>
                  </div>
                  <input
                    type="checkbox"
                    checked={stemEnabled}
                    onChange={(e) => setStemEnabled(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Tích hợp bài toán mô hình hóa thực tiễn, quy trình thiết kế kĩ thuật hoặc liên môn Khoa học - Công nghệ.
                </p>
              </div>

              {/* Differentiation Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                differentiationEnabled ? 'border-emerald-400 bg-emerald-50/40 ring-2 ring-emerald-100' : 'border-slate-200 bg-slate-50/50 opacity-75'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-900">Phân Hóa 4 Mức Độ</h3>
                  </div>
                  <input
                    type="checkbox"
                    checked={differentiationEnabled}
                    onChange={(e) => setDifferentiationEnabled(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Thiết kế nhiệm vụ phân tầng: Cần hỗ trợ, Đạt chuẩn, Khá, và Nâng cao cho học sinh xuất sắc.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi Chú Hoặc Yêu Cầu Riêng Của Thầy / Cô (Tùy Chọn)
              </label>
              <textarea
                rows={3}
                value={teacherNote}
                onChange={(e) => setTeacherNote(e.target.value)}
                placeholder="Ví dụ: Thiết kế thêm 1 trò chơi mở đầu bằng Quizizz, hoạt động nhóm phân chia theo tổ..."
                className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* AI Generate Full Plan CTA */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm">Sẵn Sàng Tạo Toàn Bộ Tiến Trình 4 Hoạt Động?</h3>
                <p className="text-xs text-blue-100 mt-0.5">Gemini AI sẽ lập kế hoạch đầy đủ 4 bước (Giao NV - Thực hiện - Báo cáo - Kết luận).</p>
              </div>
              <button
                type="button"
                onClick={handleAIGenerateFullPlan}
                disabled={isGeneratingAI}
                className="px-4 py-2.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-sm transition-colors shrink-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Soạn Ngay (Bước 6)</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG CHUẨN 5512) */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Bước 6: Xem & Tinh Chỉnh Tiến Trình Dạy Học (4 Hoạt Động)</h2>
                <p className="text-xs text-slate-500">Mỗi hoạt động gồm Mục tiêu, Nội dung, Sản phẩm và 4 bước Tổ chức thực hiện.</p>
              </div>

              <button
                type="button"
                onClick={handleAIGenerateFullPlan}
                disabled={isGeneratingAI}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tạo lại bằng AI</span>
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">Chưa có dữ liệu 4 hoạt động</h3>
                <p className="text-xs text-slate-500 mt-1">Nhấp vào nút dưới đây để Gemini AI tự động tạo toàn bộ tiến trình theo chuẩn 5512.</p>
                <button
                  type="button"
                  onClick={handleAIGenerateFullPlan}
                  className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sinh 4 Hoạt Động Bằng AI</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((act, actIdx) => (
                  <div key={act.id || actIdx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                          {act.phase}
                        </span>
                        <input
                          type="text"
                          value={act.title}
                          onChange={(e) => {
                            const copy = [...activities];
                            copy[actIdx].title = e.target.value;
                            setActivities(copy);
                          }}
                          className="font-bold text-xs sm:text-sm text-slate-900 bg-transparent border-none focus:outline-hidden"
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500">{act.durationMinutes} phút</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">a) Mục tiêu:</span>
                        <textarea
                          rows={2}
                          value={act.objectives}
                          onChange={(e) => {
                            const copy = [...activities];
                            copy[actIdx].objectives = e.target.value;
                            setActivities(copy);
                          }}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-xs"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">b) Nội dung:</span>
                        <textarea
                          rows={2}
                          value={act.content}
                          onChange={(e) => {
                            const copy = [...activities];
                            copy[actIdx].content = e.target.value;
                            setActivities(copy);
                          }}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-xs"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">c) Sản phẩm:</span>
                        <textarea
                          rows={2}
                          value={act.product}
                          onChange={(e) => {
                            const copy = [...activities];
                            copy[actIdx].product = e.target.value;
                            setActivities(copy);
                          }}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-xs"
                        />
                      </div>
                    </div>

                    {/* 4 Steps of execution */}
                    <div className="pt-2 border-t border-slate-200/80">
                      <span className="font-bold text-xs text-slate-800 block mb-2">d) Tổ chức thực hiện (4 bước):</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <strong className="text-blue-700 block mb-1">Bước 1: Giao nhiệm vụ học tập</strong>
                          <textarea
                            rows={2}
                            value={act.execution.assignTask}
                            onChange={(e) => {
                              const copy = [...activities];
                              copy[actIdx].execution.assignTask = e.target.value;
                              setActivities(copy);
                            }}
                            className="w-full border-none p-0 text-xs focus:outline-hidden resize-none"
                          />
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <strong className="text-indigo-700 block mb-1">Bước 2: Thực hiện nhiệm vụ</strong>
                          <textarea
                            rows={2}
                            value={act.execution.doTask}
                            onChange={(e) => {
                              const copy = [...activities];
                              copy[actIdx].execution.doTask = e.target.value;
                              setActivities(copy);
                            }}
                            className="w-full border-none p-0 text-xs focus:outline-hidden resize-none"
                          />
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <strong className="text-purple-700 block mb-1">Bước 3: Báo cáo - Thảo luận</strong>
                          <textarea
                            rows={2}
                            value={act.execution.reportDiscuss}
                            onChange={(e) => {
                              const copy = [...activities];
                              copy[actIdx].execution.reportDiscuss = e.target.value;
                              setActivities(copy);
                            }}
                            className="w-full border-none p-0 text-xs focus:outline-hidden resize-none"
                          />
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <strong className="text-emerald-700 block mb-1">Bước 4: Kết luận - Nhận định</strong>
                          <textarea
                            rows={2}
                            value={act.execution.concludeAssess}
                            onChange={(e) => {
                              const copy = [...activities];
                              copy[actIdx].execution.concludeAssess = e.target.value;
                              setActivities(copy);
                            }}
                            className="w-full border-none p-0 text-xs focus:outline-hidden resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>Tiếp tục (Bước {currentStep + 1})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSave}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Hoàn Thành & Mở Soạn Thảo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
