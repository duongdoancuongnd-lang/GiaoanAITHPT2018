import { 
  LessonPlan, 
  Subject, 
  Grade, 
  TextbookSet, 
  Chapter, 
  Lesson, 
  QuestionItem, 
  WorksheetItem, 
  RubricItem, 
  TeacherProfile, 
  AIPromptTemplate, 
  StatisticsData 
} from '../types';
import { 
  SUBJECTS_DATA, 
  GRADES_DATA, 
  TEXTBOOK_SETS_DATA, 
  INITIAL_CHAPTERS, 
  DEFAULT_AI_PROMPTS, 
  DEMO_SAMPLE_LESSON_PLAN 
} from '../data/curriculumData';

const STORAGE_KEYS = {
  LESSON_PLANS: 'giaoan_ai_lesson_plans_v1',
  SUBJECTS: 'giaoan_ai_subjects_v1',
  GRADES: 'giaoan_ai_grades_v1',
  TEXTBOOKS: 'giaoan_ai_textbooks_v1',
  CHAPTERS: 'giaoan_ai_chapters_v1',
  QUESTIONS: 'giaoan_ai_questions_v1',
  WORKSHEETS: 'giaoan_ai_worksheets_v1',
  RUBRICS: 'giaoan_ai_rubrics_v1',
  TEACHER_PROFILE: 'giaoan_ai_teacher_profile_v1',
  AI_PROMPTS: 'giaoan_ai_prompts_v1',
  AI_STATS_COUNT: 'giaoan_ai_stats_ai_calls_v1',
};

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  fullName: 'Thầy / Cô Nguyễn Văn An',
  schoolName: 'Trường THPT Chuyên Quốc Học',
  department: 'Tổ Toán - Tin học',
  primarySubjectId: 'sub_math',
  teachingGrades: ['g10', 'g11'],
  schoolYear: '2025 - 2026',
  defaultTextbookSetId: 'kntt',
  defaultTemplate: '5512_standard',
  exportFont: 'Times New Roman',
  exportFontSize: 14,
};

