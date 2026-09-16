import React from 'react';
import { CheckCircle2, ShieldCheck, FileSpreadsheet, UserCheck, BarChart3, Scale, Calculator, ListFilter, Sparkles } from 'lucide-react';
import { formatHours } from '../utils/formatters';

interface HeaderProps {
  activeTab: 'lookup' | 'table' | 'detailed' | 'analytics';
  setActiveTab: (tab: 'lookup' | 'table' | 'detailed' | 'analytics') => void;
  totalPassHours: number;
  includeUploadValid: boolean;
  onToggleUploadValid: (val: boolean) => void;
  onOpenUploadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalPassHours,
  includeUploadValid,
  onToggleUploadValid,
  onOpenUploadModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Đối Soát Nghiệm Thu EGO
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Giai đoạn II • Khớp 100%
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Số liệu chuẩn gốc 27 nhân sự {includeUploadValid ? '• Đã tính Valid 280 bài 上传问题' : '• Bản nghiệm thu ban đầu'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
                + Valid Upload ({formatHours(totalPassHours)})
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
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

          <button
            id="tab-btn-detailed"
            onClick={() => setActiveTab('detailed')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'detailed'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            Đối Soát Chi Tiết
          </button>

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
      </div>
    </header>
  );
};
