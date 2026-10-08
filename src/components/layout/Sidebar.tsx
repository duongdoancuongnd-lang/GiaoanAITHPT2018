import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Zap, 
  FolderKanban, 
  BookOpen, 
  HelpCircle, 
  FileSpreadsheet, 
  TableProperties, 
  Globe2, 
  Cpu, 
  Users, 
  UploadCloud, 
  BarChart3, 
  Sliders, 
  Database, 
  Settings, 
  X,
  GraduationCap
} from 'lucide-react';
import { TeacherProfile } from '../../types';

interface SidebarProps {
  currentTab: string;
  onNavigate?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  isOpenMobile?: boolean;
  isOpen?: boolean;
  onCloseMobile?: () => void;
  onClose?: () => void;
  profile?: TeacherProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  onSelectTab,
  isOpenMobile,
  isOpen,
  onCloseMobile,
  onClose,
  profile,
}) => {
  const isMenuOpen = isOpenMobile ?? isOpen ?? false;
  const handleClose = () => {
    if (onCloseMobile) onCloseMobile();
    if (onClose) onClose();
  };

  const navSections = [
    {
      title: 'CHÍNH',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: '', iconColor: 'text-slate-300' },
        { id: 'wizard', label: 'Soạn giáo án mới', icon: Sparkles, badge: '5512', iconColor: 'text-emerald-400' },
        { id: 'quick_create', label: 'Soạn nhanh 60s', icon: Zap, badge: 'Turbo', iconColor: 'text-amber-400' },
        { id: 'library', label: 'Kho giáo án', icon: FolderKanban, badge: '', iconColor: 'text-blue-400' },
      ],
    },
    {
      title: 'CHƯƠNG TRÌNH & SÁCH',
      items: [
        { id: 'curriculum', label: 'Khung GDPT 2018', icon: GraduationCap, badge: '17 Môn', iconColor: 'text-indigo-400' },
        { id: 'textbooks_subjects', label: 'Bộ SGK & Môn học', icon: BookOpen, badge: '', iconColor: 'text-sky-400' },
      ],
    },
    {
      title: 'CÔNG CỤ AI',
      items: [
        { id: 'question_bank', label: 'Ngân hàng câu hỏi', icon: HelpCircle, badge: 'Bloom', iconColor: 'text-sky-400' },
        { id: 'worksheets', label: 'Phiếu học tập (PHT)', icon: FileSpreadsheet, badge: '', iconColor: 'text-emerald-400' },
        { id: 'rubrics', label: 'Rubric & Đánh giá', icon: TableProperties, badge: '', iconColor: 'text-purple-400' },
        { id: 'differentiation', label: 'Phân hóa 4 mức độ', icon: Users, badge: '', iconColor: 'text-amber-400' },
        { id: 'resources_upload', label: 'Phân tích SGK / File', icon: UploadCloud, badge: '', iconColor: 'text-teal-400' },
      ],
    },
    {
      title: 'TÍCH HỢP',
      items: [
        { id: 'digital_competency', label: 'Năng lực số', icon: Globe2, badge: '', iconColor: 'text-blue-400' },
        { id: 'stem_steam', label: 'STEM / STEAM', icon: Cpu, badge: '', iconColor: 'text-rose-400' },
      ],
    },
    {
      title: 'HỆ THỐNG',
      items: [
        { id: 'analytics', label: 'Thống kê tiến độ', icon: BarChart3, badge: '', iconColor: 'text-emerald-400' },
        { id: 'ai_prompts', label: 'Quản lý Prompt AI', icon: Sliders, badge: '', iconColor: 'text-purple-400' },
        { id: 'backup_restore', label: 'Sao lưu & Khôi phục', icon: Database, badge: 'JSON', iconColor: 'text-cyan-400' },
        { id: 'settings', label: 'Hồ sơ & Cài đặt', icon: Settings, badge: '', iconColor: 'text-slate-400' },
      ],
    },
  ];

  const handleItemClick = (id: string) => {
    if (onNavigate) onNavigate(id);
    if (onSelectTab) onSelectTab(id);
    handleClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMenuOpen && (
        <div 
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`w-60 bg-indigo-950 text-slate-300 flex flex-col shrink-0 border-r border-indigo-900 fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-indigo-900/50 flex items-center justify-between">
          <div 
            onClick={() => handleItemClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              G
            </div>
            <div>
              <span className="font-bold text-white tracking-tight leading-tight uppercase text-sm block">
                GIÁO ÁN AI
              </span>
              <span className="text-[10px] text-indigo-300/70 font-semibold tracking-wider uppercase block">
                THPT 2018
              </span>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-indigo-900 lg:hidden"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-3 custom-scrollbar">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-0.5">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-sm transition-colors text-left group ${
                        isActive
                          ? 'bg-indigo-800 text-white font-medium shadow-xs'
                          : 'text-slate-300 hover:bg-indigo-900/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : item.iconColor || 'text-slate-400'
                        }`} />
                        <span className="truncate text-[13px]">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                          isActive
                            ? 'bg-indigo-700 text-white'
                            : 'bg-indigo-900/80 text-indigo-300 border border-indigo-700/50'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile info at bottom of sidebar */}
        <div className="p-3 border-t border-indigo-900/50 space-y-2 bg-indigo-950/60">
          <div 
            onClick={() => handleItemClick('settings')}
            className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-lg hover:bg-indigo-900/40 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'GV'}
            </div>
            <div className="overflow-hidden min-w-0 flex-1">
              <p className="truncate text-white text-xs font-medium leading-tight">
                {profile?.fullName || 'GV. Trần Văn A'}
              </p>
              <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                {profile?.department || profile?.schoolName || 'Tổ Toán - Lý'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
