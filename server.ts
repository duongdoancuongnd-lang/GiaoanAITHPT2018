import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Giáo Án AI THPT 2018',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * 1. Endpoint: AI Soạn KHBD Hoàn chỉnh theo Chuẩn Công văn 5512 & CTGDPT 2018
 */
app.post('/api/gemini/generate-khbd', async (req, res) => {
  try {
    const { 
      subjectName, 
      gradeName, 
      textbookSetName, 
      lessonTitle, 
      durationPeriods, 
      durationMinutes, 
      learningOutcomes, 
      specificCompetencies,
      digitalIntegration,
      stemIntegration,
      differentiation,
      templateType,
      teacherNote,
      lockedSections
    } = req.body;

    const client = getGeminiClient();
    const systemInstruction = `Bạn là CHUYÊN GIA SƯ PHẠM CAO CẤP VÀ KIẾN TRÚC SƯ CHƯƠNG TRÌNH GDPT 2018 CỦA BỘ GIÁO DỤC VÀ ĐÀO TẠO VIỆT NAM.
Nhiệm vụ của bạn là soạn thảo KẾ HOẠCH BÀI DẠY (KHBD) chuẩn chỉnh theo đúng tinh thần Công văn 5512/BGDĐT.

NGUYÊN TẮC QUAN TRỌNG:
1. TUYỆT ĐỐI KHÔNG BỊA ĐẶT NỘI DUNG SGK, KHÔNG BỊA SỐ TRANG NẾU KHÔNG RÕ.
2. KHÔNG VIẾT CHUNG CHUNG LAN MAN. Mọi mục tiêu phải đo lường được bằng sản phẩm cụ thể của học sinh.
3. Năng lực đặc thù phải đúng chính xác theo môn học (Toán: Tư duy logic, Mô hình hóa; Ngữ văn: Năng lực ngôn ngữ, văn học; Vật lí: Nhận thức vật lí, tìm hiểu tự nhiên; Lịch sử: Tìm hiểu lịch sử, nhận thức lịch sử; Tin học: NLa, NLb, NLc, NLd, NLe).
4. Phải tổ chức đúng 4 hoạt động:
   - Hoạt động 1: Khởi động (Hấp dẫn, trò chơi/tình huống/video kết nối bài).
   - Hoạt động 2: Hình thành kiến thức mới (Chi tiết 4 bước: Giao nhiệm vụ, Thực hiện nhiệm vụ, Báo cáo thảo luận, Kết luận nhận định).
   - Hoạt động 3: Luyện tập (Hệ thống bài tập phân hóa).
   - Hoạt động 4: Vận dụng (Gắn với đời sống, thực tiễn, hướng nghiệp/STEM).
5. Trả về đúng định dạng JSON được yêu cầu.`;

    const prompt = `Hãy soạn Kế hoạch bài dạy chi tiết cho:
- Môn: ${subjectName} (${gradeName})
- Bộ sách: ${textbookSetName}
- Tên bài: ${lessonTitle}
- Số tiết: ${durationPeriods || 2} tiết (${durationMinutes || 90} phút)
- Yêu cầu cần đạt: ${Array.isArray(learningOutcomes) ? learningOutcomes.join('; ') : (learningOutcomes || 'Theo chuẩn CTGDPT 2018')}
- Năng lực đặc thù ưu tiên: ${Array.isArray(specificCompetencies) ? specificCompetencies.join('; ') : ''}
- Tích hợp Năng lực số: ${digitalIntegration ? 'BẬT (đề xuất rõ công cụ, hành động học sinh, sản phẩm số và minh chứng)' : 'TẮT'}
- Tích hợp STEM/STEAM: ${stemIntegration ? 'BẬT (nêu rõ vấn đề thực tiễn, quy trình thiết kế chế tạo)' : 'TẮT'}
- Phân hóa học sinh: ${differentiation ? 'BẬT (4 mức: cần hỗ trợ, chuẩn, khá, giỏi)' : 'TẮT'}
- Yêu cầu bổ sung của giáo viên: ${teacherNote || 'Không có'}
${lockedSections?.length ? `- CÁC MỤC ĐÃ ĐƯỢC KHÓA (KHÔNG THAY ĐỔI NỘI DUNG NÀY): ${JSON.stringify(lockedSections)}` : ''}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Tiêu đề bài dạy' },
            objectives: {
              type: Type.OBJECT,
              properties: {
                knowledge: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Mục tiêu kiến thức' },
                generalCompetencies: {
                  type: Type.OBJECT,
                  properties: {
                    selfAutonomy: { type: Type.ARRAY, items: { type: Type.STRING } },
                    communication: { type: Type.ARRAY, items: { type: Type.STRING } },
                    problemSolving: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                },
                specificCompetencies: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Năng lực đặc thù theo môn' },
                qualities: {
                  type: Type.OBJECT,
                  properties: {
                    diligence: { type: Type.ARRAY, items: { type: Type.STRING } },
                    honesty: { type: Type.ARRAY, items: { type: Type.STRING } },
                    responsibility: { type: Type.ARRAY, items: { type: Type.STRING } },
                    patriotism: { type: Type.ARRAY, items: { type: Type.STRING } },
                    compassion: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                },
              },
            },
            equipment: {
              type: Type.OBJECT,
              properties: {
                teacher: { type: Type.ARRAY, items: { type: Type.STRING } },
                student: { type: Type.ARRAY, items: { type: Type.STRING } },
                digitalLearningMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING, description: 'warmup | knowledge | practice | application | extension' },
                  title: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER },
                  objectives: { type: Type.STRING },
                  content: { type: Type.STRING },
                  product: { type: Type.STRING },
                  execution: {
                    type: Type.OBJECT,
                    properties: {
                      assignTask: { type: Type.STRING, description: 'Bước 1: Giao nhiệm vụ' },
                      doTask: { type: Type.STRING, description: 'Bước 2: Thực hiện nhiệm vụ' },
                      reportDiscuss: { type: Type.STRING, description: 'Bước 3: Báo cáo - Thảo luận' },
                      concludeAssess: { type: Type.STRING, description: 'Bước 4: Kết luận - Nhận định' },
                    },
                    required: ['assignTask', 'doTask', 'reportDiscuss', 'concludeAssess'],
                  },
                  digitalDetails: {
                    type: Type.OBJECT,
                    properties: {
                      enabled: { type: Type.BOOLEAN },
                      activityName: { type: Type.STRING },
                      studentAction: { type: Type.STRING },
                      digitalTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                      studentProduct: { type: Type.STRING },
                      assessmentEvidence: { type: Type.STRING },
                    },
                  },
                  differentiationDetails: {
                    type: Type.OBJECT,
                    properties: {
                      enabled: { type: Type.BOOLEAN },
                      supportLevel: { type: Type.STRING },
                      standardLevel: { type: Type.STRING },
                      advancedLevel: { type: Type.STRING },
                      exceptionalLevel: { type: Type.STRING },
                    },
                  },
                },
                required: ['phase', 'title', 'durationMinutes', 'objectives', 'content', 'product', 'execution'],
              },
            },
          },
          required: ['title', 'objectives', 'equipment', 'activities'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-khbd:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi tạo kế hoạch bài dạy từ Gemini AI' });
  }
});

/**
 * 2. Endpoint: Soạn Nhanh 60 Giây (Quick Draft)
 */
app.post('/api/gemini/quick-khbd', async (req, res) => {
  try {
    const { subjectName, gradeName, textbookSetName, lessonTitle, durationPeriods, specialRequest } = req.body;
    const client = getGeminiClient();

    const prompt = `Soạn nhanh bản nháp Kế hoạch bài dạy chuẩn Công văn 5512 cho:
- Môn: ${subjectName}
- Khối: ${gradeName}
- Bộ sách: ${textbookSetName}
- Tên bài: ${lessonTitle}
- Số tiết: ${durationPeriods || 2} tiết
- Yêu cầu đặc biệt: ${specialRequest || 'Tập trung tính sư phạm và tương tác học sinh'}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là chuyên gia sư phạm THPT. Hãy tạo bản nháp KHBD ngắn gọn nhưng đầy đủ 3 phần và 4 hoạt động chuẩn 5512 dưới dạng JSON.',
        responseMimeType: 'application/json',
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in /api/gemini/quick-khbd:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi soạn nhanh KHBD' });
  }
});

