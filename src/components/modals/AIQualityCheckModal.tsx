import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Save, 
  Award, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { LessonPlan, QualityCheckResult } from '../../types';
import { aiService } from '../../services/aiService';

interface AIQualityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonPlan: LessonPlan;
  onSaveQualityCheck: (result: QualityCheckResult) => void;
}

export const AIQualityCheckModal: React.FC<AIQualityCheckModalProps> = ({
  isOpen,
  onClose,
  lessonPlan,
  onSaveQualityCheck,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<QualityCheckResult | null>(lessonPlan.qualityCheck || null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const runEvaluation = async () => {
    setLoading(true);
    try {
      const res = await aiService.checkLessonPlan(lessonPlan);
      if (res.success && res.data) {
        setCheckResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !checkResult) {
      runEvaluation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCriteria = (checkResult?.criteria || []).filter(c => {
    if (filterCategory === 'all') return true;
    return c.category === filterCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-blue-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Kiểm Tra Chất Lượng KHBD (15 Tiêu Chí Sư Phạm)
              </h2>
              <p className="text-xs text-slate-500">
                Thẩm định tự động theo chuẩn Công văn 5512/BGDĐT & CTGDPT 2018
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Thanh Tra Sư Phạm AI Đang Đánh Giá...</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Đang rà soát mục tiêu, năng lực đặc thù, phân hóa và 4 bước tổ chức hoạt động của bài dạy.
              </p>
            </div>
          ) : checkResult ? (
            <>
              {/* Score summary banner */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wide">
                    Kết Quả Đánh Giá Tổng Thể
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {checkResult.totalScore}
                    </span>
                    <span className="text-emerald-200 text-lg">/ 100 Điểm</span>
                  </div>
                  <p className="text-xs text-emerald-50 max-w-md leading-relaxed mt-1">
                    {checkResult.summary}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/20 text-center shrink-0">
                  <span className="text-[11px] uppercase tracking-wider block font-semibold text-emerald-100">
                    Xếp loại sư phạm
                  </span>
                  <span className="text-lg font-bold text-white block mt-0.5">
                    {checkResult.overallAssessment === 'good' ? '🟢 ĐẠT CHUẨN TỐT' : '🟡 CẦN HOÀN THIỆN'}
                  </span>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto text-xs">
                {[
                  { id: 'all', label: 'Tất cả (15 tiêu chí)' },
                  { id: 'objectives', label: 'Mục tiêu & Năng lực' },
                  { id: 'activities', label: 'Tiến trình 4 HĐ' },
                  { id: 'assessment', label: 'Đánh giá & Sản phẩm' },
                  { id: 'pedagogy', label: 'Phân hóa & Số hóa' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filterCategory === tab.id
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 15 Criteria Items List */}
              <div className="space-y-2.5">
                {filteredCriteria.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      c.passed
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-amber-50/40 border-amber-200'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {c.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {c.id}. {c.name}
                        </h4>
                        <span className="text-xs font-extrabold text-slate-700 shrink-0">
                          +{c.score}đ
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {c.feedback}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={runEvaluation}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Đánh Giá Lại</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
            >
              Đóng
            </button>
            {checkResult && (
              <button
                type="button"
                onClick={() => {
                  onSaveQualityCheck(checkResult);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Điểm Vào Giáo Án</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
