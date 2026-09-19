export interface NutellaRule {
  id: string;
  stageName: string;
  period: string;
  dayCount: number;
  fullWorkdayCondition: string;
  halfWorkdayCondition: string;
  zeroCondition: string;
  description: string;
  excelFormula: string;
}

export const NUTELLA_RULES: NutellaRule[] = [
  {
    id: 'gd1',
    stageName: 'Giai đoạn 1',
    period: '06/08/2026 – 15/08/2026',
    dayCount: 10,
    fullWorkdayCondition: 'Số giờ làm việc >= 5.0h',
    halfWorkdayCondition: 'Số giờ làm việc > 0 và < 5.0h',
    zeroCondition: 'Không phát sinh giờ (0h)',
    description: 'Định mức chuẩn 5 tiếng/ngày cho giai đoạn khởi động (06/08 – 15/08).',
    excelFormula: 'Nếu >= 5h thì 1.0 (full), nếu > 0 và < 5h thì 0.5 (nửa), ngược lại 0'
  },
  {
    id: 'gd2',
    stageName: 'Giai đoạn 2',
    period: '16/08/2026 – 22/08/2026',
    dayCount: 7,
    fullWorkdayCondition: 'Số giờ làm việc >= 10.0h',
    halfWorkdayCondition: 'Số giờ làm việc > 0 và < 10.0h',
    zeroCondition: 'Không phát sinh giờ (0h)',
    description: 'Điều chỉnh định mức từ 15 tiếng xuống 10 tiếng/ngày (16/08 – 22/08).',
    excelFormula: 'Nếu >= 10h thì 1.0 (full), nếu > 0 và < 10h thì 0.5 (nửa), ngược lại 0'
  },
  {
    id: 'gd3a',
    stageName: 'Giai đoạn 3A',
    period: '23/08/2026 – 25/08/2026',
    dayCount: 3,
    fullWorkdayCondition: 'Số giờ làm việc >= 20.0h',
    halfWorkdayCondition: 'Số giờ làm việc > 0 và < 20.0h',
    zeroCondition: 'Không phát sinh giờ (0h)',
    description: 'Định mức chuẩn 20 tiếng/ngày cho 3 ngày cao điểm 23, 24, 25/08.',
    excelFormula: 'Nếu >= 20h thì 1.0 (full), nếu > 0 và < 20h thì 0.5 (nửa), ngược lại 0'
  },
  {
    id: 'gd3b',
    stageName: 'Giai đoạn 3B',
    period: '26/08/2026 – 30/08/2026',
    dayCount: 5,
    fullWorkdayCondition: 'Số giờ làm việc >= 25.0h',
    halfWorkdayCondition: 'Số giờ làm việc > 0 và < 25.0h',
    zeroCondition: 'Không phát sinh giờ (0h)',
    description: 'Chiến dịch nước rút cuối tháng, nâng định mức full công lên 25 tiếng/ngày.',
    excelFormula: 'Nếu >= 25h thì 1.0 (full), nếu > 0 và < 25h thì 0.5 (nửa), ngược lại 0'
  }
];

export const NUTELLA_DATES = [
  '06/08', '07/08', '08/08', '09/08', '10/08', '11/08', '12/08', '13/08', '14/08', '15/08',
  '16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08',
  '23/08', '24/08', '25/08', '26/08', '27/08', '28/08', '29/08', '30/08'
] as const;

export type NutellaDateKey = typeof NUTELLA_DATES[number];

export interface LabelRawHoursItem {
  stt: number;
  department: string;
  name: string;
  dailyHours: Record<NutellaDateKey, number | null>;
  activeDaysCount: number;
  totalHours: number;
}

export interface LabelConvertedWorkdayItem {
  stt: number;
  department: string;
  name: string;
  dailyWorkdays: Record<NutellaDateKey, number | null>;
  workdaysGD1: number;
  workdaysGD2: number;
  workdaysGD3: number;
  totalWorkdays: number;
}

export interface QATimesheetItem {
  stt: number;
  department: string;
  name: string;
  username: string;
  profileName: string;
  dailyHours: Record<NutellaDateKey, number | null>;
  activeDaysCount: number;
  totalHours: number;
  dailyWorkdays: Record<NutellaDateKey, number | null>;
  workdaysGD1: number;
  workdaysGD2: number;
  workdaysGD3: number;
  totalWorkdays: number;
}

