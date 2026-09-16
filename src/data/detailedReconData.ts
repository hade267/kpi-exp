import { DetailedVideoItem, ErrorStatItem } from '../types';
import { PERSONNEL_DATA } from './reconData';
import { UPLOAD_ISSUE_MAP } from './uploadIssueData';

export const TOP_ERROR_STATS: ErrorStatItem[] = [
  {
    code: 'water_duration',
    category: "Thủy thời lượng (水时长)",
    count: 557,
    percentage: 39.1,
    descVi: "Kéo dài thời gian giả tạo, ít cử động, câu giờ"
  },
  {
    code: 'wrong_scene',
    category: "Cảnh không khớp (场景不符)",
    count: 310,
    percentage: 21.7,
    descVi: "Sai phân loại kịch bản (ví dụ upload nhầm sang game/bán lẻ)"
  },
  {
    code: 'screen_incomplete',
    category: "Màn hình không đầy đủ (屏幕不全)",
    count: 149,
    percentage: 10.5,
    descVi: "Góc quay bị cắt khuất màn hình PC hoặc thiết bị"
  },
  {
    code: 'blurry_frames',
    category: "Mờ hình ảnh vượt chuẩn (模糊帧占比超标)",
    count: 80,
    percentage: 5.6,
    descVi: "Tỷ lệ khung hình mờ (Laplacian variance) vượt ngưỡng cho phép"
  },
  {
    code: 'screen_flicker',
    category: "Màn hình nhấp nháy / Phản quang (画面屏闪 / 反光)",
    count: 40,
    percentage: 2.8,
    descVi: "Đèn chói hoặc màn hình bị lóa phản chiếu khó nhìn"
  },
  {
    code: 'mechanical_repeat',
    category: "Thao tác lặp cơ học quá giờ (机械重复采集)",
    count: 35,
    percentage: 2.5,
    descVi: "Lặp lại một động tác cùng đạo cụ quá 15 - 30 phút"
  },
  {
    code: 'slow_motion',
    category: "Chuyển động chậm (动作缓慢)",
    count: 30,
    percentage: 2.1,
    descVi: "Tốc độ thao tác bất thường so với thực tế"
  },
  {
    code: 'no_hand_change',
    category: "Tay không đổi trạng thái (手部无明显动作变化)",
    count: 25,
    percentage: 1.8,
    descVi: "Tay để yên hoặc không có thao tác hợp lệ"
  },
  {
    code: 'hands_visibility',
    category: "Tỷ lệ hiển thị tay < 70% (双手可见率不足)",
    count: 20,
    percentage: 1.4,
    descVi: "Tay rời khỏi tầm nhìn camera quá thời lượng quy định"
  },
  {
    code: 'other_person_limbs',
    category: "Xuất hiện người khác (出现他人肢体 / 多余双臂)",
    count: 15,
    percentage: 1.1,
    descVi: "Lộ tay chân hoặc người khác lọt vào khung hình"
  },
  {
    code: 'just_reading',
    category: "Đọc sách / Xem tài liệu (看书)",
    count: 10,
    percentage: 0.7,
    descVi: "Chỉ đọc hoặc nhìn sách mà không thực hiện phân loại"
  },
  {
    code: 'missing_command',
    category: "Thiếu lệnh bắt đầu / kết thúc (未说开始/结束)",
    count: 10,
    percentage: 0.7,
    descVi: "Thiếu khẩu lệnh quy chuẩn khi thu video"
  },
  {
    code: 'file_corrupted',
    category: "Lỗi phát video cuối file / kỹ thuật (视频播放失败)",
    count: 142,
    percentage: 10.0,
    descVi: "Video hỏng cuối file, thời lượng < 5 phút, lỗi upload"
  },
  {
    code: 'upload_issue',
    category: "Lỗi tải lên hệ thống (上传问题) - Đã tính Valid",
    count: 280,
    percentage: 19.7,
    descVi: "Lỗi upload / tải lên hệ thống (đã phê duyệt tính Valid cho 19 nhân sự)"
  }
];

export interface ErrorDefinition {
  code: string;
  label: string;
  descVi: string;
  keywords: string[];
}

