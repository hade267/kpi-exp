import React from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
  UserCheck,
  BarChart3,
  ListFilter,
  Sparkles,
  Wallet,
  ArrowRight,
  Calendar,
  FolderOpen,
  ExternalLink
} from 'lucide-react';
import { formatHours, formatCurrencyVND } from '../utils/formatters';
import { CONSOLIDATED_SALARY_TOTALS } from '../data/salaryConsolidatedData';
import { DRIVE_LINKS } from '../data/driveLinks';
import { MainSection } from './Sidebar';

interface HeaderProps {
  currentSection: MainSection;
  onSelectSection: (section: MainSection) => void;
  onToggleMobileSidebar?: () => void;
  activeTab: 'lookup' | 'table' | 'detailed' | 'analytics';
  setActiveTab: (tab: 'lookup' | 'table' | 'detailed' | 'analytics') => void;
  totalPassHours: number;
  includeUploadValid: boolean;
  onToggleUploadValid: (val: boolean) => void;
  onOpenUploadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onSelectSection,
  activeTab,
  setActiveTab,
  totalPassHours,
  includeUploadValid,
  onToggleUploadValid,
  onOpenUploadModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            {currentSection === 'ego_inspection' ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Đối Soát Nghiệm Thu EGO
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Giai đoạn II • 27 NS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Số liệu chuẩn gốc {includeUploadValid ? '• Đã tính Valid 280 bài 上传问题' : '• Bản nghiệm thu ban đầu'}
                  </p>
                </div>
              </div>
            ) : currentSection === 'nutella_timesheet' ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Chấm Công & Giờ Làm Việc NUTELLA
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 font-mono">
                      06/08 – 30/08/2026
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Quy tắc 3 giai đoạn (5h - 10h - 20h - 25h) • 291,5 công • Tổng: 48.389.000 đ
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Bảng Lương & Tổng Hợp Công
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      VIN • EGO • NUTELLA
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Dữ liệu CSV • 36 nhân sự • Tổng chi: {formatCurrencyVND(CONSOLIDATED_SALARY_TOTALS.grandTotalSalary)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Quick actions depending on active section */}
          <div className="flex items-center gap-2 flex-wrap">
            {currentSection === 'ego_inspection' ? (
              <>
                {/* Direct Google Drive Link for EGO */}
                <a
                  id="btn-header-drive-ego"
                  href={DRIVE_LINKS.egoInspection}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors shadow-2xs cursor-pointer"
                  title="Mở thư mục Google Drive chứa hồ sơ đối soát EGO"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Drive EGO</span>
                  <ExternalLink className="w-3 h-3 text-indigo-400" />
                </a>

                {/* Upload issue detail modal button */}
                <button
                  id="btn-header-upload-policy"
                  onClick={onOpenUploadModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-2xs cursor-pointer bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-emerald-300 text-emerald-800"
                  title="Xem danh sách 19 nhân sự có 280 bài 上传问题 được tính Valid (+103,55h)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Valid 上传问题: <strong>+103,55h</strong> (19 NS)</span>
                </button>

                {/* Mode switch */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-2xs font-medium">
                  <button
                    id="btn-mode-original"
                    onClick={() => onToggleUploadValid(false)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      !includeUploadValid
                        ? 'bg-white text-slate-900 font-bold shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Tính theo số liệu nghiệm thu ban đầu (Chưa cộng giờ 上传问题)"
                  >
                    Gốc (856,83h)
                  </button>
                  <button
                    id="btn-mode-upload-valid"
                    onClick={() => onToggleUploadValid(true)}
                    className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                      includeUploadValid
                        ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Đã tính 280 bài dính lỗi 上传问题 là Valid (+103,55h vào Pass tính công)"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    + Valid ({formatHours(totalPassHours)})
                  </button>
                </div>
              </>
            ) : currentSection === 'nutella_timesheet' ? (
              <div className="flex items-center gap-2 flex-wrap">
                {/* Direct Google Drive Link for Nutella */}
                <a
                  id="btn-header-drive-nutella"
                  href={DRIVE_LINKS.nutellaInspection}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors shadow-2xs cursor-pointer"
                  title="Mở thư mục Google Drive chứa hồ sơ đối soát Nutella"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>Drive Nutella</span>
                  <ExternalLink className="w-3 h-3 text-amber-600" />
                </a>

                <button
                  id="btn-switch-to-salary-from-nutella"
                  onClick={() => onSelectSection('consolidated_salary')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Bảng Lương Tổng Hợp</span>
                </button>
                <button
                  id="btn-switch-to-ego-from-nutella"
                  onClick={() => onSelectSection('ego_inspection')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                >
                  <span>Đối Soát EGO</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Dữ Liệu Chuẩn 3 Dự Án
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs - Only shown when in EGO Inspection mode */}
        {currentSection === 'ego_inspection' && (
          <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-100 pt-2 pb-2 overflow-x-auto scrollbar-none">
            <button
              id="tab-btn-lookup"
              onClick={() => setActiveTab('lookup')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'lookup'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Tra Cứu Cá Nhân
            </button>

            <button
              id="tab-btn-table"
              onClick={() => setActiveTab('table')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'table'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Bảng 27 Nhân Sự
            </button>

            <a
              id="tab-link-detailed-drive"
              href={DRIVE_LINKS.egoInspection}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 shadow-2xs cursor-pointer"
              title="Mở thư mục Google Drive: Chi Tiết Đối Soát Từng Bài"
            >
              <FolderOpen className="w-4 h-4 text-indigo-600" />
              <span>Chi Tiết Đối Soát Từng Bài (Drive)</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            </a>

            <button
              id="tab-btn-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Biểu Đồ & Thống Kê
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
