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
  Users
} from 'lucide-react';

type SortColumn =
  | 'stt'
  | 'name'
  | 'kpiVinHours'
  | 'kpiVinSalary'
  | 'kpiEgoHours'
  | 'kpiEgoSalary'
  | 'workdaysVin'
  | 'fixedSalaryVin'
  | 'workdaysNutella'
  | 'fixedSalaryNutella'
  | 'totalSalary';

export const ConsolidatedSalaryView: React.FC = () => {
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
      result = result.filter((item) => (item.workdaysNutella || 0) > 0);
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

  // Export CSV function
  const handleExportCSV = () => {
    const headers = [
      'STT',
      'Họ và tên',
      'KPI VIN (h)',
      'LƯƠNG KPI VIN (VNĐ)',
      'KPI EGO (h)',
      'LƯƠNG KPI EGO (VNĐ)',
      'NGÀY CÔNG VIN',
      'LƯƠNG CỨNG VIN (VNĐ)',
      'NGÀY CÔNG NUTELLA',
      'LƯƠNG CỨNG NUTELLA (VNĐ)',
      'TỔNG LƯƠNG (VNĐ)',
    ];

    const rows = CONSOLIDATED_SALARY_DATA.map((item) => [
      item.stt,
      `"${item.name}"`,
      item.kpiVinHours ?? '',
      item.kpiVinSalary ?? '',
      item.kpiEgoHours ?? '',
      item.kpiEgoSalary ?? '',
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
        'Tên Job,Đơn giá (VNĐ)',
        'KPI VIN,50000',
        'KPI EGO,50000',
        'LƯƠNG CỨNG VIN,153000',
        'LƯƠNG CỨNG NUTELLA,166000',
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

  // Copy TSV for Excel
  const handleCopyTSV = () => {
    const headers = [
      'STT',
      'Họ và tên',
      'KPI VIN (h)',
      'LƯƠNG KPI VIN (VNĐ)',
      'KPI EGO (h)',
      'LƯƠNG KPI EGO (VNĐ)',
      'NGÀY CÔNG VIN',
      'LƯƠNG CỨNG VIN (VNĐ)',
      'NGÀY CÔNG NUTELLA',
      'LƯƠNG CỨNG NUTELLA (VNĐ)',
      'TỔNG LƯƠNG (VNĐ)',
    ];

    const rows = processedData.map((item) => [
      item.stt,
      item.name,
      item.kpiVinHours ?? '',
      item.kpiVinSalary ?? '',
      item.kpiEgoHours ?? '',
      item.kpiEgoSalary ?? '',
      item.workdaysVin ?? '',
      item.fixedSalaryVin ?? '',
      item.workdaysNutella ?? '',
      item.fixedSalaryNutella ?? '',
      item.totalSalary,
    ]);

    const tsvContent = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
    navigator.clipboard.writeText(tsvContent);
    setCopiedTSV(true);
    setTimeout(() => setCopiedTSV(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 no-print">
        {/* Card 1: Grand Total */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-emerald-800">
              Tổng Ngân Sách Thực Lĩnh
            </span>
            <div className="text-lg sm:text-xl font-mono font-bold text-slate-900">
              {formatCurrencyVND(CONSOLIDATED_SALARY_TOTALS.grandTotalSalary)}
            </div>
            <p className="text-2xs text-slate-500">
              Chi trả đầy đủ cho <strong>{CONSOLIDATED_SALARY_TOTALS.personnelCount} nhân sự</strong>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: KPI EGO */}
        <div className="bg-white rounded-2xl p-4 border border-indigo-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-indigo-800">
              KPI Dự Án EGO (50k/h)
            </span>
            <div className="text-lg sm:text-xl font-mono font-bold text-indigo-950">
              {formatCurrencyVND(CONSOLIDATED_SALARY_TOTALS.totalKpiEgoSalary)}
            </div>
            <p className="text-2xs text-slate-500">
              Tổng <strong>{CONSOLIDATED_SALARY_TOTALS.totalKpiEgoHours.toFixed(2)}h</strong> Pass nghiệm thu EGO
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Lương Cứng NUTELLA */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-amber-800">
              Lương Cứng NUTELLA (166k/công)
            </span>
            <div className="text-lg sm:text-xl font-mono font-bold text-amber-950">
              {formatCurrencyVND(CONSOLIDATED_SALARY_TOTALS.totalFixedSalaryNutella)}
            </div>
            <p className="text-2xs text-slate-500">
              Tổng <strong>{CONSOLIDATED_SALARY_TOTALS.totalWorkdaysNutella.toFixed(1)} ngày công</strong> dự án Nutella
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Dự Án VIN */}
        <div className="bg-white rounded-2xl p-4 border border-cyan-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-cyan-800">
              Tổng Dự Án VIN (KPI + Cứng)
            </span>
            <div className="text-lg sm:text-xl font-mono font-bold text-cyan-950">
              {formatCurrencyVND(CONSOLIDATED_SALARY_TOTALS.totalKpiVinSalary + CONSOLIDATED_SALARY_TOTALS.totalFixedSalaryVin)}
            </div>
            <p className="text-2xs text-slate-500">
              <strong>{CONSOLIDATED_SALARY_TOTALS.totalKpiVinHours.toFixed(2)}h</strong> KPI + <strong>{CONSOLIDATED_SALARY_TOTALS.totalWorkdaysVin.toFixed(1)} công</strong> (153k)
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 border border-cyan-100">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

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
              title="Sao chép dạng bảng TSV để dán trực tiếp vào Microsoft Excel hoặc Google Sheets"
            >
              {copiedTSV ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTSV ? 'Đã chép' : 'Copy Excel'}</span>
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

        <div className="flex items-center justify-between text-2xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Đang hiển thị <strong>{processedData.length}</strong> / 36 nhân sự
          </span>
          <span>* Nhấp vào từng dòng để xem phiếu chi tiết và công thức tính</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Top grouping row */}
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold text-2xs uppercase tracking-wider">
                <th colSpan={2} className="py-2.5 px-3 border-r border-slate-300">
                  Nhân Sự
                </th>
                <th colSpan={2} className="py-2.5 px-3 text-center bg-blue-50/80 text-blue-900 border-r border-slate-300">
                  KPI VIN (50k/h)
                </th>
                <th colSpan={2} className="py-2.5 px-3 text-center bg-indigo-50/80 text-indigo-900 border-r border-slate-300">
                  KPI EGO (50k/h)
                </th>
                <th colSpan={2} className="py-2.5 px-3 text-center bg-cyan-50/80 text-cyan-900 border-r border-slate-300">
                  Lương Cứng VIN (153k/ngày)
                </th>
                <th colSpan={2} className="py-2.5 px-3 text-center bg-amber-50/80 text-amber-900 border-r border-slate-300">
                  Lương Cứng NUTELLA (166k/ngày)
                </th>
                <th colSpan={2} className="py-2.5 px-3 text-center bg-emerald-100/90 text-emerald-950 font-extrabold">
                  Tổng Nhận & Thao Tác
                </th>
              </tr>

              {/* Sub header row */}
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-2xs font-semibold">
                {/* STT */}
                <th
                  onClick={() => handleSort('stt')}
                  className="py-2.5 px-3 w-12 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>STT</span>
                    {sortCol === 'stt' && <ArrowUpDown className="w-3 h-3 text-indigo-600" />}
                  </div>
                </th>

                {/* Name */}
                <th
                  onClick={() => handleSort('name')}
                  className="py-2.5 px-3 min-w-[160px] cursor-pointer hover:bg-slate-100 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>Họ và tên</span>
                    {sortCol === 'name' && <ArrowUpDown className="w-3 h-3 text-indigo-600" />}
                  </div>
                </th>

                {/* KPI VIN: hours */}
                <th
                  onClick={() => handleSort('kpiVinHours')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-blue-100/50 bg-blue-50/30 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Giờ (h)</span>
                    {sortCol === 'kpiVinHours' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                  </div>
                </th>

                {/* KPI VIN: salary */}
                <th
                  onClick={() => handleSort('kpiVinSalary')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-blue-100/50 bg-blue-50/30 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Lương (VNĐ)</span>
                    {sortCol === 'kpiVinSalary' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                  </div>
                </th>

                {/* KPI EGO: hours */}
                <th
                  onClick={() => handleSort('kpiEgoHours')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-indigo-100/50 bg-indigo-50/30 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Giờ (h)</span>
                    {sortCol === 'kpiEgoHours' && <ArrowUpDown className="w-3 h-3 text-indigo-600" />}
                  </div>
                </th>

                {/* KPI EGO: salary */}
                <th
                  onClick={() => handleSort('kpiEgoSalary')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-indigo-100/50 bg-indigo-50/30 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Lương (VNĐ)</span>
                    {sortCol === 'kpiEgoSalary' && <ArrowUpDown className="w-3 h-3 text-indigo-600" />}
                  </div>
                </th>

                {/* WORKDAYS VIN */}
                <th
                  onClick={() => handleSort('workdaysVin')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-cyan-100/50 bg-cyan-50/30 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Ngày</span>
                    {sortCol === 'workdaysVin' && <ArrowUpDown className="w-3 h-3 text-cyan-600" />}
                  </div>
                </th>

                {/* FIXED SALARY VIN */}
                <th
                  onClick={() => handleSort('fixedSalaryVin')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-cyan-100/50 bg-cyan-50/30 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Lương (VNĐ)</span>
                    {sortCol === 'fixedSalaryVin' && <ArrowUpDown className="w-3 h-3 text-cyan-600" />}
                  </div>
                </th>

                {/* WORKDAYS NUTELLA */}
                <th
                  onClick={() => handleSort('workdaysNutella')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-amber-100/50 bg-amber-50/30 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Ngày</span>
                    {sortCol === 'workdaysNutella' && <ArrowUpDown className="w-3 h-3 text-amber-600" />}
                  </div>
                </th>

                {/* FIXED SALARY NUTELLA */}
                <th
                  onClick={() => handleSort('fixedSalaryNutella')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-amber-100/50 bg-amber-50/30 transition-colors border-r border-slate-200"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Lương (VNĐ)</span>
                    {sortCol === 'fixedSalaryNutella' && <ArrowUpDown className="w-3 h-3 text-amber-600" />}
                  </div>
                </th>

                {/* TOTAL SALARY */}
                <th
                  onClick={() => handleSort('totalSalary')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-emerald-100 bg-emerald-50/60 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1 font-bold text-emerald-900">
                    <span>TỔNG LƯƠNG</span>
                    {sortCol === 'totalSalary' && <ArrowUpDown className="w-3 h-3 text-emerald-700" />}
                  </div>
                </th>

                {/* Action */}
                <th className="py-2.5 px-3 text-center bg-slate-50 w-16">
                  <span>Phiếu</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 font-mono">
              {processedData.map((item) => {
                const isHighEarner = item.totalSalary >= 4000000;
                return (
                  <tr
                    key={item.stt}
                    onClick={() => setSelectedPerson(item)}
                    className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                  >
                    {/* STT */}
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-center">
                      {item.stt}
                    </td>

                    {/* Họ và tên */}
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors border-r border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {isHighEarner && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                            title="Lương trên 4 triệu VNĐ"
                          ></span>
                        )}
                      </div>
                    </td>

                    {/* KPI VIN: h */}
                    <td className="py-2.5 px-3 text-right text-slate-700 bg-blue-50/10">
                      {item.kpiVinHours !== null ? item.kpiVinHours.toFixed(2) : '-'}
                    </td>

                    {/* KPI VIN: salary */}
                    <td className="py-2.5 px-3 text-right text-slate-700 bg-blue-50/10 border-r border-slate-200">
                      {item.kpiVinSalary !== null ? formatNumber(item.kpiVinSalary) : '-'}
                    </td>

                    {/* KPI EGO: h */}
                    <td className="py-2.5 px-3 text-right font-medium text-slate-900 bg-indigo-50/10">
                      {item.kpiEgoHours !== null ? item.kpiEgoHours.toFixed(2) : '-'}
                    </td>

                    {/* KPI EGO: salary */}
                    <td className="py-2.5 px-3 text-right font-medium text-indigo-700 bg-indigo-50/10 border-r border-slate-200">
                      {item.kpiEgoSalary !== null ? formatNumber(item.kpiEgoSalary) : '-'}
                    </td>

                    {/* NGÀY CÔNG VIN */}
                    <td className="py-2.5 px-3 text-right text-slate-700 bg-cyan-50/10">
                      {item.workdaysVin !== null ? item.workdaysVin : '-'}
                    </td>

                    {/* LƯƠNG CỨNG VIN */}
                    <td className="py-2.5 px-3 text-right text-slate-700 bg-cyan-50/10 border-r border-slate-200">
                      {item.fixedSalaryVin !== null ? formatNumber(item.fixedSalaryVin) : '-'}
                    </td>

                    {/* NGÀY CÔNG NUTELLA */}
                    <td className="py-2.5 px-3 text-right font-medium text-slate-900 bg-amber-50/10">
                      {item.workdaysNutella !== null ? item.workdaysNutella : '-'}
                    </td>

                    {/* LƯƠNG CỨNG NUTELLA */}
                    <td className="py-2.5 px-3 text-right font-medium text-amber-800 bg-amber-50/10 border-r border-slate-200">
                      {item.fixedSalaryNutella !== null ? formatNumber(item.fixedSalaryNutella) : '-'}
                    </td>

                    {/* TỔNG LƯƠNG */}
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700 bg-emerald-50/40 text-xs sm:text-sm">
                      {formatNumber(item.totalSalary)} đ
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPerson(item);
                        }}
                        className="px-2 py-1 rounded text-3xs font-sans font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Total Footer Row */}
            <tfoot className="bg-slate-900 text-white font-mono font-bold text-xs border-t-2 border-slate-900">
              <tr>
                <td className="py-3 px-3 text-center">-</td>
                <td className="py-3 px-3 font-sans uppercase tracking-wider text-xs border-r border-slate-800">
                  TỔNG CỘNG
                </td>
                <td className="py-3 px-3 text-right text-blue-300">
                  {CONSOLIDATED_SALARY_TOTALS.totalKpiVinHours.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right text-blue-300 border-r border-slate-800">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.totalKpiVinSalary)}
                </td>
                <td className="py-3 px-3 text-right text-indigo-300">
                  {CONSOLIDATED_SALARY_TOTALS.totalKpiEgoHours.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right text-indigo-300 border-r border-slate-800">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.totalKpiEgoSalary)}
                </td>
                <td className="py-3 px-3 text-right text-cyan-300">
                  {CONSOLIDATED_SALARY_TOTALS.totalWorkdaysVin.toFixed(1)}
                </td>
                <td className="py-3 px-3 text-right text-cyan-300 border-r border-slate-800">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.totalFixedSalaryVin)}
                </td>
                <td className="py-3 px-3 text-right text-amber-300">
                  {CONSOLIDATED_SALARY_TOTALS.totalWorkdaysNutella.toFixed(1)}
                </td>
                <td className="py-3 px-3 text-right text-amber-300 border-r border-slate-800">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.totalFixedSalaryNutella)}
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 font-extrabold text-sm">
                  {formatNumber(CONSOLIDATED_SALARY_TOTALS.grandTotalSalary)} đ
                </td>
                <td className="py-3 px-3 text-center">-</td>
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