// Common error templates with Vietnamese translation and keywords for robust matching
export const ERROR_DEFINITIONS: ErrorDefinition[] = [
  { code: 'upload_issue', label: 'Lỗi tải lên (上传问题) - Đã tính Valid', descVi: 'Lỗi hệ thống tải lên (đã được phê duyệt tính Valid cho 19 nhân sự)', keywords: ['上传问题', 'lỗi tải lên', 'upload', 'upload issue', 'tải lên', 'lỗi upload'] },
  { code: 'water_duration', label: 'Thủy thời lượng (水时长)', descVi: 'Kéo dài thời gian giả tạo, ít cử động, câu giờ', keywords: ['水时长', 'thủy thời lượng', 'câu giờ'] },
  { code: 'wrong_scene', label: 'Cảnh không khớp (场景不符)', descVi: 'Sai kịch bản / tải nhầm phân loại công việc', keywords: ['场景不符', 'cảnh không khớp', 'sai kịch bản'] },
  { code: 'screen_incomplete', label: 'Màn hình không đầy đủ (屏幕不全)', descVi: 'Góc máy quay bị khuất / cắt mép màn hình', keywords: ['屏幕不全', 'màn hình không đầy đủ', 'khuất màn hình'] },
  { code: 'blurry_frames', label: 'Mờ hình ảnh vượt chuẩn (模糊帧占比超标)', descVi: 'Khung hình bị rung mờ, mất nét (Laplacian var thấp)', keywords: ['模糊帧', 'mờ hình ảnh', 'mờ vượt chuẩn', 'laplacian'] },
  { code: 'screen_flicker', label: 'Màn hình nhấp nháy / Phản quang (画面屏闪 / 反光)', descVi: 'Màn hình chói lóa, phản xạ ánh sáng đèn hoặc nhấp nháy tần số', keywords: ['屏闪', '反光', 'nhấp nháy', 'phản quang', 'chớp nháy'] },
  { code: 'mechanical_repeat', label: 'Thao tác lặp cơ học quá giờ (机械重复采集)', descVi: 'Lặp lại động tác cùng đạo cụ vượt quá giới hạn 15 - 30 phút', keywords: ['机械重复', 'lặp cơ học', 'lặp lại cơ học', 'lặp động tác'] },
  { code: 'slow_motion', label: 'Chuyển động chậm (动作缓慢)', descVi: 'Tốc độ thao tác bất thường so với thực tế công việc', keywords: ['动作缓慢', 'chuyển động chậm', 'chậm chạp'] },
  { code: 'no_hand_change', label: 'Tay không đổi trạng thái (手部无明显动作变化)', descVi: 'Tay giữ nguyên vị trí, không có biến đổi hành vi', keywords: ['手部无明显动作', 'tay không đổi', 'tay không cử động', 'tay để yên'] },
  { code: 'hands_visibility', label: 'Tỷ lệ hiển thị tay < 70% (双手可见率不足)', descVi: 'Bàn tay thao tác ra ngoài khung hình quá ngưỡng quy định', keywords: ['双手可见率', 'hiển thị tay', 'tầm nhìn camera', 'khuất tay'] },
  { code: 'other_person_limbs', label: 'Xuất hiện tay chân người khác (出现他人肢体)', descVi: 'Lọt tay, chân hoặc bóng dáng người thứ hai vào video', keywords: ['他人肢体', 'người khác', 'chân tay người khác', 'tay chân người khác'] },
  { code: 'just_reading', label: 'Đọc sách / Xem tài liệu (看书)', descVi: 'Chỉ ngồi đọc sách, không thực hiện thao tác phân loại', keywords: ['看书', 'đọc sách', 'tài liệu'] },
  { code: 'missing_command', label: 'Thiếu lệnh bắt đầu / kết thúc (未说开始/结束)', descVi: 'Không phát âm khẩu lệnh bắt đầu hoặc kết thúc theo quy trình', keywords: ['未说开始/结束', 'bắt đầu / kết thúc', 'bắt đầu/kết thúc', 'khẩu lệnh'] },
  { code: 'file_corrupted', label: 'Lỗi video không phát được cuối file (视频播放失败)', descVi: 'Lỗi mã hóa video hoặc tệp bị gián đoạn', keywords: ['视频播放失败', '播放不了', 'không phát được', 'cuối file', 'lỗi kỹ thuật', 'thời lượng bất thường'] },
];

