import React from 'react';
import {
  ShieldCheck,
  Wallet,
  X,
  Calculator,
  Layers
} from 'lucide-react';
import { CONSOLIDATED_SALARY_TOTALS } from '../data/salaryConsolidatedData';
import { formatCurrencyVND } from '../utils/formatters';

export type MainSection = 'ego_inspection' | 'consolidated_salary';

interface SidebarProps {
  currentSection: MainSection;
  onSelectSection: (section: MainSection) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  egoPassHours: number;
  includeUploadValid: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isMobileOpen,
  onCloseMobile,
  egoPassHours,
  includeUploadValid,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 text-slate-200 z-50 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-900/40">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                <span>EGO & DỰ ÁN</span>
                <span className="text-3xs px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-mono font-normal">
                  v2.5
                </span>
              </div>
              <p className="text-2xs text-slate-400">
                Hệ Thống Đối Soát & Bảng Lương
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="px-3 pb-2 text-3xs font-bold uppercase tracking-wider text-slate-400">
              Mục Quản Trị & Đối Soát
            </div>

            <nav className="space-y-1">
              {/* Item 1: Đối Soát Nghiệm Thu EGO */}
              <button
                id="sidebar-btn-ego-inspection"
                onClick={() => {
                  onSelectSection('ego_inspection');
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                  currentSection === 'ego_inspection'
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ShieldCheck
                    className={`w-4 h-4 shrink-0 ${
                      currentSection === 'ego_inspection'
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-indigo-400'
                    }`}
                  />
                  <span className="text-xs sm:text-sm truncate">Đối Soát Nghiệm Thu EGO</span>
                </div>
                <span
                  className={`text-3xs px-2 py-0.5 rounded-full font-mono shrink-0 ml-2 ${
                    currentSection === 'ego_inspection'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  27 NS
                </span>
              </button>

              {/* Item 2: Bảng Lương Tổng Hợp (Dữ liệu CSV) */}
              <button
                id="sidebar-btn-consolidated-salary"
                onClick={() => {
                  onSelectSection('consolidated_salary');
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                  currentSection === 'consolidated_salary'
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Wallet
                    className={`w-4 h-4 shrink-0 ${
                      currentSection === 'consolidated_salary'
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  />
                  <span className="text-xs sm:text-sm truncate">Bảng Lương Tổng Hợp</span>
                </div>
                <span
                  className={`text-3xs px-2 py-0.5 rounded-full font-mono shrink-0 ml-2 ${
                    currentSection === 'consolidated_salary'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  36 NS
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Unit Rates Reference */}
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 text-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-3xs uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              <span>Đơn Giá Áp Dụng</span>
            </div>

            <div className="space-y-1.5 text-slate-400 text-2xs">
              <div className="flex justify-between items-center py-0.5 border-b border-slate-700/50">
                <span>KPI EGO:</span>
                <span className="font-mono font-bold text-slate-200">50.000 đ/h</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-700/50">
                <span>KPI VIN:</span>
                <span className="font-mono font-bold text-slate-200">50.000 đ/h</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-700/50">
                <span>Lương cứng NUTELLA:</span>
                <span className="font-mono font-bold text-slate-200">166.000 đ/ngày</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>Lương cứng VIN:</span>
                <span className="font-mono font-bold text-slate-200">153.000 đ/ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-2xs text-slate-500">
          <div className="flex items-center justify-between">
            <span>Tổng chi ngân sách</span>
            <span className="text-white font-mono font-bold">104.613.058 đ</span>
          </div>
        </div>
      </aside>
    </>
  );
};