// BẢNG SỐ GIỜ LÀM VIỆC GỐC BỘ PHẬN SẢN XUẤT (LABEL / EP)
export const LABEL_RAW_HOURS_DATA: LabelRawHoursItem[] = [
  {
    stt: 1, department: 'Nhân sự Label', name: 'Cao Xuân Tú',
    dailyHours: {
      '06/08': 7.5, '07/08': 10.92, '08/08': 18.17, '09/08': null, '10/08': 20.85,
      '11/08': 11.45, '12/08': 4.40, '13/08': 6.35, '14/08': 11.54, '15/08': 20.19,
      '16/08': null, '17/08': null, '18/08': 19.32, '19/08': 16.85, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 27.30, '24/08': 26.50, '25/08': 20.76,
      '26/08': 41.39, '27/08': 49.69, '28/08': 26.39, '29/08': 32.97, '30/08': null
    },
    activeDaysCount: 18, totalHours: 372.53
  },
  {
    stt: 2, department: 'Nhân sự Label', name: 'DatNQ',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': 6.02,
      '11/08': 9.51, '12/08': 10.68, '13/08': 11.59, '14/08': null, '15/08': 21.32,
      '16/08': null, '17/08': 13.39, '18/08': 10.03, '19/08': 2.66, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 2.47, '24/08': 12.24, '25/08': 16.02,
      '26/08': 34.65, '27/08': 9.96, '28/08': 28.58, '29/08': null, '30/08': null
    },
    activeDaysCount: 14, totalHours: 189.13
  },
  {
    stt: 3, department: 'Nhân sự Label', name: 'Diệp Minh Đại',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': 5.10,
      '11/08': 1.76, '12/08': null, '13/08': 10.00, '14/08': null, '15/08': 10.58,
      '16/08': null, '17/08': 11.85, '18/08': 3.94, '19/08': 14.64, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 9.31, '24/08': null, '25/08': 21.03,
      '26/08': 33.77, '27/08': 56.57, '28/08': 40.04, '29/08': 30.99, '30/08': null
    },
    activeDaysCount: 13, totalHours: 249.56
  },
  {
    stt: 4, department: 'Nhân sự Label', name: 'Đỗ Văn Nguyên',
    dailyHours: {
      '06/08': 9.30, '07/08': 18.50, '08/08': 23.01, '09/08': null, '10/08': 7.19,
      '11/08': 8.70, '12/08': 12.10, '13/08': 13.92, '14/08': null, '15/08': 21.00,
      '16/08': null, '17/08': null, '18/08': 21.90, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': 10.40, '25/08': 2.74,
      '26/08': 10.52, '27/08': 20.19, '28/08': 20.29, '29/08': 16.45, '30/08': null
    },
    activeDaysCount: 15, totalHours: 216.20
  },
  {
    stt: 5, department: 'Nhân sự Label', name: 'Giang',
    dailyHours: {
      '06/08': 4.40, '07/08': 6.71, '08/08': null, '09/08': null, '10/08': 13.90,
      '11/08': 9.67, '12/08': 11.33, '13/08': 7.05, '14/08': 9.17, '15/08': 15.31,
      '16/08': null, '17/08': null, '18/08': 17.06, '19/08': 16.03, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': 20.75,
      '26/08': 28.42, '27/08': 37.20, '28/08': 25.68, '29/08': 26.03, '30/08': null
    },
    activeDaysCount: 15, totalHours: 248.71
  },
  {
    stt: 6, department: 'Nhân sự Label', name: 'Hoàng Bảo Châu',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': 11.42, '19/08': 9.40, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 19.76, '24/08': 16.65, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 4, totalHours: 57.23
  },
  {
    stt: 7, department: 'Nhân sự Label', name: 'Kiều Duy Hưng',
    dailyHours: {
      '06/08': null, '07/08': 2.51, '08/08': null, '09/08': null, '10/08': 5.93,
      '11/08': 8.88, '12/08': 12.44, '13/08': 8.29, '14/08': null, '15/08': 10.53,
      '16/08': null, '17/08': null, '18/08': 9.33, '19/08': 10.55, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 10.01, '24/08': 11.91, '25/08': 13.25,
      '26/08': null, '27/08': null, '28/08': 24.15, '29/08': null, '30/08': null
    },
    activeDaysCount: 12, totalHours: 127.79
  },
  {
    stt: 8, department: 'Nhân sự Label', name: 'Lê Quang Minh',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': 8.97, '19/08': 19.41, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 20.19, '24/08': 20.09, '25/08': 15.05,
      '26/08': 29.78, '27/08': 39.47, '28/08': 19.17, '29/08': 20.79, '30/08': null
    },
    activeDaysCount: 9, totalHours: 192.91
  },
  {
    stt: 9, department: 'Nhân sự Label', name: 'Liễu Hải Nam',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': 0.94,
      '11/08': 5.26, '12/08': 1.68, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': 1.36, '18/08': 11.94, '19/08': 6.96, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 18.47, '24/08': 1.00, '25/08': 11.59,
      '26/08': 38.73, '27/08': 12.13, '28/08': 23.40, '29/08': null, '30/08': null
    },
    activeDaysCount: 12, totalHours: 133.45
  },
  {
    stt: 10, department: 'Nhân sự Label', name: 'Nam',
    dailyHours: {
      '06/08': 3.20, '07/08': 5.00, '08/08': 8.11, '09/08': null, '10/08': 7.50,
      '11/08': 10.99, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 5, totalHours: 34.79
  },
  {
    stt: 11, department: 'Nhân sự Label', name: 'Nguyễn Thế Hân',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': 6.34, '19/08': 2.76, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 20.39, '24/08': 20.06, '25/08': 20.00,
      '26/08': 33.74, '27/08': 47.92, '28/08': 30.54, '29/08': 32.01, '30/08': null
    },
    activeDaysCount: 9, totalHours: 213.78
  },
  {
    stt: 12, department: 'Nhân sự Label', name: 'Nguyễn Thế Quang',
    dailyHours: {
      '06/08': 4.30, '07/08': 12.22, '08/08': 21.82, '09/08': null, '10/08': 27.99,
      '11/08': 7.89, '12/08': 15.19, '13/08': 12.92, '14/08': 10.46, '15/08': 28.02,
      '16/08': null, '17/08': null, '18/08': 14.87, '19/08': 21.57, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 29.04, '24/08': 25.89, '25/08': 24.11,
      '26/08': 38.49, '27/08': 6.95, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 16, totalHours: 301.72
  },
  {
    stt: 13, department: 'Nhân sự Label', name: 'Nguyễn Tuấn Anh',
    dailyHours: {
      '06/08': 4.50, '07/08': 15.86, '08/08': 15.76, '09/08': null, '10/08': 23.39,
      '11/08': 5.47, '12/08': 9.46, '13/08': 10.91, '14/08': 9.96, '15/08': 25.02,
      '16/08': null, '17/08': null, '18/08': 15.47, '19/08': 15.80, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 30.57, '24/08': 25.04, '25/08': 21.37,
      '26/08': 33.14, '27/08': 37.99, '28/08': 27.95, '29/08': 29.95, '30/08': null
    },
    activeDaysCount: 18, totalHours: 357.61
  },
  {
    stt: 14, department: 'Nhân sự Label', name: 'Nhật',
    dailyHours: {
      '06/08': null, '07/08': 1.50, '08/08': null, '09/08': null, '10/08': 2.14,
      '11/08': 1.98, '12/08': 6.48, '13/08': 2.53, '14/08': 2.92, '15/08': 1.64,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 7, totalHours: 19.20
  },
  {
    stt: 15, department: 'Nhân sự Label', name: 'Phạm Anh Dũng',
    dailyHours: {
      '06/08': 5.70, '07/08': null, '08/08': 12.01, '09/08': null, '10/08': 8.82,
      '11/08': 1.75, '12/08': 11.64, '13/08': 15.72, '14/08': 1.18, '15/08': 11.51,
      '16/08': null, '17/08': 39.76, '18/08': 12.80, '19/08': 8.93, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 29.96, '24/08': 26.38, '25/08': 28.63,
      '26/08': 36.30, '27/08': 42.35, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 16, totalHours: 293.44
  },
  {
    stt: 16, department: 'Nhân sự Label', name: 'Phạm Đạt',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': 2.19, '09/08': null, '10/08': 2.60,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 19.12, '24/08': 13.30, '25/08': 15.16,
      '26/08': 29.80, '27/08': 30.63, '28/08': 18.38, '29/08': 24.10, '30/08': null
    },
    activeDaysCount: 9, totalHours: 155.29
  },
  {
    stt: 17, department: 'Nhân sự Label', name: 'Phạm Thùy',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': 7.59,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 1, totalHours: 7.59
  },
  {
    stt: 18, department: 'Nhân sự Label', name: 'Phạm Xuân Việt',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': 5.98,
      '11/08': 4.42, '12/08': 10.98, '13/08': 10.73, '14/08': 7.66, '15/08': 16.82,
      '16/08': null, '17/08': 16.23, '18/08': 17.54, '19/08': 10.02, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 27.64, '24/08': 20.05, '25/08': 15.98,
      '26/08': 37.24, '27/08': 54.89, '28/08': 30.30, '29/08': 32.03, '30/08': null
    },
    activeDaysCount: 16, totalHours: 318.51
  },
  {
    stt: 19, department: 'Nhân sự Label', name: 'Quách Minh Chiến',
    dailyHours: {
      '06/08': 4.80, '07/08': 8.70, '08/08': null, '09/08': null, '10/08': null,
      '11/08': 8.96, '12/08': 12.42, '13/08': 6.11, '14/08': null, '15/08': 10.74,
      '16/08': null, '17/08': null, '18/08': 15.09, '19/08': 3.51, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 23.76, '24/08': 20.10, '25/08': 8.41,
      '26/08': 34.71, '27/08': 55.41, '28/08': 34.57, '29/08': 26.45, '30/08': null
    },
    activeDaysCount: 15, totalHours: 273.74
  },
  {
    stt: 20, department: 'Nhân sự Label', name: 'Quang Anh',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': 11.71, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 1, totalHours: 11.71
  },
  {
    stt: 21, department: 'Nhân sự Label', name: 'Quân',
    dailyHours: {
      '06/08': 4.00, '07/08': 2.30, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 2, totalHours: 6.30
  },
  {
    stt: 22, department: 'Nhân sự Label', name: 'Thi',
    dailyHours: {
      '06/08': 11.30, '07/08': 4.29, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 2, totalHours: 15.59
  },
  {
    stt: 23, department: 'Nhân sự Label', name: 'Thùy',
    dailyHours: {
      '06/08': null, '07/08': 11.07, '08/08': null, '09/08': null, '10/08': 2.54,
      '11/08': 5.47, '12/08': 8.47, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 4, totalHours: 27.55
  },
  {
    stt: 24, department: 'Nhân sự Label', name: 'Tuấn Vũ',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': 7.10, '09/08': null, '10/08': 24.60,
      '11/08': 13.24, '12/08': 20.64, '13/08': 15.59, '14/08': 5.90, '15/08': 24.16,
      '16/08': null, '17/08': null, '18/08': 25.03, '19/08': 22.82, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 29.98, '24/08': 24.99, '25/08': 9.27,
      '26/08': 39.79, '27/08': 37.89, '28/08': 40.13, '29/08': 13.32, '30/08': null
    },
    activeDaysCount: 16, totalHours: 354.45
  },
  {
    stt: 25, department: 'Nhân sự Label', name: 'Vũ Ngọc Dân',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': 6.75,
      '11/08': 4.01, '12/08': 9.60, '13/08': 8.86, '14/08': null, '15/08': 25.70,
      '16/08': null, '17/08': null, '18/08': null, '19/08': 13.25, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 22.51, '24/08': 17.03, '25/08': 11.39,
      '26/08': 20.42, '27/08': 42.66, '28/08': 24.22, '29/08': 25.03, '30/08': 7.93
    },
    activeDaysCount: 14, totalHours: 239.35
  },
  {
    stt: 26, department: 'Nhân sự Label', name: 'Yên',
    dailyHours: {
      '06/08': null, '07/08': 7.97, '08/08': 13.39, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    activeDaysCount: 2, totalHours: 21.35
  }
];

// BẢNG CÔNG QUY ĐỔI CHI TIẾT BỘ PHẬN SẢN XUẤT (LABEL / EP)
// 28 nhân sự (26 Label + 2 QA: Trịnh Xuân Thiện, Dương Văn Huy)
export const LABEL_CONVERTED_WORKDAYS_DATA: LabelConvertedWorkdayItem[] = [
  {
    stt: 1, department: 'Nhân sự Label', name: 'Cao Xuân Tú',
    dailyWorkdays: {
      '06/08': 1, '07/08': 1, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 0.5, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': null, '17/08': null, '18/08': 1, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': null
    },
    workdaysGD1: 8.5, workdaysGD2: 2, workdaysGD3: 7, totalWorkdays: 17.5
  },
  {
    stt: 2, department: 'Nhân sự Label', name: 'Nguyễn Quốc Đạt',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': null, '17/08': 1, '18/08': 1, '19/08': 0.5, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 0.5, '24/08': 0.5, '25/08': 0.5,
      '26/08': 1, '27/08': 0.5, '28/08': 1, '29/08': null, '30/08': null
    },
    workdaysGD1: 6, workdaysGD2: 2.5, workdaysGD3: 4, totalWorkdays: 12.5
  },
  {
    stt: 3, department: 'Nhân sự Label', name: 'Diệp Minh Đại',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': 1,
      '11/08': 0.5, '12/08': null, '13/08': 1, '14/08': null, '15/08': 1,
      '16/08': null, '17/08': 1, '18/08': 0.5, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 0.5, '24/08': null, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': null
    },
    workdaysGD1: 3.5, workdaysGD2: 2.5, workdaysGD3: 5.5, totalWorkdays: 11.5
  },
  {
    stt: 4, department: 'Nhân sự Label', name: 'Đỗ Văn Nguyên',
    dailyWorkdays: {
      '06/08': 1, '07/08': 1, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': null, '15/08': 1,
      '16/08': null, '17/08': null, '18/08': 1, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': 0.5, '25/08': 0.5,
      '26/08': 0.5, '27/08': 0.5, '28/08': 0.5, '29/08': 0.5, '30/08': null
    },
    workdaysGD1: 8, workdaysGD2: 1, workdaysGD3: 3, totalWorkdays: 12
  },
  {
    stt: 5, department: 'Nhân sự Label', name: 'Nguyễn Trường Giang',
    dailyWorkdays: {
      '06/08': 0.5, '07/08': 1, '08/08': null, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': null, '17/08': null, '18/08': 1, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': null
    },
    workdaysGD1: 7.5, workdaysGD2: 2, workdaysGD3: 5, totalWorkdays: 14.5
  },
  {
    stt: 6, department: 'Nhân sự Label', name: 'Hoàng Bảo Châu',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': 1, '19/08': 0.5, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 0.5, '24/08': 0.5, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    workdaysGD1: 0, workdaysGD2: 1.5, workdaysGD3: 1, totalWorkdays: 2.5
  },
  {
    stt: 7, department: 'Nhân sự Label', name: 'Kiều Duy Hưng',
    dailyWorkdays: {
      '06/08': null, '07/08': 0.5, '08/08': null, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': null, '15/08': 1,
      '16/08': null, '17/08': null, '18/08': 0.5, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 0.5, '24/08': 0.5, '25/08': 0.5,
      '26/08': null, '27/08': null, '28/08': 0.5, '29/08': null, '30/08': null
    },
    workdaysGD1: 5.5, workdaysGD2: 1.5, workdaysGD3: 2, totalWorkdays: 9
  },
  {
    stt: 8, department: 'Nhân sự Label', name: 'Lê Quang Minh',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': 0.5, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 0.5,
      '26/08': 1, '27/08': 1, '28/08': 0.5, '29/08': 0.5, '30/08': null
    },
    workdaysGD1: 0, workdaysGD2: 1.5, workdaysGD3: 5.5, totalWorkdays: 7
  },
  {
    stt: 9, department: 'Nhân sự Label', name: 'Liễu Hải Nam',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': 0.5,
      '11/08': 1, '12/08': 0.5, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': 0.5, '18/08': 1, '19/08': 0.5, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 0.5, '24/08': 0.5, '25/08': 0.5,
      '26/08': 1, '27/08': 0.5, '28/08': 0.5, '29/08': null, '30/08': null
    },
    workdaysGD1: 2, workdaysGD2: 2, workdaysGD3: 3.5, totalWorkdays: 7.5
  },
  {
    stt: 10, department: 'Nhân sự Label, QA', name: 'Nguyễn Phú Nam',
    dailyWorkdays: {
      '06/08': 0.5, '07/08': 1, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': 1, '17/08': 1, '18/08': 1, '19/08': 1, '20/08': 1,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': 1
    },
    workdaysGD1: 8.5, workdaysGD2: 5, workdaysGD3: 8, totalWorkdays: 21.5
  },
  {
    stt: 11, department: 'Nhân sự Label', name: 'Nguyễn Thế Hân',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': 0.5, '19/08': 0.5, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': null
    },
    workdaysGD1: 0, workdaysGD2: 1, workdaysGD3: 7, totalWorkdays: 8
  },
  {
    stt: 12, department: 'Nhân sự Label, QA', name: 'Nguyễn Thế Quang',
    dailyWorkdays: {
      '06/08': 0.5, '07/08': 1, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': null, '17/08': null, '18/08': 1, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 0.5, '29/08': null, '30/08': null
    },
    workdaysGD1: 8.5, workdaysGD2: 2, workdaysGD3: 5.5, totalWorkdays: 16
  },
  {
    stt: 13, department: 'Nhân sự Label', name: 'Nguyễn Tuấn Anh',
    dailyWorkdays: {
      '06/08': 0.5, '07/08': 1, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': null, '17/08': null, '18/08': 1, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': null
    },
    workdaysGD1: 8.5, workdaysGD2: 2, workdaysGD3: 7, totalWorkdays: 17.5
  },
  {
    stt: 14, department: 'Nhân sự Label', name: 'Đàm Long Nhật',
    dailyWorkdays: {
      '06/08': null, '07/08': 0.5, '08/08': null, '09/08': null, '10/08': 0.5,
      '11/08': 0.5, '12/08': 1, '13/08': 0.5, '14/08': 0.5, '15/08': 0.5,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    workdaysGD1: 4, workdaysGD2: 0, workdaysGD3: 0, totalWorkdays: 4
  },
  {
    stt: 15, department: 'Nhân sự Label, QA', name: 'Phạm Anh Dũng',
    dailyWorkdays: {
      '06/08': 1, '07/08': null, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 0.5, '12/08': 1, '13/08': 1, '14/08': 0.5, '15/08': 1,
      '16/08': null, '17/08': 1, '18/08': 1, '19/08': 0.5, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': 1
    },
    workdaysGD1: 7, workdaysGD2: 2.5, workdaysGD3: 8, totalWorkdays: 17.5
  },
  {
    stt: 16, department: 'Nhân sự Label, QA', name: 'Phạm Đạt',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': 0.5, '09/08': null, '10/08': 0.5,
      '11/08': null, '12/08': null, '13/08': null, '14/08': 1, '15/08': 1,
      '16/08': null, '17/08': 1, '18/08': 0.5, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 0.5, '24/08': 0.5, '25/08': 0.5,
      '26/08': 1, '27/08': 1, '28/08': 0.5, '29/08': 0.5, '30/08': null
    },
    workdaysGD1: 3, workdaysGD2: 2.5, workdaysGD3: 4.5, totalWorkdays: 10
  },
  {
    stt: 17, department: 'Nhân sự Label', name: 'Phạm Thùy',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': 1,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    workdaysGD1: 1, workdaysGD2: 0, workdaysGD3: 0, totalWorkdays: 1
  },
  {
    stt: 18, department: 'Nhân sự Label', name: 'Phạm Xuân Việt',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': 1,
      '11/08': 0.5, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': null, '17/08': 1, '18/08': 1, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 0.5,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': null
    },
    workdaysGD1: 5.5, workdaysGD2: 3, workdaysGD3: 6.5, totalWorkdays: 15
  },
  {
    stt: 19, department: 'Nhân sự Label', name: 'Quách Minh Chiến',
    dailyWorkdays: {
      '06/08': 0.5, '07/08': 1, '08/08': null, '09/08': null, '10/08': null,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': null, '15/08': 1,
      '16/08': null, '17/08': null, '18/08': 1, '19/08': 0.5, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 0.5,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': null
    },
    workdaysGD1: 5.5, workdaysGD2: 1.5, workdaysGD3: 6.5, totalWorkdays: 13.5
  },
  {
    stt: 20, department: 'Nhân sự Label', name: 'Quang Anh',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': 1, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    workdaysGD1: 0, workdaysGD2: 1, workdaysGD3: 0, totalWorkdays: 1
  },
  {
    stt: 21, department: 'Nhân sự Label', name: 'Quân',
    dailyWorkdays: {
      '06/08': 0.5, '07/08': 0.5, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    workdaysGD1: 1, workdaysGD2: 0, workdaysGD3: 0, totalWorkdays: 1
  },
  {
    stt: 22, department: 'Nhân sự Label', name: 'Thi',
    dailyWorkdays: {
      '06/08': 1, '07/08': 0.5, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    workdaysGD1: 1.5, workdaysGD2: 0, workdaysGD3: 0, totalWorkdays: 1.5
  },
  {
    stt: 23, department: 'Nhân sự Label', name: 'Thùy',
    dailyWorkdays: {
      '06/08': null, '07/08': 1, '08/08': null, '09/08': null, '10/08': 0.5,
      '11/08': 1, '12/08': 1, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    workdaysGD1: 3.5, workdaysGD2: 0, workdaysGD3: 0, totalWorkdays: 3.5
  },
  {
    stt: 24, department: 'Nhân sự Label', name: 'Tuấn Vũ',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': null, '17/08': null, '18/08': 1, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 0.5,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 0.5, '30/08': null
    },
    workdaysGD1: 7, workdaysGD2: 2, workdaysGD3: 6, totalWorkdays: 15
  },
  {
    stt: 25, department: 'Nhân sự Label', name: 'Vũ Ngọc Dân',
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': 1,
      '11/08': 0.5, '12/08': 1, '13/08': 1, '14/08': null, '15/08': 1,
      '16/08': null, '17/08': null, '18/08': null, '19/08': 1, '20/08': null,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 0.5, '25/08': 0.5,
      '26/08': 0.5, '27/08': 1, '28/08': 0.5, '29/08': 1, '30/08': 0.5
    },
    workdaysGD1: 4.5, workdaysGD2: 1, workdaysGD3: 5.5, totalWorkdays: 11
  },
  {
    stt: 26, department: 'Nhân sự Label', name: 'Yên',
    dailyWorkdays: {
      '06/08': null, '07/08': 1, '08/08': 1, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': null, '27/08': null, '28/08': null, '29/08': null, '30/08': null
    },
    workdaysGD1: 2, workdaysGD2: 0, workdaysGD3: 0, totalWorkdays: 2
  },
  {
    stt: 27, department: 'Nhân sự QA', name: 'Trịnh Xuân Thiện',
    dailyWorkdays: {
      '06/08': 1, '07/08': 1, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': 1, '17/08': 1, '18/08': 1, '19/08': 1, '20/08': 1,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': null, '30/08': 1
    },
    workdaysGD1: 9, workdaysGD2: 5, workdaysGD3: 7, totalWorkdays: 21
  },
  {
    stt: 28, department: 'Nhân sự QA', name: 'Dương Văn Huy',
    dailyWorkdays: {
      '06/08': 1, '07/08': 1, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': 1, '17/08': 1, '18/08': 1, '19/08': 1, '20/08': 1,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': 1
    },
    workdaysGD1: 9, workdaysGD2: 5, workdaysGD3: 8, totalWorkdays: 22
  }
];