export function detectErrorCode(reason?: string): string | undefined {
  if (!reason) return undefined;
  const lower = reason.toLowerCase();
  for (const def of ERROR_DEFINITIONS) {
    if (def.keywords.some((k) => lower.includes(k.toLowerCase()) || reason.includes(k))) {
      return def.code;
    }
  }
  return 'file_corrupted';
}

export function matchesError(item: DetailedVideoItem, errorFilter: string): boolean {
  if (errorFilter === 'all') return true;
  if (errorFilter === 'upload_issue') {
    return item.errorCode === 'upload_issue' || (item.errorReason?.includes('上传问题') ?? false);
  }
  if (item.status !== 'Fail' && item.errorCode !== 'upload_issue') return false;
  if (item.errorCode === errorFilter) return true;

  const def = ERROR_DEFINITIONS.find((d) => d.code === errorFilter || d.label.includes(errorFilter));
  if (def) {
    if (item.errorCode === def.code) return true;
    const text = `${item.errorCode || ''} ${item.errorReason || ''} ${item.errorCategory || ''}`.toLowerCase();
    return def.keywords.some((k) => text.includes(k.toLowerCase()) || (item.errorReason && item.errorReason.includes(k)));
  }

  const filterLower = errorFilter.toLowerCase();
  const reason = (item.errorReason || '').toLowerCase();
  const cat = (item.errorCategory || '').toLowerCase();
  return reason.includes(filterLower) || cat.includes(filterLower);
}

export const TASK_CATEGORIES = [
  { id: 'industry', name: 'Sản xuất - Đóng gói & Phân loại', prefix: 'Industry_PackLabel', taskCn: '生产类_包装' },
  { id: 'handmade', name: 'Thủ công - Lắp ráp mô hình', prefix: 'Handmade_ModelAssembly', taskCn: '手工类_手工制作' },
  { id: 'education_doc', name: 'Giáo dục - Quản lý sách & Dụng cụ', prefix: 'Education_BookDocumentManagement', taskCn: '教育类_图书/资料管理' },
  { id: 'education_art', name: 'Giáo dục - Thủ công & Mỹ thuật', prefix: 'Education_HandworkArt', taskCn: '教育类_手工/美术' },
  { id: 'education_cleanup', name: 'Giáo dục - Vệ sinh dọn lớp', prefix: 'Education_Post-classorganization', taskCn: '教育类_课后清洁归位' },
  { id: 'games_mobile', name: 'Trò chơi - Game Mobile & Thiết bị', prefix: 'Games_Mobile_gamesMobile_devices', taskCn: '游戏类_手游/移动端' },
  { id: 'games_pc', name: 'Trò chơi - Game PC & Console', prefix: 'Games_PCConsole_Games', taskCn: '游戏类_PC/主机端游' },
  { id: 'retail', name: 'Bán lẻ - Sắp xếp kệ hàng & Phân loại', prefix: 'Retail_Product_categorization_and_product_listing', taskCn: '零售类_理货上架' },
];

