import { Subject, Grade, TextbookSet, Chapter, AIPromptTemplate, LessonPlan } from '../types';

export const GRADES_DATA: Grade[] = [
  { id: 'g1', name: 'Lớp 1', level: 1, isHighSchool: false },
  { id: 'g2', name: 'Lớp 2', level: 2, isHighSchool: false },
  { id: 'g3', name: 'Lớp 3', level: 3, isHighSchool: false },
  { id: 'g4', name: 'Lớp 4', level: 4, isHighSchool: false },
  { id: 'g5', name: 'Lớp 5', level: 5, isHighSchool: false },
  { id: 'g6', name: 'Lớp 6', level: 6, isHighSchool: false },
  { id: 'g7', name: 'Lớp 7', level: 7, isHighSchool: false },
  { id: 'g8', name: 'Lớp 8', level: 8, isHighSchool: false },
  { id: 'g9', name: 'Lớp 9', level: 9, isHighSchool: false },
  { id: 'g10', name: 'Lớp 10', level: 10, isHighSchool: true },
  { id: 'g11', name: 'Lớp 11', level: 11, isHighSchool: true },
  { id: 'g12', name: 'Lớp 12', level: 12, isHighSchool: true },
];

export const INITIAL_GRADES = GRADES_DATA;

export const TEXTBOOK_SETS_DATA: TextbookSet[] = [
  {
    id: 'kntt',
    name: 'Kết nối tri thức với cuộc sống',
    publisher: 'NXB Giáo dục Việt Nam',
    description: 'Bộ sách giáo khoa chuẩn theo định hướng phát triển phẩm chất và năng lực của NXB Giáo dục Việt Nam.',
  },
  {
    id: 'canh_dieu',
    name: 'Cánh Diều',
    publisher: 'NXB Đại học Sư phạm / NXB Đại học Sư phạm TP.HCM',
    description: 'Bộ sách giáo khoa xã hội hóa đầu tiên theo CTGDPT 2018 mang thông điệp Mang cuộc sống vào bài học - Đưa bài học vào cuộc sống.',
  },
  {
    id: 'ctst',
    name: 'Chân trời sáng tạo',
    publisher: 'NXB Giáo dục Việt Nam',
    description: 'Bộ sách tiếp cận hiện đại, hướng tới khám phá, sáng tạo và mở rộng chân trời tri thức.',
  },
  {
    id: 'other_textbook',
    name: 'Bộ sách / Tài liệu bổ trợ khác',
    publisher: 'NXB Chuyên ngành',
    description: 'Dành cho các tài liệu giáo dục địa phương, chuyên đề học tập chuyên sâu hoặc tài liệu ngoại ngữ mở rộng.',
  },
];

export const INITIAL_TEXTBOOK_SETS = TEXTBOOK_SETS_DATA;

