import { PersonnelRecon, ProjectSummary } from '../types';

export interface UploadIssuePersonnel {
  stt: number;
  id: number; // matched ID in PERSONNEL_DATA
  name: string;
  uploadCount: number;
  uploadDurationSec: number;
  uploadDurationHours: number;
}

// 19 nhân sự bị dính lỗi 上传问题 (Upload issue) được tính là Valid
export const UPLOAD_ISSUE_RECON_ITEMS: UploadIssuePersonnel[] = [
  { stt: 1,  id: 19, name: 'NGUYỄN THẾ QUANG', uploadCount: 33, uploadDurationSec: 36022, uploadDurationHours: 10.01 },
  { stt: 2,  id: 8,  name: 'LÊ ANH MINH',      uploadCount: 26, uploadDurationSec: 36387, uploadDurationHours: 10.11 },
  { stt: 3,  id: 1,  name: 'BÙI ANH QUÂN',     uploadCount: 25, uploadDurationSec: 32585, uploadDurationHours: 9.05 },
  { stt: 4,  id: 26, name: 'VŨ HOÀNG NGUYÊN',  uploadCount: 22, uploadDurationSec: 32414, uploadDurationHours: 9.00 },
  { stt: 5,  id: 18, name: 'NGUYỄN THẾ HÂN',   uploadCount: 21, uploadDurationSec: 29820, uploadDurationHours: 8.28 },
  { stt: 6,  id: 22, name: 'PHẠM ANH DŨNG',    uploadCount: 20, uploadDurationSec: 31174, uploadDurationHours: 8.66 },
  { stt: 7,  id: 6,  name: 'KIỀU DUY HƯNG',    uploadCount: 20, uploadDurationSec: 28988, uploadDurationHours: 8.05 },
  { stt: 8,  id: 4,  name: 'ĐẶNG QUANG ANH',   uploadCount: 18, uploadDurationSec: 19088, uploadDurationHours: 5.30 },
  { stt: 9,  id: 25, name: 'PHẠM XUÂN VIỆT',   uploadCount: 13, uploadDurationSec: 21566, uploadDurationHours: 5.99 },
  { stt: 10, id: 9,  name: 'LÊ QUANG MINH',    uploadCount: 13, uploadDurationSec: 12692, uploadDurationHours: 3.53 },
  { stt: 11, id: 17, name: 'NGUYỄN QUỐC ĐẠT',  uploadCount: 12, uploadDurationSec: 21666, uploadDurationHours: 6.02 },
  { stt: 12, id: 5,  name: 'HOÀNG BẢO CHÂU',   uploadCount: 11, uploadDurationSec: 10359, uploadDurationHours: 2.88 },
  { stt: 13, id: 11, name: 'LƯU HỒNG SƠN',     uploadCount: 10, uploadDurationSec: 9773,  uploadDurationHours: 2.71 },
  { stt: 14, id: 10, name: 'LIỄU HẢI NAM',     uploadCount: 9,  uploadDurationSec: 16573, uploadDurationHours: 4.60 },
  { stt: 15, id: 14, name: 'NGUYỄN MINH HIẾU',  uploadCount: 9,  uploadDurationSec: 10680, uploadDurationHours: 2.97 },
  { stt: 16, id: 21, name: 'NÔNG HỮU THỊNH',   uploadCount: 7,  uploadDurationSec: 8391,  uploadDurationHours: 2.33 },
  { stt: 17, id: 27, name: 'VŨ NGỌC QUÝ',      uploadCount: 5,  uploadDurationSec: 8316,  uploadDurationHours: 2.31 },
  { stt: 18, id: 13, name: 'NGUYỄN MINH',      uploadCount: 5,  uploadDurationSec: 5377,  uploadDurationHours: 1.49 },
  { stt: 19, id: 15, name: 'NGUYỄN PHÚ NAM',   uploadCount: 1,  uploadDurationSec: 900,   uploadDurationHours: 0.25 },
];