// Helper to format seconds to mm:ss
function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Deterministic pseudo-random number generator for stable data per person
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Known real sample items from QC logs directly provided by the lead auditor
const REAL_QC_SAMPLES: Record<string, Array<{ code: string; time: string; reason?: string; category: string }>> = {
  'Hưng': [
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00032', time: '00:30:24', reason: 'Không thể phát video ở cuối (视频到最后播放不了)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00033', time: '00:25:50', reason: 'Cảnh không khớp (phân loại lắp ráp) (场景不符（组装分类）)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00034', time: '00:30:15', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00035', time: '00:30:02', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00036', time: '00:30:05', reason: 'Tay không cử động / Cảnh không khớp (手部无明显动作变化)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00037', time: '00:30:07', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00038', time: '00:30:09', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00039', time: '00:30:55', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00040', time: '00:29:53', category: 'Sản xuất - Đóng gói' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00032', time: '00:25:05', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00033', time: '00:30:09', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00034', time: '00:30:21', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00035', time: '00:30:25', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00036', time: '00:30:17', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00037', time: '00:28:01', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00038', time: '00:30:43', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00039', time: '00:09:04', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00040', time: '00:28:03', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00041', time: '00:30:05', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00001', time: '00:30:07', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00002', time: '00:30:13', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00003', time: '00:31:29', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00004', time: '00:30:33', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00005', time: '00:30:19', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00006', time: '00:30:18', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00007', time: '00:29:53', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00008', time: '00:29:03', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00009', time: '00:27:11', category: 'Thủ công' },
  ],
  'Hân': [
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_0001', time: '00:27:04', reason: 'Cảnh không khớp (phân loại) (场景不符（分类）)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_0002', time: '00:30:03', reason: 'Cảnh không khớp (phân loại) (场景不符（分类）)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_0003', time: '00:24:26', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_0004', time: '00:27:54', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_0005', time: '00:30:16', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_0006', time: '00:29:29', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_0007', time: '00:26:42', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_0008', time: '00:29:40', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_0009', time: '00:29:30', category: 'Sản xuất - Đóng gói' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00022', time: '00:27:20', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00023', time: '00:27:10', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00024', time: '00:28:49', reason: 'Màn hình chớp nháy (画面屏闪)', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00025', time: '00:27:16', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00026', time: '00:29:48', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00027', time: '00:29:10', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00028', time: '00:29:38', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00029', time: '00:29:17', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00030', time: '00:27:43', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00031', time: '00:29:41', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00036', time: '00:29:39', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00037', time: '00:28:34', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00038', time: '00:27:03', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00039', time: '00:29:02', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00040', time: '00:28:32', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00041', time: '00:25:58', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00042', time: '00:28:56', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00043', time: '00:30:14', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00044', time: '00:29:19', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260711_Making_handicrafts_00045', time: '00:27:24', category: 'Thủ công' },
  ],
  'Việt Anh': [
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00100', time: '00:30:30', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00101', time: '00:30:08', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00102', time: '00:30:43', reason: 'Tay không có chuyển động rõ ràng (手部无明显动作变化)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00103', time: '00:25:41', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00104', time: '00:30:43', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00105', time: '00:30:17', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00106', time: '00:30:45', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00107', time: '00:30:49', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00108', time: '00:30:45', category: 'Sản xuất - Đóng gói' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00146', time: '00:32:12', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00147', time: '00:29:05', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00148', time: '00:28:32', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00149', time: '00:26:37', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00150', time: '00:30:02', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00151', time: '00:19:46', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00152', time: '00:17:44', reason: 'Xuất hiện chân tay người khác (出现他人肢体)', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00153', time: '00:26:45', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00154', time: '00:31:06', reason: 'Xuất hiện chân tay người khác (出现他人肢体)', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00155', time: '00:24:43', category: 'Thủ công' },
  ],
  'Dũng': [
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00019', time: '00:28:47', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00020', time: '00:27:46', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00021', time: '00:27:20', category: 'Sản xuất - Đóng gói' },
    { code: 'Handmade_ModelAssembly_20260709_Making_handicrafts_00109', time: '00:29:15', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260709_Making_handicrafts_00110', time: '00:27:17', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260709_Making_handicrafts_00111', time: '00:26:30', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260709_Making_handicrafts_00112', time: '00:28:59', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260709_Making_handicrafts_00113', time: '00:28:19', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260709_Making_handicrafts_00114', time: '00:28:32', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00001', time: '00:28:30', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00002', time: '00:27:44', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00003', time: '00:27:35', reason: 'Tay không cử động rõ ràng (手部无明显动作变化)', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00004', time: '00:25:28', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00005', time: '00:27:03', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00006', time: '00:29:14', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00007', time: '00:28:39', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00008', time: '00:28:44', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00009', time: '00:29:27', category: 'Thủ công' },
    { code: 'Handmade_ModelAssembly_20260710_Making_handicrafts_00010', time: '00:29:29', category: 'Thủ công' },
  ],
  'Đạt': [
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00022', time: '00:30:06', reason: 'Cảnh không khớp (phân loại) (场景不符（分类）)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00023', time: '00:30:07', reason: 'Cảnh không khớp (场景不符)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00024', time: '00:30:07', reason: 'Cảnh không khớp (phân loại) (场景不符（分类）)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00025', time: '00:30:07', reason: 'Chuyển động chậm, tay không cử động (手部无明显动作变化)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00026', time: '00:30:13', reason: 'Cảnh không khớp (phân loại) (场景不符（分类）)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00027', time: '00:30:03', reason: 'Cảnh không khớp (phân loại) (场景不符（分类）)', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00028', time: '00:30:06', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00029', time: '00:17:31', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00030', time: '00:27:18', category: 'Sản xuất - Đóng gói' },
    { code: 'Industry_PackLabel_20260709_sorting_and_packing_products_00031', time: '00:30:06', reason: 'Cảnh không khớp (场景不符)', category: 'Sản xuất - Đóng gói' },
  ]
};

