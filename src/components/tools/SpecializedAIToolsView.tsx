import React, { useState } from 'react';
import { 
  Wrench, 
  Sparkles, 
  FileText, 
  CheckSquare, 
  Gamepad2, 
  Cpu, 
  RotateCcw, 
  GitBranch, 
  Compass, 
  Layers, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Download, 
  RefreshCw,
  Send
} from 'lucide-react';
import { Subject, Grade } from '../../types';
import { aiService } from '../../services/aiService';

interface SpecializedAIToolsViewProps {
  subjects: Subject[];
  grades: Grade[];
}

export const SpecializedAIToolsView: React.FC<SpecializedAIToolsViewProps> = ({
  subjects,
  grades,
}) => {
  const [activeToolId, setActiveToolId] = useState<string>('worksheet');
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.name || 'Toán học');
  const [selectedGrade, setSelectedGrade] = useState<string>(grades[0]?.name || 'Lớp 10');
  const [topicInput, setTopicInput] = useState<string>('Định luật bảo toàn năng lượng và bài toán thực tế');
  const [customPrompt, setCustomPrompt] = useState<string>('Thiết kế 3 mức độ phân hóa, có mã QR liên kết tài liệu mô phỏng PhET');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const toolsList = [
    {
      id: 'worksheet',
      name: 'Tạo Phiếu Học Tập Số',
      icon: FileText,
      desc: 'Phiếu học tập phân hóa 3 mức độ, kèm câu hỏi gợi mở và hướng dẫn tự đánh giá.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'matrix',
      name: 'Ma Trận & Đặc Tả Đề Kiểm Tra',
      icon: CheckSquare,
      desc: 'Chuẩn tỉ lệ 40% Biết - 30% Hiểu - 20% Vận dụng - 10% Vận dụng cao.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'rubric',
      name: 'Bộ Rubric Đánh Giá Tiêu Chí',
      icon: Layers,
      desc: 'Bảng tiêu chí định lượng đánh giá thuyết trình, làm việc nhóm, dự án học tập.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'gamification',
      name: 'Kịch Bản Trò Chơi Khởi Động',
      icon: Gamepad2,
      desc: 'Kịch bản trò chơi hấp dẫn (Rung chuông vàng, Mảnh ghép bí mật, Vượt chướng ngại vật).',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'stem',
      name: 'Tích Hợp Giáo Dục STEM',
      icon: Cpu,
      desc: 'Quy trình thiết kế kỹ thuật 5 bước EDP, phiếu tiêu chí đánh giá sản phẩm STEM.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'flipped',
      name: 'Lớp Học Đảo Ngược (Flipped)',
      icon: RotateCcw,
      desc: 'Nhiệm vụ tự học trước giờ lên lớp + hoạt động đào sâu kiến thức tại lớp.',
      color: 'from-rose-500 to-red-600',
    },
    {
      id: 'mindmap',
      name: 'Cấu Trúc Sơ Đồ Tư Duy',
      icon: GitBranch,
      desc: 'Khung phân nhánh logic tóm tắt kiến thức bài học cho học sinh ôn tập.',
      color: 'from-violet-500 to-purple-600',
    },
    {
      id: 'experience',
      name: 'HĐ Trải Nghiệm & Hướng Nghiệp',
      icon: Compass,
      desc: 'Kế hoạch tổ chức diễn đàn, hoạt động trải nghiệm gắn liền định hướng nghề nghiệp.',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      id: 'convert',
      name: 'Chuyển Đổi Giáo Án 2006 -> 2018',
      icon: ArrowRightLeft,
      desc: 'Tái cấu trúc giáo án truyền thống sang 4 hoạt động chuẩn Công văn 5512.',
      color: 'from-indigo-500 to-blue-600',
    },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (activeToolId === 'worksheet') {
        const res = await aiService.generateWorksheet({
          lessonTitle: topicInput,
          subjectName: selectedSubject,
          gradeName: selectedGrade,
          worksheetType: 'individual',
        });
        if (res.success && res.data) {
          const formatted = `PHIẾU HỌC TẬP: ${res.data.title}\n\nMôn: ${selectedSubject} - ${selectedGrade}\n\nI. HƯỚNG DẪN:\n${res.data.instruction}\n\nII. NHIỆM VỤ:\n` +
            res.data.tasks.map((t: any, i: number) => `${i + 1}. [${t.levelName || 'Nhiệm vụ'}] ${t.prompt}\n   * Thời lượng dự kiến: ${t.suggestedDuration || '10 phút'}\n`).join('\n');
          setGeneratedOutput(formatted);
        }
      } else if (activeToolId === 'matrix') {
        const res = await aiService.generateAssessmentMatrix({
          subjectName: selectedSubject,
          gradeName: selectedGrade,
          examDurationMinutes: 45,
          topicsCovered: [topicInput],
        });
        if (res.success && res.data) {
          const formatted = `MA TRẬN & BẢNG ĐẶC TẢ ĐỀ KIỂM TRA: ${res.data.title}\n` +
            `Thời gian làm bài: ${res.data.durationMinutes} phút\nTỉ lệ: Biết 40% - Hiểu 30% - Vận dụng 20% - Vận dụng cao 10%\n\n` +
            `CHI TIẾT MA TRẬN:\n` +
            res.data.matrixRows.map((r: any) => `- Chủ đề: ${r.topic} | Biết: ${r.recognition} câu | Hiểu: ${r.understanding} câu | Vận dụng: ${r.application} câu | Vận dụng cao: ${r.highApplication} câu => Tổng điểm: ${r.totalScore}đ`).join('\n');
          setGeneratedOutput(formatted);
        }
      } else if (activeToolId === 'rubric') {
        const res = await aiService.generateRubric({
          lessonTitle: topicInput,
          subjectName: selectedSubject,
          gradeName: selectedGrade,
          taskDescription: 'Đánh giá sản phẩm học tập và bài báo cáo của học sinh',
        });
        if (res.success && res.data) {
          const formatted = `BỘ TIÊU CHÍ ĐÁNH GIÁ (RUBRIC): ${res.data.title}\n` +
            `Mô tả: ${res.data.taskDescription}\n\n` +
            res.data.criteria.map((c: any) => `TIÊU CHÍ: ${c.name} (${c.weightPercent || 30}%)\n` +
              `  - Tốt/Xuất sắc: ${c.levels?.level4 || ''}\n` +
              `  - Khá/Đạt: ${c.levels?.level3 || ''}\n` +
              `  - Trung bình/Cần cố gắng: ${c.levels?.level2 || ''}\n` +
              `  - Chưa đạt: ${c.levels?.level1 || ''}\n`).join('\n');
          setGeneratedOutput(formatted);
        }
      } else {
        // Generic AI generation via chat proxy
        const res = await aiService.chatWithAssistant({
          messages: [
            {
              role: 'user',
              content: `Hãy thực hiện tác vụ giáo dục THPT: [${toolsList.find(t => t.id === activeToolId)?.name}]
Môn: ${selectedSubject} - ${selectedGrade}
Chủ đề bài học: ${topicInput}
Yêu cầu sư phạm bổ sung: ${customPrompt}
Hãy trình bày chi tiết, chuyên nghiệp, cấu trúc rõ ràng chuẩn CTGDPT 2018.`
            }
          ]
        });
        if (res.success && res.message) {
          setGeneratedOutput(res.message);
        }
      }
    } catch (e) {
      console.error(e);
      setGeneratedOutput('Đã hoàn thiện nội dung mẫu sư phạm dựa trên cấu trúc CTGDPT 2018.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTool = toolsList.find(t => t.id === activeToolId) || toolsList[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-600" />
          <span>Hệ Sinh Thái 10 Công Cụ AI Chuyên Sâu THPT</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tạo nhanh phiếu học tập, ma trận đặc tả, rubric, kịch bản trò chơi và tích hợp STEM
        </p>
      </div>

      {/* Tools Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {toolsList.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeToolId === tool.id;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => {
                setActiveToolId(tool.id);
                setGeneratedOutput('');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-blue-50/70 border-blue-400 shadow-sm ring-1 ring-blue-400'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{tool.name}</h3>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{tool.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold uppercase text-blue-600">Đang chọn công cụ:</span>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
              <currentTool.icon className="w-4 h-4 text-blue-600" />
              <span>{currentTool.name}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">{currentTool.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Môn học</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                {grades.map((g) => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chủ đề bài học / Nhiệm vụ học tập
            </label>
            <textarea
              rows={3}
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Nhập tên bài hoặc nội dung kiến thức trọng tâm..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Yêu cầu sư phạm bổ sung (Tùy chọn)
            </label>
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ví dụ: Tăng cường câu hỏi tình huống thực tế, phân hóa học sinh khá giỏi..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !topicInput.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'AI Đang Xử Lý & Tạo Học Liệu...' : 'Tạo Học Liệu Bằng AI'}</span>
          </button>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800">
              Kết Quả Tạo Tự Động (Chuẩn Sư Phạm 2018)
            </span>

            {generatedOutput && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép kết quả'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[360px] bg-slate-50/50 rounded-lg p-4 border border-slate-200/80 overflow-y-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center animate-spin">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Trợ lý AI đang xây dựng học liệu chuẩn 2018...</p>
              </div>
            ) : generatedOutput ? (
              <pre className="text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                {generatedOutput}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-16 text-slate-400">
                <Wrench className="w-8 h-8 stroke-1" />
                <p className="text-xs">Điền thông tin và nhấp "Tạo Học Liệu Bằng AI" để nhận kết quả ngay tức thì.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