export const SUBJECTS_DATA: Subject[] = [
  {
    id: 'sub_math',
    name: 'Toán',
    code: 'MATH',
    isCompulsory: true,
    category: 'core',
    iconName: 'Calculator',
    specificCompetencies: [
      'Năng lực tư duy và lập luận toán học',
      'Năng lực mô hình hóa toán học',
      'Năng lực giải quyết vấn đề toán học',
      'Năng lực giao tiếp toán học',
      'Năng lực sử dụng công cụ, phương tiện học toán (máy tính cầm tay, GeoGebra)'
    ]
  },
  {
    id: 'sub_literature',
    name: 'Ngữ văn',
    code: 'LIT',
    isCompulsory: true,
    category: 'core',
    iconName: 'BookOpen',
    specificCompetencies: [
      'Năng lực ngôn ngữ (đọc hiểu văn bản, viết bài văn, nói và nghe)',
      'Năng lực văn học (cảm thụ thẩm mĩ, nhận biết đặc trưng thể loại, giá trị tư tưởng)'
    ]
  },
  {
    id: 'sub_english',
    name: 'Tiếng Anh (Ngoại ngữ 1)',
    code: 'ENG',
    isCompulsory: true,
    category: 'core',
    iconName: 'Languages',
    specificCompetencies: [
      'Năng lực giao tiếp tiếng Anh (Nghe - Hiểu)',
      'Năng lực giao tiếp tiếng Anh (Nói - Tương tác)',
      'Năng lực giao tiếp tiếng Anh (Đọc - Khai thác thông tin)',
      'Năng lực giao tiếp tiếng Anh (Viết - Diễn đạt ý tưởng)',
      'Năng lực nhận thức ngôn ngữ và liên văn hóa'
    ]
  },
  {
    id: 'sub_physics',
    name: 'Vật lí',
    code: 'PHYS',
    isCompulsory: false,
    category: 'science',
    iconName: 'Atom',
    specificCompetencies: [
      'Nhận thức vật lí (nắm vững khái niệm, định luật, mô hình vật lí)',
      'Tìm hiểu thế giới tự nhiên dưới góc độ vật lí (lập kế hoạch thí nghiệm, quan sát, đo lường)',
      'Vận dụng kiến thức, kĩ năng đã học để giải thích hiện tượng và giải quyết vấn đề thực tiễn'
    ]
  },
  {
    id: 'sub_chemistry',
    name: 'Hóa học',
    code: 'CHEM',
    isCompulsory: false,
    category: 'science',
    iconName: 'FlaskConical',
    specificCompetencies: [
      'Nhận thức hóa học (cấu tạo chất, phương trình hóa học, quy luật biến đổi)',
      'Tìm hiểu thế giới tự nhiên dưới góc độ hóa học (thực hành thí nghiệm, phân tích chất)',
      'Vận dụng kiến thức hóa học vào đời sống, sản xuất và bảo vệ môi trường'
    ]
  },
  {
    id: 'sub_biology',
    name: 'Sinh học',
    code: 'BIO',
    isCompulsory: false,
    category: 'science',
    iconName: 'Dna',
    specificCompetencies: [
      'Nhận thức sinh học (cấp độ tổ chức sống, cơ chế di truyền, sinh thái học)',
      'Tìm hiểu thế giới sống (quan sát tế bào, vi sinh vật, khảo sát hệ sinh thái)',
      'Vận dụng kiến thức sinh học vào chăm sóc sức khỏe, bảo tồn đa dạng sinh học và phát triển bền vững'
    ]
  },
  {
    id: 'sub_history',
    name: 'Lịch sử',
    code: 'HIST',
    isCompulsory: true,
    category: 'social',
    iconName: 'Landmark',
    specificCompetencies: [
      'Tìm hiểu lịch sử (khai thác nguồn sử liệu, tư liệu lịch sử)',
      'Nhận thức và tư duy lịch sử (phân tích bối cảnh, nguyên nhân, tiến trình và ý nghĩa lịch sử)',
      'Vận dụng bài học lịch sử để hiểu thực tại và định hướng tương lai'
    ]
  },
  {
    id: 'sub_geography',
    name: 'Địa lí',
    code: 'GEO',
    isCompulsory: false,
    category: 'social',
    iconName: 'Globe2',
    specificCompetencies: [
      'Nhận thức khoa học địa lí (đặc điểm tự nhiên, kinh tế - xã hội)',
      'Tìm hiểu địa lí (sử dụng bản đồ, biểu đồ, tranh ảnh, số liệu thống kê địa lí, GIS)',
      'Vận dụng kiến thức địa lí vào thực tiễn cuộc sống và phát triển kinh tế bền vững'
    ]
  },
  {
    id: 'sub_economic_law',
    name: 'Giáo dục kinh tế và pháp luật',
    code: 'GDKTPL',
    isCompulsory: false,
    category: 'social',
    iconName: 'Scale',
    specificCompetencies: [
      'Năng lực điều chỉnh hành vi theo quy định pháp luật và chuẩn mực đạo đức',
      'Năng lực tìm hiểu và tham gia các hoạt động kinh tế - xã hội',
      'Năng lực sử dụng và thực thi quyền, nghĩa vụ công dân trong nhà nước pháp quyền'
    ]
  },
  {
    id: 'sub_informatics',
    name: 'Tin học',
    code: 'INFO',
    isCompulsory: false,
    category: 'technology',
    iconName: 'Cpu',
    specificCompetencies: [
      'Năng lực sử dụng và quản lí các phương tiện công nghệ thông tin và truyền thông (NLa)',
      'Năng lực ứng xử phù hợp trong môi trường số (NLb)',
      'Năng lực giải quyết vấn đề với sự trợ giúp của CNTT và truyền thông (NLc)',
      'Năng lực ứng dụng CNTT và truyền thông trong học và tự học (NLd)',
      'Năng lực hợp tác trong môi trường số (NLe)'
    ]
  },
  {
    id: 'sub_technology',
    name: 'Công nghệ',
    code: 'TECH',
    isCompulsory: false,
    category: 'technology',
    iconName: 'Wrench',
    specificCompetencies: [
      'Nhận thức công nghệ (hiểu biết bản vẽ, vật liệu kĩ thuật, cơ khí, điện - điện tử, nông nghiệp)',
      'Giao tiếp công nghệ (đọc và trình bày tài liệu kĩ thuật)',
      'Sử dụng công nghệ an toàn và hiệu quả',
      'Đánh giá công nghệ và thiết kế kĩ thuật'
    ]
  },
  {
    id: 'sub_national_defense',
    name: 'Giáo dục quốc phòng và an ninh',
    code: 'GDQP',
    isCompulsory: true,
    category: 'core',
    iconName: 'ShieldAlert',
    specificCompetencies: [
      'Nhận thức về truyền thống đánh giặc giữ nước, quan điểm đường lối quân sự của Đảng',
      'Vận dụng các kĩ năng quân sự cơ bản và phòng thủ dân sự trong đời sống',
      'Ý thức chấp hành pháp luật bảo vệ Tổ quốc Việt Nam Xã hội Chủ nghĩa'
    ]
  },
  {
    id: 'sub_physical_education',
    name: 'Giáo dục thể chất',
    code: 'GDTC',
    isCompulsory: true,
    category: 'core',
    iconName: 'Activity',
    specificCompetencies: [
      'Năng lực chăm sóc sức khỏe và vệ sinh thể dục thể thao',
      'Năng lực vận động cơ bản và kĩ thuật động tác',
      'Năng lực hoạt động thể dục thể thao tập thể và rèn luyện thể lực bền bỉ'
    ]
  },
  {
    id: 'sub_music',
    name: 'Âm nhạc',
    code: 'MUS',
    isCompulsory: false,
    category: 'arts',
    iconName: 'Music',
    specificCompetencies: [
      'Thể hiện âm nhạc (hát, đọc nhạc, chơi nhạc cụ)',
      'Cảm thụ và hiểu biết âm nhạc',
      'Ứng dụng và sáng tạo âm nhạc'
    ]
  },
  {
    id: 'sub_fine_arts',
    name: 'Mĩ thuật',
    code: 'ART',
    isCompulsory: false,
    category: 'arts',
    iconName: 'Palette',
    specificCompetencies: [
      'Quan sát và nhận thức thẩm mĩ',
      'Sáng tạo và ứng dụng mĩ thuật (hội họa, đồ họa, điêu khắc, thiết kế)',
      'Phân tích và đánh giá tác phẩm mĩ thuật'
    ]
  },
  {
    id: 'sub_experiential_activities',
    name: 'Hoạt động trải nghiệm, hướng nghiệp',
    code: 'HDTN',
    isCompulsory: true,
    category: 'activity',
    iconName: 'Compass',
    specificCompetencies: [
      'Năng lực thích ứng với cuộc sống và làm chủ bản thân',
      'Năng lực thiết kế và tổ chức hoạt động tập thể, cộng đồng',
      'Năng lực định hướng nghề nghiệp và chuẩn bị hành trang bước vào thế giới nghề nghiệp'
    ]
  },
  {
    id: 'sub_local_education',
    name: 'Nội dung giáo dục địa phương',
    code: 'GDDP',
    isCompulsory: true,
    category: 'local',
    iconName: 'MapPin',
    specificCompetencies: [
      'Nhận thức về văn hóa, lịch sử, địa lí, kinh tế, xã hội địa phương',
      'Gìn giữ và phát huy bản sắc văn hóa và di sản quê hương',
      'Tham gia giải quyết các vấn đề thực tiễn của cộng đồng địa phương'
    ]
  }
];