/**
 * 3. Endpoint: AI Kiểm tra KHBD theo 15 tiêu chí sư phạm (Chấm điểm /100)
 */
app.post('/api/gemini/check-khbd', async (req, res) => {
  try {
    const { lessonPlan } = req.body;
    const client = getGeminiClient();

    const prompt = `Kiểm tra và đánh giá chi tiết chất lượng Kế hoạch bài dạy sau theo 15 tiêu chí chuẩn Công văn 5512/BGDĐT:
${JSON.stringify(lessonPlan, null, 2)}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: `Bạn là THANH TRA CHUYÊN MÔN SỞ GIÁO DỤC VÀ ĐÀO TẠO. Hãy chấm điểm KHBD theo thang 100 điểm với 15 tiêu chí sau:
1. Có mục tiêu kiến thức cụ thể, đo lường được?
2. Mục tiêu có phù hợp YCCĐ của CTGDPT 2018?
3. Có năng lực chung (Tự chủ, Giao tiếp - Hợp tác, Giải quyết vấn đề)?
4. Có năng lực đặc thù ĐÚNG THEO MÔN HỌC?
5. Có phẩm chất gắn với hành vi người học?
6. Có thiết bị và học liệu đầy đủ?
7. Hoạt động khởi động tạo hứng thú và liên kết bài?
8. Hoạt động hình thành kiến thức đủ 4 bước (Giao NV, Thực hiện, Báo cáo, Kết luận)?
9. Hoạt động luyện tập có bài tập phân hóa?
10. Hoạt động vận dụng gắn với đời sống/thực tiễn?
11. Sản phẩm học tập của học sinh có rõ ràng, kiểm chứng được?
12. Có phương án đánh giá phù hợp?
13. Có phân hóa đối tượng học sinh?
14. Tích hợp Năng lực số/AI/STEM thực chất nếu có?
15. Phân bổ thời lượng các hoạt động hợp lí?

Trả về JSON gồm totalScore (0-100), overallAssessment ('good' | 'needs_adjustment' | 'needs_revision'), summary, và criteria array.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalScore: { type: Type.NUMBER },
            overallAssessment: { type: Type.STRING },
            summary: { type: Type.STRING },
            criteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  name: { type: Type.STRING },
                  passed: { type: Type.BOOLEAN },
                  score: { type: Type.NUMBER },
                  feedback: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ['id', 'name', 'passed', 'score', 'feedback'],
              },
            },
          },
          required: ['totalScore', 'overallAssessment', 'summary', 'criteria'],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in /api/gemini/check-khbd:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi kiểm tra KHBD' });
  }
});

