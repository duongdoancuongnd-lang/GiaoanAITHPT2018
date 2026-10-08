import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  FolderKanban, 
  Bot, 
  GraduationCap, 
  FileSpreadsheet, 
  Globe2, 
  Database, 
  FileText, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle2, 
  Download, 
  Copy, 
  ArrowRight, 
  BookOpen, 
  Star,
  Layers,
  ChevronRight,
  Send,
  Loader2
} from 'lucide-react';
import { LessonPlan, TeacherProfile, StatisticsData } from '../../types';
import { aiService } from '../../services/aiService';

interface DashboardViewProps {
  plans?: LessonPlan[];
  lessonPlans?: LessonPlan[];
  stats?: StatisticsData;
  profile: TeacherProfile;
  onNavigate?: (tab: string) => void;
  onNewPlan?: () => void;
  onOpenPlan?: (plan: LessonPlan) => void;
  onQuickCreate?: () => void;
  onViewAllPlans?: () => void;
  onOpenTools?: () => void;
  onOpenCurriculum?: () => void;
  onExportDocx?: (plan: LessonPlan) => void;
  onDuplicatePlan?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  plans,
  lessonPlans,
  stats: propStats,
  profile,
  onNavigate = (_tab: string) => {},
  onNewPlan,
  onOpenPlan = (_plan: LessonPlan) => {},
  onQuickCreate = () => {},
  onViewAllPlans,
  onOpenTools,
  onOpenCurriculum,
  onExportDocx = (_plan: LessonPlan) => {},
  onDuplicatePlan = (_id: string) => {},
  onToggleFavorite = (_id: string) => {},
}) => {
  const allPlans = lessonPlans || plans || [];
  const recentPlans = allPlans.slice(0, 5);

  // Compute stats if not explicitly passed
  const totalPlans = propStats?.totalPlans ?? allPlans.length;
  const favoritePlans = propStats?.favoritePlans ?? allPlans.filter(p => p.isFavorite).length;
  const plansThisMonth = propStats?.plansThisMonth ?? allPlans.filter(p => {
    const d = new Date(p.updatedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const aiGenerationsCount = propStats?.aiGenerationsCount ?? 850;
  const qualityAverage = propStats?.qualityAverage ?? 92;
  const mostUsedSubject = propStats?.mostUsedSubject || profile.mainSubject || 'Toán học 10';

  // Inline Quick Generator State
  const [quickGrade, setQuickGrade] = useState('Lớp 10');
  const [quickSubject, setQuickSubject] = useState(profile.mainSubject || 'Toán học');
  const [quickTextbook, setQuickTextbook] = useState(profile.mainTextbookSet || 'Kết nối tri thức');
  const [quickTopic, setQuickTopic] = useState('');
  const [quickSpecialReq, setQuickSpecialReq] = useState('');
  const [isGeneratingTurbo, setIsGeneratingTurbo] = useState(false);

  // Interactive AI Assistant State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'ai' | 'user'; text: string; time: string }>>([
    {
      role: 'ai',
      text: `Chào thầy/cô ${profile.fullName ? profile.fullName.split(' ').pop() : ''}! Em đã cập nhật chuẩn Công văn 5512/BGDĐT mới nhất. Thầy/cô muốn soạn bài nào hôm nay ạ?`,
      time: 'Vừa xong'
    },
    {
      role: 'user',
      text: 'Gợi ý cho tôi hoạt động khởi động môn Toán 10 gắn với thực tiễn nhé.',
      time: '1 phút trước'
    },
    {
      role: 'ai',
      text: 'Đã rõ! Với Toán 10, hoạt động khởi động "Bắn cung & Đường Parabol" hoặc "Quy hoạch ngân sách đi chơi cùng lớp" rất kích thích tư duy giải quyết vấn đề!',
      time: 'Vừa xong'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputMessage.trim();
    if (!query || isAiThinking) return;

    const userMsg = { role: 'user' as const, text: query, time: 'Vừa xong' };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAiThinking(true);

    try {
      const reply = await aiService.sendCopilotMessage(query);
      setChatMessages(prev => [...prev, { role: 'ai', text: reply, time: 'Vừa xong' }]);
    } catch {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Em đã ghi nhận yêu cầu. Thầy/cô có thể mở tab "Soạn giáo án" để áp dụng trực tiếp vào 4 hoạt động nhé!', 
        time: 'Vừa xong' 
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleTurboSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickCreate();
  };

  const navigateTo = (tab: string) => {
    if (tab === 'wizard' || tab === 'create_wizard') {
      if (onNewPlan) onNewPlan();
      else onNavigate('create_wizard');
    } else if (tab === 'library') {
      if (onViewAllPlans) onViewAllPlans();
      else onNavigate('library');
    } else if (tab === 'curriculum') {
      if (onOpenCurriculum) onOpenCurriculum();
      else onNavigate('curriculum');
    } else if (tab === 'tools' || tab === 'worksheets' || tab === 'question_bank') {
      if (onOpenTools) onOpenTools();
      else onNavigate('tools');
    } else {
      onNavigate(tab);
    }
  };

  const quickActionCards = [
    {
      id: 'wizard',
      title: 'Soạn giáo án mới',
      desc: 'Quy trình 6 bước chuẩn Công văn 5512/BGDĐT',
      icon: Sparkles,
      iconColor: 'text-indigo-600',
      badge: 'Chuẩn 5512',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      action: () => navigateTo('wizard'),
    },
    {
      id: 'quick',
      title: 'Soạn nhanh 60s',
      desc: 'AI tạo ngay bản nháp hoàn chỉnh trong 1 phút',
      icon: Zap,
      iconColor: 'text-amber-500',
      badge: 'Nhanh nhất',
      badgeColor: 'bg-amber-100 text-amber-900',
      action: onQuickCreate,
    },
    {
      id: 'library',
      title: 'Kho giáo án của tôi',
      desc: 'Quản lý, chỉnh sửa, lọc theo môn và khối',
      icon: FolderKanban,
      iconColor: 'text-emerald-600',
      badge: `${allPlans.length} bài`,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      action: () => navigateTo('library'),
    },
    {
      id: 'curriculum',
      title: 'Chương trình GDPT 2018',
      desc: 'Khung 17 môn THPT, YCCĐ và 3 bộ SGK chuẩn',
      icon: GraduationCap,
      iconColor: 'text-purple-600',
      badge: '17 Môn',
      badgeColor: 'bg-purple-100 text-purple-800',
      action: () => navigateTo('curriculum'),
    },
    {
      id: 'worksheets',
      title: 'Phiếu học tập & Rubric',
      desc: 'Tự động tạo PHT cá nhân/nhóm và bảng tiêu chí',
      icon: FileSpreadsheet,
      iconColor: 'text-cyan-600',
      badge: 'Sư phạm',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      action: () => navigateTo('tools'),
    },
    {
      id: 'digital',
      title: 'Năng lực số & STEM',
      desc: 'Tích hợp DigCompEdu & mô hình thiết kế STEM',
      icon: Globe2,
      iconColor: 'text-blue-600',
      badge: 'Hiện đại',
      badgeColor: 'bg-blue-100 text-blue-800',
      action: () => navigateTo('tools'),
    },
    {
      id: 'questions',
      title: 'Ngân hàng câu hỏi Bloom',
      desc: 'Sinh câu hỏi 4 mức độ kèm ma trận và lời giải',
      icon: Layers,
      iconColor: 'text-rose-600',
      badge: '4 Mức độ',
      badgeColor: 'bg-rose-100 text-rose-800',
      action: () => navigateTo('tools'),
    },
    {
      id: 'backup',
      title: 'Sao lưu & Khôi phục',
      desc: 'Xuất tệp JSON an toàn, không lo mất dữ liệu',
      icon: Database,
      iconColor: 'text-slate-600',
      badge: 'Offline/Cloud',
      badgeColor: 'bg-slate-100 text-slate-800',
      action: () => navigateTo('backup_restore'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 High Density Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng giáo án
          </p>
          <div className="flex items-end justify-between mt-1">
            <h2 className="text-2xl font-bold text-slate-800">{totalPlans}</h2>
            <span className="text-emerald-600 text-xs font-medium">
              +{plansThisMonth} tháng này
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sử dụng AI
          </p>
          <div className="flex items-end justify-between mt-1">
            <h2 className="text-2xl font-bold text-slate-800">{aiGenerationsCount}</h2>
            <span className="text-indigo-600 text-xs font-medium">
              Tín dụng: 2.5k
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Yêu thích
          </p>
          <div className="flex items-end justify-between mt-1">
            <h2 className="text-2xl font-bold text-slate-800">{favoritePlans}</h2>
            <span className="text-amber-500 text-xs font-medium">
              ⭐ Top nội dung
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs bg-gradient-to-br from-indigo-50 to-white">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Môn dạy chính
          </p>
          <div className="flex items-end justify-between mt-1">
            <h2 className="text-xl font-bold text-slate-800 truncate" title={mostUsedSubject}>
              {mostUsedSubject}
            </h2>
            <span className="text-slate-400 text-xs font-medium shrink-0 ml-2">
              KNTT
            </span>
          </div>
        </div>
      </div>

      {/* High Density Split Grid: Turbo AI 60s on Left & AI Assistant on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Quick 60s Lesson Plan Box */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl flex flex-col flex-1 shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <span>Soạn giáo án nhanh 60s</span>
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                Chế độ Turbo AI
              </span>
            </div>

            <form onSubmit={handleTurboSubmit} className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Khối lớp
                </label>
                <select 
                  value={quickGrade}
                  onChange={(e) => setQuickGrade(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-colors"
                >
                  <option value="Lớp 10">Lớp 10</option>
                  <option value="Lớp 11">Lớp 11</option>
                  <option value="Lớp 12">Lớp 12</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Môn học
                </label>
                <select 
                  value={quickSubject}
                  onChange={(e) => setQuickSubject(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-colors"
                >
                  <option value="Toán học">Toán học</option>
                  <option value="Ngữ văn">Ngữ văn</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Vật lí">Vật lí</option>
                  <option value="Hóa học">Hóa học</option>
                  <option value="Sinh học">Sinh học</option>
                  <option value="Lịch sử">Lịch sử</option>
                  <option value="Địa lí">Địa lí</option>
                  <option value="Tin học">Tin học</option>
                  <option value="GD Kinh tế & Pháp luật">GD Kinh tế & Pháp luật</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Bộ sách
                </label>
                <select 
                  value={quickTextbook}
                  onChange={(e) => setQuickTextbook(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-colors"
                >
                  <option value="Kết nối tri thức">Kết nối tri thức</option>
                  <option value="Cánh Diều">Cánh Diều</option>
                  <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Tên bài học
                </label>
                <input 
                  type="text" 
                  value={quickTopic}
                  onChange={(e) => setQuickTopic(e.target.value)}
                  placeholder="Ví dụ: Đại số tổ hợp, Nhị thức Newton..." 
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden transition-colors"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Yêu cầu đặc biệt cho AI (Tùy chọn)
                </label>
                <textarea 
                  value={quickSpecialReq}
                  onChange={(e) => setQuickSpecialReq(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-hidden resize-none transition-colors" 
                  placeholder="Nhập thêm yêu cầu về STEM, năng lực số, phiếu học tập phân hóa..."
                />
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex items-center gap-3">
                <button 
                  type="button"
                  onClick={onQuickCreate}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 rounded-lg text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>AI SOẠN TỰ ĐỘNG</span>
                </button>
                <button 
                  type="button"
                  onClick={() => navigateTo('wizard')}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  Chi tiết (6 Bước)
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (4 cols): Dark AI Assistant Chat Widget */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col flex-1 shadow-lg overflow-hidden min-h-[380px]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Trợ lý AI Chat
                </span>
              </div>
              <span className="text-[10px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/40">
                Sư phạm THPT
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-[13px] custom-scrollbar max-h-[280px]">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div 
                    className={
                      msg.role === 'user'
                        ? 'bg-indigo-600 p-2.5 rounded-lg text-white max-w-[85%] text-xs leading-relaxed shadow-xs'
                        : 'bg-slate-800 p-2.5 rounded-lg border-l-4 border-emerald-500 text-slate-300 text-xs leading-relaxed shadow-xs'
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 p-2 rounded-lg w-fit">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>AI đang tư vấn phương pháp...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-2.5 bg-slate-800/50 border-t border-slate-800">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Hỏi AI ý tưởng khởi động, rubric, bài tập..." 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-3 pr-10 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!inputMessage.trim() || isAiThinking}
                  className="absolute right-1.5 p-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 8 Feature Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Hệ Sinh Thái Sư Phạm THPT 2018
          </h2>
          <span className="text-xs text-slate-500">Chuẩn hóa theo CV 5512/BGDĐT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={`card-action-${card.id}`}
                onClick={card.action}
                className="group relative bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-500 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                      <Icon className={`w-4 h-4 ${card.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {card.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span>Mở chức năng</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Lesson Plans Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Giáo Án Đã Lưu Gần Đây</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tiếp tục chỉnh sửa hoặc xuất bản sang định dạng Word (.docx)</p>
          </div>
          <button
            id="btn-view-all-plans"
            type="button"
            onClick={() => navigateTo('library')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Xem tất cả ({allPlans.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentPlans.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Chưa có Kế hoạch bài dạy nào</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Hãy bắt đầu bằng cách chọn "Soạn giáo án mới" hoặc dùng tính năng "Soạn nhanh 60s".
            </p>
            <button
              onClick={() => navigateTo('wizard')}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Soạn bài đầu tiên</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentPlans.map((plan) => (
              <div 
                key={plan.id}
                className="p-3.5 sm:px-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      {plan.subjectName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {plan.gradeName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      {plan.textbookSetName}
                    </span>
                    {plan.qualityCheck?.totalScore && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{plan.qualityCheck.totalScore}/100đ</span>
                      </span>
                    )}
                  </div>

                  <h3 
                    onClick={() => onOpenPlan(plan)}
                    className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer truncate"
                  >
                    {plan.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {plan.durationPeriods} tiết ({plan.durationMinutes} phút)
                    </span>
                    <span>•</span>
                    <span>Cập nhật: {new Date(plan.updatedAt).toLocaleDateString('vi-VN')}</span>
                    <span>•</span>
                    <span className="text-slate-600">{plan.activities?.length || 4} hoạt động</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(plan.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      plan.isFavorite 
                        ? 'bg-amber-50 border-amber-200 text-amber-500' 
                        : 'border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                    title={plan.isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Star className={`w-3.5 h-3.5 ${plan.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicatePlan(plan.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Nhân bản bài dạy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onExportDocx(plan)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                    title="Xuất tệp Word (.docx)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất Word</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenPlan(plan)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                  >
                    Mở soạn thảo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