export const UPLOAD_ISSUE_TOTALS = {
  personnelCount: 19,
  totalVideos: 280,
  totalDurationSec: 372771,
  totalDurationHours: 103.55,
};

// Map lookup by personnel name or ID
export const UPLOAD_ISSUE_MAP = new Map<number, UploadIssuePersonnel>(
  UPLOAD_ISSUE_RECON_ITEMS.map((item) => [item.id, item])
);

/**
 * Return personnel list updated when "上传问题" is counted as Valid
 */
export function getPersonnelWithUploadPolicy(
  baseList: PersonnelRecon[],
  includeUploadValid: boolean
): PersonnelRecon[] {
  if (!includeUploadValid) {
    return baseList;
  }

  const updated = baseList.map((p) => {
    const uploadItem = UPLOAD_ISSUE_MAP.get(p.id);
    if (!uploadItem) {
      return { ...p };
    }

    const passCount = p.passCount + uploadItem.uploadCount;
    const failCount = Math.max(0, p.failCount - uploadItem.uploadCount);
    const passDurationSec = p.passDurationSec + uploadItem.uploadDurationSec;
    const failDurationSec = Math.max(0, p.failDurationSec - uploadItem.uploadDurationSec);
    const passDurationHours = Number((passDurationSec / 3600).toFixed(2));
    const failDurationHours = Number((failDurationSec / 3600).toFixed(2));
    const passRatePercent = p.validCount > 0 ? Number(((passCount / p.validCount) * 100).toFixed(1)) : 0;
    const failRatePercent = p.validCount > 0 ? Number(((failCount / p.validCount) * 100).toFixed(1)) : 0;
    const passDurationPercent = p.totalOriginalDurationSec > 0
      ? Number(((passDurationSec / p.totalOriginalDurationSec) * 100).toFixed(1))
      : 0;

    return {
      ...p,
      passCount,
      failCount,
      passDurationSec,
      passDurationHours,
      failDurationSec,
      failDurationHours,
      passRatePercent,
      failRatePercent,
      passDurationPercent,
    };
  });

  // Re-rank based on updated passDurationSec
  const sorted = [...updated].sort((a, b) => b.passDurationSec - a.passDurationSec);
  sorted.forEach((item, index) => {
    item.rankPassHours = index + 1;
  });

  // Restore STT order
  return sorted.sort((a, b) => a.id - b.id);
}

/**
 * Return project summary updated when "上传问题" is counted as Valid
 */
export function getProjectSummaryWithUploadPolicy(
  baseSummary: ProjectSummary,
  includeUploadValid: boolean
): ProjectSummary {
  if (!includeUploadValid) {
    return baseSummary;
  }

  const addedSec = UPLOAD_ISSUE_TOTALS.totalDurationSec;
  const addedCount = UPLOAD_ISSUE_TOTALS.totalVideos;

  const totalValidPassDurationSec = baseSummary.totalValidPassDurationSec + addedSec;
  const totalValidPassDurationHours = Number((totalValidPassDurationSec / 3600).toFixed(2));
  const totalValidFailDurationSec = Math.max(0, baseSummary.totalValidFailDurationSec - addedSec);
  const totalValidFailDurationHours = Number((totalValidFailDurationSec / 3600).toFixed(2));

  const totalPassCount = 2298 + addedCount; // 2578
  const overallPassItemRate = Number(((totalPassCount / baseSummary.totalValidCount) * 100).toFixed(1));
  const overallPassDurationRate = baseSummary.totalValidDurationSec > 0
    ? Number(((totalValidPassDurationSec / baseSummary.totalValidDurationSec) * 100).toFixed(1))
    : 0;

  return {
    ...baseSummary,
    totalValidPassDurationSec,
    totalValidPassDurationHours,
    totalValidFailDurationSec,
    totalValidFailDurationHours,
    overallPassItemRate,
    overallPassDurationRate,
  };
}