// Generate complete list of detailed items for each person matching exactly their metrics
// Cumulative error weights for realistic distribution matching TOP_ERROR_STATS
const ERROR_CUMULATIVE_WEIGHTS = (() => {
  let total = 0;
  return TOP_ERROR_STATS.map((stat) => {
    total += stat.count;
    return { code: stat.code, cum: total };
  });
})();
const TOTAL_ERROR_WEIGHT = ERROR_CUMULATIVE_WEIGHTS[ERROR_CUMULATIVE_WEIGHTS.length - 1]?.cum || 1423;

function pickWeightedErrorDef(r: number): ErrorDefinition {
  const target = r * TOTAL_ERROR_WEIGHT;
  const found = ERROR_CUMULATIVE_WEIGHTS.find((entry) => entry.cum >= target) || ERROR_CUMULATIVE_WEIGHTS[0];
  return ERROR_DEFINITIONS.find((def) => def.code === found.code) || ERROR_DEFINITIONS[0];
}

// Trạng thái đối soát chi tiết: Đã xóa toàn bộ dữ liệu cũ và chuyển thành đang cập nhật lại
export const DETAILED_RECON_STATUS = {
  isUpdating: true,
  statusLabel: 'Đang cập nhật lại',
  description: 'Toàn bộ dữ liệu chi tiết đối soát từng bài đã được xóa khỏi hệ thống để chuẩn bị tích hợp tệp đối soát mới.',
  clearedRecordsCount: 0,
  updatedAt: '2026-09-16'
};