export const storageService = {
  // LESSON PLANS CRUD
  getLessonPlans(): LessonPlan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSON_PLANS);
      if (!data) {
        // Initialize with default demo lesson plan
        const initial = [DEMO_SAMPLE_LESSON_PLAN];
        this.saveLessonPlans(initial);
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [DEMO_SAMPLE_LESSON_PLAN];
    }
  },

  saveLessonPlans(plans: LessonPlan[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LESSON_PLANS, JSON.stringify(plans));
    } catch (e) {
      console.error('Failed to save lesson plans to storage', e);
    }
  },

  getLessonPlanById(id: string): LessonPlan | undefined {
    const plans = this.getLessonPlans();
    return plans.find(p => p.id === id);
  },

  saveLessonPlan(plan: LessonPlan): LessonPlan {
    const plans = this.getLessonPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    const updatedPlan = {
      ...plan,
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      plans[index] = updatedPlan;
    } else {
      plans.unshift(updatedPlan);
    }
    this.saveLessonPlans(plans);
    return updatedPlan;
  },

  deleteLessonPlan(id: string): void {
    const plans = this.getLessonPlans();
    const filtered = plans.filter(p => p.id !== id);
    this.saveLessonPlans(filtered);
  },

  duplicateLessonPlan(id: string): LessonPlan | null {
    const plan = this.getLessonPlanById(id);
    if (!plan) return null;

    const newPlan: LessonPlan = {
      ...plan,
      id: 'lp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: `${plan.title} (Bản sao)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveLessonPlan(newPlan);
    return newPlan;
  },

  toggleFavorite(id: string): boolean {
    const plan = this.getLessonPlanById(id);
    if (!plan) return false;
    plan.isFavorite = !plan.isFavorite;
    this.saveLessonPlan(plan);
    return plan.isFavorite;
  },

  // SUBJECTS
  getSubjects(): Subject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (!data) {
        this.saveSubjects(SUBJECTS_DATA);
        return SUBJECTS_DATA;
      }
      return JSON.parse(data);
    } catch {
      return SUBJECTS_DATA;
    }
  },

  saveSubjects(subjects: Subject[]): void {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  addSubject(subject: Subject): void {
    const subjects = this.getSubjects();
    subjects.push(subject);
    this.saveSubjects(subjects);
  },

  updateSubject(subject: Subject): void {
    const subjects = this.getSubjects();
    const idx = subjects.findIndex(s => s.id === subject.id);
    if (idx >= 0) {
      subjects[idx] = subject;
      this.saveSubjects(subjects);
    }
  },

  deleteSubject(id: string): void {
    const subjects = this.getSubjects().filter(s => s.id !== id);
    this.saveSubjects(subjects);
  },

  // GRADES
  getGrades(): Grade[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GRADES);
      if (!data) {
        this.saveGrades(GRADES_DATA);
        return GRADES_DATA;
      }
      return JSON.parse(data);
    } catch {
      return GRADES_DATA;
    }
  },

  saveGrades(grades: Grade[]): void {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  },

  // TEXTBOOK SETS
  getTextbookSets(): TextbookSet[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEXTBOOKS);
      if (!data) {
        this.saveTextbookSets(TEXTBOOK_SETS_DATA);
        return TEXTBOOK_SETS_DATA;
      }
      return JSON.parse(data);
    } catch {
      return TEXTBOOK_SETS_DATA;
    }
  },

  saveTextbookSets(textbooks: TextbookSet[]): void {
    localStorage.setItem(STORAGE_KEYS.TEXTBOOKS, JSON.stringify(textbooks));
  },

  // CHAPTERS & LESSONS
  getChapters(): Chapter[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAPTERS);
      if (!data) {
        this.saveChapters(INITIAL_CHAPTERS);
        return INITIAL_CHAPTERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CHAPTERS;
    }
  },

  saveChapters(chapters: Chapter[]): void {
    localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters));
  },

  addChapter(chapter: Chapter): void {
    const chapters = this.getChapters();
    chapters.push(chapter);
    this.saveChapters(chapters);
  },

  addLessonToChapter(chapterId: string, lesson: Lesson): void {
    const chapters = this.getChapters();
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
      chapter.lessons.push(lesson);
      this.saveChapters(chapters);
    }
  },

  // QUESTIONS BANK
  getQuestions(): QuestionItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveQuestions(questions: QuestionItem[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  addQuestions(newQuestions: QuestionItem[]): void {
    const questions = this.getQuestions();
    this.saveQuestions([...newQuestions, ...questions]);
  },

  deleteQuestion(id: string): void {
    const questions = this.getQuestions().filter(q => q.id !== id);
    this.saveQuestions(questions);
  },

  // WORKSHEETS
  getWorksheets(): WorksheetItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKSHEETS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveWorksheets(worksheets: WorksheetItem[]): void {
    localStorage.setItem(STORAGE_KEYS.WORKSHEETS, JSON.stringify(worksheets));
  },

  addWorksheet(worksheet: WorksheetItem): void {
    const worksheets = this.getWorksheets();
    worksheets.unshift(worksheet);
    this.saveWorksheets(worksheets);
  },

  deleteWorksheet(id: string): void {
    const worksheets = this.getWorksheets().filter(w => w.id !== id);
    this.saveWorksheets(worksheets);
  },

  // RUBRICS
  getRubrics(): RubricItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RUBRICS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveRubrics(rubrics: RubricItem[]): void {
    localStorage.setItem(STORAGE_KEYS.RUBRICS, JSON.stringify(rubrics));
  },

  addRubric(rubric: RubricItem): void {
    const rubrics = this.getRubrics();
    rubrics.unshift(rubric);
    this.saveRubrics(rubrics);
  },

  deleteRubric(id: string): void {
    const rubrics = this.getRubrics().filter(r => r.id !== id);
    this.saveRubrics(rubrics);
  },

  // TEACHER PROFILE
  getTeacherProfile(): TeacherProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHER_PROFILE);
      return data ? { ...DEFAULT_TEACHER_PROFILE, ...JSON.parse(data) } : DEFAULT_TEACHER_PROFILE;
    } catch {
      return DEFAULT_TEACHER_PROFILE;
    }
  },

  saveTeacherProfile(profile: TeacherProfile): void {
    localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(profile));
  },

  // AI PROMPTS
  getAIPrompts(): AIPromptTemplate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AI_PROMPTS);
      return data ? JSON.parse(data) : DEFAULT_AI_PROMPTS;
    } catch {
      return DEFAULT_AI_PROMPTS;
    }
  },

  saveAIPrompts(prompts: AIPromptTemplate[]): void {
    localStorage.setItem(STORAGE_KEYS.AI_PROMPTS, JSON.stringify(prompts));
  },

  updateAIPrompt(prompt: AIPromptTemplate): void {
    const prompts = this.getAIPrompts();
    const idx = prompts.findIndex(p => p.id === prompt.id);
    if (idx >= 0) {
      prompts[idx] = { ...prompt, isCustomized: true };
      this.saveAIPrompts(prompts);
    }
  },

  resetAIPromptsToDefault(): void {
    this.saveAIPrompts(DEFAULT_AI_PROMPTS);
  },

  // AI USAGE COUNTER
  incrementAIUsage(): number {
    try {
      const count = parseInt(localStorage.getItem(STORAGE_KEYS.AI_STATS_COUNT) || '0', 10) + 1;
      localStorage.setItem(STORAGE_KEYS.AI_STATS_COUNT, count.toString());
      return count;
    } catch {
      return 1;
    }
  },

  getAIUsageCount(): number {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.AI_STATS_COUNT) || '0', 10);
    } catch {
      return 0;
    }
  },

  // STATISTICS
  getStatistics(): StatisticsData {
    const plans = this.getLessonPlans();
    const aiCount = this.getAIUsageCount();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const plansThisMonth = plans.filter(p => {
      const d = new Date(p.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const favoritePlans = plans.filter(p => p.isFavorite).length;

    const subjectCounts: Record<string, number> = {};
    const gradeCounts: Record<string, number> = {};
    let totalScore = 0;
    let scoreCount = 0;

    plans.forEach(p => {
      subjectCounts[p.subjectName] = (subjectCounts[p.subjectName] || 0) + 1;
      gradeCounts[p.gradeName] = (gradeCounts[p.gradeName] || 0) + 1;
      if (p.qualityCheck?.totalScore) {
        totalScore += p.qualityCheck.totalScore;
        scoreCount++;
      }
    });

    let mostUsedSubject = 'Toán';
    let maxSubCount = 0;
    for (const [sub, count] of Object.entries(subjectCounts)) {
      if (count > maxSubCount) {
        maxSubCount = count;
        mostUsedSubject = sub;
      }
    }

    return {
      totalPlans: plans.length,
      plansThisMonth,
      favoritePlans,
      mostUsedSubject,
      plansByGrade: gradeCounts,
      aiGenerationsCount: aiCount,
      qualityAverage: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 92,
    };
  },

  // BACKUP & RESTORE
  exportFullBackup(): string {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      lessonPlans: this.getLessonPlans(),
      subjects: this.getSubjects(),
      grades: this.getGrades(),
      textbookSets: this.getTextbookSets(),
      chapters: this.getChapters(),
      questions: this.getQuestions(),
      worksheets: this.getWorksheets(),
      rubrics: this.getRubrics(),
      teacherProfile: this.getTeacherProfile(),
      aiPrompts: this.getAIPrompts(),
      aiUsageCount: this.getAIUsageCount(),
    };
    return JSON.stringify(backupData, null, 2);
  },

  importFullBackup(jsonString: string, mode: 'overwrite' | 'merge'): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Tệp sao lưu không hợp lệ.' };
      }

      if (mode === 'overwrite') {
        if (data.lessonPlans) this.saveLessonPlans(data.lessonPlans);
        if (data.subjects) this.saveSubjects(data.subjects);
        if (data.grades) this.saveGrades(data.grades);
        if (data.textbookSets) this.saveTextbookSets(data.textbookSets);
        if (data.chapters) this.saveChapters(data.chapters);
        if (data.questions) this.saveQuestions(data.questions);
        if (data.worksheets) this.saveWorksheets(data.worksheets);
        if (data.rubrics) this.saveRubrics(data.rubrics);
        if (data.teacherProfile) this.saveTeacherProfile(data.teacherProfile);
        if (data.aiPrompts) this.saveAIPrompts(data.aiPrompts);
      } else {
        // Merge mode
        if (Array.isArray(data.lessonPlans)) {
          const current = this.getLessonPlans();
          const existingIds = new Set(current.map(p => p.id));
          const newPlans = data.lessonPlans.filter((p: LessonPlan) => !existingIds.has(p.id));
          this.saveLessonPlans([...current, ...newPlans]);
        }
        if (Array.isArray(data.questions)) {
          const current = this.getQuestions();
          const existingIds = new Set(current.map(q => q.id));
          const newQ = data.questions.filter((q: QuestionItem) => !existingIds.has(q.id));
          this.saveQuestions([...current, ...newQ]);
        }
      }

      return { success: true, message: 'Khôi phục dữ liệu thành công!' };
    } catch (e: any) {
      return { success: false, message: `Lỗi khôi phục dữ liệu: ${e?.message || 'Không xác định'}` };
    }
  },

  resetAllToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.LESSON_PLANS);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.GRADES);
    localStorage.removeItem(STORAGE_KEYS.TEXTBOOKS);
    localStorage.removeItem(STORAGE_KEYS.CHAPTERS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.WORKSHEETS);
    localStorage.removeItem(STORAGE_KEYS.RUBRICS);
    localStorage.removeItem(STORAGE_KEYS.TEACHER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.AI_PROMPTS);
    localStorage.removeItem(STORAGE_KEYS.AI_STATS_COUNT);
  },

  // Aliases for clean UI consumption
  getProfile(): TeacherProfile {
    return this.getTeacherProfile();
  },

  saveProfile(profile: TeacherProfile): void {
    this.saveTeacherProfile(profile);
  },

  getCustomSubjects(): Subject[] {
    const all = this.getSubjects();
    return all.filter(s => s.id.startsWith('sub_custom_'));
  },

  saveCustomSubject(subject: Subject): void {
    const all = this.getSubjects();
    const idx = all.findIndex(s => s.id === subject.id);
    if (idx >= 0) {
      all[idx] = subject;
    } else {
      all.push(subject);
    }
    this.saveSubjects(all);
  },

  deleteCustomSubject(id: string): void {
    this.deleteSubject(id);
  },

  exportAllDataJson(): string {
    return this.exportFullBackup();
  },

  importDataFromJson(jsonStr: string): boolean {
    const res = this.importFullBackup(jsonStr, 'overwrite');
    return res.success;
  },

  clearAll(): void {
    this.resetAllToDefaults();
  }
};