/**
 * 4. Endpoint: AI Nâng Cấp KHBD (3 Chiều: Làm tốt hơn, Làm khác đi, Làm ngược lại)
 */
app.post('/api/gemini/upgrade-khbd', async (req, res) => {
  try {
    const { lessonPlan } = req.body;
    const client = getGeminiClient();

    const prompt = `Phân tích KHBD sau và đưa ra các đề xuất nâng cấp theo 3 chiều:
1. Làm tốt hơn được không? (Tối ưu hóa thời gian, nâng cao độ rõ nét của sản phẩm học sinh, tăng cường tự đánh giá)
2. Làm khác đi được không? (Thay đổi hình thức tổ chức, ứng dụng công nghệ/trò chơi/trạm học tập, STEM)
3. Làm ngược lại được không? (Áp dụng Lớp học đảo ngược - Flipped Classroom, giao nhiệm vụ tìm hiểu trước qua video/tài liệu)

Dữ liệu KHBD:
${JSON.stringify(lessonPlan, null, 2)}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là chuyên gia đổi mới phương pháp dạy học. Đưa ra 3 phương án nâng cấp có vấn đề phát hiện, đề xuất cải thiện và đoạn gợi ý nâng cấp cụ thể dưới dạng JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dimension: { type: Type.STRING, description: 'better | different | reversed' },
                  dimensionTitle: { type: Type.STRING },
                  issueFound: { type: Type.STRING },
                  suggestedImprovement: { type: Type.STRING },
                  upgradedSnippet: { type: Type.STRING },
                },
                required: ['dimension', 'dimensionTitle', 'issueFound', 'suggestedImprovement', 'upgradedSnippet'],
              },
            },
          },
          required: ['recommendations'],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in /api/gemini/upgrade-khbd:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi nâng cấp KHBD' });
  }
});

/**
 * 5. Endpoint: AI Quality Check (Kiểm tra tính phù hợp nhanh)
 */
app.post('/api/gemini/quality-check', async (req, res) => {
  try {
    const { lessonPlan } = req.body;
    const client = getGeminiClient();

    const prompt = `Kiểm tra nhanh tính phù hợp sư phạm của KHBD:
- Nội dung có phù hợp khối lớp không?
- Thời lượng có khả thi trong thực tế không?
- YCCĐ có được thực hiện đầy đủ không?
- Mục tiêu có đo lường được không?
- Sản phẩm có rõ ràng không?
- Năng lực số có thực chất không?

KHBD: ${JSON.stringify(lessonPlan)}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: 'good | needs_adjustment | needs_revision' },
            badgeText: { type: Type.STRING, description: '🟢 TỐT | 🟡 CẦN CHỈNH | 🔴 CẦN XEM LẠI' },
            comment: { type: Type.STRING },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            concerns: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['verdict', 'badgeText', 'comment'],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in /api/gemini/quality-check:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi quality check' });
  }
});

