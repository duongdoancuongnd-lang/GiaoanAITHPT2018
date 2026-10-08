import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/layout/Header';
import { 
  Sidebar 
} from './components/layout/Sidebar';
import { 
  DashboardView 
} from './components/dashboard/DashboardView';
import { 
  LessonPlanWizard 
} from './components/wizard/LessonPlanWizard';
import { 
  LessonPlanEditorView 
} from './components/editor/LessonPlanEditorView';
import { 
  LessonPlansLibraryView 
} from './components/library/LessonPlansLibraryView';
import { 
  CurriculumManagerView 
} from './components/curriculum/CurriculumManagerView';
import { 
  SpecializedAIToolsView 
} from './components/tools/SpecializedAIToolsView';
import { 
  ProfileSettingsView 
} from './components/profile/ProfileSettingsView';
import { 
  AIQualityCheckModal 
} from './components/modals/AIQualityCheckModal';
import { 
  AIUpgradeModal 
} from './components/modals/AIUpgradeModal';
import { 
  QuickCreateModal 
} from './components/modals/QuickCreateModal';
import { 
  AICopilotDrawer 
} from './components/chat/AICopilotDrawer';
import { 
  storageService 
} from './services/storageService';
import { 
  exportService 
} from './services/exportService';
import { 
  LessonPlan, 
  TeacherProfile, 
  Subject, 
  Grade, 
  TextbookSet, 
  Chapter, 
  Lesson, 
  QualityCheckResult, 
  UpgradeRecommendation 
} from './types';
import { 
  INITIAL_SUBJECTS, 
  INITIAL_GRADES, 
  INITIAL_TEXTBOOK_SETS, 
  INITIAL_CHAPTERS 
} from './data/curriculumData';

