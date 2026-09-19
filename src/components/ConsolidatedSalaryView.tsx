import React, { useState, useMemo } from 'react';
import {
  CONSOLIDATED_SALARY_DATA,
  CONSOLIDATED_SALARY_TOTALS,
  UNIT_PRICES,
  ConsolidatedSalaryItem,
} from '../data/salaryConsolidatedData';
import { formatCurrencyVND, formatNumber } from '../utils/formatters';
import { ConsolidatedSalaryModal } from './ConsolidatedSalaryModal';
import {
  Search,
  ArrowUpDown,
  Download,
  Copy,
  Check,
  Printer,
  Award,
  Wallet,
  Clock,
  Calendar,
  Building2,
  Users,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

type SortColumn =
  | 'stt'
  | 'name'
  | 'kpiVinHours'
  | 'kpiVinSalary'
  | 'kpiEgoHours'
  | 'kpiEgoSalary'
  | 'kpiNutellaHours'
  | 'kpiNutellaSalary'
  | 'kpiQaNutellaHours'
  | 'kpiQaNutellaSalary'
  | 'workdaysVin'
  | 'fixedSalaryVin'
  | 'workdaysNutella'
  | 'fixedSalaryNutella'
  | 'totalSalary';

interface ConsolidatedSalaryViewProps {
  onSwitchSection?: (section: 'ego_inspection' | 'consolidated_salary' | 'nutella_timesheet') => void;
}

export const ConsolidatedSalaryView: React.FC<ConsolidatedSalaryViewProps> = ({ onSwitchSection }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState<'all' | 'ego' | 'vin' | 'nutella' | 'high_earner'>('all');
  const [sortCol, setSortCol] = useState<SortColumn>('stt');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [selectedPerson, setSelectedPerson] = useState<ConsolidatedSalaryItem | null>(null);
  const [copiedTSV, setCopiedTSV] = useState(false);

  // Sorting helper
  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(col === 'name' || col === 'stt' ? true : false);
    }
  };

  // Filtered & Sorted items
  const processedData = useMemo(() => {
    let result = [...CONSOLIDATED_SALARY_DATA];

    // Search by name
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(q) || item.stt.toString() === q
      );
    }

    // Filter project participation
    if (filterProject === 'ego') {
      result = result.filter((item) => (item.kpiEgoHours || 0) > 0);
    } else if (filterProject === 'vin') {
      result = result.filter(
        (item) => (item.kpiVinHours || 0) > 0 || (item.workdaysVin || 0) > 0
      );
    } else if (filterProject === 'nutella') {
      result = result.filter(
        (item) =>
          (item.workdaysNutella || 0) > 0 ||
          (item.kpiNutellaHours || 0) > 0 ||
          (item.kpiQaNutellaHours || 0) > 0
      );
    } else if (filterProject === 'high_earner') {
      result = result.filter((item) => item.totalSalary >= 4000000);
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortCol];
      let valB: any = b[sortCol];

      if (valA === null || valA === undefined) valA = sortAsc ? Infinity : -Infinity;
      if (valB === null || valB === undefined) valB = sortAsc ? Infinity : -Infinity;

      if (typeof valA === 'string') {
        const comp = valA.localeCompare(valB, 'vi');
        return sortAsc ? comp : -comp;
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return result;
  }, [searchTerm, filterProject, sortCol, sortAsc]);

  // Export CSV function with 14 columns matching exactly
  const handleExportCSV = () => {
    const headers = [
      'STT',
      'Tên',
      'KPI VIN',
      'LƯƠNG KPI VIN',
      'KPI EGO',
      'LƯƠNG KPI EGO',
      'KPI NUTELLA',
      'LƯƠNG KPI NUTELLA',
      'KPI QA NUTELLA',
      'LƯƠNG QA NUTELLA',
      'NGÀY CÔNG VIN',
      'LƯƠNG CỨNG VIN',
      'NGÀY CÔNG NUTELLA',
      'LƯƠNG CỨNG NUTELLA',
      'TỔNG LƯƠNG',
    ];

    const rows = CONSOLIDATED_SALARY_DATA.map((item) => [
      item.stt,
      `"${item.name}"`,
      item.kpiVinHours ?? '',
      item.kpiVinSalary ?? '',
      item.kpiEgoHours ?? '',
      item.kpiEgoSalary ?? '',
      item.kpiNutellaHours ?? '',
      item.kpiNutellaSalary ?? '',
      item.kpiQaNutellaHours ?? '',
      item.kpiQaNutellaSalary ?? '',
      item.workdaysVin ?? '',
      item.fixedSalaryVin ?? '',
      item.workdaysNutella ?? '',
      item.fixedSalaryNutella ?? '',
      item.totalSalary,
    ]);

    const totalRow = [
      '',
      '"TỔNG CỘNG"',
      CONSOLIDATED_SALARY_TOTALS.totalKpiVinHours,
      CONSOLIDATED_SALARY_TOTALS.totalKpiVinSalary,
      CONSOLIDATED_SALARY_TOTALS.totalKpiEgoHours,
      CONSOLIDATED_SALARY_TOTALS.totalKpiEgoSalary,
      CONSOLIDATED_SALARY_TOTALS.totalKpiNutellaHours,
      CONSOLIDATED_SALARY_TOTALS.totalKpiNutellaSalary,
      CONSOLIDATED_SALARY_TOTALS.totalKpiQaNutellaHours,
      CONSOLIDATED_SALARY_TOTALS.totalKpiQaNutellaSalary,
      CONSOLIDATED_SALARY_TOTALS.totalWorkdaysVin,
      CONSOLIDATED_SALARY_TOTALS.totalFixedSalaryVin,
      CONSOLIDATED_SALARY_TOTALS.totalWorkdaysNutella,
      CONSOLIDATED_SALARY_TOTALS.totalFixedSalaryNutella,
      CONSOLIDATED_SALARY_TOTALS.grandTotalSalary,
    ];

    const csvContent =
      '\uFEFF' +
      [
        headers.join(','),
        ...rows.map((r) => r.join(',')),
        totalRow.join(','),
        '',
        'BẢNG ĐƠN GIÁ CƠ BẢN ÁP DỤNG,',
        'Tên Hạng Mục,Đơn giá (VNĐ),Ghi chú',
        'KPI VIN,50000,50.000 đ/giờ Pass nhiệm vụ VIN',
        'KPI EGO,50000,50.000 đ/giờ Pass nhiệm vụ EGO (Đã gồm Valid Upload)',
        'KPI NUTELLA,7000,7.000 đ/giờ thời lượng tự ghi sản xuất Nutella',
        'KPI QA NUTELLA,2000,2.000 đ/giờ kiểm định chất lượng (QA) Nutella',
        'LƯƠNG CỨNG VIN,153000,153.000 đ/ngày công dự án VIN',
        'LƯƠNG CỨNG NUTELLA,166000,166.000 đ/ngày công quy đổi dự án Nutella',
      ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bang_Luong_Tong_Hop_VIN_EGO_NUTELLA_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy TSV for Excel / Google Sheets
  const handleCopyTSV = () => {
    const headers = [
      'Tên',
      'KPI VIN',
      'LƯƠNG KPI VIN',
      'KPI EGO',
      'LƯƠNG KPI EGO',
      'KPI NUTELLA',
      'LƯƠNG KPI NUTELLA',
      'KPI QA NUTELLA',
      'LƯƠNG QA NUTELLA',
      'NGÀY CÔNG VIN',
      'LƯƠNG CỨNG VIN',
      'NGÀY CÔNG NUTELLA',
      'LƯƠNG CỨNG NUTELLA',
      'TỔNG LƯƠNG',
    ];

    const rows = processedData.map((item) => [
      item.name,
      item.kpiVinHours !== null ? item.kpiVinHours : '',
      item.kpiVinSalary !== null ? `${formatNumber(item.kpiVinSalary)}₫` : '0₫',
      item.kpiEgoHours !== null ? item.kpiEgoHours : '',
      item.kpiEgoSalary !== null ? `${formatNumber(item.kpiEgoSalary)}₫` : '0₫',
      item.kpiNutellaHours !== null ? item.kpiNutellaHours : '',
      item.kpiNutellaSalary !== null ? `${formatNumber(item.kpiNutellaSalary)}₫` : '0₫',
      item.kpiQaNutellaHours !== null ? item.kpiQaNutellaHours : '',
      item.kpiQaNutellaSalary !== null ? `${formatNumber(item.kpiQaNutellaSalary)}₫` : '0₫',
      item.workdaysVin !== null ? item.workdaysVin : '',
      item.fixedSalaryVin !== null ? `${formatNumber(item.fixedSalaryVin)}₫` : '0₫',
      item.workdaysNutella !== null ? item.workdaysNutella.toFixed(2) : '',
      item.fixedSalaryNutella !== null ? `${formatNumber(item.fixedSalaryNutella)}₫` : '0₫',
      `${formatNumber(item.totalSalary)}₫`,
    ]);

    const totalRow = [
      'TỔNG CỘNG',
      CONSOLIDATED_SALARY_TOTALS.totalKpiVinHours,
      `${formatNumber(CONSOLIDATED_SALARY_TOTALS.totalKpiVinSalary)}₫`,
      CONSOLIDATED_SALARY_TOTALS.totalKpiEgoHours,
      `${formatNumber(CONSOLIDATED_SALARY_TOTALS.totalKpiEgoSalary)}₫`,
      CONSOLIDATED_SALARY_TOTALS.totalKpiNutellaHours,
      `${formatNumber(CONSOLIDATED_SALARY_TOTALS.totalKpiNutellaSalary)}₫`,
      CONSOLIDATED_SALARY_TOTALS.totalKpiQaNutellaHours,
      `${formatNumber(CONSOLIDATED_SALARY_TOTALS.totalKpiQaNutellaSalary)}₫`,
      CONSOLIDATED_SALARY_TOTALS.totalWorkdaysVin,
      `${formatNumber(CONSOLIDATED_SALARY_TOTALS.totalFixedSalaryVin)}₫`,
      CONSOLIDATED_SALARY_TOTALS.totalWorkdaysNutella.toFixed(2),
      `${formatNumber(CONSOLIDATED_SALARY_TOTALS.totalFixedSalaryNutella)}₫`,
      `${formatNumber(CONSOLIDATED_SALARY_TOTALS.grandTotalSalary)}₫`,
    ];

    const tsvContent = [
      headers.join('\t'),
      ...rows.map((r) => r.join('\t')),
      totalRow.join('\t'),
    ].join('\n');

    navigator.clipboard.writeText(tsvContent);
    setCopiedTSV(true);
    setTimeout(() => setCopiedTSV(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Filter, Search & Export Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên nhân sự hoặc STT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Project Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterProject('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterProject === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả (36)
            </button>
            <button
              onClick={() => setFilterProject('nutella')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterProject === 'nutella'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Có làm Nutella
            </button>
            <button
              onClick={() => setFilterProject('ego')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterProject === 'ego'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Có làm EGO
            </button>
            <button
              onClick={() => setFilterProject('vin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterProject === 'vin'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
              }`}
            >
              Có làm VIN
            </button>
            <button
              onClick={() => setFilterProject('high_earner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                filterProject === 'high_earner'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Award className="w-3 h-3" />
              Lương ≥ 4 Tr
            </button>
          </div>

          {/* Action buttons: Copy TSV, Export CSV, Print */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-copy-tsv"
              onClick={handleCopyTSV}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
                copiedTSV
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
              title="Sao chép toàn bộ bảng TSV để dán trực tiếp vào Google Sheets / Microsoft Excel"
            >
              {copiedTSV ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTSV ? 'Đã chép Excel' : 'Copy Excel'}</span>
            </button>

            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
              title="Tải xuống tệp CSV UTF-8 tiếng Việt"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất CSV</span>
            </button>

            <button
              id="btn-print-salary"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-2xs text-slate-500 pt-1 border-t border-slate-100 flex-wrap gap-2">
          <span>
            Đang hiển thị <strong>{processedData.length}</strong> / 36 nhân sự
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Top grouping row */}
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold text-2xs uppercase tracking-wider select-none">
                <th colSpan={2} className="py-2 px-2 border-r border-slate-300">
                  Nhân Sự
                </th>
                <th colSpan={2} className="py-2 px-1.5 text-center bg-blue-50/90 text-blue-900 border-r border-slate-300">
                  KPI VIN (50k/h)
                </th>
                <th colSpan={2} className="py-2 px-1.5 text-center bg-indigo-50/90 text-indigo-900 border-r border-slate-300">
                  KPI EGO (50k/h)
                </th>
                <th colSpan={2} className="py-2 px-1.5 text-center bg-amber-50/90 text-amber-900 border-r border-slate-300">
                  KPI NUT (7k/h)
                </th>
                <th colSpan={2} className="py-2 px-1.5 text-center bg-purple-50/90 text-purple-900 border-r border-slate-300">
                  QA NUT (2k/h)
                </th>
                <th colSpan={2} className="py-2 px-1.5 text-center bg-cyan-50/90 text-cyan-900 border-r border-slate-300">
                  CỨNG VIN (153k/c)
                </th>
                <th colSpan={2} className="py-2 px-1.5 text-center bg-orange-50/90 text-orange-900 border-r border-slate-300">
                  CỨNG NUT (166k/c)
                </th>
                <th colSpan={2} className="py-2 px-2 text-center bg-emerald-100 text-emerald-950 font-black">
                  TỔNG LƯƠNG & PHIẾU
                </th>
              </tr>

              {/* Sub header row */}
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-2xs font-semibold select-none">
                {/* STT */}
                <th
                  onClick={() => handleSort('stt')}
                  className="py-2 px-1 w-8 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <span>STT</span>
                    {sortCol === 'stt' && <ArrowUpDown className="w-2.5 h-2.5 text-indigo-600 ml-0.5" />}
                  </div>
                </th>

                {/* Name */}
                <th
                  onClick={() => handleSort('name')}
                  className="py-2 px-2 min-w-[125px] cursor-pointer hover:bg-slate-100 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>Họ và Tên</span>
                    {sortCol === 'name' && <ArrowUpDown className="w-2.5 h-2.5 text-indigo-600" />}
                  </div>
                </th>

                {/* KPI VIN: hours */}
                <th
                  onClick={() => handleSort('kpiVinHours')}
                  className="py-2 px-1.5 text-right min-w-[46px] cursor-pointer hover:bg-blue-100/60 bg-blue-50/30 transition-colors"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Giờ</span>
                    {sortCol === 'kpiVinHours' && <ArrowUpDown className="w-2.5 h-2.5 text-blue-600" />}
                  </div>
                </th>

                {/* KPI VIN: salary */}
                <th
                  onClick={() => handleSort('kpiVinSalary')}
                  className="py-2 px-1.5 text-right min-w-[68px] cursor-pointer hover:bg-blue-100/60 bg-blue-50/30 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Lương</span>
                    {sortCol === 'kpiVinSalary' && <ArrowUpDown className="w-2.5 h-2.5 text-blue-600" />}
                  </div>
                </th>

                {/* KPI EGO: hours */}
                <th
                  onClick={() => handleSort('kpiEgoHours')}
                  className="py-2 px-1.5 text-right min-w-[46px] cursor-pointer hover:bg-indigo-100/60 bg-indigo-50/30 transition-colors"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Giờ</span>
                    {sortCol === 'kpiEgoHours' && <ArrowUpDown className="w-2.5 h-2.5 text-indigo-600" />}
                  </div>
                </th>

                {/* KPI EGO: salary */}
                <th
                  onClick={() => handleSort('kpiEgoSalary')}
                  className="py-2 px-1.5 text-right min-w-[70px] cursor-pointer hover:bg-indigo-100/60 bg-indigo-50/30 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Lương</span>
                    {sortCol === 'kpiEgoSalary' && <ArrowUpDown className="w-2.5 h-2.5 text-indigo-600" />}
                  </div>
                </th>

                {/* KPI NUTELLA: hours */}
                <th
                  onClick={() => handleSort('kpiNutellaHours')}
                  className="py-2 px-1.5 text-right min-w-[46px] cursor-pointer hover:bg-amber-100/60 bg-amber-50/30 transition-colors"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Giờ</span>
                    {sortCol === 'kpiNutellaHours' && <ArrowUpDown className="w-2.5 h-2.5 text-amber-600" />}
                  </div>
                </th>

                {/* KPI NUTELLA: salary */}
                <th
                  onClick={() => handleSort('kpiNutellaSalary')}
                  className="py-2 px-1.5 text-right min-w-[72px] cursor-pointer hover:bg-amber-100/60 bg-amber-50/30 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Lương</span>
                    {sortCol === 'kpiNutellaSalary' && <ArrowUpDown className="w-2.5 h-2.5 text-amber-600" />}
                  </div>
                </th>

                {/* KPI QA NUTELLA: hours */}
                <th
                  onClick={() => handleSort('kpiQaNutellaHours')}
                  className="py-2 px-1.5 text-right min-w-[44px] cursor-pointer hover:bg-purple-100/60 bg-purple-50/30 transition-colors"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Giờ</span>
                    {sortCol === 'kpiQaNutellaHours' && <ArrowUpDown className="w-2.5 h-2.5 text-purple-600" />}
                  </div>
                </th>

                {/* KPI QA NUTELLA: salary */}
                <th
                  onClick={() => handleSort('kpiQaNutellaSalary')}
                  className="py-2 px-1.5 text-right min-w-[68px] cursor-pointer hover:bg-purple-100/60 bg-purple-50/30 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Lương</span>
                    {sortCol === 'kpiQaNutellaSalary' && <ArrowUpDown className="w-2.5 h-2.5 text-purple-600" />}
                  </div>
                </th>

                {/* WORKDAYS VIN */}
                <th
                  onClick={() => handleSort('workdaysVin')}
                  className="py-2 px-1.5 text-right min-w-[44px] cursor-pointer hover:bg-cyan-100/60 bg-cyan-50/30 transition-colors"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Công</span>
                    {sortCol === 'workdaysVin' && <ArrowUpDown className="w-2.5 h-2.5 text-cyan-600" />}
                  </div>
                </th>

                {/* FIXED SALARY VIN */}
                <th
                  onClick={() => handleSort('fixedSalaryVin')}
                  className="py-2 px-1.5 text-right min-w-[70px] cursor-pointer hover:bg-cyan-100/60 bg-cyan-50/30 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Lương</span>
                    {sortCol === 'fixedSalaryVin' && <ArrowUpDown className="w-2.5 h-2.5 text-cyan-600" />}
                  </div>
                </th>

                {/* WORKDAYS NUTELLA */}
                <th
                  onClick={() => handleSort('workdaysNutella')}
                  className="py-2 px-1.5 text-right min-w-[46px] cursor-pointer hover:bg-orange-100/60 bg-orange-50/30 transition-colors"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Công</span>
                    {sortCol === 'workdaysNutella' && <ArrowUpDown className="w-2.5 h-2.5 text-orange-600" />}
                  </div>
                </th>

                {/* FIXED SALARY NUTELLA */}
                <th
                  onClick={() => handleSort('fixedSalaryNutella')}
                  className="py-2 px-1.5 text-right min-w-[72px] cursor-pointer hover:bg-orange-100/60 bg-orange-50/30 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Lương</span>
                    {sortCol === 'fixedSalaryNutella' && <ArrowUpDown className="w-2.5 h-2.5 text-orange-600" />}
                  </div>
                </th>

                {/* TOTAL SALARY */}
                <th
                  onClick={() => handleSort('totalSalary')}
                  className="py-2 px-2 text-right min-w-[88px] cursor-pointer hover:bg-emerald-200 bg-emerald-100 text-emerald-950 font-black transition-colors"
                >
                  <div className="flex items-center justify-end gap-0.5">
                    <span>Tổng Lương</span>
                    {sortCol === 'totalSalary' && <ArrowUpDown className="w-2.5 h-2.5 text-emerald-800" />}
                  </div>
                </th>

                {/* Action */}
                <th className="py-2 px-1 text-center bg-slate-50 w-12">
                  <span>Phiếu</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-mono text-2xs">
              {processedData.map((item, index) => {
                const isHighEarner = item.totalSalary >= 4000000;
                return (
                  <tr
                    key={item.stt}
                    onClick={() => setSelectedPerson(item)}
                    className={`hover:bg-amber-50/40 transition-colors cursor-pointer group ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                    }`}
                  >
                    {/* STT */}
                    <td className="py-1.5 px-1 text-slate-400 text-center font-mono text-3xs">
                      {item.stt}
                    </td>

                    {/* Tên */}
                    <td className="py-1.5 px-2 font-sans font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors border-r border-slate-200 text-xs whitespace-nowrap">
                      <div className="flex items-center justify-between gap-1">
                        <span>{item.name}</span>
                        {isHighEarner && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 ml-1"
                            title="Lương trên 4 triệu VNĐ"
                          ></span>
                        )}
                      </div>
                    </td>

                    {/* KPI VIN: h */}
                    <td className="py-1.5 px-1.5 text-right text-slate-700 bg-blue-50/10">
                      {item.kpiVinHours !== null ? item.kpiVinHours.toLocaleString('vi-VN') : <span className="text-slate-300">-</span>}
                    </td>

                    {/* LƯƠNG KPI VIN */}
                    <td className="py-1.5 px-1.5 text-right text-slate-700 bg-blue-50/10 border-r border-slate-200">
                      {item.kpiVinSalary ? `${formatNumber(item.kpiVinSalary)}₫` : <span className="text-slate-300">-</span>}
                    </td>

                    {/* KPI EGO: h */}
                    <td className="py-1.5 px-1.5 text-right text-slate-700 bg-indigo-50/10">
                      {item.kpiEgoHours !== null ? item.kpiEgoHours.toLocaleString('vi-VN') : <span className="text-slate-300">-</span>}
                    </td>

                    {/* LƯƠNG KPI EGO */}
                    <td className="py-1.5 px-1.5 text-right font-medium text-indigo-700 bg-indigo-50/10 border-r border-slate-200">
                      {item.kpiEgoSalary ? `${formatNumber(item.kpiEgoSalary)}₫` : <span className="text-slate-300">-</span>}
                    </td>

                    {/* KPI NUTELLA: h */}
                    <td className="py-1.5 px-1.5 text-right font-medium text-slate-800 bg-amber-50/10">
                      {item.kpiNutellaHours !== null ? item.kpiNutellaHours.toLocaleString('vi-VN') : <span className="text-slate-300">-</span>}
                    </td>

                    {/* LƯƠNG KPI NUTELLA */}
                    <td className="py-1.5 px-1.5 text-right font-semibold text-amber-900 bg-amber-50/10 border-r border-slate-200">
                      {item.kpiNutellaSalary ? `${formatNumber(item.kpiNutellaSalary)}₫` : <span className="text-slate-300">-</span>}
                    </td>

                    {/* KPI QA NUTELLA: h */}
                    <td className="py-1.5 px-1.5 text-right text-slate-700 bg-purple-50/10">
                      {item.kpiQaNutellaHours !== null ? item.kpiQaNutellaHours.toLocaleString('vi-VN') : <span className="text-slate-300">-</span>}
                    </td>

                    {/* LƯƠNG QA NUTELLA */}
                    <td className="py-1.5 px-1.5 text-right font-medium text-purple-700 bg-purple-50/10 border-r border-slate-200">
                      {item.kpiQaNutellaSalary ? `${formatNumber(item.kpiQaNutellaSalary)}₫` : <span className="text-slate-300">-</span>}
                    </td>

                    {/* NGÀY CÔNG VIN */}
                    <td className="py-1.5 px-1.5 text-right text-slate-700 bg-cyan-50/10">
                      {item.workdaysVin !== null ? item.workdaysVin.toLocaleString('vi-VN') : <span className="text-slate-300">-</span>}
                    </td>

                    {/* LƯƠNG CỨNG VIN */}
                    <td className="py-1.5 px-1.5 text-right text-slate-700 bg-cyan-50/10 border-r border-slate-200">
                      {item.fixedSalaryVin ? `${formatNumber(item.fixedSalaryVin)}₫` : <span className="text-slate-300">-</span>}
                    </td>

                    {/* NGÀY CÔNG NUTELLA */}
                    <td className="py-1.5 px-1.5 text-right text-slate-700 bg-orange-50/10">
                      {item.workdaysNutella !== null ? item.workdaysNutella.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : <span className="text-slate-300">-</span>}
                    </td>

                    {/* LƯƠNG CỨNG NUTELLA */}
                    <td className="py-1.5 px-1.5 text-right font-medium text-orange-800 bg-orange-50/10 border-r border-slate-200">
                      {item.fixedSalaryNutella ? `${formatNumber(item.fixedSalaryNutella)}₫` : <span className="text-slate-300">-</span>}
                    </td>

                    {/* TỔNG LƯƠNG */}
                    <td className="py-1.5 px-2 text-right font-bold text-emerald-700 bg-emerald-50/50 text-xs whitespace-nowrap">
                      {formatNumber(item.totalSalary)}₫
                    </td>

                    {/* Action */}
                    <td className="py-1.5 px-1 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPerson(item);
                        }}
                        className="px-1.5 py-0.5 rounded text-3xs font-sans font-medium bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600 transition-colors"
                      >
                        Phiếu
                      </button>
                    </td>
                  </tr>
                );
              })}

              {processedData.length === 0 && (
                <tr>
                  <td colSpan={16} className="py-8 text-center text-slate-400 text-xs">
                    Không tìm thấy nhân sự phù hợp với tiêu chí lọc.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Total Footer Row */}
            <tfoot className="bg-slate-900 text-white font-mono font-bold text-xs border-t-2 border-slate-900">
              <tr>
                <td className="py-2.5 px-1 text-center text-slate-500 text-2xs">-</td>
                <td className="py-2.5 px-2 font-sans uppercase tracking-wider text-xs border-r border-slate-800 text-slate-200 font-black whitespace-nowrap">
                  TỔNG CỘNG
                </td>
                <td className="py-2.5 px-1.5 text-right text-blue-300 font-mono text-2xs">
                  {CONSOLIDATED_SALARY_TOTALS.totalKpiVinHours.toLocaleString('vi-VN')}
                </td>
                <td className="py-2.5 px-1.5 text-right text-blue-300 border-r border-slate-800 font-mono text-2xs">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.totalKpiVinSalary)}₫
                </td>
                <td className="py-2.5 px-1.5 text-right text-indigo-300 font-mono text-2xs">
                  {CONSOLIDATED_SALARY_TOTALS.totalKpiEgoHours.toLocaleString('vi-VN')}
                </td>
                <td className="py-2.5 px-1.5 text-right text-indigo-300 border-r border-slate-800 font-mono text-2xs">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.totalKpiEgoSalary)}₫
                </td>
                <td className="py-2.5 px-1.5 text-right text-amber-300 font-mono text-2xs">
                  {CONSOLIDATED_SALARY_TOTALS.totalKpiNutellaHours.toLocaleString('vi-VN')}
                </td>
                <td className="py-2.5 px-1.5 text-right text-amber-300 border-r border-slate-800 font-mono text-2xs">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.totalKpiNutellaSalary)}₫
                </td>
                <td className="py-2.5 px-1.5 text-right text-purple-300 font-mono text-2xs">
                  {CONSOLIDATED_SALARY_TOTALS.totalKpiQaNutellaHours.toLocaleString('vi-VN')}
                </td>
                <td className="py-2.5 px-1.5 text-right text-purple-300 border-r border-slate-800 font-mono text-2xs">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.totalKpiQaNutellaSalary)}₫
                </td>
                <td className="py-2.5 px-1.5 text-right text-cyan-300 font-mono text-2xs">
                  {CONSOLIDATED_SALARY_TOTALS.totalWorkdaysVin.toLocaleString('vi-VN')}
                </td>
                <td className="py-2.5 px-1.5 text-right text-cyan-300 border-r border-slate-800 font-mono text-2xs">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.totalFixedSalaryVin)}₫
                </td>
                <td className="py-2.5 px-1.5 text-right text-orange-300 font-mono text-2xs">
                  {CONSOLIDATED_SALARY_TOTALS.totalWorkdaysNutella.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-2.5 px-1.5 text-right text-orange-300 border-r border-slate-800 font-mono text-2xs">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.totalFixedSalaryNutella)}₫
                </td>
                <td className="py-2.5 px-2 text-right text-emerald-400 font-black text-xs sm:text-sm bg-slate-950 whitespace-nowrap">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.grandTotalSalary)}₫
                </td>
                <td className="py-2.5 px-1 text-center text-slate-500 text-2xs">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Detail Breakdown Modal */}
      <ConsolidatedSalaryModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </div>
  );
};