/**
 * 6. Endpoint: Tạo Ngân hàng Câu hỏi Phân hóa (Bloom Taxonomy)
 */
app.post('/api/gemini/generate-questions', async (req, res) => {
  try {
    const { subjectName, gradeName, lessonTitle, levels, questionTypes, count } = req.body;
    const client = getGeminiClient();

    const prompt = `Tạo ${count || 6} câu hỏi kiểm tra đánh giá cho:
- Môn: ${subjectName} (${gradeName})
- Tên bài: ${lessonTitle}
- Mức độ nhận thức: ${Array.isArray(levels) ? levels.join(', ') : 'Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao'}
- Dạng câu hỏi: ${Array.isArray(questionTypes) ? questionTypes.join(', ') : 'Trắc nghiệm nhiều lựa chọn, Đúng/Sai, Trả lời ngắn, Tự luận'}
Yêu cầu: Có đáp án chính xác, lời giải thích chi tiết, và ghi rõ YCCĐ liên quan.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.STRING, description: 'nhan_biet | thong_hieu | van_dung | van_dung_cao' },
                  type: { type: Type.STRING, description: 'multiple_choice | true_false | short_answer | essay | situational' },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  learningOutcomeRef: { type: Type.STRING },
                },
                required: ['level', 'type', 'question', 'correctAnswer', 'explanation'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-questions:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi tạo câu hỏi' });
  }
});

/**
 * 7. Endpoint: Tạo Phiếu Học Tập (Worksheet)
 */
app.post('/api/gemini/generate-worksheet', async (req, res) => {
  try {
    const { subjectName, gradeName, lessonTitle, worksheetType, instruction } = req.body;
    const client = getGeminiClient();

    const prompt = `Tạo một Phiếu học tập hoàn chỉnh cho bài dạy:
- Môn: ${subjectName} (${gradeName})
- Tên bài: ${lessonTitle}
- Hình thức: ${worksheetType} (Cá nhân / Cặp đôi / Nhóm / Phân hóa 3 mức độ)
- Yêu cầu sư phạm: ${instruction || 'Định hướng học sinh tự khám phá kiến thức và tương tác tích cực'}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            instruction: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  levelName: { type: Type.STRING },
                  prompt: { type: Type.STRING },
                  spaceForAnswer: { type: Type.BOOLEAN },
                  suggestedDuration: { type: Type.STRING },
                },
                required: ['prompt'],
              },
            },
          },
          required: ['title', 'instruction', 'tasks'],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-worksheet:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi tạo phiếu học tập' });
  }
});

/**
 * 8. Endpoint: Tạo Rubric Đánh Giá (4 Mức độ)
 */