export const INITIAL_SUBJECTS = SUBJECTS_DATA;

export const INITIAL_CHAPTERS: Chapter[] = [
  // Toán 10 - Kết nối tri thức
  {
    id: 'ch_math10_kntt_1',
    subjectId: 'sub_math',
    gradeId: 'g10',
    textbookSetId: 'kntt',
    title: 'Chương I: Mệnh đề và tập hợp',
    order: 1,
    lessons: [
      {
        id: 'les_math10_1',
        subjectId: 'sub_math',
        gradeId: 'g10',
        textbookSetId: 'kntt',
        chapterId: 'ch_math10_kntt_1',
        title: 'Bài 1: Mệnh đề',
        periodCount: 2,
        learningOutcomes: [
          'Thiết lập và phát biểu được mệnh đề toán học, mệnh đề phủ định, mệnh đề kéo theo, mệnh đề tương đương.',
          'Xác định được tính đúng/sai của một mệnh đề trong các tình huống toán học và thực tế đơn giản.',
          'Sử dụng đúng các kí hiệu với mọi (∀) và tồn tại (∃) trong việc diễn đạt toán học.'
        ],
        coreKnowledge: [
          'Khái niệm mệnh đề, mệnh đề chứa biến.',
          'Mệnh đề phủ định (P và P̄).',
          'Mệnh đề kéo theo P => Q, mệnh đề đảo Q => P.',
          'Mệnh đề tương đương P <=> Q, điều kiện cần và đủ.',
          'Kí hiệu ∀ và ∃.'
        ],
        suggestedActivities: [
          'Trò chơi Đúng - Sai để phân biệt câu trần thuật thông thường và mệnh đề.',
          'Thảo luận nhóm xác định điều kiện cần và đủ trong tam giác.',
          'Sử dụng Quizizz kiểm tra tính đúng/sai của mệnh đề chứa kí hiệu ∀ và ∃.'
        ]
      },
      {
        id: 'les_math10_2',
        subjectId: 'sub_math',
        gradeId: 'g10',
        textbookSetId: 'kntt',
        chapterId: 'ch_math10_kntt_1',
        title: 'Bài 2: Tập hợp và các phép toán trên tập hợp',
        periodCount: 2,
        learningOutcomes: [
          'Nhận biết các cách cho một tập hợp (liệt kê, chỉ ra tính chất đặc trưng).',
          'Thực hiện thành thạo các phép toán giao (∩), hợp (∪), hiệu (\\) và phần bù của hai tập hợp.',
          'Mô tả các tập hợp con của tập số thực bằng kí hiệu khoảng, đoạn, nửa khoảng trên trục số.'
        ],
        coreKnowledge: [
          'Khái niệm tập hợp, tập hợp con, tập hợp rỗng.',
          'Giao, hợp, hiệu và phần bù của hai tập hợp.',
          'Biểu diễn các khoảng, đoạn, nửa khoảng trên trục số thực.'
        ],
        suggestedActivities: [
          'Vẽ sơ đồ Venn trên phần mềm GeoGebra/Canva để biểu diễn giao và hợp tập hợp.',
          'Bài toán thực tế tìm số học sinh giỏi cả hai môn Toán và Văn.'
        ]
      }
    ]
  },
  {
    id: 'ch_math10_kntt_2',
    subjectId: 'sub_math',
    gradeId: 'g10',
    textbookSetId: 'kntt',
    title: 'Chương II: Bất phương trình và hệ bất phương trình bậc nhất hai ẩn',
    order: 2,
    lessons: [
      {
        id: 'les_math10_3',
        subjectId: 'sub_math',
        gradeId: 'g10',
        textbookSetId: 'kntt',
        chapterId: 'ch_math10_kntt_2',
        title: 'Bài 3: Bất phương trình bậc nhất hai ẩn',
        periodCount: 2,
        learningOutcomes: [
          'Nhận biết bất phương trình bậc nhất hai ẩn và nghiệm của nó.',
          'Biểu diễn được miền nghiệm của bất phương trình bậc nhất hai ẩn trên mặt phẳng tọa độ.',
          'Vận dụng giải quyết bài toán quy hoạch tuyến tính đơn giản trong đời sống (kinh tế, dinh dưỡng).'
        ],
        coreKnowledge: [
          'Dạng chuẩn của bất phương trình bậc nhất hai ẩn ax + by + c <= 0.',
          'Miền nghiệm trên mặt phẳng tọa độ Oxy.',
          'Cách xác định nửa mặt phẳng bờ đường thẳng ax + by + c = 0.'
        ]
      }
    ]
  },

  // Ngữ văn 10 - Kết nối tri thức
  {
    id: 'ch_lit10_kntt_1',
    subjectId: 'sub_literature',
    gradeId: 'g10',
    textbookSetId: 'kntt',
    title: 'Bài 1: Sức hấp dẫn của truyện kể (Thần thoại và Sử thi)',
    order: 1,
    lessons: [
      {
        id: 'les_lit10_1',
        subjectId: 'sub_literature',
        gradeId: 'g10',
        textbookSetId: 'kntt',
        chapterId: 'ch_lit10_kntt_1',
        title: 'Đọc: Héc-to từ biệt Ăng-đrô-mác (Trích Sử thi I-li-át - Hô-me-rơ)',
        periodCount: 2,
        learningOutcomes: [
          'Nhận biết và phân tích được đặc điểm của thể loại sử thi qua nhân vật Héc-to và bối cảnh thành Tơ-roa.',
          'Phân tích được sự giằng xé giữa bổn phận người anh hùng với tình cảm gia đình tha thiết.',
          'Cảm nhận được giá trị nhân văn cao đẹp và khát vọng hòa bình của nhân loại thời cổ đại.'
        ],
        coreKnowledge: [
          'Khái niệm sử thi cổ đại, đặc trưng về nhân vật anh hùng và ngôn ngữ trang trọng.',
          'Xung đột bi kịch giữa nghĩa vụ chiến binh và tình phụ tử, phu thê.',
          'Nghệ thuật xây dựng đối thoại và miêu tả tâm lí nhân vật.'
        ]
      },
      {
        id: 'les_lit10_2',
        subjectId: 'sub_literature',
        gradeId: 'g10',
        textbookSetId: 'kntt',
        chapterId: 'ch_lit10_kntt_1',
        title: 'Viết: Viết bài văn nghị luận phân tích, đánh giá một tác phẩm truyện',
        periodCount: 2,
        learningOutcomes: [
          'Nắm vững cấu trúc bài văn nghị luận phân tích tác phẩm truyện (chủ đề, nhân vật, nghệ thuật kể chuyện).',
          'Biết lập dàn ý và phát triển luận điểm rõ ràng, có dẫn chứng xác đáng từ tác phẩm.',
          'Sử dụng ngôn ngữ mạch lạc, giàu tính biểu cảm và thuyết phục.'
        ],
        coreKnowledge: [
          'Quy trình viết bài nghị luận: Xác định đề tài, tìm ý, lập dàn ý, viết bài và chỉnh sửa.',
          'Kĩ năng phân tích tình huống truyện, nghệ thuật xây dựng nhân vật.'
        ]
      }
    ]
  },

  // Vật lí 10 - Kết nối tri thức
  {
    id: 'ch_phys10_kntt_1',
    subjectId: 'sub_physics',
    gradeId: 'g10',
    textbookSetId: 'kntt',
    title: 'Chương 1: Mở đầu & Mô tả chuyển động',
    order: 1,
    lessons: [
      {
        id: 'les_phys10_1',
        subjectId: 'sub_physics',
        gradeId: 'g10',
        textbookSetId: 'kntt',
        chapterId: 'ch_phys10_kntt_1',
        title: 'Bài 4: Độ dịch chuyển và quãng đường đi được',
        periodCount: 2,
        learningOutcomes: [
          'Phân biệt được độ dịch chuyển và quãng đường đi được của một vật chuyển động.',
          'Xác định được độ dịch chuyển tổng hợp bằng phương pháp hình học và vectơ.',
          'Vận dụng định lí Pi-ta-go và quy tắc tam giác vectơ để tính toán độ dịch chuyển.'
        ],
        coreKnowledge: [
          'Khái niệm độ dịch chuyển (vectơ nối vị trí đầu và vị trí cuối).',
          'Quãng đường (độ dài quỹ đạo chuyển động, đại lượng vô hướng).',
          'Khi nào độ lớn độ dịch chuyển bằng quãng đường đi được.'
        ]
      },
      {
        id: 'les_phys10_2',
        subjectId: 'sub_physics',
        gradeId: 'g10',
        textbookSetId: 'kntt',
        chapterId: 'ch_phys10_kntt_1',
        title: 'Bài 9: Chuyển động thẳng biến đổi đều (Tích hợp STEM / Thí nghiệm)',
        periodCount: 2,
        learningOutcomes: [
          'Lập được phương trình vận tốc và tọa độ của chuyển động thẳng biến đổi đều.',
          'Vẽ và phân tích được đồ thị vận tốc - thời gian (v-t).',
          'Thực hành đo gia tốc của vật trên máng nghiêng bằng cảm biến chuyển động.'
        ],
        coreKnowledge: [
          'Gia tốc a = Δv/Δt.',
          'Công thức vận tốc v = v0 + at và quãng đường s = v0*t + 0.5*a*t^2.',
          'Công thức độc lập thời gian v^2 - v0^2 = 2as.'
        ]
      }
    ]
  },

  // Tin học 10 - Kết nối tri thức
  {
    id: 'ch_info10_kntt_1',
    subjectId: 'sub_informatics',
    gradeId: 'g10',
    textbookSetId: 'kntt',
    title: 'Chủ đề 1: Máy tính và xã hội tri thức',
    order: 1,
    lessons: [
      {
        id: 'les_info10_1',
        subjectId: 'sub_informatics',
        gradeId: 'g10',
        textbookSetId: 'kntt',
        chapterId: 'ch_info10_kntt_1',
        title: 'Bài 1: Thông tin và xử lí thông tin',
        periodCount: 1,
        learningOutcomes: [
          'Phân biệt được thông tin và dữ liệu, biết các dạng dữ liệu cơ bản trong máy tính.',
          'Giải thích được các bước cơ bản trong quá trình xử lí thông tin của hệ thống số.',
          'Nhận biết được vai trò của thiết bị số trong việc nâng cao hiệu quả làm việc của con người.'
        ],
        coreKnowledge: [
          'Dữ liệu, thông tin, tri thức và mối quan hệ giữa chúng.',
          'Quy trình: Thu nhận -> Lưu trữ -> Xử lí -> Truyền đạt thông tin.',
          'Đơn vị đo dung lượng thông tin (Byte, KB, MB, GB, TB).'
        ]
      }
    ]
  },

  // Lịch sử 10 - Cánh Diều
  {
    id: 'ch_hist10_cd_1',
    subjectId: 'sub_history',
    gradeId: 'g10',
    textbookSetId: 'canh_dieu',
    title: 'Chủ đề 1: Lịch sử và Sử học',
    order: 1,
    lessons: [
      {
        id: 'les_hist10_1',
        subjectId: 'sub_history',
        gradeId: 'g10',
        textbookSetId: 'canh_dieu',
        chapterId: 'ch_hist10_cd_1',
        title: 'Bài 1: Hiện thực lịch sử và nhận thức lịch sử',
        periodCount: 2,
        learningOutcomes: [
          'Phân biệt được hiện thực lịch sử và nhận thức lịch sử.',
          'Giải thích được vì sao nhận thức lịch sử có tính đa dạng và phụ thuộc vào mục đích của nhà sử học.',
          'Nhận thức được ý nghĩa của việc tôn trọng sự thật lịch sử và học tập lịch sử suốt đời.'
        ],
        coreKnowledge: [
          'Khái niệm hiện thực lịch sử (tính khách quan, không thể thay đổi).',
          'Khái niệm nhận thức lịch sử (tính chủ quan, tiến dần đến chân lí).',
          'Các nguồn sử liệu: hiện vật, chữ viết, truyền miệng, đa phương tiện.'
        ]
      }
    ]
  }
];

