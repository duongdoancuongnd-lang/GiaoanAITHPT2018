export interface Subject {
  id: string;
  name: string;
  code: string;
  isCompulsory: boolean;
  category: 'core' | 'science' | 'social' | 'technology' | 'arts' | 'activity' | 'local';
  specificCompetencies: string[];
  iconName: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number; // 1 to 12
  isHighSchool: boolean; // 10, 11, 12
}

export interface TextbookSet {
  id: string;
  name: string;
  publisher: string;
  description: string;
}

export interface LearningOutcome {
  id: string;
  content: string;
  competencyType: 'knowledge' | 'general_competency' | 'specific_competency' | 'quality' | 'digital_competency';
  level: 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';
}

export interface Lesson {
  id: string;
  subjectId: string;
  gradeId: string;
  textbookSetId: string;
  chapterId: string;
  title: string;
  periodCount: number;
  learningOutcomes: string[];
  coreKnowledge: string[];
  suggestedActivities?: string[];
}

export interface Chapter {
  id: string;
  subjectId: string;
  gradeId: string;
  textbookSetId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export type LessonPlanTemplateType = 
  | '5512_standard' 
  | '3_parts' 
  | 'table_columns' 
  | 'detailed_4cols' 
  | 'digital_integrated' 
  | 'stem_steam' 
  | 'ai_integrated'
  | 'custom';

export interface ActivityExecution {
  assignTask: string; // Giao nhiệm vụ
  doTask: string; // Thực hiện nhiệm vụ
  reportDiscuss: string; // Báo cáo - thảo luận
  concludeAssess: string; // Kết luận - nhận định
}

export interface DigitalDetails {
  enabled: boolean;
  activityName: string;
  studentAction: string;
  digitalTools: string[]; // e.g. GeoGebra, Padlet, Canva, Quizizz, Google Docs
  studentProduct: string;
  assessmentEvidence: string;
  ethicalAiNote?: string;
}

export interface StemDetails {
  enabled: boolean;
  realWorldProblem: string;
  engineeringDesign: string;
  manufacturingSteps: string;
  testingAdjustment: string;
  productPresentation: string;
  stemRubric: string;
}

export interface DifferentiationDetails {
  enabled: boolean;
  supportLevel: string; // Học sinh cần hỗ trợ
  standardLevel: string; // Học sinh đạt chuẩn
  advancedLevel: string; // Học sinh khá
  exceptionalLevel: string; // Học sinh giỏi
}

export type Activity = LessonActivity;

export interface LessonActivity {
  id: string;
  phase: 'warmup' | 'knowledge' | 'practice' | 'application' | 'extension';
  title: string;
  durationMinutes: number;
  objectives: string;
  content: string;
  product: string;
  execution: ActivityExecution;
  activityType?: 'game' | 'situation_question' | 'video' | 'image' | 'quiz' | 'ai_tool' | 'digital_app' | 'experiment' | 'project';
  practiceTypes?: Array<'mcq' | 'true_false' | 'fill_blank' | 'matching' | 'essay' | 'situation' | 'hands_on' | 'mini_project'>;
  digitalDetails?: DigitalDetails;
  stemDetails?: StemDetails;
  differentiationDetails?: DifferentiationDetails;
  isLocked?: boolean;
}

export interface RubricLevel {
  level4: string; // Tốt / Xuất sắc
  level3: string; // Khá / Đạt
  level2: string; // Trung bình / Cần cố gắng
  level1: string; // Chưa đạt
}

export interface RubricCriterion {
  id: string;
  name: string;
  weightPercent?: number;
  levels: RubricLevel;
}

export interface RubricItem {
  id: string;
  title: string;
  taskDescription: string;
  criteria: RubricCriterion[];
  createdAt: string;
}

export interface QuestionItem {
  id: string;
  level: 'nhan_biet' | 'thong_hieu' | 'van_dung' | 'van_dung_cao';
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'situational' | 'open_ended';
  question: string;
  options?: string[]; // For MCQ (A, B, C, D)
  correctAnswer: string;
  explanation: string;
  learningOutcomeRef?: string;
}

export interface WorksheetItem {
  id: string;
  title: string;
  type: 'individual' | 'pair' | 'group' | 'differentiated_3levels';
  targetLessonPlanId?: string;
  instruction: string;
  tasks: Array<{
    id: string;
    levelName?: string;
    prompt: string;
    spaceForAnswer: boolean;
    suggestedDuration?: string;
  }>;
  createdAt: string;
}

export interface QualityCheckCriterion {
  id: number;
  name: string;
  passed: boolean;
  score: number; // e.g. out of 6 or 7
  feedback: string;
  category: 'objectives' | 'equipment' | 'activities' | 'assessment' | 'pedagogy';
}

export interface QualityCheckResult {
  totalScore: number; // 0 to 100
  overallAssessment: 'good' | 'needs_adjustment' | 'needs_revision';
  summary: string;
  criteria: QualityCheckCriterion[];
  checkedAt: string;
}

export interface UpgradeRecommendation {
  dimension: 'better' | 'different' | 'reversed';
  dimensionTitle: string;
  issueFound: string;
  suggestedImprovement: string;
  upgradedSnippet: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  schoolName: string;
  department: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
  gradeId: string;
  gradeName: string;
  textbookSetId: string;
  textbookSetName: string;
  schoolYear: string;
  durationPeriods: number;
  durationMinutes: number;
  teachDate: string;
  chapterTitle?: string;
  lessonNumber?: string;
  templateType: LessonPlanTemplateType;