export function generatePersonnelItems(personnelId: number, includeUploadValid: boolean = true): DetailedVideoItem[] {
  // Toàn bộ dữ liệu đối soát chi tiết đã được xóa và chuyển sang trạng thái đang cập nhật lại
  return [];
  const person = PERSONNEL_DATA.find((p) => p.id === personnelId);
  if (!person) return [];

  const rng = seededRandom(person.id * 7919);
  const items: DetailedVideoItem[] = [];

  const uploadItem = UPLOAD_ISSUE_MAP.get(person.id);
  const uploadCount = uploadItem?.uploadCount || 0;
  const uploadDurationSec = uploadItem?.uploadDurationSec || 0;
  const avgUploadSec = uploadCount > 0 ? Math.floor(uploadDurationSec / uploadCount) : 0;
  const remainderUploadSec = uploadCount > 0 ? uploadDurationSec - avgUploadSec * uploadCount : 0;

  const aliasKey = Object.keys(REAL_QC_SAMPLES).find((k) => person.initialAlias.includes(k) || k === person.initialAlias);
  const realList = aliasKey ? REAL_QC_SAMPLES[aliasKey] : [];

  let passesCreated = 0;
  let failsCreated = 0;

  // 1. Add any real known records
  realList.forEach((sample, idx) => {
    const isFail = !!sample.reason;
    if (isFail && failsCreated >= person.failCount) return;
    if (!isFail && passesCreated >= person.passCount) return;

    const [mm, ss] = sample.time.split(':').map(Number);
    const sec = (mm || 0) * 60 + (ss || 0);
    const errorCode = isFail ? detectErrorCode(sample.reason) : undefined;

    items.push({
      id: `${person.id}-${idx + 1}`,
      personnelId: person.id,
      personnelName: person.name,
      alias: person.initialAlias.split(';')[0].trim(),
      date: sample.code.includes('202607') ? sample.code.match(/202607\d{2}/)?.[0] || '2026-07-15' : '2026-07-15',
      videoCode: sample.code,
      originalFile: `C3531325${person.id.toString().padStart(4, '0')}_${sample.code.slice(-10)}`,
      category: sample.category || 'Thủ công - Lắp ráp',
      durationSec: sec,
      durationFormatted: sample.time,
      status: isFail ? 'Fail' : 'Pass',
      errorCode,
      errorReason: sample.reason,
      errorCategory: isFail ? (sample.reason?.split('(')[0].trim() || 'Lỗi kiểm duyệt') : undefined
    });

    if (isFail) failsCreated++;
    else passesCreated++;
  });

  // 2. Generate remaining Pass records to match person.passCount
  const dates = [
    '2026-07-09', '2026-07-10', '2026-07-11', '2026-07-13', '2026-07-14',
    '2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18', '2026-07-20',
    '2026-07-21', '2026-07-22', '2026-07-23', '2026-07-24', '2026-07-25',
    '2026-07-26', '2026-07-27', '2026-07-28'
  ];

  while (passesCreated < person.passCount) {
    passesCreated++;
    const cat = TASK_CATEGORIES[Math.floor(rng() * TASK_CATEGORIES.length)];
    const date = dates[Math.floor(rng() * dates.length)];
    const num = Math.floor(rng() * 300 + 1).toString().padStart(5, '0');
    const sec = Math.floor(rng() * 400 + 1500); // 25m - 31m (avg 1700-1800s)

    items.push({
      id: `${person.id}-pass-${passesCreated}`,
      personnelId: person.id,
      personnelName: person.name,
      alias: person.initialAlias.split(';')[0].trim(),
      date,
      videoCode: `${cat.prefix}_${date.replace(/-/g, '')}_task_${num}`,
      originalFile: `C3531325${person.id.toString().padStart(4, '0')}_${date.replace(/-/g, '')}_${num.slice(-4)}`,
      category: cat.name,
      durationSec: sec,
      durationFormatted: formatTime(sec),
      status: 'Pass'
    });
  }

  // 3. Generate remaining Fail records to match person.failCount with realistic error definitions
  while (failsCreated < person.failCount) {
    failsCreated++;
    const cat = TASK_CATEGORIES[Math.floor(rng() * TASK_CATEGORIES.length)];
    const date = dates[Math.floor(rng() * dates.length)];
    const num = Math.floor(rng() * 300 + 1).toString().padStart(5, '0');

    // Check if this item is part of the approved upload issues for this personnel
    const isThisUploadIssue = failsCreated <= uploadCount;

    if (isThisUploadIssue) {
      const sec = avgUploadSec + (failsCreated === uploadCount ? remainderUploadSec : 0);
      items.push({
        id: `${person.id}-upload-${failsCreated}`,
        personnelId: person.id,
        personnelName: person.name,
        alias: person.initialAlias.split(';')[0].trim(),
        date,
        videoCode: `${cat.prefix}_${date.replace(/-/g, '')}_task_${num}`,
        originalFile: `C3531325${person.id.toString().padStart(4, '0')}_${date.replace(/-/g, '')}_${num.slice(-4)}`,
        category: cat.name,
        durationSec: sec,
        durationFormatted: formatTime(sec),
        status: includeUploadValid ? 'Pass' : 'Fail',
        errorCode: 'upload_issue',
        errorReason: includeUploadValid
          ? 'Lỗi tải lên (上传问题) - Đã được phê duyệt tính VALID vào giờ công'
          : 'Lỗi tải lên hệ thống (上传问题)',
        errorCategory: 'Lỗi tải lên (上传问题)'
      });
    } else {
      const sec = Math.floor(rng() * 450 + 1450);
      const errDef = pickWeightedErrorDef(rng());

      items.push({
        id: `${person.id}-fail-${failsCreated}`,
        personnelId: person.id,
        personnelName: person.name,
        alias: person.initialAlias.split(';')[0].trim(),
        date,
        videoCode: `${cat.prefix}_${date.replace(/-/g, '')}_task_${num}`,
        originalFile: `C3531325${person.id.toString().padStart(4, '0')}_${date.replace(/-/g, '')}_${num.slice(-4)}`,
        category: cat.name,
        durationSec: sec,
        durationFormatted: formatTime(sec),
        status: 'Fail',
        errorCode: errDef.code,
        errorReason: `${errDef.label} - ${errDef.descVi}`,
        errorCategory: errDef.label
      });
    }
  }

  // Sort items deterministically by date and ID
  return items.sort((a, b) => a.date.localeCompare(b.date) || a.videoCode.localeCompare(b.videoCode));
}

// Precomputed master datasets for quick global queries
let ALL_DETAILED_ITEMS_VALID: DetailedVideoItem[] | null = null;
let ALL_DETAILED_ITEMS_RAW: DetailedVideoItem[] | null = null;

export function getAllDetailedItems(includeUploadValid: boolean = true): DetailedVideoItem[] {
  // Toàn bộ dữ liệu đối soát chi tiết đã được xóa và chuyển sang trạng thái đang cập nhật lại
  return [];
}
