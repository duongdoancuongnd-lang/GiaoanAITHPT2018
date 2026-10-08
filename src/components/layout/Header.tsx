import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Menu, 
  Zap, 
  Bell
} from 'lucide-react';
import { TeacherProfile } from '../../types';

interface HeaderProps {
  currentTab?: string;
  onNavigate?: (tab: string) => void;
  onOpenQuickModal?: () => void;
  onOpenQuickCreate?: () => void;
  onToggleCopilot?: () => void;
  onOpenCopilot?: () => void;
  isCopilotOpen?: boolean;
  profile?: TeacherProfile;
  onToggleMobileMenu?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab = 'dashboard',
  onNavigate,
  onOpenQuickModal,
  onOpenQuickCreate,
  onToggleCopilot,
  onOpenCopilot,
  isCopilotOpen,
  profile,
  onToggleMobileMenu,
  onToggleSidebar,
}) => {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  const handleQuickCreate = () => {
    if (onOpenQuickCreate) onOpenQuickCreate();
    else if (onOpenQuickModal) onOpenQuickModal();
  };

  const handleToggleCopilot = () => {
    if (onOpenCopilot) onOpenCopilot();
    else if (onToggleCopilot) onToggleCopilot();
  };

  const handleToggleMenu = () => {
    if (onToggleSidebar) onToggleSidebar();
    else if (onToggleMobileMenu) onToggleMobileMenu();
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Trang chủ Dashboard';
      case 'wizard':
      case 'create_wizard': return 'Soạn giáo án mới (Chuẩn 5512)';
      case 'quick_create': return 'Soạn nhanh 60 giây';
      case 'library': return 'Kho giáo án đã lưu';
      case 'editor': return 'Trình biên tập giáo án';
      case 'curriculum': return 'Chương trình GDPT 2018';
      case 'textbooks_subjects': return 'Bộ sách giáo khoa & Môn học';
      case 'tools':
      case 'question_bank':
      case 'worksheets':
      case 'rubrics':
      case 'digital_competency':
      case 'stem_steam': return 'Công cụ sư phạm AI';
      case 'profile':
      case 'settings': return 'Cài đặt & Hồ sơ giáo viên';
      case 'analytics': return 'Thống kê & Báo cáo';
      default: return 'Giáo Án AI THPT 2018';
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 sticky top-0">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-sidebar-toggle"
          type="button"
          onClick={handleToggleMenu}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {getPageTitle()}
          </h1>
          <span className="hidden xs:inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick 60s Turbo button */}
        <button
          id="btn-header-quick-create"
          type="button"
          onClick={handleQuickCreate}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          title="Tạo nhanh giáo án trong 60 giây"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Soạn nhanh 60s</span>
        </button>

        {/* Primary New Lesson Plan button */}
        <button
          id="btn-header-new-lesson-plan"
          type="button"
          onClick={() => onNavigate ? onNavigate('create_wizard') : null}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ Soạn mới</span>
        </button>

        {/* AI Copilot toggle button */}
        <button
          id="btn-header-toggle-copilot"
          type="button"
          onClick={handleToggleCopilot}
          className={`h-8 w-8 rounded-full border flex items-center justify-center relative transition-colors ${
            isCopilotOpen 
              ? 'bg-indigo-50 border-indigo-300 text-indigo-600 shadow-xs' 
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
          }`}
          title="Trợ lý AI Chat đồng hành"
          aria-label="Trợ lý AI Chat đồng hành"
        >
          <Bot className="w-4 h-4" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </button>

        {/* User profile avatar / link */}
        <button
          id="btn-header-profile-settings"
          type="button"
          onClick={() => onNavigate ? onNavigate('profile') : null}
          className="h-8 w-8 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs transition-colors"
          title={profile?.fullName || 'Hồ sơ giáo viên'}
        >
          {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'GV'}
        </button>
      </div>
    </header>
  );
};
