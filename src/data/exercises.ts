import { Exercise } from '../types';

export const EQUIPMENT_DEFINITIONS = [
  { id: 'smith_machine', nameAr: 'جهاز السميث', nameEn: 'Smith Machine' },
  { id: 'cable_crossover', nameAr: 'جهاز الكابل المزدوج', nameEn: 'Cable Crossover' },
  { id: 'seated_cable_row', nameAr: 'جهاز السحب الأرضي', nameEn: 'Seated Cable Row' },
  { id: 'pec_deck', nameAr: 'جهاز الفراشة للصدر', nameEn: 'Pec Deck / Butterfly' },
  { id: 'leg_extension', nameAr: 'جهاز مد الرجل الأمامي', nameEn: 'Leg Extension' },
  { id: 'leg_press_45', nameAr: 'جهاز ضغط الرجل 45 درجة', nameEn: '45-Degree Leg Press' },
  { id: 'dumbbells_barbells', nameAr: 'دامبلز وبارات حرة', nameEn: 'Dumbbells & Barbells' },
  { id: 'bodyweight', nameAr: 'وزن الجسم وتدريبات حرة', nameEn: 'Bodyweight' },
];

export const EXERCISES_DATABASE: Exercise[] = [
  // ==================== الصدر (Chest) ====================
  {
    id: 'smith_incline_press',
    nameAr: 'ضغط صدر علوي على جهاز السميث',
    nameEn: 'Smith Machine Incline Bench Press',
    targetMuscle: 'الصدر العلوي',
    movementPattern: 'chest_press',
    equipmentRequired: 'smith_machine',
    defaultSets: 4,
    defaultReps: '8-12',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['db_incline_press', 'cable_incline_fly'],
    formCues: {
      setup: 'اضبط المقعد بزاوية 30-45 درجة، واجعل البار يلامس الجزء العلوي من الصدر تحت الترقوة مباشرة.',
      tempo: 'اهبط بالبار ببطء في 2-3 ثوانٍ واضغط للأعلى بقوة وثبات دون قفل مفصل الكوع بالكامل.',
      mistake: 'تجنب فتح الكوعين للخارج بزاوية 90 درجة؛ اجعل زاوية الكوع مع الجذع قرابة 60-70 درجة لحماية الكتف.'
    }
  },
  {
    id: 'smith_flat_press',
    nameAr: 'ضغط صدر مستوي على جهاز السميث',
    nameEn: 'Smith Machine Flat Bench Press',
    targetMuscle: 'الصدر الأوسط',
    movementPattern: 'chest_press',
    equipmentRequired: 'smith_machine',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['db_flat_press', 'pec_deck_fly'],
    formCues: {
      setup: 'استلقِ على المقعد المسطح مع سحب لوحي الكتف للخلف وللأسفل وتثبيت القدمين بقوة على الأرض.',
      tempo: 'انزل بالبار حتى يلامس منتصف الصدر برفق ثم ادفع للأعلى مع قبض عضلات الصدر في القمة.',
      mistake: 'احذر ارتداد البار من عظام الصدر أو رفع أسفل الظهر بشكل مبالغ فيه عن الدكة.'
    }
  },
  {
    id: 'db_incline_press',
    nameAr: 'ضغط صدر علوي بالدامبلز',
    nameEn: 'Incline Dumbbell Press',
    targetMuscle: 'الصدر العلوي',
    movementPattern: 'chest_press',
    equipmentRequired: 'dumbbells_barbells',
    defaultSets: 4,
    defaultReps: '8-12',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['smith_incline_press', 'cable_incline_fly'],
    formCues: {
      setup: 'اضبط الدكة على زاوية 30 درجة، ثبت الدامبلز فوق ركبتيك ثم استند إلى الخلف وثبت لوحي الكتف.',
      tempo: 'انزل بالدامبلز لأسفل الصدر العلوي بمدى حركي كامل واصعد للأعلى في مسار قوسي خفيف.',
      mistake: 'لا تضرب الدامبلز ببعضهما في القمة؛ حافظ على التوتر المستمر داخل عضلات الصدر.'
    }
  },
  {
    id: 'db_flat_press',
    nameAr: 'ضغط صدر مستوي بالدامبلز',
    nameEn: 'Flat Dumbbell Press',
    targetMuscle: 'عضلات الصدر',
    movementPattern: 'chest_press',
    equipmentRequired: 'dumbbells_barbells',
    defaultSets: 3,
    defaultReps: '8-12',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['smith_flat_press', 'pec_deck_fly'],
    formCues: {
      setup: 'استلقِ على دكة مستوية، ارفع الدامبلز مع ثني المرفقين بزاوية 75 درجة تجاه الجذع.',
      tempo: 'اهبط بتركيز حتى مستوى الصدر وادفع بقوة للأعلى مع التركيز على ضم الصدر للداخل.',
      mistake: 'تجنب ترك الرسغ يلتوي للخلف؛ اجعل قبضتك عمودية وصلبة طوال الحركة.'
    }
  },
  {
    id: 'pec_deck_fly',
    nameAr: 'تجميع صدر على جهاز الفراشة',
    nameEn: 'Pec Deck Machine Fly',
    targetMuscle: 'الصدر الداخلي والأوسط',
    movementPattern: 'chest_fly',
    equipmentRequired: 'pec_deck',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['cable_standing_fly', 'db_flat_fly'],
    formCues: {
      setup: 'اضبط ارتفاع المقعد ليكون المقبضان في مستوى منتصف الصدر مع إرجاع الكتفين بالكامل للمسند.',
      tempo: 'اجمع المقبضين للأمام مع عصر الصدر لثانية كاملة، ثم افتح ذراعيك ببطء وتحكم.',
      mistake: 'لا تدع الأوزان ترتطم ببعضها في نهاية التكرار، ولا تدفع بجسمك للأمام خارج مسند الظهر.'
    }
  },
  {
    id: 'cable_standing_fly',
    nameAr: 'تجميع صدر عالي بالكابل',
    nameEn: 'Cable Crossover High to Low',
    targetMuscle: 'الصدر السفلي والأوسط',
    movementPattern: 'chest_fly',
    equipmentRequired: 'cable_crossover',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['pec_deck_fly', 'cable_incline_fly'],
    formCues: {
      setup: 'ثبت البكرات في أعلى نقطة، خذ خطوة للأمام مع ميلان طفيف بالجذع وثني المرفقين قليلاً.',
      tempo: 'اسحب الكابلات لأسفل وللداخل حتى تلتقي يداك أمام الحزام مع الضغط الشديد على الصدر.',
      mistake: 'لا تستخدم قوة الدفع أو التأرجح؛ ثبت مفصل الكوع وتحرك فقط من مفصل الكتف.'
    }
  },
  {
    id: 'cable_incline_fly',
    nameAr: 'تجميع صدر علوي بالكابل من أسفل',
    nameEn: 'Low to High Cable Fly',
    targetMuscle: 'الصدر العلوي',
    movementPattern: 'chest_fly',
    equipmentRequired: 'cable_crossover',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['pec_deck_fly', 'db_incline_press'],
    formCues: {
      setup: 'ضع بكرات الكابل في أدنى نقطة، أمسك المقابض وتقدم خطوة واحدة للأمام بتوازن.',
      tempo: 'اسحب الكابل للأعلى وللأمام حتى مستوى الذقن مع ثبات انحناء المرفقين وعصر الصدر العلوي.',
      mistake: 'تجنب استخدام عضلات البايسبس في رفع الوزن؛ فكّر في تقريب كوعيك لبعضهما.'
    }
  },
  {
    id: 'db_flat_fly',
    nameAr: 'تفتيح صدر مستوي بالدامبلز',
    nameEn: 'Flat Dumbbell Fly',
    targetMuscle: 'عضلات الصدر',
    movementPattern: 'chest_fly',
    equipmentRequired: 'dumbbells_barbells',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['pec_deck_fly', 'cable_standing_fly'],
    formCues: {
      setup: 'استلقِ على الدكة مع ثني خفيف وثابت في المرفقين كأنك تحتضن شجرة ضخمة.',
      tempo: 'افتح ذراعيك ببطء لجانبيك حتى تشعر بإطالة الصدر ثم اعصر للأعلى لنفس نقطة البداية.',
      mistake: 'لا تنزل بالدامبلز لمستوى عميق جداً يسبب ضغطاً مفرطاً وتمزقاً لأوتار الكتف.'
    }
  },

  // ==================== الظهر (Back) ====================
  {
    id: 'seated_cable_row_vbar',
    nameAr: 'سحب أرضي على جهاز الكابل (مسكة ضيقة V)',
    nameEn: 'Seated Cable Row Close Grip',
    targetMuscle: 'منتصف الظهر والمجنص',
    movementPattern: 'horizontal_pull',
    equipmentRequired: 'seated_cable_row',
    defaultSets: 4,
    defaultReps: '8-12',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['db_single_arm_row', 'smith_bent_over_row'],
    formCues: {
      setup: 'اجلس مع فرد الظهر وثني الركبتين خفيفاً، واسحب المقبض واثبت صدرك مرفوعاً للأعلى.',
      tempo: 'اسحب المقبض باتجاه السرة مع اعتصار لوحي الظهر معاً لثانية، ثم ارجع ببطء وتحكم.',
      mistake: 'احذر تقويس الظهر أو التأرجح للأمام والخلف بالخصر لحمل الوزن.'
    }
  },
  {
    id: 'seated_cable_row_wide',
    nameAr: 'سحب أرضي بالبار العريض (عضلة الترابيس وأعلى الظهر)',
    nameEn: 'Seated Wide Grip Cable Row',
    targetMuscle: 'أعلى الظهر والكتف الخلفي',
    movementPattern: 'horizontal_pull',
    equipmentRequired: 'seated_cable_row',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['seated_cable_row_vbar', 'cable_face_pull'],
    formCues: {
      setup: 'ركّب البار المستقيم الطويل، أمسك بقبضة أوسع من الكتفين مع الحفاظ على الصدر مشدوداً.',
      tempo: 'اسحب البار نحو أعلى البطن مع فتح الكوعين للجانبين وعصر أعلى الظهر.',
      mistake: 'لا تسحب البار برقبتك أو ترفع كتفيك لأعلى نحو أذنيك.'
    }
  },
  {
    id: 'smith_bent_over_row',
    nameAr: 'سحب بار محني على جهاز السميث',
    nameEn: 'Smith Machine Bent Over Row',
    targetMuscle: 'الظهر العلوي واللاتس',
    movementPattern: 'horizontal_pull',
    equipmentRequired: 'smith_machine',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['seated_cable_row_vbar', 'db_single_arm_row'],
    formCues: {
      setup: 'قف أمام بار السميث مع انحناء الجذع 45 درجة وثني الركبتين وتثبيت عضلات البطن والظهر مستقيماً.',
      tempo: 'اسحب البار نحو السرة مع سحب الكوعين للخلف وإرجاع لوحي الكتف.',
      mistake: 'تجنب تحريك الجذع لأعلى ولأسفل أثناء التكرار؛ حافظ على ثبات زاويتك.'
    }
  },
  {
    id: 'db_single_arm_row',
    nameAr: 'تجديف فردي بالدامبل (منشار)',
    nameEn: 'One-Arm Dumbbell Row',
    targetMuscle: 'المجنص (اللاتس)',
    movementPattern: 'horizontal_pull',
    equipmentRequired: 'dumbbells_barbells',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 75,
    isCompound: true,
    alternateExerciseIds: ['seated_cable_row_vbar', 'smith_bent_over_row'],
    formCues: {
      setup: 'سند الركبة واليد على الدكة مع جعل الظهر موازياً للأرض ورأسك في وضع محايد.',
      tempo: 'اسحب الدامبل باتجاه الجيب (الورك) مع قيادة الحركة بالكوع وليس المعصم.',
      mistake: 'لا تلوِ جذعك لليمين أو اليسار للمساعدة في رفع الوزن؛ الظهر يظل ثابتاً.'
    }
  },
  {
    id: 'cable_lat_pulldown',
    nameAr: 'سحب مجنص عالي على جهاز الكابل',
    nameEn: 'Dual Cable Lat Pulldown',
    targetMuscle: 'عريض الظهر (اللاتس)',
    movementPattern: 'vertical_pull',
    equipmentRequired: 'cable_crossover',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['seated_cable_row_vbar', 'cable_straight_arm_pulldown'],
    formCues: {
      setup: 'اجلس بركبتيك على الأرض بين بكرات الكابل العالية وأمسك المقبضين مع فرد الذراعين وإمالة الصدر لأعلى.',
      tempo: 'اسحب للأسفل وللجانب مع توجيه الكوعين نحو خاصرتك واعتصار المجنص.',
      mistake: 'لا تمِل للخلف بزاوية كبيرة تحول الحركة لتجديف أفقي؛ ابقَ شبه عمودي.'
    }
  },
  {
    id: 'cable_straight_arm_pulldown',
    nameAr: 'سحب ذراعين مستقيمة على الكابل (إطالة مجنص)',
    nameEn: 'Cable Straight Arm Pulldown',
    targetMuscle: 'المجنص المعزول (اللاتس)',
    movementPattern: 'vertical_pull',
    equipmentRequired: 'cable_crossover',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['cable_lat_pulldown', 'seated_cable_row_vbar'],
    formCues: {
      setup: 'ثبت الحبل أو البار في أعلى الكابل، خذ خطوة للخلف ومِل بالجذع 30 درجة مع فرد الذراعين.',
      tempo: 'ادفع البار أو الحبل للأسفل نحو فخذيك في مسار نصف دائري مع ثبات المرفقين.',
      mistake: 'لا تثنِ مرفقيك وتحوله لتمرين ترايسبس؛ الحركة تخرج بالكامل من الكتف والمجنص.'
    }
  },
  {
    id: 'cable_face_pull',
    nameAr: 'سحب للوجه بالحبل على الكابل (Face Pull)',
    nameEn: 'Cable Face Pull',
    targetMuscle: 'الكتف الخلفي والترابيس الوسطى',
    movementPattern: 'horizontal_pull',
    equipmentRequired: 'cable_crossover',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['db_rear_delt_fly', 'seated_cable_row_wide'],
    formCues: {
      setup: 'اضبط الكابل على مستوى العين، أمسك الحبل بإبهاميك متجهين للخلف.',
      tempo: 'اسحب الحبل باتجاه جانبي جبهتك وأذنيك مع تدوير يديك للخارج وفتح الكوعين.',
      mistake: 'لا تسحب الحبل لأسفل رقبتك؛ حافظ على الكوعين أعلى من المعصمين طوال السحبة.'
    }
  },

  // ==================== الأكتاف (Shoulders) ====================
  {
    id: 'smith_overhead_press',
    nameAr: 'ضغط أكتاف جالس على جهاز السميث',
    nameEn: 'Smith Machine Seated Shoulder Press',
    targetMuscle: 'الكتف الأمامي والجانبي',
    movementPattern: 'shoulder_press',
    equipmentRequired: 'smith_machine',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['db_seated_shoulder_press', 'cable_lateral_raise'],
    formCues: {
      setup: 'اضبط ظهر الدكة على زاوية 80-85 درجة، واجعل البار ينزل أمام ذقنك مباشرة.',
      tempo: 'انزل بالبار حتى مستوى الأنف أو الذقن ثم ادفع للأعلى دون قفل الكوعين تماماً.',
      mistake: 'احذر تنزيل البار خلف الرأس؛ فهذا يضع مفصل الكتف في وضع تشريحي خطير.'
    }
  },
  {
    id: 'db_seated_shoulder_press',
    nameAr: 'ضغط أكتاف جالس بالدامبلز',
    nameEn: 'Seated Dumbbell Shoulder Press',
    targetMuscle: 'الكتف الأمامي والجانبي',
    movementPattern: 'shoulder_press',
    equipmentRequired: 'dumbbells_barbells',
    defaultSets: 4,
    defaultReps: '8-12',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['smith_overhead_press', 'cable_lateral_raise'],
    formCues: {
      setup: 'اجلس بظهر مستقيم مسنود، ارفع الدامبلز لمستوى الأذنين مع كوعين للأمام قليلاً 60 درجة.',
      tempo: 'ادفع للأعلى في مسار قوسي خفيف مع إبقاء الرأس ثابتاً وتجنب ضرب الأوزان ببعضها.',
      mistake: 'لا تقوّس أسفل ظهرك لتسهيل الدفع؛ ثبت بطنك واضغط ظهرك في المسند.'
    }
  },
  {
    id: 'cable_lateral_raise',
    nameAr: 'رفرفة جانبي فردي بالكابل',
    nameEn: 'Cable Lateral Raise',
    targetMuscle: 'الكتف الجانبي',
    movementPattern: 'lateral_raise',
    equipmentRequired: 'cable_crossover',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['db_lateral_raise', 'cable_face_pull'],
    formCues: {
      setup: 'اضبط الكابل على أدنى مستوى، قف جانباً وأمسك المقبض خلف ظهرك أو أمامك بيد واحدة.',
      tempo: 'ارفع يدك للجانب حتى توازي مستوى الكتف مع قيادة الحركة بالكوع والتحكم في النزول.',
      mistake: 'لا ترفع الذراع أعلى من مستوى الكتف لتجنب احتكاك أوتار الكتف، وتجنب هز الجذع.'
    }
  },
  {
    id: 'db_lateral_raise',
    nameAr: 'رفرفة جانبي بالدامبلز',
    nameEn: 'Dumbbell Lateral Raise',
    targetMuscle: 'الكتف الجانبي',
    movementPattern: 'lateral_raise',
    equipmentRequired: 'dumbbells_barbells',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['cable_lateral_raise', 'cable_face_pull'],
    formCues: {
      setup: 'قف بوقفة متوازنة مع ميلان بسيط جداً للأمام وثني خفيف في المرفقين.',
      tempo: 'ارفع الدامبلز للجانبين كأنك تصب إبريق ماء مع جعل الخنصر أعلى قليلاً من الإبهام.',
      mistake: 'لا تستخدم قوة الدفع بالركبتين والظهر لرفع وزن ثقيل؛ الكتف الجانبي يحتاج تركيزاً وعزلاً.'
    }
  },
  {
    id: 'db_rear_delt_fly',
    nameAr: 'رفرفة خلفي بالدامبلز على الدكة',
    nameEn: 'Dumbbell Rear Delt Fly',
    targetMuscle: 'الكتف الخلفي',
    movementPattern: 'lateral_raise',
    equipmentRequired: 'dumbbells_barbells',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['cable_face_pull', 'seated_cable_row_wide'],
    formCues: {
      setup: 'انحنِ للأمام بالجذع موازياً للأرض أو استلقِ بصدرك على دكة مائلة بزاوية 30 درجة.',
      tempo: 'افتح الدامبلز للجانبين مع توجيه الكوعين للأعلى وللخارج وعصر الكتف الخلفي.',
      mistake: 'لا تستخدم عضلات الترابيس لسحب الوزن؛ ركز فقط على الجزء الخلفي من الكتف.'
    }
  },

  // ==================== الأرجل (Legs) ====================
  {
    id: 'leg_press_45_compound',
    nameAr: 'ضغط رجل 45 درجة',
    nameEn: '45-Degree Leg Press',
    targetMuscle: 'عضلات الفخذ الأمامية والخلفية والمؤخرة',
    movementPattern: 'quad_dominant',
    equipmentRequired: 'leg_press_45',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSec: 120,
    isCompound: true,
    alternateExerciseIds: ['smith_squat', 'db_goblet_squat'],
    formCues: {
      setup: 'ضع قدميك في منتصف المنصة بعرض الكتفين مع تثبيت أسفل ظهرك وعصعصك بإحكام في المقعد.',
      tempo: 'انزل بالمنصة ببطء حتى تصبح زاوية الركبة 90 درجة ثم ادفع من كعبي القدمين.',
      mistake: 'احذر تماماً قفل مفصل الركبة في أعلى نقطة (Lockout)، ولا تدع ركبتيك تنضمان للداخل.'
    }
  },
  {
    id: 'smith_squat',
    nameAr: 'سكوات على جهاز السميث',
    nameEn: 'Smith Machine Squat',
    targetMuscle: 'الأفخاذ الأمامية والمؤخرة',
    movementPattern: 'quad_dominant',
    equipmentRequired: 'smith_machine',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRestSec: 120,
    isCompound: true,
    alternateExerciseIds: ['leg_press_45_compound', 'db_goblet_squat'],
    formCues: {
      setup: 'ضع البار على عضلات الترابيس (وليس الفقرات العظمية) وقدميك متقدمتين نصف خطوة للأمام.',
      tempo: 'اهبط بالحوض للأسفل وللخلف حتى يوازي فخذاك الأرض ثم ادفع للأعلى بثبات.',
      mistake: 'لا تدع الكعبين يرتفعان عن الأرض، وحافظ على صدرك مرفوعاً وعينيك للأمام.'
    }
  },
  {
    id: 'leg_extension_machine',
    nameAr: 'مد رجل أمامي على الجهاز',
    nameEn: 'Leg Extension Machine',
    targetMuscle: 'الفخذ الأمامي المعزول (الكوادس)',
    movementPattern: 'quad_dominant',
    equipmentRequired: 'leg_extension',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSec: 75,
    isCompound: false,
    alternateExerciseIds: ['leg_press_45_compound', 'smith_squat'],
    formCues: {
      setup: 'اضبط وسادة الساق لتكون فوق كاحلك مباشرة، واجعل محور دوران الركبة متطابقاً مع محور الجهاز.',
      tempo: 'ارفع الساقين للأعلى واعتصر الفخذ الأمامي بقوة لمدة ثانية في القمة، ثم انزل ببطء.',
      mistake: 'لا تستخدم قوة الدفع السريع أو رمي الوزن؛ تحكم في النزول لحماية أربطة الركبة.'
    }
  },
  {
    id: 'db_romanian_deadlift',
    nameAr: 'ديدلفت روماني بالدامبلز (RDL)',
    nameEn: 'Dumbbell Romanian Deadlift',
    targetMuscle: 'الفخذ الخلفي والمؤخرة وأسفل الظهر',
    movementPattern: 'hip_hinge',
    equipmentRequired: 'dumbbells_barbells',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['smith_rdl', 'leg_press_45_compound'],
    formCues: {
      setup: 'قف مستقيماً مع ثني خفيف جداً وثابت في الركبتين، وامسك الدامبلز ملامسة لفخذيك.',
      tempo: 'ادفع مؤخرتك للخلف كأنك تغلق باباً بها مع انزلاق الدامبلز بمحاذاة ساقيك حتى تشعر بإطالة الخلفيات.',
      mistake: 'لا تقوّس ظهرك نهائياً؛ الحركة حركة مفصل الحوض (Hinge) وليست انحناء للعمود الفقري.'
    }
  },
  {
    id: 'smith_rdl',
    nameAr: 'ديدلفت روماني على جهاز السميث',
    nameEn: 'Smith Machine Romanian Deadlift',
    targetMuscle: 'الفخذ الخلفي والمؤخرة',
    movementPattern: 'hip_hinge',
    equipmentRequired: 'smith_machine',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['db_romanian_deadlift', 'leg_press_45_compound'],
    formCues: {
      setup: 'قف ملاصقاً للبار مع تفريغ وزن الحوض للخلف وثبات الصدر مشدوداً للأعلى.',
      tempo: 'انزل بالبار حتى أسفل الركبة مباشرة مع الشعور بتمزق إيجابي في ألياف الخلفيات ثم اعصر المؤخرة للصعود.',
      mistake: 'لا تنزل بالبار لمستوى يجعلك تفقد استقامة الظهر، ولا تثنِ ركبتيك كسيم السكوات.'
    }
  },
  {
    id: 'smith_calf_raise',
    nameAr: 'رفع سمانة واقف على جهاز السميث',
    nameEn: 'Smith Machine Standing Calf Raise',
    targetMuscle: 'السمانة (البطات)',
    movementPattern: 'calves',
    equipmentRequired: 'smith_machine',
    defaultSets: 4,
    defaultReps: '15-20',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['leg_press_calf_raise', 'db_goblet_squat'],
    formCues: {
      setup: 'ضع مشطي قدميك على حافة لوح خشبي أو ديسك وزن والبار مستقر بأمان على كتفيك.',
      tempo: 'انزل بكعبيك لأسفل نقطة لإطالة كاملة ثم اصعد على أطراف أصابعك لأعلى مدى ممكن واثبت ثانية.',
      mistake: 'لا تنطط بكعبيك بسرعة؛ أوتار السمانة تمتص الصدمات لذلك تحتاج لثبات وتحكم بطيء.'
    }
  },
  {
    id: 'leg_press_calf_raise',
    nameAr: 'رفع سمانة على جهاز ضغط الرجل',
    nameEn: 'Leg Press Calf Press',
    targetMuscle: 'عضلات السمانة',
    movementPattern: 'calves',
    equipmentRequired: 'leg_press_45',
    defaultSets: 4,
    defaultReps: '15-20',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['smith_calf_raise'],
    formCues: {
      setup: 'ضع أطراف أصابع القدمين فقط على الحافة السفلية للمنصة مع فرد الساقين وثني طفيف بالركبة.',
      tempo: 'ادفع المنصة بأصابع قدميك ثم اهبط ببطء حتى تشعر بإطالة عضلة السمانة بالكامل.',
      mistake: 'لا تقفل ركبتيك وتترك قفل الأمان دون حماية لضمان سلامتك القصوى.'
    }
  },
  {
    id: 'db_goblet_squat',
    nameAr: 'سكوات جوبلت بالدامبل',
    nameEn: 'Dumbbell Goblet Squat',
    targetMuscle: 'الأفخاذ والبطن',
    movementPattern: 'quad_dominant',
    equipmentRequired: 'dumbbells_barbells',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRestSec: 75,
    isCompound: true,
    alternateExerciseIds: ['leg_press_45_compound', 'smith_squat'],
    formCues: {
      setup: 'امسك دامبل عمودياً بين يديك ملاصقاً لمنتصف الصدر وقف بوقفة سكوات مريحة.',
      tempo: 'اهبط بالحوض بين ركبتيك مع إبقاء كوعيك يلامسان داخل الفخذين ثم اصعد للأعلى بقوة.',
      mistake: 'لا تبعد الدامبل عن صدرك؛ قربه من مركز الجاذبية يحمي عمودك الفقري.'
    }
  },

  // ==================== الذراعين (Arms: Biceps & Triceps) ====================
  {
    id: 'cable_bicep_curl_rope',
    nameAr: 'تبادل بايسبس بالكابل بالحبل (Hammer)',
    nameEn: 'Cable Rope Bicep Hammer Curl',
    targetMuscle: 'البايسبس وعضلة البراكيلس (Brachialis)',
    movementPattern: 'bicep_curl',
    equipmentRequired: 'cable_crossover',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['db_incline_bicep_curl', 'cable_straight_bar_curl'],
    formCues: {
      setup: 'ثبت الحبل بأسفل الكابل، قف باستقامة مع إلصاق الكوعين تماماً بجانبي جسمك.',
      tempo: 'اسحب الحبل للأعلى وافرد طرفيه للخارج في قمة التكرار لتعظيم انقباض البايسبس.',
      mistake: 'لا تحرك كوعيك للأمام أو ترفع كتفيك؛ اعزل مفصل الكوع ليتحرك بمفرده.'
    }
  },
  {
    id: 'cable_straight_bar_curl',
    nameAr: 'مرجحة بايسبس بالبار المستقيم على الكابل',
    nameEn: 'Cable Straight Bar Bicep Curl',
    targetMuscle: 'رأسا البايسبس',
    movementPattern: 'bicep_curl',
    equipmentRequired: 'cable_crossover',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['cable_bicep_curl_rope', 'db_incline_bicep_curl'],
    formCues: {
      setup: 'أمسك البار بقبضة سفلية بعرض الكتفين والظهر مشدود ومستقيم.',
      tempo: 'ارفع البار للأعلى حتى أقصى انقباض واثبت لثانية، ثم انزل ببطء في 3 ثوانٍ.',
      mistake: 'لا تمِل للخلف لتوليد عزم حركة؛ ثبات الجذع يضمن نمو البايسبس الحقيقي.'
    }
  },
  {
    id: 'db_incline_bicep_curl',
    nameAr: 'مرجحة بايسبس مائل بالدامبلز (أقوى إطالة)',
    nameEn: 'Incline Dumbbell Curl',
    targetMuscle: 'الرأس الطويل للبايسبس',
    movementPattern: 'bicep_curl',
    equipmentRequired: 'dumbbells_barbells',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['cable_bicep_curl_rope', 'cable_straight_bar_curl'],
    formCues: {
      setup: 'اجلس على دكة مائلة بزاوية 45-60 درجة ودع ذراعيك تتدليان خلف جسمك للأسفل تماماً.',
      tempo: 'اثنِ ذراعيك للأعلى مع لف المعصم للخارج في القمة للوصول لأقصى تكوير للعضلة.',
      mistake: 'لا ترفع رأسك أو كتفيك عن مسند الدكة؛ دع العضلة تتمدد بالكامل.'
    }
  },
  {
    id: 'cable_tricep_pushdown_rope',
    nameAr: 'ضغط ترايسبس بالحبل على الكابل',
    nameEn: 'Cable Rope Tricep Pushdown',
    targetMuscle: 'الرأس الجانبي والخارجي للترايسبس',
    movementPattern: 'tricep_extension',
    equipmentRequired: 'cable_crossover',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['cable_overhead_tricep_extension', 'smith_close_grip_bench'],
    formCues: {
      setup: 'اضبط الكابل بأعلى نقطة، ثبت الكوعين بجانب الأضلاع مع ميلان خفيف جداً بالجذع.',
      tempo: 'ادفع الحبل لأسفل وافصل طرفيه بقوة بجانب فخذيك لثانية كاملة ثم ارجع حتى زاوية 90 درجة.',
      mistake: 'لا تدع كوعيك يرتفعان للأعلى أو يتحركان للأمام؛ الكوع يجب أن يكون مسماراً ثابتاً.'
    }
  },
  {
    id: 'cable_overhead_tricep_extension',
    nameAr: 'مد ترايسبس فوق الرأس بالحبل على الكابل',
    nameEn: 'Cable Overhead Tricep Extension',
    targetMuscle: 'الرأس الطويل للترايسبس (حجم الذراع الأكبر)',
    movementPattern: 'tricep_extension',
    equipmentRequired: 'cable_crossover',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['cable_tricep_pushdown_rope', 'smith_close_grip_bench'],
    formCues: {
      setup: 'اضبط الكابل على مستوى الكتف أو الصدر، استدر للأمام وامسك الحبل خلف رأسك في وضع اندفاع.',
      tempo: 'ادفع يديك للأمام وللأعلى مع تثبيت الكوعين بجانب الرأس واعتصار الترايسبس.',
      mistake: 'لا تفتح كوعيك للخارج بشكل مفرط؛ ابقِ المرفقين متجهين للأمام.'
    }
  },
  {
    id: 'smith_close_grip_bench',
    nameAr: 'ضغط بنش مسكة ضيقة على جهاز السميث',
    nameEn: 'Smith Machine Close Grip Bench Press',
    targetMuscle: 'عضلة الترايسبس مع الصدر الأوسط',
    movementPattern: 'tricep_extension',
    equipmentRequired: 'smith_machine',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSec: 90,
    isCompound: true,
    alternateExerciseIds: ['cable_tricep_pushdown_rope', 'cable_overhead_tricep_extension'],
    formCues: {
      setup: 'استلقِ على الدكة المستوية وامسك البار بمسافة مساوية لعرض الكتفين تماماً (لا تضيق أكثر).',
      tempo: 'انزل بالبار حتى أسفل الصدر مع إلصاق الكوعين بجانب الجذع وادفع بقوة الترايسبس.',
      mistake: 'لا تجعل قبضتك قريبة جداً (أقل من 20 سم) لتجنب التحميل الضار على معصم اليد.'
    }
  },

  // ==================== البطن والكور (Core) ====================
  {
    id: 'cable_kneeling_crunch',
    nameAr: 'طحن بطن على الكابل جالس على الركبتين',
    nameEn: 'Kneeling Cable Crunch',
    targetMuscle: 'عضلات البطن العلوية والمستقيمة',
    movementPattern: 'core',
    equipmentRequired: 'cable_crossover',
    defaultSets: 3,
    defaultReps: '15-20',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['bodyweight_plank'],
    formCues: {
      setup: 'اجلس على ركبتيك ممسكاً بالحبل بجانب أذنيك، مع تثبيت الوركين في مكان شبه ثابت.',
      tempo: 'اطحن بطنك مقرباً كوعيك باتجاه ركبتيك مع تقويس الظهر وعصر البطن بقوة.',
      mistake: 'لا تحرك مؤخرتك للخلف كأنك تجلس؛ الحركة يجب أن تكون طياً للعمود الفقري بعضلات البطن فقط.'
    }
  },
  {
    id: 'bodyweight_plank',
    nameAr: 'تمرين البلانك الثابت',
    nameEn: 'Plank Hold',
    targetMuscle: 'عضلات البطن العميقة والكور',
    movementPattern: 'core',
    equipmentRequired: 'bodyweight',
    defaultSets: 3,
    defaultReps: '45-60 ثانية',
    defaultRestSec: 60,
    isCompound: false,
    alternateExerciseIds: ['cable_kneeling_crunch'],
    formCues: {
      setup: 'استند على الساعدين وأطراف أصابع القدمين مع تشكيل خط مستقيم من الكعبين حتى الرأس.',
      tempo: 'شد عضلات البطن والمؤخرة بقوة وتنفس بانتظام وثبات طوال المدة المحددة.',
      mistake: 'لا تدع أسفل ظهرك يهبط للأسفل أو ترفع حوضك كالهرم في الهواء.'
    }
  }
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES_DATABASE.find(e => e.id === id);
}

export function getAvailableExercisesForEquipment(availableEquipmentIds: string[]): Exercise[] {
  return EXERCISES_DATABASE.filter(e => 
    availableEquipmentIds.includes(e.equipmentRequired) || e.equipmentRequired === 'bodyweight'
  );
}

export function getYoutubeSearchUrl(exerciseNameEn: string): string {
  const query = encodeURIComponent(`${exerciseNameEn} proper form tutorial`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