app.post('/api/gemini/generate-rubric', async (req, res) => {
  try {
    const { subjectName, gradeName, lessonTitle, taskDescription } = req.body;
    const client = getGeminiClient();

    const prompt = `Tạo Bảng tiêu chí đánh giá (Rubric) theo 4 mức độ (Mức 4: Tốt/Xuất sắc; Mức 3: Khá/Đạt; Mức 2: Trung bình/Cần cố gắng; Mức 1: Chưa đạt) cho:
- Môn: ${subjectName} (${gradeName})
- Tên bài: ${lessonTitle}
- Nhiệm vụ đánh giá: ${taskDescription || 'Đánh giá sản phẩm thuyết trình / báo cáo nhóm / bài thực hành'}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            taskDescription: { type: Type.STRING },
            criteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  weightPercent: { type: Type.NUMBER },
                  levels: {
                    type: Type.OBJECT,
                    properties: {
                      level4: { type: Type.STRING },
                      level3: { type: Type.STRING },
                      level2: { type: Type.STRING },
                      level1: { type: Type.STRING },
                    },
                    required: ['level4', 'level3', 'level2', 'level1'],
                  },
                },
                required: ['name', 'levels'],
              },
            },
          },
          required: ['title', 'taskDescription', 'criteria'],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-rubric:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi tạo rubric' });
  }
});

/**
 * 9. Endpoint: Trợ lý AI Chatbot Sư phạm (Context-aware Copilot)
 */
app.post('/api/gemini/copilot-chat', async (req, res) => {
  try {
    const { message, currentLessonPlan, history } = req.body;
    const client = getGeminiClient();

    const systemInstruction = `Bạn là TRỢ LÝ SOẠN GIÁO ÁN AI THPT 2018 - chuyên gia đồng hành cùng giáo viên.
Bạn đang hỗ trợ giáo viên chỉnh sửa hoặc hoàn thiện Kế hoạch bài dạy (KHBD).
Luôn đưa ra câu trả lời thực tế, thiết thực, có tính sư phạm cao theo chuẩn Công văn 5512/BGDĐT.
Nếu giáo viên yêu cầu viết lại hoặc bổ sung phần nào (Khởi động, Trò chơi, Năng lực số, Câu hỏi vận dụng), hãy cung cấp nội dung hoàn chỉnh để giáo viên có thể sao chép hoặc áp dụng ngay vào bài dạy.
Chú ý: Luôn nhắc nhở sử dụng AI có trách nhiệm, giáo viên là người kiểm duyệt cuối cùng.`;

    const contextPrompt = `
CONTEXT BÀI DẠY HIỆN TẠI ĐANG MỞ:
${currentLessonPlan ? JSON.stringify({
  title: currentLessonPlan.title,
  subject: currentLessonPlan.subjectName,
  grade: currentLessonPlan.gradeName,
  textbook: currentLessonPlan.textbookSetName,
  activitiesCount: currentLessonPlan.activities?.length,
  activitiesTitles: currentLessonPlan.activities?.map((a: any) => a.title)
}, null, 2) : 'Chưa mở bài dạy cụ thể.'}

CÂU HỎI / YÊU CẦU CỦA GIÁO VIÊN:
${message}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contextPrompt,
      config: {
        systemInstruction,
      },
    });

    res.json({ success: true, reply: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/gemini/copilot-chat:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi phản hồi từ AI Copilot' });
  }
});

/**
 * 10. Endpoint: Gợi ý Yêu cầu cần đạt & Kiến thức trọng tâm từ Tên bài học
 */
app.post('/api/gemini/suggest-learning-outcomes', async (req, res) => {
  try {
    const { subjectName, gradeName, textbookSetName, lessonTitle } = req.body;
    const client = getGeminiClient();

    const prompt = `Phân tích bài học sau theo chuẩn Chương trình GDPT 2018:
- Môn: ${subjectName}
- Khối lớp: ${gradeName}
- Bộ sách: ${textbookSetName}
- Tên bài học: ${lessonTitle}

Đề xuất:
1. Yêu cầu cần đạt (về kiến thức và kĩ năng cốt lõi)
2. Kiến thức trọng tâm
3. Năng lực đặc thù của môn học tương ứng
4. Đề xuất ý tưởng hoạt động học tập phù hợp`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là chuyên gia thẩm định chương trình giáo dục. Đưa ra gợi ý chuẩn xác theo CTGDPT 2018 dưới dạng JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            learningOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
            coreKnowledge: { type: Type.ARRAY, items: { type: Type.STRING } },
            specificCompetencies: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedActivities: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['learningOutcomes', 'coreKnowledge', 'specificCompetencies'],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in /api/gemini/suggest-learning-outcomes:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi gợi ý yêu cầu cần đạt' });
  }
});

/**
 * 11. Endpoint: Phân tích tài liệu / SGK tải lên
 */
app.post('/api/gemini/parse-document', async (req, res) => {
  try {
    const { documentText, subjectName, gradeName } = req.body;
    const client = getGeminiClient();

    const prompt = `Phân tích đoạn văn bản tài liệu SGK / Kế hoạch bài dạy sau:
Môn: ${subjectName || 'THPT'}, Khối: ${gradeName || '10-12'}
Nội dung tài liệu:
${documentText?.substring(0, 10000)}

Hãy trích xuất:
1. Tên bài học hoặc chủ đề
2. Yêu cầu cần đạt phát hiện được
3. Kiến thức trọng tâm
4. Các hoạt động hoặc câu hỏi thực hành`;

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedTitle: { type: Type.STRING },
            learningOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
            coreKnowledge: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedActivities: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['detectedTitle', 'learningOutcomes', 'coreKnowledge'],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    console.error('Error in /api/gemini/parse-document:', error);
    res.status(500).json({ success: false, error: error?.message || 'Lỗi phân tích tài liệu' });
  }
});

// Vite Middleware for development vs production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Giáo Án AI THPT 2018 Server running on http://localhost:${PORT}`);
  });
}

startServer();