  // I. Mục tiêu
  objectives: {
    knowledge: string[];
    generalCompetencies: {
      selfAutonomy: string[]; // Tự chủ và tự học
      communication: string[]; // Giao tiếp và hợp tác
      problemSolving: string[]; // Giải quyết vấn đề và sáng tạo
    };
    specificCompetencies: string[]; // Năng lực đặc thù theo môn
    qualities: {
      patriotism?: string[]; // Yêu nước
      compassion?: string[]; // Nhân ái
      diligence?: string[]; // Chăm chỉ
      honesty?: string[]; // Trung thực
      responsibility?: string[]; // Trách nhiệm
    };
  };

  // II. Thiết bị dạy học và học liệu
  equipment: {
    teacher: string[];
    student: string[];
    digitalLearningMaterials: string[];
  };

  // Tích hợp tổng quan
  integrations: {
    digitalCompetencyEnabled: boolean;
    aiInTeachingEnabled: boolean;
    stemEnabled: boolean;
    differentiationEnabled: boolean;
    extensionActivityEnabled: boolean;
  };

  // III. Tiến trình dạy học (Các hoạt động)
  activities: LessonActivity[];

  // IV. Phụ lục (Đề kiểm tra, Phiếu học tập, Rubric)
  rubrics?: RubricItem[];
  worksheets?: WorksheetItem[];
  questions?: QuestionItem[];

  // Metadata
  isFavorite: boolean;
  qualityCheck?: QualityCheckResult;
  upgradeHistory?: Array<{
    date: string;
    recommendations: UpgradeRecommendation[];
  }>;
  aiPromptsUsed?: string[];
  lockedSections?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfile {
  fullName: string;
  schoolName: string;
  department: string; // Tổ chuyên môn
  primarySubjectId: string;
  teachingGrades: string[];
  schoolYear: string;
  defaultTextbookSetId: string;
  defaultTemplate: LessonPlanTemplateType;
  exportFont: 'Times New Roman' | 'Arial' | 'Calibri';
  exportFontSize: 12 | 13 | 14 | 15 | 16;
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  code: 'create_khbd' | 'quick_khbd' | 'check_khbd' | 'upgrade_khbd' | 'create_questions' | 'create_rubric' | 'create_worksheet' | 'digital_integration' | 'stem_integration' | 'differentiation' | 'copilot_chat';
  description: string;
  systemInstruction: string;
  userPromptTemplate: string;
  isCustomized: boolean;
}

export interface StatisticsData {
  totalPlans: number;
  plansThisMonth: number;
  favoritePlans: number;
  mostUsedSubject: string;
  plansByGrade: Record<string, number>;
  aiGenerationsCount: number;
  qualityAverage: number;
}
