export enum PagesEnums {
  URL='http://ims.aswan.gov.eg/api',
  // URL = 'http://192.168.1.23/api',
  
  /*************MODULES***************/
  STORES='Store',
  ROLES='IT',
  ACCOUNTS = 'Accounts',
  HR='HR',
  ATTENDANDCE='Attendance',
  PY='PY',
  TR='TR',
  

  /*************USER_ROLES***************/
  /****************** module:1 STORES المخازن ************************/
  
  WITHDRAW = 'اذن صرف',
  STRAdd = 'اذن اضافة',
  STR_OPENING_STOCK = 'الافتتاحية',
  EMPLOYEE_OPENING ='نقل عهده',
  EMPLOYEE_OPENING_CUSTODY ='افتتاحي لعهد',
  COMMODITY ='السلعة',
  GRADE = 'النوعية',
  STR_PLATOON = 'الفصيلة',
  GROUP1 = 'المجموعة',
  UNIT = 'الوحدة',
  ITEMES1 = 'الاصناف',
  PRODUCTS = 'المنتجات',
  STORE = 'المخازن',
  COST_CENTER = 'مركز التكلفة',
  STR_VENDOR = 'المصنع',
  MODEL = 'الموديلات',
  STORES_ACCOUNTS = 'حسابات المخازن',
  PRODUCT_SERIAL='مسلسل المنتج',
 STRUSERSTORE ='مخازن المستخدم',
 StrStockTaking='الجرد',
 /****************** module:2 Roles الصلاحيات************************/
  PR_USER = 'المستخدمين',
  PR_GROUP = 'مجموعات المستخدمين',
   /****************** module:3 ACCOUNTS الحسابات************************/
  ADD_ACCOUNT='الحسابات',
  AccountHierarchy=24,
  FiAccountItem='البنود الاحصائية',
  AccountParent=26,
  FIJournal='اليوميات',
  EntrySource ='مصدر الدخل',
  EntrySourceType='نوع مصدر الدخل',
  FI_ENTRY='القيود',
   /****************** module:4 HR شئون العاملين************************/
HR_JOB_TITLE='المسمى الوظيفى',
HR_INCENTIVE='الحوافز',
HR_HIRING_TYPE='توع التوظيف',
SeveranceReason ='نهاية العمل',
HR_MILLIIRY_STATE='الموقف من التجنيد',
CITY='المحافظات',
CITY_STATE='المراكز',
QUALIFICATION='المؤهلات',
QUALIATIVE_GROUP ='المجموعات النوعية',
WorkPlace='أماكن العمل',
specialization='التخصصات',
HR_POSTION='الوظائف',
hr_Disciplinary='الجزاءات',
HR_VACATION ='الاجازات',
HR_employeeVacationBalance='رصيد الاجازات',
HR_Employee_VACATION='اجازات الموظفين',
HR_Employee_Disciplinary='الدرجات الوظيفية',
HR_financialDegree='الدرجات المالية',
HR_employeeFinancialDegree ='درجات الموظف المالية',
HR_employee_position='وظائف الموظف',
HR_employeeAppraisal ='تقييم الموظفين',
HR_employee='الموظفين',
Employee_qualifications='مؤهلات الوظف',
Qualification_level='الدرجة العلمية',
  /****************** module:5 Attendance  الحضور والانصراف************************/

  hr_AttendancePermission='نوع الإذن',
  hr_attendanceSchedule='الورديات',
  hr_attendanceMachine='أجهزة البصمة',
  hr_attendanceMachineWorkPlace='أماكن أجهزة البصمة',
  hr_employeeAttendanceSchedule='ورديات الموظفين',
  hr_EmployeeAttendancePermission='أذونات الموظفين',
  hr_EmployeeAttendance='الحضور والإنصراف',

/****************** module:6 Py الرواتب************************/
  PyInstallment='الأقساط',
  PyItem='بنود الأجور',
  PyItemGroup='مجموعات الأجور',
  PyItemCategory='تصنيفات بنود الاجور',
  pytaxbracket='الوعاء الضريبي',


  /****************** module:7 Cc التكاليف************************/
  CcActivity='النشاط',
  CcFunction='الوظيفي',
  CcPlant='المحطة',
  CcRegion='المنطقة',
  CcSubRegion='المنطقة الفرعية',
  CcSource='المصدر',
  CcPlantComponent='تحليل المنطقة',
  CcEquipment='المعدات',
  Cccostcenter='مركزالتكاليف',
  CcEntry='القيود',
  CcReports='تقارير التكاليف',

   /****************** module:8 FA الاصول الثابتة  ************************/
   FaCategoryFirst='تصنيف اول',
   FaCategorySecond='تصنيف ثاني',
   FaCategoryThird='تصنيف ثالث',
   FaFixedAsset='الإصول الثابتة ',
   FaSGGubRegion='حركة الإصول',
   FaReports='تقارير الإصول',
}