export const DEFAULT_AI_PROMPTS: AIPromptTemplate[] = [
  {
    id: 'prompt_create_khbd',
    name: 'Prompt Soạn KHBD Chuẩn 5512',
    code: 'create_khbd',
    description: 'Tạo Kế hoạch bài dạy chuẩn theo Công văn 5512/BGDĐT và CTGDPT 2018 với đầy đủ 3 phần và 4 hoạt động.',
    systemInstruction: `Bạn là CHUYÊN GIA SƯ PHẠM THPT VIỆT NAM và KIẾN TRÚC SƯ CTGDPT 2018 với 20 năm kinh nghiệm.
Nhiệm vụ của bạn là xây dựng KẾ HOẠCH BÀI DẠY (KHBD) hoàn chỉnh, chuẩn xác theo Công văn 5512/BGDĐT của Bộ Giáo dục và Đào tạo.

TUÂN THỦ CÁC NGUYÊN TẮC:
1. KHÔNG VIẾT LAN MAN, KHÔNG BỊA ĐẶT NỘI DUNG SGK hay số trang nếu không có dữ liệu.
2. Nêu rõ 3 nhóm Mục tiêu:
   - Kiến thức: Cụ thể, định lượng, bám sát Yêu cầu cần đạt.
   - Năng lực: Gồm Năng lực chung (Tự chủ, Giao tiếp - Hợp tác, Giải quyết vấn đề) VÀ Năng lực đặc thù ĐÚNG THEO MÔN HỌC (Ví dụ Toán: Tư duy & lập luận toán học, Mô hình hóa; Ngữ văn: Năng lực ngôn ngữ, Năng lực văn học; Vật lí: Nhận thức vật lí, Tìm hiểu thế giới tự nhiên; Tin học: NLa, NLb, NLc, NLd, NLe).
   - Phẩm chất: Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm.
3. Cấu trúc 4 Hoạt động chuẩn Công văn 5512:
   - Hoạt động 1: Khởi động (Mục tiêu, Nội dung, Sản phẩm, Tổ chức: Giao nhiệm vụ, Thực hiện, Báo cáo, Kết luận).
   - Hoạt động 2: Hình thành kiến thức mới (Mục tiêu, Nội dung, Sản phẩm, Tổ chức: Giao nhiệm vụ, Thực hiện, Báo cáo, Kết luận chi tiết).
   - Hoạt động 3: Luyện tập (Hệ thống bài tập, câu hỏi phân hóa từ nhận biết đến vận dụng).
   - Hoạt động 4: Vận dụng (Nhiệm vụ thực tế, đời sống, tích hợp STEM hoặc giáo dục địa phương/hướng nghiệp).
4. Phân biệt rõ giữa Dữ liệu chính thức, Dữ liệu giáo viên cung cấp và Đề xuất sáng tạo của AI.
5. Khi có tích hợp Năng lực số: Giải thích rõ hoạt động học sinh dùng công cụ số gì, sản phẩm số là gì, minh chứng đánh giá ra sao.`,
    userPromptTemplate: `Hãy soạn KHBD cho:
- Môn: {{subjectName}} (Khối {{gradeName}})
- Bộ sách: {{textbookSetName}}
- Tên bài: {{lessonTitle}}
- Số tiết: {{durationPeriods}} tiết (Thời lượng: {{durationMinutes}} phút)
- Yêu cầu cần đạt: {{learningOutcomes}}
- Tích hợp Năng lực số: {{digitalIntegration}}
- Tích hợp STEM/STEAM: {{stemIntegration}}
- Phân hóa học sinh: {{differentiation}}
- Yêu cầu bổ sung của Giáo viên: {{teacherNote}}`,
    isCustomized: false
  },
  {
    id: 'prompt_check_khbd',
    name: 'Prompt Kiểm tra KHBD (15 Tiêu chí)',
    code: 'check_khbd',
    description: 'Chấm điểm và phân tích chất lượng KHBD theo thang 100 điểm với 15 tiêu chí kiểm định sư phạm.',
    systemInstruction: `Bạn là THANH TRA CHUYÊN MÔN SỞ GIÁO DỤC VÀ ĐÀO TẠO chuyên kiểm tra chất lượng Kế hoạch bài dạy theo Công văn 5512/BGDĐT.
Hãy phân tích KHBD được cung cấp và chấm điểm công tâm, chỉ ra cụ thể điểm mạnh, điểm yếu và giải pháp khắc phục.`,
    userPromptTemplate: `Kiểm tra và đánh giá KHBD sau:
{{lessonPlanContent}}`,
    isCustomized: false
  },
  {
    id: 'prompt_upgrade_khbd',
    name: 'Prompt Nâng Cấp KHBD (3 Chiều)',
    code: 'upgrade_khbd',
    description: 'Nâng cấp KHBD theo 3 chiều: Làm tốt hơn, Làm khác đi, Làm ngược lại (Lớp học đảo ngược, chuyển đổi số).',
    systemInstruction: `Bạn là CHUYÊN GIA ĐỔI MỚI PHƯƠNG PHÁP DẠY HỌC THPT.
Hãy phân tích KHBD hiện tại và đưa ra 3 phương án nâng cấp:
1. Làm tốt hơn (Tối ưu hóa thời lượng, tăng tính sư phạm và sản phẩm học tập).
2. Làm khác đi (Ứng dụng công nghệ, trò chơi hóa, học qua dự án, giải quyết vấn đề).
3. Làm ngược lại (Mô hình Flipped Classroom - Lớp học đảo ngược, tự học qua video/bài giảng trước).`,
    userPromptTemplate: `Hãy nâng cấp KHBD sau:
{{lessonPlanContent}}`,
    isCustomized: false
  },
  {
    id: 'prompt_create_questions',
    name: 'Prompt Ngân hàng Câu hỏi Phân hóa',
    code: 'create_questions',
    description: 'Tạo câu hỏi 4 mức độ nhận thức (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao) có đáp án và ma trận.',
    systemInstruction: `Bạn là CHUYÊN GIA KHẢO THÍ VÀ ĐÁNH GIÁ GIÁO DỤC THPT VIỆT NAM.
Hãy tạo ngân hàng câu hỏi bám sát chuẩn kiến thức, kĩ năng theo 4 mức độ nhận thức của Thông tư 22/BGDĐT.`,
    userPromptTemplate: `Tạo câu hỏi cho:
- Môn: {{subjectName}}, Khối {{gradeName}}, Bài: {{lessonTitle}}
- Mức độ: {{levels}}
- Dạng câu hỏi: {{questionTypes}}
- Số lượng: {{count}} câu`,
    isCustomized: false
  }
];