// BẢNG CÔNG QUY ĐỔI & SỐ GIỜ HANDLED ĐỘI NGŨ QA THÁNG 08/2026
export const QA_TIMESHEET_DATA: QATimesheetItem[] = [
  {
    stt: 1, department: 'QA', name: 'Huy', username: 'huawenbang', profileName: 'tengce1',
    dailyHours: {
      '06/08': 30.5, '07/08': 33.4, '08/08': 50.4, '09/08': null, '10/08': 32.7,
      '11/08': 50.0, '12/08': 40.48, '13/08': 50.75, '14/08': 61.3, '15/08': 85.6,
      '16/08': 217.13, '17/08': 83.77, '18/08': 101.0, '19/08': 97.2, '20/08': 25.0,
      '21/08': null, '22/08': null, '23/08': 77.3, '24/08': 88.6, '25/08': 105.0,
      '26/08': 111.2, '27/08': 119.6, '28/08': 117.1, '29/08': 71.5, '30/08': 122.1
    },
    activeDaysCount: 22, totalHours: 1771.62,
    dailyWorkdays: {
      '06/08': 1, '07/08': 1, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': 1, '17/08': 1, '18/08': 1, '19/08': 1, '20/08': 1,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': 1
    },
    workdaysGD1: 9, workdaysGD2: 5, workdaysGD3: 8, totalWorkdays: 22
  },
  {
    stt: 2, department: 'QA', name: 'Thiện', username: 'anhngoc', profileName: 'tengce9',
    dailyHours: {
      '06/08': 64.0, '07/08': 51.9, '08/08': 53.3, '09/08': null, '10/08': 405.2,
      '11/08': 85.5, '12/08': 161.9, '13/08': 203.0, '14/08': 223.5, '15/08': 151.5,
      '16/08': 202.73, '17/08': 85.77, '18/08': 90.33, '19/08': 94.5, '20/08': 25.0,
      '21/08': null, '22/08': null, '23/08': 90.1, '24/08': 81.0, '25/08': 121.3,
      '26/08': 100.3, '27/08': 204.3, '28/08': 144.4, '29/08': null, '30/08': 196.3
    },
    activeDaysCount: 21, totalHours: 2835.83,
    dailyWorkdays: {
      '06/08': 1, '07/08': 1, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': 1, '12/08': 1, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': 1, '17/08': 1, '18/08': 1, '19/08': 1, '20/08': 1,
      '21/08': null, '22/08': null, '23/08': 1, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': null, '30/08': 1
    },
    workdaysGD1: 9, workdaysGD2: 5, workdaysGD3: 7, totalWorkdays: 21
  },
  {
    stt: 3, department: 'QA', name: 'ngocyen', username: 'ngocyen', profileName: 'tengce16',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': 26.0, '27/08': 100.2, '28/08': 100.3, '29/08': 92.1, '30/08': null
    },
    activeDaysCount: 4, totalHours: 318.60,
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': null,
      '16/08': null, '17/08': null, '18/08': null, '19/08': null, '20/08': null,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': null
    },
    workdaysGD1: 0, workdaysGD2: 0, workdaysGD3: 4, totalWorkdays: 4
  },
  {
    stt: 4, department: 'QA', name: 'Nam', username: 'nguyennam', profileName: 'tengce23',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': 40.48, '14/08': 50.75, '15/08': 36.3,
      '16/08': 83.1, '17/08': 604.0, '18/08': 251.3, '19/08': 263.5, '20/08': 189.0,
      '21/08': 43.3, '22/08': null, '23/08': null, '24/08': 83.2, '25/08': 81.2,
      '26/08': 128.2, '27/08': 102.8, '28/08': 201.8, '29/08': 110.4, '30/08': 55.6
    },
    activeDaysCount: 17, totalHours: 2419.13,
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': null, '09/08': null, '10/08': null,
      '11/08': null, '12/08': null, '13/08': 1, '14/08': 1, '15/08': 1,
      '16/08': 1, '17/08': 1, '18/08': 1, '19/08': 1, '20/08': 1,
      '21/08': 1, '22/08': null, '23/08': null, '24/08': 1, '25/08': 1,
      '26/08': 1, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': 1
    },
    workdaysGD1: 4, workdaysGD2: 5, workdaysGD3: 8, totalWorkdays: 17
  },
  {
    stt: 5, department: 'QA', name: 'datpham', username: 'datpham', profileName: 'tengce24',
    dailyHours: {
      '06/08': null, '07/08': null, '08/08': 27.5, '09/08': null, '10/08': 32.5,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': 25.6,
      '16/08': 50.4, '17/08': null, '18/08': 20.0, '19/08': 10.0, '20/08': 20.0,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': 3.4, '27/08': 52.8, '28/08': 109.1, '29/08': 56.5, '30/08': 47.4
    },
    activeDaysCount: 13, totalHours: 546.40,
    dailyWorkdays: {
      '06/08': null, '07/08': null, '08/08': 1, '09/08': null, '10/08': 1,
      '11/08': null, '12/08': null, '13/08': null, '14/08': null, '15/08': 1,
      '16/08': 1, '17/08': null, '18/08': 1, '19/08': 0.5, '20/08': 1,
      '21/08': null, '22/08': null, '23/08': null, '24/08': null, '25/08': null,
      '26/08': 0.5, '27/08': 1, '28/08': 1, '29/08': 1, '30/08': 1
    },
    workdaysGD1: 4, workdaysGD2: 2.5, workdaysGD3: 5.5, totalWorkdays: 12
  }
];

