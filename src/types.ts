export interface PersonnelRecon {
  id: number; // STT
  name: string; // Họ và tên nhân sự
  initialAlias: string; // Tên tự ghi ban đầu
  sheetName: string; // Tên Sheet chi tiết
  selfRecordedCount: number; // Bài tự ghi
  validCount: number; // Bài hợp lệ tính công
  duplicateCount: number; // Trùng lặp (không tính)
  notFoundInOriginalCount: number; // Chưa có gốc (không tính)
  passCount: number; // Bài Pass (Đạt)
  passRatePercent: number; // Tỷ lệ Pass (%)
  failCount: number; // Bài Fail (Lỗi)
  failRatePercent: number; // Tỷ lệ Fail (%)
  totalOriginalDurationSec: number; // Tổng TG gốc tính công (s)
  passDurationSec: number; // TG Pass tính công (s)
  passDurationHours: number; // TG Pass tính công (h)
  failDurationSec: number; // TG Fail (s)
  failDurationHours: number; // TG Fail (h)
  passDurationPercent: number; // % TG Pass
  rankPassHours: number; // Hạng theo Giờ Pass tính công (1 - 27)
  rankPassRate?: number | null; // Hạng theo % Pass bài (tham chiếu cũ)
}

export interface ProjectSummary {
  totalOriginalRowsSheet1: number;
  totalOriginalDurationSec: number;
  totalOriginalDurationHours: number;
  totalSuccessDurationSec: number;
  totalSuccessDurationHours: number;
  totalFailDurationSec: number;
  totalFailDurationHours: number;
  totalSelfRecordedRows: number;
  totalValidCount: number;
  totalDuplicateCount: number;
  totalNotFoundInOriginal: number;
  unclaimedOriginalCount: number;
  totalValidDurationSec: number;
  totalValidDurationHours: number;
  totalValidPassDurationSec: number;
  totalValidPassDurationHours: number;
  totalValidFailDurationSec: number;
  totalValidFailDurationHours: number;
  overallPassItemRate: number;
  overallPassDurationRate: number;
}

export interface BridgeReconItem {
  category: string;
  originalSec: number;
  originalHours: number;
  unclaimedSec: number;
  unclaimedHours: number;
  validSec: number;
  validHours: number;
  explanation: string;
}

export interface UnclaimedOriginalItem {
  code: string;
  name: string;
  status: 'Pass' | 'Fail';
  durationSec: number;
  durationHours: number;
  note: string;
}

export interface DetailedVideoItem {
  id: string; // Unique ID or video code
  personnelId: number; // Personnel STT (1-27)
  personnelName: string; // Full name
  alias: string; // Initial alias
  date: string; // Submission date
  videoCode: string; // Code (e.g. Industry_PackLabel...)
  originalFile?: string; // Master file code (e.g. C3531...)
  category: string; // Vietnamese category label
  durationSec: number; // Seconds
  durationFormatted: string; // mm:ss
  status: 'Pass' | 'Fail';
  errorCode?: string; // Standard error code (e.g. water_duration)
  errorReason?: string; // Reason description
  errorCategory?: string; // Grouped reason category
}

export interface ErrorStatItem {
  code?: string;
  category: string;
  count: number;
  percentage: number;
  descVi: string;
}
