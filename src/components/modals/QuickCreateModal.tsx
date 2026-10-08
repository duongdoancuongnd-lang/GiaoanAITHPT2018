import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  Clock, 
  FileText 
} from 'lucide-react';
import { Subject, Grade, TextbookSet, LessonPlan, TeacherProfile } from '../../types';
import { aiService } from '../../services/aiService';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  grades: Grade[];
  textbookSets: TextbookSet[];
  profile: TeacherProfile;
  onCompleteQuickPlan: (plan: LessonPlan) => void;
}

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({
  isOpen,
  onClose,
  subjects,
  grades,
  textbookSets,
  profile,
  onCompleteQuickPlan,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(profile.primarySubjectId || subjects[0]?.id || 'sub_math');
  const [selectedGradeId, setSelectedGradeId] = useState<string>(profile.teachingGrades[0] || 'g10');
  const [selectedTextbookId, setSelectedTextbookId] = useState<string>(profile.defaultTextbookSetId || 'kntt');
  const [lessonTitle, setLessonTitle] = useState<string>('Khái niệm về hàm số và đồ thị');
  const [durationPeriods, setDurationPeriods] = useState<number>(2);
  const [specialRequest, setSpecialRequest] = useState<string>('Thiết kế trò chơi khởi động hấp dẫn, có phiếu học tập số');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const selectedGrade = grades.find(g => g.id === selectedGradeId) || grades[0];
  const selectedTextbook = textbookSets.find(t => t.id === selectedTextbookId) || textbookSets[0];

  const handleGenerate = async () => {
    if (!lessonTitle.trim()) return;

    setLoading(true);
    try {
      const res = await aiService.generateLessonPlan({
        subjectName: selectedSubject.name,
        gradeName: selectedGrade.name,
        textbookSetName: selectedTextbook.name,
        lessonTitle,
        durationPeriods,
        durationMinutes: durationPeriods * 45,
        digitalIntegration: true,
        stemIntegration: true,
        differentiation: true,
        teacherNote: specialRequest,
      });

      const fallbackActivities = [
        {
          id: 'act_q1',
          phase: 'warmup',
          title: 'Hoạt động 1: Khởi động (Mở đầu)',
          durationMinutes: 7,
          objectives: 'Tạo tâm thế và kết nối kiến thức thực tế với bài học mới.',
          content: 'Học sinh tham gia trò chơi trắc nghiệm nhanh trên Quizizz/Mentimeter.',
          product: 'Câu trả lời và sự hào hứng của học sinh.',
          execution: {
            assignTask: 'GV chiếu mã QR và đặt câu hỏi tình huống mở đầu.',
            doTask: 'HS quét mã làm bài cá nhân.',
            reportDiscuss: 'GV tổng kết nhanh bảng xếp hạng.',
            concludeAssess: 'GV chốt vấn đề và dẫn dắt vào bài học.'
          }
        },
        {
          id: 'act_q2',
          phase: 'knowledge',
          title: 'Hoạt động 2: Hình thành kiến thức mới',
          durationMinutes: 48,
          objectives: 'Học sinh làm chủ các khái niệm cốt lõi.',
          content: 'Thảo luận nhóm với Phiếu học tập số 1.',
          product: 'Sản phẩm hoàn thiện trên phiếu học tập.',
          execution: {
            assignTask: 'GV chia 4 nhóm và giao nhiệm vụ.',
            doTask: 'HS đọc SGK và thảo luận nhóm.',
            reportDiscuss: 'Đại diện nhóm báo cáo, nhóm bạn phản biện.',
            concludeAssess: 'GV kết luận và ghi bảng kiến thức chuẩn.'
          }
        },
        {
          id: 'act_q3',
          phase: 'practice',
          title: 'Hoạt động 3: Luyện tập củng cố',
          durationMinutes: 20,
          objectives: 'Khắc sâu kiến thức qua bài tập phân hóa.',
          content: 'Giải các bài toán/câu hỏi từ dễ đến nâng cao.',
          product: 'Bài làm trong vở học sinh.',
          execution: {
            assignTask: 'GV giao hệ thống câu hỏi phân hóa 3 mức.',
            doTask: 'HS làm bài độc lập.',
            reportDiscuss: 'GV gọi 2 HS lên bảng trình bày.',
            concludeAssess: 'GV nhận xét và sửa lỗi chi tiết.'
          }
        },
        {
          id: 'act_q4',
          phase: 'application',
          title: 'Hoạt động 4: Vận dụng thực tiễn',
          durationMinutes: 15,
          objectives: 'Vận dụng kiến thức giải quyết vấn đề thực tế.',
          content: 'Nhiệm vụ nghiên cứu nhỏ tại nhà.',
          product: 'Bản báo cáo ngắn nộp buổi sau.',
          execution: {
            assignTask: 'GV nêu đề bài vận dụng thực tế.',
            doTask: 'HS ghi nhận nhiệm vụ và tiêu chí đánh giá.',
            reportDiscuss: 'Nộp bài qua Google Classroom / LMS.',
            concludeAssess: 'GV dặn dò chuẩn bị bài tiếp theo.'
          }
        }
      ];

      const newPlan: LessonPlan = {
        id: 'lp_quick_' + Date.now(),
        title: res.data?.title || `Kế hoạch bài dạy: ${lessonTitle}`,
        schoolName: profile.schoolName || 'Trường THPT Chuyên Quốc Học',
        department: profile.department || 'Tổ Chuyên Môn',
        teacherName: profile.fullName || 'Thầy/Cô',
        schoolYear: profile.schoolYear || '2025 - 2026',
        subjectId: selectedSubjectId,
        subjectName: selectedSubject.name,
        gradeId: selectedGradeId,
        gradeName: selectedGrade.name,
        textbookSetId: selectedTextbookId,
        textbookSetName: selectedTextbook.name,
        durationPeriods,
        durationMinutes: durationPeriods * 45,
        teachDate: new Date().toISOString().split('T')[0],
        templateType: '5512_standard',
        isFavorite: false,
        integrations: {
          digitalCompetencyEnabled: true,
          aiInTeachingEnabled: false,
          stemEnabled: false,
          differentiationEnabled: true,
          extensionActivityEnabled: false,
        },
        objectives: res.data?.objectives || {
          knowledge: [
            `Hiểu và nắm vững các khái niệm trọng tâm của bài ${lessonTitle}.`,
            `Vận dụng kiến thức để giải quyết bài tập và tình huống liên quan.`
          ],
          generalCompetencies: {
            selfAutonomy: ['Chủ động nghiên cứu SGK và làm việc độc lập.'],
            communication: ['Hợp tác nhóm hiệu quả trong các hoạt động học tập.'],
            problemSolving: ['Phát hiện và đề xuất giải pháp cho vấn đề thực tiễn.']
          },
          specificCompetencies: [
            `Năng lực chuyên môn đặc thù môn ${selectedSubject.name}`,
            `Năng lực sử dụng công cụ và học liệu số`
          ],
          qualities: {
            diligence: ['Chăm chỉ, hoàn thành tốt các bài tập được giao.'],
            honesty: ['Trung thực trong báo cáo kết quả và tự đánh giá.'],
            responsibility: ['Có trách nhiệm với công việc chung của nhóm.']
          }
        },
        equipment: res.data?.equipment || {
          teacher: ['Kế hoạch bài dạy, bài giảng điện tử PowerPoint, Phiếu học tập số 1.'],
          student: [`Sách giáo khoa ${selectedSubject.name} ${selectedGrade.name}, vở ghi bài.`],
          digitalLearningMaterials: ['Phần mềm tương tác và ứng dụng học tập số.']
        },
        activities: (res.data?.activities && res.data.activities.length > 0)
          ? res.data.activities.map((a: any, i: number) => ({ ...a, id: `act_q_${Date.now()}_${i}` }))
          : fallbackActivities,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onCompleteQuickPlan(newPlan);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-xs">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Soạn Nhanh Giáo Án 60 Giây
              </h2>
              <p className="text-xs text-slate-500">
                Chỉ cần điền tên bài, Gemini AI tự động tạo hoàn chỉnh theo chuẩn 5512
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp</label>
              <select
                value={selectedGradeId}
                onChange={(e) => setSelectedGradeId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bộ sách</label>
              <select
                value={selectedTextbookId}
                onChange={(e) => setSelectedTextbookId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {textbookSets.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên Bài Học / Tiêu Đề Bài Dạy <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Ví dụ: Định luật II Newton và các ứng dụng"
              className="w-full px-3 py-2.5 text-sm font-medium border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số tiết dạy</label>
              <input
                type="number"
                min={1}
                max={6}
                value={durationPeriods}
                onChange={(e) => setDurationPeriods(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Thời lượng tổng</label>
              <div className="px-3 py-2 text-xs bg-slate-100 rounded-lg text-slate-700 font-medium">
                {durationPeriods * 45} phút
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Yêu Cầu Đặc Biệt Hoặc Ý Tưởng Của Giáo Viên
            </label>
            <textarea
              rows={2}
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Ví dụ: Tăng cường hoạt động trải nghiệm thực hành, ứng dụng Canva..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !lessonTitle.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/25 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
            <span>{loading ? 'AI Đang Soạn (khoảng 10-15s)...' : 'Sinh Giáo Án Ngay'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