export const NUTELLA_TIMESHEET_SUMMARY = {
  totalPersonnelLabel: 26,
  totalPersonnelConverted: 28,
  totalPersonnelQA: 5,
  totalLabelRawHours: 4439.47,
  totalLabelActivePersonDays: 265,
  totalConvertedLabelWorkdays: 253,
  workdaysGD1Total: 112.0,
  workdaysGD2Total: 40.0,
  workdaysGD3Total: 101.0,
  totalQARawHours: 7891.58,
  totalQAWorkdays: 76.0,
  qaWorkdaysGD1: 26.0,
  qaWorkdaysGD2: 17.5,
  qaWorkdaysGD3: 32.5,
  unitRateNutella: 166000,
  consolidatedWorkdaysNutellaTotal: 291.5,
  consolidatedSalaryNutellaTotal: 48389000
};

// ==========================================
// BẢNG BÁO CÁO ĐỐI SOÁT EP & LƯƠNG TỰ GHI (26 NHÂN SỰ)
// ==========================================
export interface NutellaEpReportItem {
  stt: number;
  name: string;
  epCount: number; // EP trong báo cáo
  totalDurationSeconds: number; // Tổng thời lượng (giây)
  totalDurationHours: number; // Tổng giờ tự ghi (h)
  epZeroDurationCount: number; // EP không tính thời gian
  salary: number; // Lương (VNĐ)
}

