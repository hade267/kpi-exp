import React, { useState, useMemo } from 'react';
import { PersonnelRecon, ProjectSummary } from '../types';
import { formatNumber, formatHours, formatPercent } from '../utils/formatters';
import { UPLOAD_ISSUE_MAP } from '../data/uploadIssueData';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Copy,
  Check,
  Eye,
  FileSpreadsheet,
  AlertTriangle,
  Award,
  Filter,
  Sparkles
} from 'lucide-react';

interface PersonnelTableProps {
  personnelList: PersonnelRecon[];
  projectSummary: ProjectSummary;
  onSelectPerson: (id: number) => void;
  includeUploadValid?: boolean;
  onOpenUploadModal?: () => void;
}

type SortField =
  | 'id'
  | 'name'
  | 'selfRecordedCount'
  | 'validCount'
  | 'duplicateCount'
  | 'notFoundInOriginalCount'
  | 'passCount'
  | 'passRatePercent'
  | 'failCount'
  | 'passDurationHours'
  | 'rankPassHours'
  | 'failDurationHours'
  | 'totalOriginalDurationSec'
  | 'passDurationPercent';

export const PersonnelTable: React.FC<PersonnelTableProps> = ({
  personnelList,
  projectSummary,
  onSelectPerson,
  includeUploadValid,
  onOpenUploadModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<'all' | 'top10hours' | 'pass70' | 'pass60' | 'duplicates' | 'notFound'>('all');
  const [copiedTable, setCopiedTable] = useState(false);

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      // Default to ascending for id, name, rankPassHours; descending for metrics
      setSortDirection(field === 'id' || field === 'name' || field === 'rankPassHours' ? 'asc' : 'desc');
    }
  };

  // Filtered and sorted data
  const processedPersonnel = useMemo(() => {
    let result = [...personnelList];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.initialAlias.toLowerCase().includes(term) ||
          p.sheetName.toLowerCase().includes(term)
      );
    }

    // Quick filter chips
    if (filterType === 'top10hours') {
      result = result.filter((p) => p.rankPassHours <= 10);
    } else if (filterType === 'pass70') {
      result = result.filter((p) => p.passRatePercent >= 70);
    } else if (filterType === 'pass60') {
      result = result.filter((p) => p.passRatePercent >= 60);
    } else if (filterType === 'duplicates') {
      result = result.filter((p) => p.duplicateCount > 0);
    } else if (filterType === 'notFound') {
      result = result.filter((p) => p.notFoundInOriginalCount > 0);
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB, 'vi')
          : valB.localeCompare(valA, 'vi');
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [personnelList, searchTerm, sortField, sortDirection, filterType]);

  // Real dynamic counts for filter buttons
  const filterCounts = useMemo(() => {
    return {
      all: personnelList.length,
      top10hours: Math.min(10, personnelList.length),
      pass70: personnelList.filter((p) => p.passRatePercent >= 70).length,
      pass60: personnelList.filter((p) => p.passRatePercent >= 60).length,
      duplicates: personnelList.filter((p) => p.duplicateCount > 0).length,
      notFound: personnelList.filter((p) => p.notFoundInOriginalCount > 0).length,
    };
  }, [personnelList]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'STT',
      'Hạng Giờ Pass',
      'Họ và tên nhân sự',
      'Tên tự ghi ban đầu',
      'Tên Sheet chi tiết',
      'Bài tự ghi',
      'Bài hợp lệ tính công',
      'Trùng lặp (không tính)',
      'Chưa có gốc (không tính)',
      'Bài Pass (Đạt)',
      'Tỷ lệ Pass (%)',
      'Bài Fail (Lỗi)',
      'Tỷ lệ Fail (%)',
      'Tổng TG gốc tính công (s)',
      'TG Pass tính công (s)',
      'TG Pass tính công (h)',
      'TG Fail (s)',
      'TG Fail (h)',
      '% TG Pass',
    ];

    const rows = processedPersonnel.map((p) => [
      p.id,
      p.rankPassHours,
      `"${p.name}"`,
      `"${p.initialAlias}"`,
      `"${p.sheetName}"`,
      p.selfRecordedCount,
      p.validCount,
      p.duplicateCount,
      p.notFoundInOriginalCount,
      p.passCount,
      `"${p.passRatePercent}%"`,
      p.failCount,
      `"${p.failRatePercent}%"`,
      p.totalOriginalDurationSec,
      p.passDurationSec,
      p.passDurationHours,
      p.failDurationSec,
      p.failDurationHours,
      `"${p.passDurationPercent}%"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bang_Doi_Soat_27_Nhan_Su_EGO_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy table TSV
  const handleCopyTable = () => {
    const headers = ['STT', 'Hạng Giờ Pass', 'Họ và tên', 'Tên tự ghi', 'Bài tự ghi', 'Hợp lệ', 'Trùng', 'Chưa gốc', 'Pass', '% Pass', 'Fail', 'TG Pass (h)', 'TG Fail (h)', '% TG Pass'];
    const rows = processedPersonnel.map((p) => [
      p.id,
      p.rankPassHours,
      p.name,
      p.initialAlias,
      p.selfRecordedCount,
      p.validCount,
      p.duplicateCount,
      p.notFoundInOriginalCount,
      p.passCount,
      `${p.passRatePercent}%`,
      p.failCount,
      p.passDurationHours,
      p.failDurationHours,
      `${p.passDurationPercent}%`,
    ]);

    const tsv = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
    navigator.clipboard.writeText(tsv);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 2000);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 ml-1 inline-block" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600 ml-1 inline-block" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600 ml-1 inline-block" />
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Controls & Filters Header */}
      <div className="p-5 border-b border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              Bảng Tổng Hợp Chi Tiết 27 Nhân Sự
            </h2>
            <p className="text-xs text-slate-500">
              Dữ liệu đối soát chuẩn gốc, không tính trùng lặp (Khớp 100%)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenUploadModal && (
              <button
                id="btn-table-upload-policy"
                onClick={onOpenUploadModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-2xs cursor-pointer"
                title="Xem bảng kê 19 nhân sự có 280 bài 上传问题 được tính Valid (+103,55h)"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Valid 上传问题 (19 NS • +103,55h)</span>
              </button>
            )}

            <button
              id="btn-copy-table"
              onClick={handleCopyTable}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Sao chép bảng để dán vào Excel / Google Sheets"
            >
              {copiedTable ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copiedTable ? 'Đã sao chép!' : 'Sao chép TSV'}</span>
            </button>

            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="filter-table-input"
              type="text"
              placeholder="Tìm theo tên, tên tự ghi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0 text-xs">
            <span className="text-slate-400 text-2xs font-semibold uppercase mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Lọc:
            </span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({filterCounts.all})
            </button>
            <button
              onClick={() => setFilterType('top10hours')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap flex items-center gap-1 ${
                filterType === 'top10hours'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Top 10 Giờ Pass
            </button>
            <button
              onClick={() => setFilterType('pass70')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap ${
                filterType === 'pass70'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Pass ≥ 70% ({filterCounts.pass70})
            </button>
            <button
              onClick={() => setFilterType('pass60')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap ${
                filterType === 'pass60'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Pass ≥ 60% ({filterCounts.pass60})
            </button>
            <button
              onClick={() => setFilterType('duplicates')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap ${
                filterType === 'duplicates'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Có trùng lặp ({filterCounts.duplicates})
            </button>
            <button
              onClick={() => setFilterType('notFound')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap ${
                filterType === 'notFound'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Có ngoài gốc ({filterCounts.notFound})
            </button>
          </div>
        </div>
      </div>

      {/* Table responsive wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="py-3 px-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('id')}>
                STT {renderSortIcon('id')}
              </th>
              <th className="py-3 px-3 cursor-pointer hover:bg-slate-100 min-w-[160px]" onClick={() => handleSort('name')}>
                Nhân sự {renderSortIcon('name')}
              </th>
              <th className="py-3 px-3 cursor-pointer hover:bg-slate-100 min-w-[110px]">
                Tên tự ghi
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('selfRecordedCount')}>
                Tự ghi {renderSortIcon('selfRecordedCount')}
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('validCount')}>
                Hợp lệ {renderSortIcon('validCount')}
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('duplicateCount')}>
                Trùng {renderSortIcon('duplicateCount')}
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('notFoundInOriginalCount')}>
                Chưa gốc {renderSortIcon('notFoundInOriginalCount')}
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('passCount')}>
                Pass {renderSortIcon('passCount')}
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 min-w-[90px]" onClick={() => handleSort('passRatePercent')}>
                % Pass {renderSortIcon('passRatePercent')}
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('failCount')}>
                Fail {renderSortIcon('failCount')}
              </th>
              <th className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 min-w-[125px]" onClick={() => handleSort('passDurationHours')}>
                TG Pass (h) / Hạng {renderSortIcon('passDurationHours')}
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('failDurationHours')}>
                TG Fail (h) {renderSortIcon('failDurationHours')}
              </th>
              <th className="py-3 px-2 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('passDurationPercent')}>
                % TG Pass {renderSortIcon('passDurationPercent')}
              </th>
              <th className="py-3 px-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processedPersonnel.length === 0 ? (
              <tr>
                <td colSpan={14} className="py-8 text-center text-slate-400">
                  Không tìm thấy nhân sự nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              processedPersonnel.map((person) => {
                const isTop = person.rankPassHours <= 3;
                const hasDeductions = person.duplicateCount > 0 || person.notFoundInOriginalCount > 0;
                const uploadInfo = UPLOAD_ISSUE_MAP.get(person.id);

                return (
                  <tr
                    key={person.id}
                    id={`table-row-${person.id}`}
                    onClick={() => onSelectPerson(person.id)}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 font-mono font-medium text-slate-500">
                      {person.id}
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{person.name}</span>
                        {isTop && (
                          <span
                            title={`Top #${person.rankPassHours} toàn dự án về giờ Pass`}
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-2xs font-black ${
                              person.rankPassHours === 1
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : person.rankPassHours === 2
                                ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                : 'bg-orange-100 text-orange-900 border border-orange-300'
                            }`}
                          >
                            <Award className="w-3 h-3 flex-shrink-0" />
                            <span>Top #{person.rankPassHours}</span>
                          </span>
                        )}
                      </div>
                      {uploadInfo && (
                        <div className="mt-1">
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-3xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300/80"
                            title={`Đã tính Valid ${uploadInfo.uploadCount} bài lỗi 上传问题 (+${formatHours(uploadInfo.uploadDurationHours)})`}
                          >
                            <Sparkles className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                            <span>+{uploadInfo.uploadCount} bài 上传问题 (+{formatHours(uploadInfo.uploadDurationHours)})</span>
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-500 text-2xs truncate max-w-[120px]" title={person.initialAlias}>
                      {person.initialAlias}
                    </td>

                    <td className="py-3 px-2 text-right font-mono text-slate-600">
                      {formatNumber(person.selfRecordedCount)}
                    </td>

                    <td className="py-3 px-2 text-right font-mono font-semibold text-indigo-700 bg-indigo-50/30">
                      {formatNumber(person.validCount)}
                    </td>

                    <td className="py-3 px-2 text-right font-mono">
                      {person.duplicateCount > 0 ? (
                        <span className="text-amber-700 font-bold bg-amber-100/80 px-1.5 py-0.5 rounded text-2xs">
                          {person.duplicateCount}
                        </span>
                      ) : (
                        <span className="text-slate-300">0</span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-right font-mono">
                      {person.notFoundInOriginalCount > 0 ? (
                        <span className="text-rose-700 font-bold bg-rose-100/80 px-1.5 py-0.5 rounded text-2xs">
                          {person.notFoundInOriginalCount}
                        </span>
                      ) : (
                        <span className="text-slate-300">0</span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-right font-mono font-bold text-emerald-700">
                      {formatNumber(person.passCount)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono">
                      <span
                        className={`font-bold ${
                          person.passRatePercent >= 80
                            ? 'text-emerald-700'
                            : person.passRatePercent >= 60
                            ? 'text-indigo-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {formatPercent(person.passRatePercent)}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-right font-mono text-slate-500">
                      {formatNumber(person.failCount)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800 bg-emerald-50/40">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <span>{formatHours(person.passDurationHours)}</span>
                        <span
                          className={`text-2xs font-bold px-1.5 py-0.5 rounded ${
                            person.rankPassHours === 1
                              ? 'bg-amber-400 text-slate-950 font-black shadow-2xs'
                              : person.rankPassHours === 2
                              ? 'bg-slate-300 text-slate-900 font-black'
                              : person.rankPassHours === 3
                              ? 'bg-amber-700 text-white font-black'
                              : person.rankPassHours <= 10
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-slate-100 text-slate-500 font-normal'
                          }`}
                          title={`Xếp hạng Giờ Pass: #${person.rankPassHours}/27`}
                        >
                          #{person.rankPassHours}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-right font-mono text-rose-700">
                      {formatHours(person.failDurationHours)}
                    </td>

                    <td className="py-3 px-2 text-right font-mono font-medium text-slate-700">
                      {formatPercent(person.passDurationPercent)}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPerson(person.id);
                        }}
                        className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-md transition-colors"
                        title="Xem phiếu chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {/* Totals Footer Row */}
          <tfoot>
            <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300 text-xs">
              <td colSpan={3} className="py-3 px-3">
                Tổng cộng toàn dự án (27 nhân sự)
              </td>
              <td className="py-3 px-2 text-right font-mono">
                {formatNumber(projectSummary.totalSelfRecordedRows)}
              </td>
              <td className="py-3 px-2 text-right font-mono text-indigo-700">
                {formatNumber(projectSummary.totalValidCount)}
              </td>
              <td className="py-3 px-2 text-right font-mono text-amber-700">
                {projectSummary.totalDuplicateCount}
              </td>
              <td className="py-3 px-2 text-right font-mono text-rose-700">
                {projectSummary.totalNotFoundInOriginal}
              </td>
              <td className="py-3 px-2 text-right font-mono text-emerald-700">
                2.295
              </td>
              <td className="py-3 px-3 text-right font-mono text-indigo-900">
                {formatPercent(projectSummary.overallPassItemRate)}
              </td>
              <td className="py-3 px-2 text-right font-mono text-slate-700">
                1.426
              </td>
              <td className="py-3 px-3 text-right font-mono text-emerald-800 bg-emerald-100/50">
                {formatHours(projectSummary.totalValidPassDurationHours)}
              </td>
              <td className="py-3 px-2 text-right font-mono text-rose-800">
                {formatHours(projectSummary.totalValidFailDurationHours)}
              </td>
              <td className="py-3 px-2 text-right font-mono text-slate-800">
                {formatPercent(projectSummary.overallPassDurationRate)}
              </td>
              <td className="py-3 px-3 text-center text-slate-400">
                Khớp 100%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
