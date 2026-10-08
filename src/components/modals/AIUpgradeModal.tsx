import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  RefreshCw, 
  Check, 
  ArrowRight, 
  Zap, 
  Lightbulb, 
  RotateCcw,
  Copy
} from 'lucide-react';
import { LessonPlan, UpgradeRecommendation } from '../../types';
import { aiService } from '../../services/aiService';

interface AIUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonPlan: LessonPlan;
  onApplyUpgrade: (recommendation: UpgradeRecommendation) => void;
}

export const AIUpgradeModal: React.FC<AIUpgradeModalProps> = ({
  isOpen,
  onClose,
  lessonPlan,
  onApplyUpgrade,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<UpgradeRecommendation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchUpgrades = async () => {
    setLoading(true);
    try {
      const res = await aiService.upgradeLessonPlan(lessonPlan);
      if (res.success && res.recommendations) {
        setRecommendations(res.recommendations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUpgrades();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                AI Nâng Cấp Giáo Án (3 Chiều Đột Phá)
              </h2>
              <p className="text-xs text-slate-500">
                1. Làm tốt hơn • 2. Làm khác đi • 3. Làm ngược lại (Flipped Classroom)
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">AI Đang Phân Tích & Sáng Tạo Phương Án Mới...</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tìm kiếm cơ hội tối ưu hóa thời gian, phương pháp dạy học tích cực và mô hình lớp học đảo ngược.
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, idx) => {
                const isBetter = rec.dimension === 'better';
                const isDifferent = rec.dimension === 'different';
                const isReversed = rec.dimension === 'reversed';

                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-5 border transition-all space-y-3 ${
                      isBetter
                        ? 'bg-blue-50/40 border-blue-200'
                        : isDifferent
                        ? 'bg-purple-50/40 border-purple-200'
                        : 'bg-amber-50/40 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isBetter && <Zap className="w-4 h-4 text-blue-600" />}
                        {isDifferent && <Lightbulb className="w-4 h-4 text-purple-600" />}
                        {isReversed && <RotateCcw className="w-4 h-4 text-amber-600" />}
                        <h3 className="font-bold text-sm text-slate-900">
                          {rec.dimensionTitle}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isBetter ? 'bg-blue-100 text-blue-800' : isDifferent ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {isBetter ? 'Tối ưu hóa' : isDifferent ? 'Đổi mới phương pháp' : 'Lớp học đảo ngược'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                        <span className="font-bold text-slate-500 block mb-1">Điểm có thể cải thiện:</span>
                        <p className="text-slate-800 leading-relaxed">{rec.issueFound}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                        <span className="font-bold text-emerald-700 block mb-1">Đề xuất nâng cấp từ AI:</span>
                        <p className="text-slate-800 leading-relaxed">{rec.suggestedImprovement}</p>
                      </div>
                    </div>

                    {/* Upgraded snippet box */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-300 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-900">Đoạn Nội Dung Nâng Cấp Sẵn Sàng Áp Dụng:</span>
                        <button
                          type="button"
                          onClick={() => handleCopySnippet(rec.upgradedSnippet, `snip_${idx}`)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                        >
                          {copiedId === `snip_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === `snip_${idx}` ? 'Đã sao chép' : 'Sao chép đoạn này'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded font-mono leading-relaxed">
                        {rec.upgradedSnippet}
                      </p>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          onApplyUpgrade(rec);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <span>Áp Dụng Vào Hoạt Động Của Bài</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={fetchUpgrades}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Tạo Đề Xuất Khác</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