export const NUTELLA_EP_REPORT_DATA: NutellaEpReportItem[] = [
  { stt: 1, name: 'Cao Xuân Tú', epCount: 862, totalDurationSeconds: 1083228.72, totalDurationHours: 300.897, epZeroDurationCount: 0, salary: 2106278 },
  { stt: 2, name: 'DatNQ', epCount: 207, totalDurationSeconds: 308394.15, totalDurationHours: 85.665, epZeroDurationCount: 0, salary: 599655 },
  { stt: 3, name: 'Diệp Minh Đại', epCount: 601, totalDurationSeconds: 717662.69, totalDurationHours: 199.351, epZeroDurationCount: 1, salary: 1395455 },
  { stt: 4, name: 'Đỗ Văn Nguyên', epCount: 436, totalDurationSeconds: 450763.39, totalDurationHours: 125.212, epZeroDurationCount: 0, salary: 876484 },
  { stt: 5, name: 'Giang', epCount: 611, totalDurationSeconds: 724994.31, totalDurationHours: 201.387, epZeroDurationCount: 0, salary: 1409711 },
  { stt: 6, name: 'Hoàng Bảo Châu', epCount: 193, totalDurationSeconds: 169838.31, totalDurationHours: 47.177, epZeroDurationCount: 0, salary: 330241 },
  { stt: 7, name: 'Kiều Duy Hưng', epCount: 397, totalDurationSeconds: 379222.08, totalDurationHours: 105.339, epZeroDurationCount: 0, salary: 737376 },
  { stt: 8, name: 'Lê Quang Minh', epCount: 489, totalDurationSeconds: 572462.15, totalDurationHours: 159.017, epZeroDurationCount: 0, salary: 1113121 },
  { stt: 9, name: 'Liễu Hải Nam', epCount: 314, totalDurationSeconds: 397448.31, totalDurationHours: 110.402, epZeroDurationCount: 0, salary: 772816 },
  { stt: 10, name: 'Nam', epCount: 94, totalDurationSeconds: 69011.13, totalDurationHours: 19.17, epZeroDurationCount: 0, salary: 134188 },
  { stt: 11, name: 'Nguyễn Thế Hân', epCount: 522, totalDurationSeconds: 633416.07, totalDurationHours: 175.949, epZeroDurationCount: 0, salary: 1231642 },
  { stt: 12, name: 'Nguyễn Thế Quang', epCount: 864, totalDurationSeconds: 883089.27, totalDurationHours: 245.303, epZeroDurationCount: 0, salary: 1717118 },
  { stt: 13, name: 'Nguyễn Tuấn Anh', epCount: 949, totalDurationSeconds: 1049243.35, totalDurationHours: 291.456, epZeroDurationCount: 1, salary: 2040195 },
  { stt: 14, name: 'Nhật', epCount: 72, totalDurationSeconds: 56962.40, totalDurationHours: 15.823, epZeroDurationCount: 0, salary: 110760 },
  { stt: 15, name: 'Phạm Anh Dũng', epCount: 635, totalDurationSeconds: 853858.28, totalDurationHours: 237.183, epZeroDurationCount: 0, salary: 1660280 },
  { stt: 16, name: 'Phạm Đạt', epCount: 601, totalDurationSeconds: 585393.73, totalDurationHours: 162.609, epZeroDurationCount: 10, salary: 1138266 },
  { stt: 17, name: 'Phạm Thùy', epCount: 29, totalDurationSeconds: 22517.13, totalDurationHours: 6.255, epZeroDurationCount: 0, salary: 43783 },
  { stt: 18, name: 'Phạm Xuân Việt', epCount: 948, totalDurationSeconds: 946474.63, totalDurationHours: 262.91, epZeroDurationCount: 0, salary: 1840367 },
  { stt: 19, name: 'Quách Minh Chiến', epCount: 714, totalDurationSeconds: 786082.12, totalDurationHours: 218.356, epZeroDurationCount: 2, salary: 1528493 },
  { stt: 20, name: 'Quang Anh', epCount: 34, totalDurationSeconds: 34747.58, totalDurationHours: 9.652, epZeroDurationCount: 0, salary: 67565 },
  { stt: 21, name: 'Quân', epCount: 10, totalDurationSeconds: 6827.69, totalDurationHours: 1.897, epZeroDurationCount: 0, salary: 13276 },
  { stt: 22, name: 'Thi', epCount: 17, totalDurationSeconds: 12722.59, totalDurationHours: 3.534, epZeroDurationCount: 0, salary: 24738 },
  { stt: 23, name: 'Thùy', epCount: 97, totalDurationSeconds: 81744.81, totalDurationHours: 22.707, epZeroDurationCount: 0, salary: 158948 },
  { stt: 24, name: 'Tuấn Vũ', epCount: 935, totalDurationSeconds: 1051816.68, totalDurationHours: 292.171, epZeroDurationCount: 0, salary: 2045199 },
  { stt: 25, name: 'Vũ Ngọc Dân', epCount: 603, totalDurationSeconds: 710263.51, totalDurationHours: 197.295, epZeroDurationCount: 0, salary: 1381068 },
  { stt: 26, name: 'Yên', epCount: 82, totalDurationSeconds: 63361.01, totalDurationHours: 17.6, epZeroDurationCount: 0, salary: 123202 }
];

export const NUTELLA_EP_REPORT_TOTALS = {
  personnelCount: 26,
  totalEpCount: 11319,
  totalDurationSeconds: 12651546.07,
  totalDurationHoursExact: 3514.318354,
  totalDurationHoursDisplay: 3514.32,
  totalEpZeroDurationCount: 14,
  totalSalary: 24600228,
  hourlyRate: 7000
};

