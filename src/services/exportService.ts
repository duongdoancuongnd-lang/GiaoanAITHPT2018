import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle, 
  WidthType,
  UnderlineType
} from 'docx';
import saveAs from 'file-saver';
import { LessonPlan, WorksheetItem, RubricItem, TeacherProfile } from '../types';

export const exportService = {
  /**
   * Export Lesson Plan to Microsoft Word (.docx)
   */
  async exportLessonPlanToDocx(plan: LessonPlan, profile?: TeacherProfile): Promise<void> {
    const fontName = profile?.exportFont || 'Times New Roman';
    const fontSizeHalfPt = (profile?.exportFontSize || 14) * 2; // docx uses half-points (28 = 14pt)

    // School header table (Trường / Tổ chuyên môn on left, Quốc hiệu on right)
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: plan.schoolName.toUpperCase() || 'TRƯỜNG THPT...', bold: true, font: fontName, size: fontSizeHalfPt - 2 })],
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  children: [new TextRun({ text: `TỔ: ${plan.department.toUpperCase() || 'CHUYÊN MÔN'}`, bold: true, font: fontName, size: fontSizeHalfPt - 2 })],
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  children: [new TextRun({ text: `GV: ${plan.teacherName || '...'}`, font: fontName, size: fontSizeHalfPt - 2 })],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', bold: true, font: fontName, size: fontSizeHalfPt - 2 })],
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'Độc lập - Tự do - Hạnh phúc', bold: true, underline: { type: UnderlineType.SINGLE }, font: fontName, size: fontSizeHalfPt - 2 })],
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  children: [new TextRun({ text: `Năm học: ${plan.schoolYear || '2025 - 2026'}`, italics: true, font: fontName, size: fontSizeHalfPt - 2 })],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const docChildren: (Paragraph | Table)[] = [
      headerTable,
      new Paragraph({ text: '', spacing: { after: 200 } }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'KẾ HOẠCH BÀI DẠY (GIÁO ÁN)',
            bold: true,
            font: fontName,
            size: fontSizeHalfPt + 4,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${plan.title.toUpperCase()}`,
            bold: true,
            font: fontName,
            size: fontSizeHalfPt + 2,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Môn học: ${plan.subjectName} | Khối lớp: ${plan.gradeName} | Bộ sách: ${plan.textbookSetName}`,
            italics: true,
            font: fontName,
            size: fontSizeHalfPt,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Thời lượng: ${plan.durationPeriods} tiết (${plan.durationMinutes} phút)`,
            italics: true,
            font: fontName,
            size: fontSizeHalfPt,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),

      // I. MỤC TIÊU
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: 'I. MỤC TIÊU',
            bold: true,
            font: fontName,
            size: fontSizeHalfPt + 2,
          }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '1. Về kiến thức:',
            bold: true,
            font: fontName,
            size: fontSizeHalfPt,
          }),
        ],
        spacing: { before: 80, after: 60 },
      }),
      ...plan.objectives.knowledge.map(
        k =>
          new Paragraph({
            children: [new TextRun({ text: `• ${k}`, font: fontName, size: fontSizeHalfPt })],
            indent: { left: 400 },
            spacing: { after: 50 },
          })
      ),

      new Paragraph({
        children: [
          new TextRun({
            text: '2. Về năng lực:',
            bold: true,
            font: fontName,
            size: fontSizeHalfPt,
          }),
        ],
        spacing: { before: 100, after: 60 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'a) Năng lực chung:',
            bold: true,
            italics: true,
            font: fontName,
            size: fontSizeHalfPt,
          }),
        ],
        indent: { left: 200 },
        spacing: { after: 50 },
      }),
      ...plan.objectives.generalCompetencies.selfAutonomy.map(
        c =>
          new Paragraph({
            children: [new TextRun({ text: `• Tự chủ và tự học: ${c}`, font: fontName, size: fontSizeHalfPt })],
            indent: { left: 400 },
            spacing: { after: 40 },
          })
      ),
      ...plan.objectives.generalCompetencies.communication.map(
        c =>
          new Paragraph({
            children: [new TextRun({ text: `• Giao tiếp và hợp tác: ${c}`, font: fontName, size: fontSizeHalfPt })],
            indent: { left: 400 },
            spacing: { after: 40 },
          })
      ),
      ...plan.objectives.generalCompetencies.problemSolving.map(
        c =>
          new Paragraph({
            children: [new TextRun({ text: `• Giải quyết vấn đề và sáng tạo: ${c}`, font: fontName, size: fontSizeHalfPt })],
            indent: { left: 400 },
            spacing: { after: 40 },
          })
      ),

      new Paragraph({
        children: [
          new TextRun({
            text: `b) Năng lực đặc thù (${plan.subjectName}):`,
            bold: true,
            italics: true,
            font: fontName,
            size: fontSizeHalfPt,
          }),
        ],
        indent: { left: 200 },
        spacing: { before: 60, after: 50 },
      }),
      ...plan.objectives.specificCompetencies.map(
        sc =>
          new Paragraph({
            children: [new TextRun({ text: `• ${sc}`, font: fontName, size: fontSizeHalfPt })],
            indent: { left: 400 },
            spacing: { after: 40 },
          })
      ),

      new Paragraph({
        children: [
          new TextRun({
            text: '3. Về phẩm chất:',
            bold: true,
            font: fontName,
            size: fontSizeHalfPt,
          }),
        ],
        spacing: { before: 100, after: 60 },
      }),
      ...(plan.objectives.qualities.diligence || []).map(
        q =>
          new Paragraph({
            children: [new TextRun({ text: `• Chăm chỉ: ${q}`, font: fontName, size: fontSizeHalfPt })],
            indent: { left: 400 },
            spacing: { after: 40 },
          })
      ),
      ...(plan.objectives.qualities.honesty || []).map(
        q =>
          new Paragraph({
            children: [new TextRun({ text: `• Trung thực: ${q}`, font: fontName, size: fontSizeHalfPt })],
            indent: { left: 400 },
            spacing: { after: 40 },
          })
      ),
      ...(plan.objectives.qualities.responsibility || []).map(
        q =>
          new Paragraph({
            children: [new TextRun({ text: `• Trách nhiệm: ${q}`, font: fontName, size: fontSizeHalfPt })],
            indent: { left: 400 },
            spacing: { after: 40 },
          })
      ),
      ...(plan.objectives.qualities.compassion || []).map(
        q =>
          new Paragraph({
            children: [new TextRun({ text: `• Nhân ái: ${q}`, font: fontName, size: fontSizeHalfPt })],
            indent: { left: 400 },
            spacing: { after: 40 },
          })
      ),
      ...(plan.objectives.qualities.patriotism || []).map(
        q =>
          new Paragraph({
            children: [new TextRun({ text: `• Yêu nước: ${q}`, font: fontName, size: fontSizeHalfPt })],
            indent: { left: 400 },
            spacing: { after: 40 },
          })
      ),

      // II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU',
            bold: true,
            font: fontName,
            size: fontSizeHalfPt + 2,
          }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '1. Giáo viên: ', bold: true, font: fontName, size: fontSizeHalfPt }),
          new TextRun({ text: plan.equipment.teacher.join('; ') || 'Kế hoạch bài dạy, bài trình chiếu điện tử, phiếu học tập.', font: fontName, size: fontSizeHalfPt }),
        ],
        indent: { left: 200 },
        spacing: { after: 60 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '2. Học sinh: ', bold: true, font: fontName, size: fontSizeHalfPt }),
          new TextRun({ text: plan.equipment.student.join('; ') || 'SGK, vở ghi chép, dụng cụ học tập.', font: fontName, size: fontSizeHalfPt }),
        ],
        indent: { left: 200 },
        spacing: { after: 60 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: '3. Thiết bị / Học liệu số (nếu có): ', bold: true, font: fontName, size: fontSizeHalfPt }),
          new TextRun({ text: plan.equipment.digitalLearningMaterials.join('; ') || 'Phần mềm tương tác, học liệu số.', font: fontName, size: fontSizeHalfPt }),
        ],
        indent: { left: 200 },
        spacing: { after: 150 },
      }),

      // III. TIẾN TRÌNH DẠY HỌC
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: 'III. TIẾN TRÌNH DẠY HỌC',
            bold: true,
            font: fontName,
            size: fontSizeHalfPt + 2,
          }),
        ],
        spacing: { before: 200, after: 120 },
      }),
    ];

    // Append activities according to CV 5512 or chosen template
    plan.activities.forEach((act, idx) => {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${act.title.toUpperCase()} (${act.durationMinutes} phút)`,
              bold: true,
              font: fontName,
              size: fontSizeHalfPt + 1,
            }),
          ],
          spacing: { before: 160, after: 80 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'a) Mục tiêu: ', bold: true, font: fontName, size: fontSizeHalfPt }),
            new TextRun({ text: act.objectives, font: fontName, size: fontSizeHalfPt }),
          ],
          indent: { left: 200 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'b) Nội dung: ', bold: true, font: fontName, size: fontSizeHalfPt }),
            new TextRun({ text: act.content, font: fontName, size: fontSizeHalfPt }),
          ],
          indent: { left: 200 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'c) Sản phẩm: ', bold: true, font: fontName, size: fontSizeHalfPt }),
            new TextRun({ text: act.product, font: fontName, size: fontSizeHalfPt }),
          ],
          indent: { left: 200 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'd) Tổ chức thực hiện:', bold: true, font: fontName, size: fontSizeHalfPt }),
          ],
          indent: { left: 200 },
          spacing: { after: 60 },
        })
      );

      // 4 steps of execution in a clean table or structured block
      const stepsTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: 'Hoạt động của GV & HS', bold: true, font: fontName, size: fontSizeHalfPt })], alignment: AlignmentType.CENTER })],
              }),
              new TableCell({
                width: { size: 70, type: WidthType.PERCENTAGE },
                children: [new Paragraph({ children: [new TextRun({ text: 'Dự kiến sản phẩm / Nội dung chi tiết', bold: true, font: fontName, size: fontSizeHalfPt })], alignment: AlignmentType.CENTER })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: 'Bước 1: Giao nhiệm vụ học tập', bold: true, font: fontName, size: fontSizeHalfPt })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: act.execution.assignTask, font: fontName, size: fontSizeHalfPt })] })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: 'Bước 2: Thực hiện nhiệm vụ', bold: true, font: fontName, size: fontSizeHalfPt })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: act.execution.doTask, font: fontName, size: fontSizeHalfPt })] })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: 'Bước 3: Báo cáo, thảo luận', bold: true, font: fontName, size: fontSizeHalfPt })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: act.execution.reportDiscuss, font: fontName, size: fontSizeHalfPt })] })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: 'Bước 4: Kết luận, nhận định', bold: true, font: fontName, size: fontSizeHalfPt })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: act.execution.concludeAssess, font: fontName, size: fontSizeHalfPt })] })],
              }),
            ],
          }),
        ],
      });

      docChildren.push(stepsTable);

      // Digital or STEM integration notes if present
      if (act.digitalDetails?.enabled) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: '🌐 Tích hợp Năng lực số: ', bold: true, font: fontName, size: fontSizeHalfPt }),
              new TextRun({ text: `Công cụ: ${act.digitalDetails.digitalTools.join(', ')} | Học sinh: ${act.digitalDetails.studentAction} | Sản phẩm số: ${act.digitalDetails.studentProduct}`, font: fontName, size: fontSizeHalfPt }),
            ],
            indent: { left: 200 },
            spacing: { before: 80, after: 60 },
          })
        );
      }

      if (act.differentiationDetails?.enabled) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: '🎯 Phân hóa học sinh: ', bold: true, font: fontName, size: fontSizeHalfPt }),
              new TextRun({ text: `Cần hỗ trợ: ${act.differentiationDetails.supportLevel} | Khá giỏi: ${act.differentiationDetails.advancedLevel}`, font: fontName, size: fontSizeHalfPt }),
            ],
            indent: { left: 200 },
            spacing: { before: 60, after: 120 },
          })
        );
      }
    });

    // Signature footer
    docChildren.push(
      new Paragraph({ text: '', spacing: { before: 300, after: 100 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: 'DUYỆT CỦA TỔ CHUYÊN MÔN', bold: true, font: fontName, size: fontSizeHalfPt })],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({ text: '', spacing: { after: 800 } }),
                ],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: 'GIÁO VIÊN SOẠN BÀI', bold: true, font: fontName, size: fontSizeHalfPt })],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: '(Kí và ghi rõ họ tên)', italics: true, font: fontName, size: fontSizeHalfPt - 2 })],
                    alignment: AlignmentType.CENTER,
                  }),
                  new Paragraph({ text: '', spacing: { after: 600 } }),
                  new Paragraph({
                    children: [new TextRun({ text: plan.teacherName, bold: true, font: fontName, size: fontSizeHalfPt })],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1134, // 2 cm
                bottom: 1134, // 2 cm
                left: 1417, // 2.5 cm
                right: 1134, // 2 cm
              },
            },
          },
          children: docChildren,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const sanitizedFilename = `KHBD_${plan.subjectName}_${plan.gradeName}_${plan.lessonNumber || 'Bai'}`.replace(/[/\\?%*:|"<>]/g, '_');
    saveAs(blob, `${sanitizedFilename}.docx`);
  },

  /**
   * Export Worksheet to Word (.docx)
   */
  async exportWorksheetToDocx(ws: WorksheetItem, profile?: TeacherProfile): Promise<void> {
    const fontName = profile?.exportFont || 'Times New Roman';
    const fontSizeHalfPt = 28;

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
            },
          },
          children: [
            new Paragraph({
              children: [new TextRun({ text: ws.title.toUpperCase(), bold: true, font: fontName, size: fontSizeHalfPt + 4 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: `Hình thức: ${ws.type === 'individual' ? 'Cá nhân' : ws.type === 'pair' ? 'Cặp đôi' : ws.type === 'group' ? 'Thảo luận nhóm' : 'Phân hóa 3 mức độ'}`, italics: true, font: fontName, size: fontSizeHalfPt })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Họ và tên học sinh / Nhóm: ................................................................ Lớp: .............', font: fontName, size: fontSizeHalfPt }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'HƯỚNG DẪN THỰC HIỆN:', bold: true, font: fontName, size: fontSizeHalfPt }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ text: ws.instruction, font: fontName, size: fontSizeHalfPt })],
              spacing: { after: 200 },
            }),
            ...ws.tasks.map((task, idx) => [
              new Paragraph({
                children: [
                  new TextRun({ text: `Nhiệm vụ ${idx + 1}${task.levelName ? ` [${task.levelName}]` : ''}: `, bold: true, font: fontName, size: fontSizeHalfPt }),
                  new TextRun({ text: task.prompt, font: fontName, size: fontSizeHalfPt }),
                ],
                spacing: { before: 100, after: 60 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Trả lời / Sản phẩm:', italics: true, font: fontName, size: fontSizeHalfPt - 2 }),
                ],
              }),
              new Paragraph({
                text: '..................................................................................................................................................................',
                spacing: { after: 60 },
              }),
              new Paragraph({
                text: '..................................................................................................................................................................',
                spacing: { after: 60 },
              }),
              new Paragraph({
                text: '..................................................................................................................................................................',
                spacing: { after: 150 },
              }),
            ]).flat(),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Phieu_Hoc_Tap_${ws.title.replace(/[/\\?%*:|"<>]/g, '_')}.docx`);
  },

  /**
   * Export Rubric Table to Word (.docx)
   */
  async exportRubricToDocx(rubric: RubricItem, profile?: TeacherProfile): Promise<void> {
    const fontName = profile?.exportFont || 'Times New Roman';
    const fontSizeHalfPt = 26;

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Tiêu chí đánh giá', bold: true, font: fontName, size: fontSizeHalfPt })], alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            width: { size: 19, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Mức 4 (Tốt / 9-10đ)', bold: true, font: fontName, size: fontSizeHalfPt })], alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            width: { size: 19, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Mức 3 (Khá / 7-8đ)', bold: true, font: fontName, size: fontSizeHalfPt })], alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            width: { size: 19, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Mức 2 (Đạt / 5-6đ)', bold: true, font: fontName, size: fontSizeHalfPt })], alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'Mức 1 (Cần cố gắng / <5đ)', bold: true, font: fontName, size: fontSizeHalfPt })], alignment: AlignmentType.CENTER })],
          }),
        ],
      }),
      ...rubric.criteria.map(
        c =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: `${c.name}${c.weightPercent ? ` (${c.weightPercent}%)` : ''}`, bold: true, font: fontName, size: fontSizeHalfPt })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: c.levels.level4, font: fontName, size: fontSizeHalfPt - 2 })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: c.levels.level3, font: fontName, size: fontSizeHalfPt - 2 })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: c.levels.level2, font: fontName, size: fontSizeHalfPt - 2 })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: c.levels.level1, font: fontName, size: fontSizeHalfPt - 2 })] })],
              }),
            ],
          })
      ),
    ];

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
            },
          },
          children: [
            new Paragraph({
              children: [new TextRun({ text: `BẢNG TIÊU CHÍ ĐÁNH GIÁ (RUBRIC): ${rubric.title.toUpperCase()}`, bold: true, font: fontName, size: fontSizeHalfPt + 2 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: `Nhiệm vụ: ${rubric.taskDescription}`, italics: true, font: fontName, size: fontSizeHalfPt })],
              spacing: { after: 200 },
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: tableRows,
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Rubric_${rubric.title.replace(/[/\\?%*:|"<>]/g, '_')}.docx`);
  },

  /**
   * Copy Lesson Plan to Clipboard formatted as markdown
   */
  async copyLessonPlanToClipboard(plan: LessonPlan): Promise<boolean> {
    const text = `# KẾ HOẠCH BÀI DẠY: ${plan.title}
Trường: ${plan.schoolName} | GV: ${plan.teacherName} | Tổ: ${plan.department}
Môn: ${plan.subjectName} | Khối: ${plan.gradeName} | Bộ sách: ${plan.textbookSetName}
Thời lượng: ${plan.durationPeriods} tiết (${plan.durationMinutes} phút)

## I. MỤC TIÊU
### 1. Kiến thức
${plan.objectives.knowledge.map(k => `- ${k}`).join('\n')}

### 2. Năng lực
**a) Năng lực chung:**
- Tự chủ và tự học: ${plan.objectives.generalCompetencies.selfAutonomy.join('; ')}
- Giao tiếp và hợp tác: ${plan.objectives.generalCompetencies.communication.join('; ')}
- Giải quyết vấn đề và sáng tạo: ${plan.objectives.generalCompetencies.problemSolving.join('; ')}

**b) Năng lực đặc thù (${plan.subjectName}):**
${plan.objectives.specificCompetencies.map(sc => `- ${sc}`).join('\n')}

### 3. Phẩm chất
- Chăm chỉ: ${(plan.objectives.qualities.diligence || []).join('; ')}
- Trung thực: ${(plan.objectives.qualities.honesty || []).join('; ')}
- Trách nhiệm: ${(plan.objectives.qualities.responsibility || []).join('; ')}

## II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
- Giáo viên: ${plan.equipment.teacher.join('; ')}
- Học sinh: ${plan.equipment.student.join('; ')}
- Thiết bị số: ${plan.equipment.digitalLearningMaterials.join('; ')}

## III. TIẾN TRÌNH DẠY HỌC
${plan.activities.map((act, idx) => `
### ${act.title} (${act.durationMinutes} phút)
- **Mục tiêu:** ${act.objectives}
- **Nội dung:** ${act.content}
- **Sản phẩm:** ${act.product}
- **Tổ chức thực hiện:**
  + Bước 1 (Giao nhiệm vụ): ${act.execution.assignTask}
  + Bước 2 (Thực hiện nhiệm vụ): ${act.execution.doTask}
  + Bước 3 (Báo cáo - Thảo luận): ${act.execution.reportDiscuss}
  + Bước 4 (Kết luận - Nhận định): ${act.execution.concludeAssess}
${act.digitalDetails?.enabled ? `  * Tích hợp Năng lực số: Công cụ: ${act.digitalDetails.digitalTools.join(', ')} - Học sinh: ${act.digitalDetails.studentAction}` : ''}
${act.differentiationDetails?.enabled ? `  * Phân hóa: Hỗ trợ: ${act.differentiationDetails.supportLevel} | Nâng cao: ${act.differentiationDetails.advancedLevel}` : ''}
`).join('\n')}
`;

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
};