export const App: React.FC = () => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Core Data State
  const [profile, setProfile] = useState<TeacherProfile>(storageService.getProfile());
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [grades] = useState<Grade[]>(INITIAL_GRADES);
  const [textbookSets] = useState<TextbookSet[]>(INITIAL_TEXTBOOK_SETS);
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);

  // Active / Selected Lesson Plan for Editor & Modals
  const [activePlan, setActivePlan] = useState<LessonPlan | null>(null);

  // Modal States
  const [isQualityCheckOpen, setIsQualityCheckOpen] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState<boolean>(false);

  // Load initial data
  const reloadData = () => {
    setProfile(storageService.getProfile());
    const plans = storageService.getLessonPlans();
    setLessonPlans(plans);

    // Custom subjects
    const customSubs = storageService.getCustomSubjects();
    if (customSubs && customSubs.length > 0) {
      setSubjects([...INITIAL_SUBJECTS, ...customSubs]);
    } else {
      setSubjects(INITIAL_SUBJECTS);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Handlers for Lesson Plan Management
  const handleSavePlan = (plan: LessonPlan) => {
    storageService.saveLessonPlan(plan);
    reloadData();
    setActivePlan(plan);
  };

  const handleOpenPlanInEditor = (plan: LessonPlan) => {
    setActivePlan(plan);
    setCurrentTab('editor');
  };

  const handleDuplicatePlan = (id: string) => {
    const duplicated = storageService.duplicateLessonPlan(id);
    if (duplicated) {
      reloadData();
      setActivePlan(duplicated);
      setCurrentTab('editor');
    }
  };

  const handleDeletePlan = (id: string) => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa bài dạy này?')) {
      storageService.deleteLessonPlan(id);
      reloadData();
      if (activePlan?.id === id) {
        setActivePlan(null);
        setCurrentTab('library');
      }
    }
  };

  const handleToggleFavorite = (id: string) => {
    storageService.toggleFavorite(id);
    reloadData();
    if (activePlan?.id === id) {
      setActivePlan(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleExportDocx = async (plan: LessonPlan) => {
    await exportService.exportLessonPlanToDocx(plan, profile);
  };

  // Handler from Curriculum browser to start wizard
  const handleStartLessonPlanFromCurriculum = (
    subject: Subject,
    grade: Grade,
    textbook: TextbookSet,
    lessonTitle: string
  ) => {
    setCurrentTab('create_wizard');
  };

  // Handlers for Custom Subjects & Curriculum
  const handleAddSubject = (newSub: Subject) => {
    storageService.saveCustomSubject(newSub);
    setSubjects(prev => [...prev, newSub]);
  };

  const handleUpdateSubject = (updatedSub: Subject) => {
    storageService.saveCustomSubject(updatedSub);
    setSubjects(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
  };

  const handleDeleteSubject = (id: string) => {
    storageService.deleteCustomSubject(id);
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const handleAddChapter = (newCh: Chapter) => {
    setChapters(prev => [...prev, newCh]);
  };

  const handleAddLesson = (chapterId: string, newLesson: Lesson) => {
    setChapters(prev => prev.map(ch => {
      if (ch.id === chapterId) {
        return { ...ch, lessons: [...ch.lessons, newLesson] };
      }
      return ch;
    }));
  };

  // Quality check save handler
  const handleSaveQualityCheck = (result: QualityCheckResult) => {
    if (!activePlan) return;
    const updated: LessonPlan = {
      ...activePlan,
      qualityCheck: result,
      updatedAt: new Date().toISOString(),
    };
    handleSavePlan(updated);
  };

  // Upgrade apply handler
  const handleApplyUpgrade = (rec: UpgradeRecommendation) => {
    if (!activePlan) return;
    const upgradedActivities = [...activePlan.activities];
    if (upgradedActivities.length > 1) {
      upgradedActivities[1] = {
        ...upgradedActivities[1],
        title: `${upgradedActivities[1].title} (Đã nâng cấp AI)`,
        content: `${upgradedActivities[1].content}\n[AI Nâng cấp: ${rec.dimensionTitle}]: ${rec.suggestedImprovement}`,
      };
    }
    const updated: LessonPlan = {
      ...activePlan,
      activities: upgradedActivities,
      updatedAt: new Date().toISOString(),
    };
    handleSavePlan(updated);
  };

  // Quick plan creation callback
  const handleCompleteQuickPlan = (newPlan: LessonPlan) => {
    storageService.saveLessonPlan(newPlan);
    reloadData();
    setActivePlan(newPlan);
    setCurrentTab('editor');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        profile={profile}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        onOpenQuickCreate={() => setIsQuickCreateOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'editor' && !activePlan && lessonPlans.length > 0) {
              setActivePlan(lessonPlans[0]);
            }
            setCurrentTab(tab);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Tab 1: Dashboard */}
            {currentTab === 'dashboard' && (
              <DashboardView
                profile={profile}
                lessonPlans={lessonPlans}
                onNavigate={(tab) => setCurrentTab(tab)}
                onNewPlan={() => setCurrentTab('create_wizard')}
                onQuickCreate={() => setIsQuickCreateOpen(true)}
                onOpenPlan={handleOpenPlanInEditor}
                onViewAllPlans={() => setCurrentTab('library')}
                onOpenTools={() => setCurrentTab('tools')}
                onOpenCurriculum={() => setCurrentTab('curriculum')}
                onExportDocx={handleExportDocx}
                onDuplicatePlan={handleDuplicatePlan}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* Tab 2: 6-Step Wizard */}
            {(currentTab === 'create_wizard' || currentTab === 'wizard') && (
              <LessonPlanWizard
                profile={profile}
                subjects={subjects}
                grades={grades}
                textbookSets={textbookSets}
                chapters={chapters}
                onCompletePlan={(newPlan) => {
                  storageService.saveLessonPlan(newPlan);
                  reloadData();
                  setActivePlan(newPlan);
                  setCurrentTab('editor');
                }}
                onCancel={() => setCurrentTab('dashboard')}
              />
            )}

            {/* Tab 3: Interactive Lesson Plan Editor */}
            {currentTab === 'editor' && (
              activePlan ? (
                <LessonPlanEditorView
                  plan={activePlan}
                  profile={profile}
                  onSavePlan={handleSavePlan}
                  onBack={() => setCurrentTab('library')}
                  onOpenQualityCheck={(p) => {
                    setActivePlan(p);
                    setIsQualityCheckOpen(true);
                  }}
                  onOpenUpgradeModal={(p) => {
                    setActivePlan(p);
                    setIsUpgradeModalOpen(true);
                  }}
                />
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                  <h3 className="text-sm font-bold text-slate-800">Chưa có bài dạy nào được chọn</h3>
                  <p className="text-xs text-slate-500">Hãy chọn một bài từ Kho giáo án hoặc bắt đầu soạn mới.</p>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('create_wizard')}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Soạn Kế Hoạch Bài Dạy Mới
                  </button>
                </div>
              )
            )}

            {/* Tab 4: Library */}
            {currentTab === 'library' && (
              <LessonPlansLibraryView
                plans={lessonPlans}
                subjects={subjects}
                grades={grades}
                textbookSets={textbookSets}
                onOpenPlan={handleOpenPlanInEditor}
                onNewPlan={() => setCurrentTab('create_wizard')}
                onExportDocx={handleExportDocx}
                onDuplicatePlan={handleDuplicatePlan}
                onDeletePlan={handleDeletePlan}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* Tab 5: CTGDPT 2018 Curriculum Manager */}
            {(currentTab === 'curriculum' || currentTab === 'textbooks_subjects') && (
              <CurriculumManagerView
                subjects={subjects}
                grades={grades}
                textbookSets={textbookSets}
                chapters={chapters}
                onAddSubject={handleAddSubject}
                onUpdateSubject={handleUpdateSubject}
                onDeleteSubject={handleDeleteSubject}
                onAddChapter={handleAddChapter}
                onAddLesson={handleAddLesson}
                onStartLessonPlanForLesson={handleStartLessonPlanFromCurriculum}
              />
            )}

            {/* Tab 6: Specialized AI Tools */}
            {(currentTab === 'tools' || currentTab === 'worksheets' || currentTab === 'question_bank' || currentTab === 'rubrics' || currentTab === 'digital_competency' || currentTab === 'stem_steam' || currentTab === 'differentiation' || currentTab === 'resources_upload' || currentTab === 'analytics' || currentTab === 'ai_prompts' || currentTab === 'backup_restore') && (
              <SpecializedAIToolsView
                subjects={subjects}
                grades={grades}
              />
            )}

            {/* Tab 7: Teacher Profile & System Settings */}
            {(currentTab === 'profile' || currentTab === 'settings') && (
              <ProfileSettingsView
                profile={profile}
                subjects={subjects}
                grades={grades}
                textbookSets={textbookSets}
                onSaveProfile={(updated) => {
                  storageService.saveProfile(updated);
                  setProfile(updated);
                }}
                onRefreshData={reloadData}
              />
            )}
          </div>
        </main>
      </div>

      {/* Slide-over AI Pedagogical Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* AI Quality Check (15 Criteria) Modal */}
      {isQualityCheckOpen && activePlan && (
        <AIQualityCheckModal
          isOpen={isQualityCheckOpen}
          onClose={() => setIsQualityCheckOpen(false)}
          lessonPlan={activePlan}
          onSaveQualityCheck={handleSaveQualityCheck}
        />
      )}

      {/* AI 3-Dimension Upgrade Modal */}
      {isUpgradeModalOpen && activePlan && (
        <AIUpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          lessonPlan={activePlan}
          onApplyUpgrade={handleApplyUpgrade}
        />
      )}

      {/* 60-Second Quick Create Modal */}
      {isQuickCreateOpen && (
        <QuickCreateModal
          isOpen={isQuickCreateOpen}
          onClose={() => setIsQuickCreateOpen(false)}
          subjects={subjects}
          grades={grades}
          textbookSets={textbookSets}
          profile={profile}
          onCompleteQuickPlan={handleCompleteQuickPlan}
        />
      )}
    </div>
  );
};

export default App;
