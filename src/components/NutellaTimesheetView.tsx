import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Info,
  ChevronRight,
  ShieldCheck,
  Wallet,
  Users,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  Calculator,
  FileSpreadsheet,
  FolderOpen,
  ExternalLink
} from 'lucide-react';
import { DRIVE_LINKS } from '../data/driveLinks';
import {
  NUTELLA_DATES,
  NUTELLA_RULES,
  LABEL_CONVERTED_WORKDAYS_DATA,
  QA_TIMESHEET_DATA,
  NUTELLA_TIMESHEET_SUMMARY
} from '../data/nutellaTimesheetData';
import { formatCurrencyVND } from '../utils/formatters';

interface NutellaTimesheetViewProps {
  onSwitchSection?: (section: 'ego_inspection' | 'consolidated_salary' | 'nutella_timesheet') => void;
}

type NutellaSubTab = 'converted_workdays' | 'qa_breakdown' | 'rules';

export const NutellaTimesheetView: React.FC<NutellaTimesheetViewProps> = ({ onSwitchSection }) => {
  const [activeTab, setActiveTab] = useState<NutellaSubTab>('converted_workdays');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<'ALL' | 'Label' | 'QA'>('ALL');

  // Interactive formula tester
  const [testHours, setTestHours] = useState<number>(12);
  const [testStage, setTestStage] = useState<'gd1' | 'gd2' | 'gd3a' | 'gd3b'>('gd2');

  const testWorkdayResult = useMemo(() => {
    if (testHours <= 0) return { workday: 0, label: '0.0 công (Không tính)' };
    if (testStage === 'gd1') {
      return testHours >= 5
        ? { workday: 1.0, label: '1.0 công (Full công - Đạt chuẩn >= 5h)' }
        : { workday: 0.5, label: '0.5 công (Nửa công - Dưới 5h)' };
    }
    if (testStage === 'gd2') {
      return testHours >= 10
        ? { workday: 1.0, label: '1.0 công (Full công - Đạt chuẩn >= 10h)' }
        : { workday: 0.5, label: '0.5 công (Nửa công - Dưới 10h)' };
    }
    if (testStage === 'gd3a') {
      return testHours >= 20
        ? { workday: 1.0, label: '1.0 công (Full công - Đạt chuẩn >= 20h)' }
        : { workday: 0.5, label: '0.5 công (Nửa công - Dưới 20h)' };
    }
    // gd3b
    return testHours >= 25
      ? { workday: 1.0, label: '1.0 công (Full công - Đạt chuẩn >= 25h)' }
      : { workday: 0.5, label: '0.5 công (Nửa công - Dưới 25h)' };
  }, [testHours, testStage]);

  // Filtered Converted Workdays Data
  const filteredConvertedWorkdays = useMemo(() => {
    return LABEL_CONVERTED_WORKDAYS_DATA.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchDept = departmentFilter === 'ALL' || item.department.includes(departmentFilter);
      return matchSearch && matchDept;
    });
  }, [searchTerm, departmentFilter]);

  // Filtered QA Data
  const filteredQA = useMemo(() => {
    return QA_TIMESHEET_DATA.filter(item => {
      const q = searchTerm.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.username.toLowerCase().includes(q) ||
        item.profileName.toLowerCase().includes(q)
      );
    });
  }, [searchTerm]);

  // Export to CSV helper
  const handleExportCSV = () => {
    let csvContent = '';
    if (activeTab === 'converted_workdays') {
      const headers = ['STT', 'Bo_phan', 'Ho_va_ten', ...NUTELLA_DATES, 'Cong_GD1', 'Cong_GD2', 'Cong_GD3', 'TONG_CONG'];
      const rows = LABEL_CONVERTED_WORKDAYS_DATA.map(item => [
        item.stt,
        `"${item.department}"`,
        `"${item.name}"`,
        ...NUTELLA_DATES.map(d => item.dailyWorkdays[d] ?? ''),
        item.workdaysGD1,
        item.workdaysGD2,
        item.workdaysGD3,
        item.totalWorkdays
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else {
      const headers = ['STT', 'Bo_phan', 'Ho_va_ten', 'Username', 'Profile', ...NUTELLA_DATES, 'Cong_GD1', 'Cong_GD2', 'Cong_GD3', 'Tong_cong'];
      const rows = QA_TIMESHEET_DATA.map(item => [
        item.stt,
        `"${item.department}"`,
        `"${item.name}"`,
        `"${item.username}"`,
        `"${item.profileName}"`,
        ...NUTELLA_DATES.map(d => item.dailyWorkdays[d] ?? ''),
        item.workdaysGD1,
        item.workdaysGD2,
        item.workdaysGD3,
        item.totalWorkdays
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nutella_timesheet_${activeTab}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to get stage background color for header columns
  const getStageHeaderStyle = (date: string) => {
    const day = parseInt(date.split('/')[0], 10);
    if (day <= 15) return 'bg-sky-50 text-sky-800 border-sky-200';
    if (day <= 22) return 'bg-amber-50 text-amber-800 border-amber-200';
    if (day <= 25) return 'bg-orange-50 text-orange-800 border-orange-200';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Bảng Chấm Công NUTELLA (Quy Đổi Ngày Công)
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  06/08 – 30/08/2026
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  166.000 đ/công
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Hệ thống chuẩn hóa ngày công làm việc Nutella, áp dụng quy tắc 3 giai đoạn để tính công thực lãnh cho bộ phận Sản xuất (Label) và QA.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-shrink-0 flex-wrap">
            <a
              id="btn-nutella-banner-drive"
              href={DRIVE_LINKS.nutellaInspection}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              title="Mở thư mục Google Drive chứa hồ sơ đối soát Nutella"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>Hồ Sơ Đối Soát (Drive)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            {onSwitchSection && (
              <button
                type="button"
                onClick={() => onSwitchSection('consolidated_salary')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Xem Bảng Lương (109,1M)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Tổng công Nutella Bảng lương */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-slate-500">
            <span>Công Nutella (Bảng Lương)</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-black text-emerald-700">
            {NUTELLA_TIMESHEET_SUMMARY.consolidatedWorkdaysNutellaTotal.toLocaleString('vi-VN')}
            <span className="text-xs font-normal text-slate-500 ml-1">công</span>
          </div>
          <div className="text-2xs font-semibold text-slate-500">
            = {formatCurrencyVND(NUTELLA_TIMESHEET_SUMMARY.consolidatedSalaryNutellaTotal)}
          </div>
        </div>

        {/* Card 2: Sản Xuất / Label */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-slate-500">
            <span>Sản Xuất / Label (26 NS)</span>
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-mono font-black text-indigo-700">
            {NUTELLA_TIMESHEET_SUMMARY.totalConvertedLabelWorkdays.toLocaleString('vi-VN')}
            <span className="text-xs font-normal text-slate-500 ml-1">công</span>
          </div>
          <div className="text-2xs font-semibold text-slate-500">
            GĐ1: {NUTELLA_TIMESHEET_SUMMARY.workdaysGD1Total}c • GĐ2: {NUTELLA_TIMESHEET_SUMMARY.workdaysGD2Total}c • GĐ3: {NUTELLA_TIMESHEET_SUMMARY.workdaysGD3Total}c
          </div>
        </div>

        {/* Card 3: Đội ngũ QA */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-slate-500">
            <span>Đội Ngũ QA (5 NS)</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-mono font-black text-amber-700">
            {NUTELLA_TIMESHEET_SUMMARY.totalQAWorkdays}
            <span className="text-xs font-normal text-slate-500 ml-1">công</span>
          </div>
          <div className="text-2xs font-semibold text-slate-500">
            GĐ1: {NUTELLA_TIMESHEET_SUMMARY.qaWorkdaysGD1}c • GĐ2: {NUTELLA_TIMESHEET_SUMMARY.qaWorkdaysGD2}c • GĐ3: {NUTELLA_TIMESHEET_SUMMARY.qaWorkdaysGD3}c
          </div>
        </div>

        {/* Card 4: Tổng nhân sự tham gia */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-slate-500">
            <span>Nhân Sự Tham Gia</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-mono font-black text-sky-700">
            28
            <span className="text-xs font-normal text-slate-500 ml-1">nhân sự</span>
          </div>
          <div className="text-2xs font-semibold text-slate-500">
            100% đã được đối soát & chốt công
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('converted_workdays')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'converted_workdays'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Bảng Công Quy Đổi (28 NS)</span>
              <span className="text-2xs px-1.5 py-0.2 rounded-full font-mono bg-white/20">
                253c
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('qa_breakdown')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'qa_breakdown'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Đội Ngũ QA (76 Công)</span>
              <span className="text-2xs px-1.5 py-0.2 rounded-full font-mono bg-white/20">
                76c
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'rules'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Quy Tắc 3 Giai Đoạn</span>
            </button>
          </div>

          {/* Search & Export */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab !== 'rules' && (
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm nhân sự..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            )}

            {activeTab !== 'rules' && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Xuất CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: BẢNG CÔNG QUY ĐỔI CHI TIẾT (28 NHÂN SỰ) */}
      {activeTab === 'converted_workdays' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header Description & Legend */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-800">
                Bảng Công Quy Đổi Bộ Phận Sản Xuất (28 nhân sự)
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">
                Hiển thị {filteredConvertedWorkdays.length} / 28 nhân sự
              </span>
            </div>

            {/* Stage Legend */}
            <div className="flex items-center gap-2 flex-wrap text-2xs">
              <span className="font-bold text-slate-600">Quy ước mốc:</span>
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">
                GĐ1 (06-15/8: ≥5h=1c)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                GĐ2 (16-22/8: ≥10h=1c)
              </span>
              <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-semibold border border-orange-200">
                GĐ3A (23-25/8: ≥20h=1c)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                GĐ3B (26-30/8: ≥25h=1c)
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto max-h-[620px] scrollbar-thin">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs z-20 text-slate-700 font-bold border-b border-slate-200 shadow-2xs">
                <tr>
                  <th className="p-2.5 text-center w-10 border-r border-slate-200">STT</th>
                  <th className="p-2.5 min-w-[160px] border-r border-slate-200">Họ và tên</th>
                  <th className="p-2.5 min-w-[130px] border-r border-slate-200">Bộ phận</th>
                  {NUTELLA_DATES.map(date => (
                    <th
                      key={date}
                      className={`p-1.5 text-center min-w-[38px] border-r border-slate-200 font-mono text-2xs ${getStageHeaderStyle(date)}`}
                      title={`Ngày ${date}`}
                    >
                      {date.split('/')[0]}
                    </th>
                  ))}
                  <th className="p-2 text-center min-w-[65px] bg-sky-100/80 text-sky-900 border-r border-slate-200">
                    Công GĐ1
                  </th>
                  <th className="p-2 text-center min-w-[65px] bg-amber-100/80 text-amber-900 border-r border-slate-200">
                    Công GĐ2
                  </th>
                  <th className="p-2 text-center min-w-[65px] bg-emerald-100/80 text-emerald-900 border-r border-slate-200">
                    Công GĐ3
                  </th>
                  <th className="p-2 text-center min-w-[80px] bg-indigo-100 text-indigo-950 font-black">
                    TỔNG CÔNG
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredConvertedWorkdays.map(item => (
                  <tr key={item.stt} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2 text-center font-mono text-slate-400 border-r border-slate-100">
                      {item.stt}
                    </td>
                    <td className="p-2.5 font-bold text-slate-900 border-r border-slate-100 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="p-2 text-slate-500 border-r border-slate-100 text-2xs whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                        {item.department}
                      </span>
                    </td>
                    {NUTELLA_DATES.map(date => {
                      const val = item.dailyWorkdays[date];
                      return (
                        <td
                          key={date}
                          className="p-1 text-center font-mono text-2xs border-r border-slate-100"
                        >
                          {val === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                              1
                            </span>
                          ) : val === 0.5 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-bold">
                              0.5
                            </span>
                          ) : (
                            <span className="text-slate-200">•</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-2 text-center font-mono font-bold text-sky-800 bg-sky-50/40 border-r border-slate-100">
                      {item.workdaysGD1}
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-amber-800 bg-amber-50/40 border-r border-slate-100">
                      {item.workdaysGD2}
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-emerald-800 bg-emerald-50/40 border-r border-slate-100">
                      {item.workdaysGD3}
                    </td>
                    <td className="p-2 text-center font-mono font-black text-indigo-700 bg-indigo-50/50">
                      {item.totalWorkdays}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-slate-900 text-white font-bold border-t-2 border-slate-700 z-10">
                {/* Row 1: Tổng cộng công bộ phận Label (26 nhân sự - Khớp 100% dòng tổng file gốc) */}
                <tr className="border-b border-slate-800">
                  <td colSpan={3} className="p-2.5 text-center uppercase tracking-wider text-2xs font-black text-amber-300">
                    TỔNG CỘNG CÔNG LABEL (26 NS - FILE GỐC)
                  </td>
                  {NUTELLA_DATES.map(date => {
                    const labelDayTotal = LABEL_CONVERTED_WORKDAYS_DATA.filter(item => item.department.includes('Label')).reduce(
                      (acc, cur) => acc + (cur.dailyWorkdays[date] || 0),
                      0
                    );
                    return (
                      <td key={date} className="p-1 text-center font-mono text-2xs text-amber-300">
                        {labelDayTotal > 0 ? labelDayTotal : '0'}
                      </td>
                    );
                  })}
                  <td className="p-2 text-center font-mono text-sky-300 bg-slate-800/80">
                    {NUTELLA_TIMESHEET_SUMMARY.workdaysGD1Total}
                  </td>
                  <td className="p-2 text-center font-mono text-amber-300 bg-slate-800/80">
                    {NUTELLA_TIMESHEET_SUMMARY.workdaysGD2Total}
                  </td>
                  <td className="p-2 text-center font-mono text-emerald-300 bg-slate-800/80">
                    {NUTELLA_TIMESHEET_SUMMARY.workdaysGD3Total}
                  </td>
                  <td className="p-2 text-center font-mono text-sm font-black text-white bg-indigo-600">
                    {NUTELLA_TIMESHEET_SUMMARY.totalConvertedLabelWorkdays}
                  </td>
                </tr>

                {/* Row 2: Tổng cộng toàn bảng gồm cả 2 QA (Thiện & Huy) */}
                <tr className="bg-slate-950 text-slate-300 text-2xs">
                  <td colSpan={3} className="p-2 text-center uppercase tracking-wider text-3xs text-slate-400">
                    TỔNG TOÀN BẢNG (28 NS - GỒM THIỆN & HUY QA)
                  </td>
                  {NUTELLA_DATES.map(date => {
                    const allDayTotal = LABEL_CONVERTED_WORKDAYS_DATA.reduce(
                      (acc, cur) => acc + (cur.dailyWorkdays[date] || 0),
                      0
                    );
                    return (
                      <td key={date} className="p-1 text-center font-mono text-3xs text-slate-300">
                        {allDayTotal > 0 ? allDayTotal : '0'}
                      </td>
                    );
                  })}
                  <td className="p-1.5 text-center font-mono text-slate-300 bg-slate-900">
                    {NUTELLA_TIMESHEET_SUMMARY.workdaysGD1Total + 18}
                  </td>
                  <td className="p-1.5 text-center font-mono text-slate-300 bg-slate-900">
                    {NUTELLA_TIMESHEET_SUMMARY.workdaysGD2Total + 10}
                  </td>
                  <td className="p-1.5 text-center font-mono text-slate-300 bg-slate-900">
                    {NUTELLA_TIMESHEET_SUMMARY.workdaysGD3Total + 15}
                  </td>
                  <td className="p-1.5 text-center font-mono text-xs font-bold text-amber-300 bg-slate-800">
                    {NUTELLA_TIMESHEET_SUMMARY.totalConvertedLabelWorkdays + 43}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: ĐỘI NGŨ QA (CÔNG QUY ĐỔI) */}
      {activeTab === 'qa_breakdown' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Bảng Chấm Công Quy Đổi Đội Ngũ QA Tháng 08/2026
              </h3>
              <p className="text-xs text-slate-500">
                5 nhân sự QA • Tổng 76,0 ngày công (GĐ1: 18c, GĐ2: 10c, GĐ3: 48c)
              </p>
            </div>
            <div className="text-2xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 font-mono">
              Tổng cộng QA: 76 ngày công
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto max-h-[620px] scrollbar-thin">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs z-20 text-slate-700 font-bold border-b border-slate-200 shadow-2xs">
                  <tr>
                    <th className="p-2.5 text-center w-10 border-r border-slate-200">STT</th>
                    <th className="p-2.5 min-w-[140px] border-r border-slate-200">Họ và tên</th>
                    <th className="p-2.5 min-w-[100px] border-r border-slate-200">Username</th>
                    <th className="p-2.5 min-w-[100px] border-r border-slate-200">Profile</th>
                    {NUTELLA_DATES.map(date => (
                      <th
                        key={date}
                        className={`p-1.5 text-center min-w-[42px] border-r border-slate-200 font-mono text-2xs ${getStageHeaderStyle(date)}`}
                        title={`Ngày ${date}`}
                      >
                        {date.split('/')[0]}
                      </th>
                    ))}
                    <th className="p-2 text-center min-w-[65px] bg-sky-100 text-sky-900 border-r border-slate-200">
                      Công GĐ1
                    </th>
                    <th className="p-2 text-center min-w-[65px] bg-amber-100 text-amber-900 border-r border-slate-200">
                      Công GĐ2
                    </th>
                    <th className="p-2 text-center min-w-[65px] bg-emerald-100 text-emerald-900 border-r border-slate-200">
                      Công GĐ3
                    </th>
                    <th className="p-2 text-center min-w-[80px] bg-indigo-100 text-indigo-950 font-black">
                      TỔNG CÔNG
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQA.map(item => (
                    <tr key={item.stt} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 text-center font-mono text-slate-400 border-r border-slate-100">
                        {item.stt}
                      </td>
                      <td className="p-2.5 font-bold text-slate-900 border-r border-slate-100 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="p-2 font-mono text-slate-600 border-r border-slate-100 text-2xs">
                        {item.username}
                      </td>
                      <td className="p-2 font-mono text-slate-600 border-r border-slate-100 text-2xs">
                        {item.profileName}
                      </td>
                      {NUTELLA_DATES.map(date => {
                        const val = item.dailyWorkdays[date];
                        return (
                          <td
                            key={date}
                            className="p-1 text-center font-mono text-2xs border-r border-slate-100"
                          >
                            {val === 1 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                                1
                              </span>
                            ) : val === 0.5 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-bold">
                                0.5
                              </span>
                            ) : (
                              <span className="text-slate-200">•</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-2 text-center font-mono font-bold text-sky-800 bg-sky-50/40 border-r border-slate-100">
                        {item.workdaysGD1}
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-amber-800 bg-amber-50/40 border-r border-slate-100">
                        {item.workdaysGD2}
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-800 bg-emerald-50/40 border-r border-slate-100">
                        {item.workdaysGD3}
                      </td>
                      <td className="p-2 text-center font-mono font-black text-indigo-700 bg-indigo-50/50">
                        {item.totalWorkdays}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="sticky bottom-0 bg-slate-900 text-white font-bold border-t-2 border-slate-700 z-10">
                  <tr>
                    <td colSpan={4} className="p-3 text-center uppercase tracking-wider text-xs">
                      TỔNG CỘNG CÔNG QA
                    </td>
                    {NUTELLA_DATES.map(date => {
                      const dayVal = QA_TIMESHEET_DATA.reduce((acc, cur) => {
                        return acc + (cur.dailyWorkdays[date] || 0);
                      }, 0);
                      return (
                        <td key={date} className="p-1 text-center font-mono text-2xs text-amber-300">
                          {dayVal > 0 ? dayVal : '0'}
                        </td>
                      );
                    })}
                    <td className="p-2.5 text-center font-mono text-sky-300 bg-slate-800">
                      {NUTELLA_TIMESHEET_SUMMARY.qaWorkdaysGD1}
                    </td>
                    <td className="p-2.5 text-center font-mono text-amber-300 bg-slate-800">
                      {NUTELLA_TIMESHEET_SUMMARY.qaWorkdaysGD2}
                    </td>
                    <td className="p-2.5 text-center font-mono text-emerald-300 bg-slate-800">
                      {NUTELLA_TIMESHEET_SUMMARY.qaWorkdaysGD3}
                    </td>
                    <td className="p-2.5 text-center font-mono text-base font-black text-white bg-indigo-600">
                      {NUTELLA_TIMESHEET_SUMMARY.totalQAWorkdays}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: QUY TẮC & ĐỊNH MỨC 3 GIAI ĐOẠN */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* Rules Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {NUTELLA_RULES.map((rule, idx) => (
              <div
                key={rule.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {rule.stageName}
                  </span>
                  <span className="text-2xs font-mono font-bold text-slate-400">
                    {rule.dayCount} ngày
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900 mb-0.5">
                    {rule.period}
                  </h4>
                  <p className="text-2xs text-slate-500 leading-relaxed">
                    {rule.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="font-semibold text-emerald-800">1.0 Full Công:</span>
                    <span className="font-mono font-bold text-emerald-900">
                      {rule.fullWorkdayCondition}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="font-semibold text-amber-800">0.5 Nửa Công:</span>
                    <span className="font-mono font-bold text-amber-900">
                      {rule.halfWorkdayCondition}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-2xs text-slate-500">
                    <span>Không tính:</span>
                    <span>{rule.zeroCondition}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-3xs font-mono text-slate-600">
                  <span className="font-bold text-slate-700">Công thức: </span>
                  {rule.excelFormula}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Calculator / Simulator */}
          <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50/40 rounded-2xl p-5 sm:p-6 border border-indigo-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Mô Phỏng & Thử Nghiệm Logic Quy Đổi Công Nutella
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Nhập số giờ làm việc thực tế và chọn giai đoạn để xem công quy đổi tương ứng theo đúng thuật toán dự án:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Select Stage */}
              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Chọn Giai Đoạn Áp Dụng
                </label>
                <select
                  value={testStage}
                  onChange={e => setTestStage(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="gd1">Giai đoạn 1 (06/08 – 15/08: Định mức 5h)</option>
                  <option value="gd2">Giai đoạn 2 (16/08 – 22/08: Định mức 10h)</option>
                  <option value="gd3a">Giai đoạn 3A (23/08 – 25/08: Định mức 20h)</option>
                  <option value="gd3b">Giai đoạn 3B (26/08 – 30/08: Định mức 25h)</option>
                </select>
              </div>

              {/* Input Hours */}
              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Nhập Số Giờ Làm Việc (tiếng)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="50"
                  value={testHours}
                  onChange={e => setTestHours(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Result Preview */}
              <div className="p-3 rounded-xl bg-white border border-indigo-200 flex flex-col justify-center space-y-1">
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
                  Kết quả quy đổi công:
                </span>
                <div className="text-lg font-mono font-black text-indigo-700 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{testWorkdayResult.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