export const DEMO_SAMPLE_LESSON_PLAN: LessonPlan = {
  id: 'lp_demo_math10_1',
  title: 'Kế hoạch bài dạy: Bài 1. Mệnh đề (Tiết 1 - 2)',
  schoolName: 'Trường THPT Chuyên Quốc Học',
  department: 'Tổ Toán - Tin',
  teacherName: 'Nguyễn Văn An',
  subjectId: 'sub_math',
  subjectName: 'Toán',
  gradeId: 'g10',
  gradeName: 'Lớp 10',
  textbookSetId: 'kntt',
  textbookSetName: 'Kết nối tri thức với cuộc sống',
  schoolYear: '2025 - 2026',
  durationPeriods: 2,
  durationMinutes: 90,
  teachDate: '2025-09-08',
  chapterTitle: 'Chương I: Mệnh đề và tập hợp',
  lessonNumber: 'Bài 1',
  templateType: '5512_standard',
  objectives: {
    knowledge: [
      'Nhận biết được thế nào là một mệnh đề toán học, mệnh đề chứa biến.',
      'Phát biểu và xác định được tính đúng/sai của mệnh đề phủ định, mệnh đề kéo theo và mệnh đề tương đương.',
      'Hiểu và sử dụng thành thạo các kí hiệu phổ biến ∀ (với mọi) và ∃ (tồn tại).'
    ],
    generalCompetencies: {
      selfAutonomy: ['Tự giác tìm hiểu định nghĩa mệnh đề thông qua các ví dụ thực tiễn trong phiếu học tập cá nhân.'],
      communication: ['Tích cực thảo luận cặp đôi để phản biện và giải thích tính đúng/sai của các mệnh đề kéo theo.'],
      problemSolving: ['Phát hiện và sửa lỗi sai trong việc phủ định mệnh đề chứa kí hiệu ∀ và ∃.']
    },
    specificCompetencies: [
      'Năng lực tư duy và lập luận toán học: So sánh, đối chiếu, suy luận logic khi xác định điều kiện cần và đủ.',
      'Năng lực mô hình hóa toán học: Chuyển các câu khẳng định thực tế sang dạng mệnh đề toán học có cấu trúc logic.',
      'Năng lực sử dụng công cụ số: Sử dụng Quizizz và Google Form để tham gia bài tập trắc nghiệm tương tác nhanh.'
    ],
    qualities: {
      diligence: ['Chăm chỉ theo dõi bài học, hoàn thành đầy đủ các nhiệm vụ luyện tập trong phiếu học tập.'],
      honesty: ['Trung thực trong tự đánh giá và đánh giá chéo kết quả thảo luận nhóm.'],
      responsibility: ['Có trách nhiệm phối hợp nhóm để hoàn thành báo cáo trò chơi khởi động.']
    }
  },
  equipment: {
    teacher: [
      'Máy tính cá nhân, máy chiếu/màn hình tương tác.',
      'Bộ slide bài giảng điện tử tương tác và phiếu học tập (PHT số 1, số 2).',
      'Đường link trò chơi Quizizz "Ai là nhà logic học tài ba?".'
    ],
    student: [
      'Sách giáo khoa Toán 10 (Bộ Kết nối tri thức), vở ghi, bút dạ bảng nhóm.',
      'Điện thoại thông minh/máy tính bảng kết nối Wifi (dùng cho hoạt động trò chơi).'
    ],
    digitalLearningMaterials: [
      'Phiếu học tập trực tuyến trên Google Docs/Canva.',
      'Phần mềm trắc nghiệm Quizizz kiểm tra nhanh tính đúng/sai.'
    ]
  },
  integrations: {
    digitalCompetencyEnabled: true,
    aiInTeachingEnabled: true,
    stemEnabled: false,
    differentiationEnabled: true,
    extensionActivityEnabled: true
  },
  activities: [
    {
      id: 'act_1',
      phase: 'warmup',
      title: 'Hoạt động 1: Khởi động - Trò chơi "Thực hay Ảo? Đúng hay Sai?"',
      durationMinutes: 10,
      objectives: 'Tạo tâm thế hứng thú cho học sinh; bước đầu nhận biết sự khác nhau giữa câu khẳng định có tính đúng/sai rõ ràng và các câu cảm thán/câu hỏi thông thường.',
      content: 'Giáo viên trình chiếu 5 câu nói trên màn hình và yêu cầu học sinh quét mã QR bình chọn câu nào khẳng định được chắc chắn Đúng hoặc Sai.',
      product: 'Kết quả bình chọn trên màn hình lớp và câu trả lời miệng của đại diện học sinh phân tích lý do.',
      activityType: 'game',
      execution: {
        assignTask: 'GV chia lớp thành 4 tổ, trình chiếu 5 phát biểu (ví dụ: "Hà Nội là thủ đô của Việt Nam", "Trời hôm nay đẹp quá!", "Số 13 là số nguyên tố", "x + 2 = 5", "Bạn ăn cơm chưa?"). Yêu cầu HS giơ thẻ màu: Xanh (Đúng), Đỏ (Sai), Vàng (Không xác định được Đúng/Sai).',
        doTask: 'HS quan sát, suy nghĩ độc lập trong 1 phút và giơ thẻ phản hồi theo hiệu lệnh của GV.',
        reportDiscuss: 'GV gọi 2 HS có lựa chọn thẻ Vàng giải thích tại sao câu "Trời hôm nay đẹp quá!" không thể coi là Đúng hay Sai tuyệt đối.',
        concludeAssess: 'GV chốt lại: Những câu khẳng định có tính Đúng hoặc Sai rõ ràng trong toán học gọi là MỆNH ĐỀ. Dẫn dắt vào bài mới.'
      },
      digitalDetails: {
        enabled: true,
        activityName: 'Bình chọn tương tác thời gian thực',
        studentAction: 'HS dùng Mentimeter hoặc thẻ phản hồi số để biểu quyết',
        digitalTools: ['Mentimeter', 'Màn hình tương tác'],
        studentProduct: 'Biểu đồ phân phối ý kiến cả lớp trên màn hình',
        assessmentEvidence: 'Tỉ lệ học sinh phân biệt đúng câu có giá trị chân lí'
      }
    },
    {
      id: 'act_2',
      phase: 'knowledge',
      title: 'Hoạt động 2: Hình thành kiến thức mới - Mệnh đề, Mệnh đề kéo theo và Kí hiệu ∀, ∃',
      durationMinutes: 45,
      objectives: 'Học sinh nắm vững định nghĩa mệnh đề, mệnh đề phủ định, mệnh đề kéo theo P => Q, mệnh đề tương đương P <=> Q, và cách dùng kí hiệu ∀, ∃.',
      content: 'Học sinh làm việc với Phiếu học tập số 1 theo nhóm 4 người, tìm hiểu từng mục và xây dựng ví dụ minh họa.',
      product: 'Nội dung hoàn chỉnh trên Phiếu học tập số 1 và bảng nhóm của các tổ.',
      execution: {
        assignTask: 'GV phát Phiếu học tập số 1 gồm 3 nhiệm vụ: (1) Nhận dạng mệnh đề và mệnh đề phủ định; (2) Phân tích mệnh đề "Nếu tam giác ABC đều thì tam giác ABC cân" (P => Q); (3) Đọc và viết mệnh đề bằng kí hiệu ∀ và ∃.',
        doTask: 'HS thảo luận nhóm 4 em trong 15 phút. GV đi quan sát, hướng dẫn các nhóm gặp khó khăn ở phần phủ định mệnh đề chứa ∀ (cần chuyển thành ∃).',
        reportDiscuss: 'Đại diện Nhóm 1 và Nhóm 3 lên bảng trình bày. Nhóm 2 và Nhóm 4 đặt câu hỏi phản biện về việc phủ định mệnh đề "Mọi số thực đều có bình phương không âm".',
        concludeAssess: 'GV chuẩn hóa kiến thức, nhấn mạnh: Mệnh đề P => Q chỉ sai khi P đúng mà Q sai. Phủ định của ∀x, P(x) là ∃x, P̄(x).'
      },
      differentiationDetails: {
        enabled: true,
        supportLevel: 'Cung cấp phiếu gợi ý có sẵn cấu trúc: Nếu [Giả thiết P] thì [Kết luận Q].',
        standardLevel: 'Tự lấy 2 ví dụ thực tế về mệnh đề kéo theo và xác định tính đúng sai.',
        advancedLevel: 'Phát biểu định lí dưới dạng "Điều kiện cần", "Điều kiện đủ" và "Điều kiện cần và đủ".',
        exceptionalLevel: 'Chứng minh mệnh đề đảo của một định lí hình học lớp 9 bằng phản chứng.'
      }
    },
    {
      id: 'act_3',
      phase: 'practice',
      title: 'Hoạt động 3: Luyện tập - Củng cố qua hệ thống bài tập phân hóa',
      durationMinutes: 20,
      objectives: 'Rèn luyện kĩ năng xác định tính đúng/sai của mệnh đề, viết mệnh đề phủ định và mệnh đề đảo một cách chính xác.',
      content: 'Học sinh làm bài tập cá nhân trên phiếu trắc nghiệm kết hợp tự luận ngắn, sau đó đổi bài chấm chéo.',
      product: 'Bài làm trên phiếu của từng học sinh với điểm đánh giá và lời nhận xét của bạn.',
      practiceTypes: ['mcq', 'true_false', 'essay'],
      execution: {
        assignTask: 'GV giao bài tập gồm 6 câu trắc nghiệm (Nhận biết - Thông hiểu) và 2 câu tự luận (Vận dụng: phát biểu mệnh đề đảo và xác định điều kiện cần, đủ).',
        doTask: 'HS làm bài độc lập trong 12 phút.',
        reportDiscuss: 'GV chiếu đáp án chuẩn kèm barem điểm. HS đổi bài theo cặp để chấm chéo và ghi nhận xét vào phiếu của bạn.',
        concludeAssess: 'GV thu nhanh một số bài chấm mẫu, nhận xét các lỗi phổ biến mà học sinh hay mắc phải (nhầm lẫn giữa phủ định của "=" là "≠" hay "<").'
      }
    },
    {
      id: 'act_4',
      phase: 'application',
      title: 'Hoạt động 4: Vận dụng - Ứng dụng logic mệnh đề trong đời sống và lập trình cơ bản',
      durationMinutes: 15,
      objectives: 'Học sinh biết liên hệ cấu trúc mệnh đề điều kiện "Nếu... thì..." với tư duy lập trình và các quy tắc pháp luật/giao thông thực tế.',
      content: 'Nhiệm vụ: Viết lại quy tắc an toàn giao thông đường bộ hoặc một luật lệ gia đình/lớp học dưới dạng mệnh đề logic P => Q.',
      product: 'Một đoạn văn ngắn hoặc sơ đồ khối thuật toán logic nộp trên Padlet của lớp.',
      execution: {
        assignTask: 'GV nêu yêu cầu: "Trong lập trình và đời sống, mệnh đề điều kiện If... Then... xuất hiện rất nhiều. Hãy viết 2 mệnh đề P => Q về Luật Giao thông (ví dụ: Vượt đèn đỏ -> Bị phạt) và tìm mệnh đề phủ định của nó."',
        doTask: 'HS làm việc cá nhân hoặc theo cặp, viết lên giấy ghi chú hoặc đăng lên bảng Padlet chung.',
        reportDiscuss: 'GV chọn ngẫu nhiên 3 bài trên Padlet chiếu lên màn hình để cả lớp cùng góp ý phân tích tính chặt chẽ.',
        concludeAssess: 'GV tổng kết, nhấn mạnh tư duy logic mệnh đề chính là nền tảng của toán học hiện đại, khoa học máy tính và trí tuệ nhân tạo (AI).'
      },
      digitalDetails: {
        enabled: true,
        activityName: 'Bảng tin tương tác số Padlet',
        studentAction: 'HS đăng bài viết ngắn và sơ đồ logic lên Padlet',
        digitalTools: ['Padlet', 'Canva'],
        studentProduct: 'Bài đăng số kèm hình ảnh/sơ đồ khối logic',
        assessmentEvidence: 'Khả năng diễn đạt chính xác quan hệ nhân quả logic'
      }
    }
  ],
  isFavorite: true,
  qualityCheck: {
    totalScore: 95,
    overallAssessment: 'good',
    summary: 'Kế hoạch bài dạy bám sát rất tốt chuẩn Công văn 5512/BGDĐT, mục tiêu rõ ràng đo lường được, hoạt động học sinh tích cực, tích hợp số thực chất.',
    criteria: [
      { id: 1, name: 'Mục tiêu kiến thức cụ thể, rõ ràng', passed: true, score: 7, feedback: 'Mục tiêu nêu bật được 3 mức nhận thức bám sát YCCĐ.', category: 'objectives' },
      { id: 2, name: 'Năng lực chung được rèn luyện thực tế', passed: true, score: 7, feedback: 'Tự chủ và hợp tác được lồng ghép rõ trong hoạt động nhóm.', category: 'objectives' },
      { id: 3, name: 'Năng lực đặc thù đúng chuẩn môn Toán', passed: true, score: 7, feedback: 'Nêu đúng Năng lực tư duy & lập luận toán học, mô hình hóa.', category: 'objectives' },
      { id: 4, name: 'Phẩm chất gắn với hành vi người học', passed: true, score: 6, feedback: 'Chăm chỉ, trung thực thể hiện qua chấm chéo bài.', category: 'objectives' },
      { id: 5, name: 'Thiết bị dạy học và học liệu đầy đủ', passed: true, score: 6, feedback: 'Có PHT, slide, công cụ Quizizz và Padlet.', category: 'equipment' },
      { id: 6, name: 'Hoạt động khởi động tạo hứng thú, liên kết bài', passed: true, score: 7, feedback: 'Trò chơi Thực hay Ảo dẫn dắt rất tự nhiên vào khái niệm mệnh đề.', category: 'activities' },
      { id: 7, name: 'Hoạt động hình thành kiến thức đủ 4 bước', passed: true, score: 7, feedback: 'Giao NV - Thực hiện - Báo cáo - Kết luận rất rành mạch.', category: 'activities' },
      { id: 8, name: 'Hoạt động luyện tập có phân hóa', passed: true, score: 7, feedback: 'Hệ thống câu hỏi từ nhận biết đến vận dụng.', category: 'activities' },
      { id: 9, name: 'Hoạt động vận dụng gắn với thực tiễn', passed: true, score: 7, feedback: 'Gắn với an toàn giao thông và thuật toán máy tính.', category: 'activities' },
      { id: 10, name: 'Sản phẩm học tập của học sinh cụ thể', passed: true, score: 7, feedback: 'Mỗi hoạt động đều nêu rõ sản phẩm cần nộp.', category: 'assessment' },
      { id: 11, name: 'Phương án đánh giá đa dạng (tự đánh giá, chấm chéo)', passed: true, score: 6, feedback: 'Có biểu điểm và hoạt động chấm chéo theo cặp.', category: 'assessment' },
      { id: 12, name: 'Tích hợp Năng lực số thực chất, không hình thức', passed: true, score: 7, feedback: 'Sử dụng Quizizz, Mentimeter và Padlet rõ mục đích.', category: 'pedagogy' },
      { id: 13, name: 'Có phương án phân hóa học sinh rõ ràng', passed: true, score: 7, feedback: 'Có 4 mức từ hỗ trợ đến học sinh giỏi.', category: 'pedagogy' },
      { id: 14, name: 'Phân bổ thời lượng hợp lí (90 phút / 2 tiết)', passed: true, score: 6, feedback: '10p - 45p - 20p - 15p rất cân đối.', category: 'pedagogy' },
      { id: 15, name: 'Hình thức trình bày chuẩn văn bản sư phạm', passed: true, score: 6, feedback: 'Trình bày mạch lạc, cấu trúc đúng chuẩn Bộ GD&ĐT.', category: 'pedagogy' }
    ],
    checkedAt: '2025-08-30'
  },
  createdAt: '2025-08-28T08:00:00.000Z',
  updatedAt: '2025-08-30T10:15:00.000Z'
};
