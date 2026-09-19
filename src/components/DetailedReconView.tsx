import React from 'react';
import {
  Clock,
  RefreshCw,
  Wallet,
  UserCheck,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  Database,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  FolderOpen,
  ExternalLink
} from 'lucide-react';
import { CONSOLIDATED_SALARY_TOTALS } from '../data/salaryConsolidatedData';
import { formatCurrencyVND } from '../utils/formatters';
import { DRIVE_LINKS } from '../data/driveLinks';

interface DetailedReconViewProps {
  initialPersonnelId?: number | null;
  onSelectPerson?: (id: number) => void;
  onSwitchSection?: (section: 'ego_inspection' | 'consolidated_salary') => void;
  onSwitchTab?: (tab: 'lookup' | 'table' | 'detailed' | 'analytics') => void;
}

export const DetailedReconView: React.FC<DetailedReconViewProps> = ({
  onSwitchSection,
  onSwitchTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Prominent Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 rounded-2xl p-5 sm:p-6 border border-amber-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-600 flex-shrink-0 shadow-2xs">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-600 [animation-duration:8s]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Đối Soát Chi Tiết Từng Video
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Đang Cập Nhật Lại
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                Toàn bộ dữ liệu đối soát chi tiết từng bài (4.213 video) đã được xóa bỏ khỏi hệ thống theo yêu cầu quản trị.
                Bộ phận dữ liệu đang tiến hành rà soát, đồng bộ và chuẩn bị cập nhật lại bộ tệp đối soát mới chính thức.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0 flex-wrap">
            <a
              id="btn-detailed-drive-ego"
              href={DRIVE_LINKS.egoInspection}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Mở thư mục Google Drive chứa hồ sơ đối soát EGO"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Hồ Sơ Đối Soát EGO (Drive)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {onSwitchSection && (
              <button
                id="btn-switch-to-salary-from-detailed"
                type="button"
                onClick={() => onSwitchSection('consolidated_salary')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Xem Bảng Lương Tổng Hợp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Trạng thái đối soát */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-amber-800">
            <span>Trạng Thái Đối Soát</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Đang Cập Nhật Lại</span>
          </div>
          <p className="text-2xs text-slate-500">
            Hệ thống đã dọn sạch toàn bộ dữ liệu video cũ để chuẩn bị nạp tệp mới.
          </p>
        </div>

        {/* Card 2: Số bản ghi chi tiết */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-slate-500">
            <span>Bản Ghi Chi Tiết Video</span>
            <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100">
              <Database className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-mono font-black text-slate-900">
            0 / 0 video
          </div>
          <p className="text-2xs text-slate-500">
            Đã xóa 100% dữ liệu chi tiết cũ; đang chờ tệp đối soát mới.
          </p>
        </div>

        {/* Card 3: Dữ liệu khả dụng */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-emerald-800">
            <span>Dữ Liệu Lương Khả Dụng</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-mono font-black text-emerald-700">
            {formatCurrencyVND(CONSOLIDATED_SALARY_TOTALS.grandTotalSalary)}
          </div>
          <p className="text-2xs text-slate-500">
            Bảng Lương Tổng Hợp 36 nhân sự vẫn hoạt động đầy đủ.
          </p>
        </div>
      </div>

      {/* Thông Báo Tiến Trình & Hướng Dẫn */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Tiến Trình Cập Nhật Dữ Liệu Đối Soát
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-300">
                ✓
              </span>
              <span className="text-xs font-bold text-slate-900">Bước 1: Xóa Dữ Liệu Cũ</span>
            </div>
            <p className="text-2xs text-slate-500">
              Đã gỡ bỏ 100% dữ liệu đối soát chi tiết cũ để loại bỏ hoàn toàn các sai lệch và lỗi dữ liệu trước đó.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center border border-amber-300 animate-pulse">
                2
              </span>
              <span className="text-xs font-bold text-amber-900">Bước 2: Chuẩn Hóa Tệp Mới</span>
            </div>
            <p className="text-2xs text-slate-600">
              Đang tiếp nhận và đồng bộ tệp danh sách đối soát mới từ quản lý dự án, bao gồm mã video, thời lượng và lý do QC.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-xs font-bold text-slate-700">Bước 3: Hiển Thị Lại Dữ Liệu</span>
            </div>
            <p className="text-2xs text-slate-500">
              Bảng tra cứu chi tiết từng video sẽ tự động kích hoạt và hiển thị đầy đủ ngay sau khi hoàn tất nạp dữ liệu.
            </p>
          </div>
        </div>

        {/* Navigation buttons to other tabs */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 mr-2">Chuyển nhanh đến:</span>
          {onSwitchSection && (
            <button
              type="button"
              onClick={() => onSwitchSection('consolidated_salary')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Bảng Lương Tổng Hợp (36 NS)</span>
            </button>
          )}

          {onSwitchTab && (
            <>
              <button
                type="button"
                onClick={() => onSwitchTab('lookup')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Tra Cứu Cá Nhân</span>
              </button>

              <button
                type="button"
                onClick={() => onSwitchTab('table')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Bảng 27 Nhân Sự EGO</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Empty Data Placeholder Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Danh Sách Video Đối Soát Chi Tiết
            </h3>
          </div>
          <span className="text-2xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            0 bản ghi • Đang cập nhật lại
          </span>
        </div>

        {/* Empty state presentation */}
        <div className="py-16 px-4 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
            <Clock className="w-8 h-8 animate-pulse text-amber-600" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800">
              Hiện Chưa Có Dữ Liệu Đối Soát Chi Tiết Nào
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Toàn bộ dữ liệu đối soát chi tiết từng video đã được xóa bỏ để chuẩn bị cập nhật lại.
              Bảng dữ liệu sẽ tự động hiển thị lại ngay khi file đối soát mới được tích hợp.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <a
              id="btn-detailed-open-drive-ego"
              href={DRIVE_LINKS.egoInspection}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-2xs cursor-pointer"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Mở Thư Mục Đối Soát EGO Trên Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {onSwitchSection && (
              <button
                type="button"
                onClick={() => onSwitchSection('consolidated_salary')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
              >
                <span>Xem Bảng Lương Tổng Hợp 36 Nhân Sự</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
