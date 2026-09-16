import React, { useState, useMemo } from 'react';
import { DetailedVideoItem } from '../types';
import { PERSONNEL_DATA } from '../data/reconData';
import { getAllDetailedItems, TOP_ERROR_STATS, TASK_CATEGORIES, ERROR_DEFINITIONS, matchesError } from '../data/detailedReconData';
import { formatNumber } from '../utils/formatters';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Tag,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  FileText,
  SlidersHorizontal,
  Info,
  X,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface DetailedReconViewProps {
  initialPersonnelId?: number | null;
  onSelectPerson?: (id: number) => void;
}

export const DetailedReconView: React.FC<DetailedReconViewProps> = ({
  initialPersonnelId = null,
  onSelectPerson,
}) => {
  // Filters
  const [selectedPersonId, setSelectedPersonId] = useState<string>(
    initialPersonnelId ? initialPersonnelId.toString() : 'all'
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pass' | 'Fail'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [errorTypeFilter, setErrorTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Selected item modal
  const [activeItem, setActiveItem] = useState<DetailedVideoItem | null>(null);

  // Load all detailed items
  const allItems = useMemo(() => getAllDetailedItems(), []);

  // Filter items with robust matching
  const filteredItems = useMemo(() => {
    let result = allItems;

    // Filter by personnel
    if (selectedPersonId !== 'all') {
      const pid = parseInt(selectedPersonId, 10);
      result = result.filter((item) => item.personnelId === pid);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      const catLower = categoryFilter.toLowerCase();
      result = result.filter((item) =>
        item.category.toLowerCase().includes(catLower) ||
        item.videoCode.toLowerCase().includes(catLower)
      );
    }

    // Filter by error type (using robust matchesError helper)
    if (errorTypeFilter !== 'all') {
      result = result.filter(
        (item) => item.status === 'Fail' && matchesError(item, errorTypeFilter)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.videoCode.toLowerCase().includes(q) ||
          item.personnelName.toLowerCase().includes(q) ||
          item.alias.toLowerCase().includes(q) ||
          (item.errorReason && item.errorReason.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q) ||
          (item.originalFile && item.originalFile.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allItems, selectedPersonId, statusFilter, categoryFilter, errorTypeFilter, searchQuery]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedPersonId, statusFilter, categoryFilter, errorTypeFilter, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Copy helper
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Scope items: filtered by selected personnel and category (baseline scope for status and error counts)
  const scopeItems = useMemo(() => {
    let res = allItems;
    if (selectedPersonId !== 'all') {
      res = res.filter((i) => i.personnelId.toString() === selectedPersonId);
    }
    if (categoryFilter !== 'all') {
      const cat = categoryFilter.toLowerCase();
      res = res.filter((i) => i.category.toLowerCase().includes(cat) || i.videoCode.toLowerCase().includes(cat));
    }
    return res;
  }, [allItems, selectedPersonId, categoryFilter]);

  // Context counts for the status filter buttons so they reflect the real counts in this scope
  const statusStats = useMemo(() => {
    const total = scopeItems.length;
    const passItems = scopeItems.filter((i) => i.status === 'Pass');
    const failItems = scopeItems.filter((i) => i.status === 'Fail');
    const totalSec = scopeItems.reduce((sum, i) => sum + i.durationSec, 0);
    const passSec = passItems.reduce((sum, i) => sum + i.durationSec, 0);
    const failSec = failItems.reduce((sum, i) => sum + i.durationSec, 0);

    return {
      total,
      pass: passItems.length,
      fail: failItems.length,
      totalHours: (totalSec / 3600).toFixed(2),
      passHours: (passSec / 3600).toFixed(2),
      failHours: (failSec / 3600).toFixed(2),
    };
  }, [scopeItems]);

  // Dynamic error counts mapping for currently selected scope (shows exact real matches)
  const errorCountsMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const stat of TOP_ERROR_STATS) {
      const codeKey = stat.code || stat.category.split('(')[0].trim();
      const count = scopeItems.filter((i) => matchesError(i, codeKey)).length;
      map[codeKey] = count;
      map[stat.category.split('(')[0].trim()] = count;
    }
    return map;
  }, [scopeItems]);

  // KPI calculations for currently filtered set
  const filterStats = useMemo(() => {
    const total = filteredItems.length;
    const pass = filteredItems.filter((i) => i.status === 'Pass').length;
    const fail = total - pass;
    const totalSec = filteredItems.reduce((sum, i) => sum + i.durationSec, 0);
    const passSec = filteredItems.filter((i) => i.status === 'Pass').reduce((sum, i) => sum + i.durationSec, 0);
    const failSec = totalSec - passSec;

    return {
      total,
      pass,
      fail,
      passRate: total > 0 ? (pass / total) * 100 : 0,
      totalHours: (totalSec / 3600).toFixed(2),
      passHours: (passSec / 3600).toFixed(2),
      failHours: (failSec / 3600).toFixed(2),
    };
  }, [filteredItems]);

  // Reset all filters
  const handleResetAllFilters = () => {
    setSelectedPersonId('all');
    setStatusFilter('all');
    setCategoryFilter('all');
    setErrorTypeFilter('all');
    setSearchQuery('');
  };

  // Toggle error filter with automatic conflict avoidance
  const handleToggleErrorFilter = (stat: typeof TOP_ERROR_STATS[0]) => {
    const codeKey = stat.code || stat.category.split('(')[0].trim();
    if (errorTypeFilter === codeKey) {
      setErrorTypeFilter('all');
    } else {
      setErrorTypeFilter(codeKey);
      // Auto-switch away from 'Pass' since errors only apply to 'Fail' items
      if (statusFilter === 'Pass') {
        setStatusFilter('Fail');
      }
    }
  };

  // Status button click handlers
  const handleSelectStatus = (newStatus: 'all' | 'Pass' | 'Fail') => {
    setStatusFilter(newStatus);
    // If user specifically clicks Pass, clear errorTypeFilter so it doesn't conflict
    if (newStatus === 'Pass' && errorTypeFilter !== 'all') {
      setErrorTypeFilter('all');
    }
  };

  const hasActiveFilters =
    selectedPersonId !== 'all' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    errorTypeFilter !== 'all' ||
    searchQuery.trim() !== '';

  const activePersonName = selectedPersonId !== 'all'
    ? PERSONNEL_DATA.find((p) => p.id.toString() === selectedPersonId)?.name
    : null;

  const activeErrorLabel = errorTypeFilter !== 'all'
    ? (TOP_ERROR_STATS.find((s) => s.code === errorTypeFilter || s.category.includes(errorTypeFilter))?.category.split('(')[0].trim() ||
       ERROR_DEFINITIONS.find((d) => d.code === errorTypeFilter)?.label.split('(')[0].trim() ||
       errorTypeFilter)
    : null;

  return (
    <div className="space-y-5">
      {/* Top Header & Overview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Đối Soát Chi Tiết Từng Video
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {formatNumber(filteredItems.length)} bài hiển thị
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Kiểm tra chi tiết từng video, mã tệp, phân loại nhiệm vụ, thời lượng và nguyên nhân trừ giờ
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-2xs text-slate-600">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Đã loại bỏ 100% bài ngoài gốc (83 bài)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium">
                <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                Bài trùng lặp chỉ tính 1 lần duy nhất (4 lượt)
              </span>
            </div>
          </div>

          {/* Quick Filter Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleSelectStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tất cả: {formatNumber(statusStats.total)} bài ({statusStats.totalHours}h)
            </button>
            <button
              onClick={() => handleSelectStatus('Pass')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                statusFilter === 'Pass'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đạt (Pass): {formatNumber(statusStats.pass)} bài ({statusStats.passHours}h)
            </button>
            <button
              onClick={() => handleSelectStatus('Fail')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                statusFilter === 'Fail'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Lỗi (Fail): {formatNumber(statusStats.fail)} bài ({statusStats.failHours}h)
            </button>
          </div>
        </div>

        {/* Top Error Reasons Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Lọc theo nguyên nhân trừ giờ (bấm để lọc chi tiết):
            </span>
            {errorTypeFilter !== 'all' && (
              <button
                onClick={() => setErrorTypeFilter('all')}
                className="text-2xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Bỏ lọc lỗi ({activeErrorLabel})
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {TOP_ERROR_STATS.map((stat) => {
              const codeKey = stat.code || stat.category.split('(')[0].trim();
              const isSelected = errorTypeFilter === codeKey || errorTypeFilter === stat.category.split('(')[0].trim();
              const realCount = errorCountsMap[codeKey] ?? 0;
              return (
                <button
                  key={stat.category}
                  onClick={() => handleToggleErrorFilter(stat)}
                  className={`px-2.5 py-1 rounded-lg text-2xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-1 ring-amber-400'
                      : realCount === 0
                      ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60 hover:bg-slate-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-800'
                  }`}
                  title={`${stat.descVi} (${stat.category}) - ${realCount} bài`}
                >
                  <span>{stat.category.split('(')[0].trim()}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : realCount === 0
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {realCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã video, tên nhân sự..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Personnel Dropdown */}
          <div>
            <select
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
            >
              <option value="all">Tất cả nhân sự (27 người)</option>
              {PERSONNEL_DATA.map((p) => (
                <option key={p.id} value={p.id.toString()}>
                  #{p.id} - {p.name} ({p.initialAlias})
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
            >
              <option value="all">Tất cả hạng mục công việc</option>
              <option value="Sản xuất">Sản xuất - Đóng gói & Phân loại</option>
              <option value="Thủ công">Thủ công - Lắp ráp mô hình</option>
              <option value="Giáo dục">Giáo dục - Sách / Dụng cụ / Mỹ thuật</option>
              <option value="Trò chơi">Trò chơi - Mobile Game & PC</option>
              <option value="Bán lẻ">Bán lẻ - Sắp xếp kệ hàng</option>
            </select>
          </div>

          {/* Error Type Dropdown */}
          <div>
            <select
              value={errorTypeFilter}
              onChange={(e) => {
                const val = e.target.value;
                setErrorTypeFilter(val);
                if (val !== 'all' && statusFilter === 'Pass') {
                  setStatusFilter('Fail');
                }
              }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
            >
              <option value="all">Tất cả nguyên nhân lỗi (13 loại)</option>
              {TOP_ERROR_STATS.map((err) => {
                const val = err.code || err.category.split('(')[0].trim();
                const realCount = errorCountsMap[val] ?? 0;
                return (
                  <option key={val} value={val}>
                    {err.category.split('(')[0].trim()} ({realCount} bài)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Page Size & Reset */}
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 w-full"
            >
              <option value="25">25 dòng/trang</option>
              <option value="50">50 dòng/trang</option>
              <option value="100">100 dòng/trang</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetAllFilters}
                className="px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors whitespace-nowrap flex items-center gap-1"
                title="Xóa tất cả bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Đặt lại
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-2xs text-slate-500 font-semibold mr-1">Bộ lọc đang áp dụng:</span>
            {selectedPersonId !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-2xs font-medium border border-indigo-200">
                Nhân sự: {activePersonName}
                <button onClick={() => setSelectedPersonId('all')} className="hover:text-indigo-900 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-2xs font-medium border border-slate-200">
                Kết quả: {statusFilter === 'Pass' ? 'Đạt (Pass)' : 'Lỗi (Fail)'}
                <button onClick={() => setStatusFilter('all')} className="hover:text-slate-900 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-2xs font-medium border border-slate-200">
                Hạng mục: {categoryFilter}
                <button onClick={() => setCategoryFilter('all')} className="hover:text-slate-900 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {errorTypeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-2xs font-medium border border-amber-200">
                Lỗi: {activeErrorLabel}
                <button onClick={() => setErrorTypeFilter('all')} className="hover:text-amber-950 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-2xs font-medium border border-slate-200">
                Từ khóa: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-slate-900 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetAllFilters}
              className="text-2xs font-semibold text-rose-600 hover:text-rose-700 hover:underline ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Main Detailed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-2xs tracking-wider">
              <tr>
                <th className="py-3 px-3.5 text-center w-12">STT</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Nhân sự</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Ngày nộp</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Mã Video / Tên tệp</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Phân loại</th>
                <th className="py-3 px-3.5 text-center whitespace-nowrap">Thời lượng</th>
                <th className="py-3 px-3.5 text-center whitespace-nowrap">Kết quả</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Chi tiết lỗi / Nghiệm thu</th>
                <th className="py-3 px-3.5 text-center w-20">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        Không tìm thấy bài đối soát nào phù hợp với bộ lọc hiện tại
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {selectedPersonId !== 'all'
                          ? `Nhân sự "${activePersonName}" có thể không có video nào thuộc kết hợp trạng thái / hạng mục / nguyên nhân lỗi đang chọn.`
                          : 'Không có video nào thỏa mãn đồng thời tất cả các điều kiện lọc đang chọn.'}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        {selectedPersonId !== 'all' && (
                          <button
                            onClick={() => setSelectedPersonId('all')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                          >
                            Xem trên tất cả 27 nhân sự
                          </button>
                        )}
                        {errorTypeFilter !== 'all' && (
                          <button
                            onClick={() => setErrorTypeFilter('all')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                          >
                            Bỏ lọc lỗi ({activeErrorLabel})
                          </button>
                        )}
                        {categoryFilter !== 'all' && (
                          <button
                            onClick={() => setCategoryFilter('all')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                          >
                            Bỏ lọc hạng mục
                          </button>
                        )}
                        <button
                          onClick={handleResetAllFilters}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                        >
                          Xóa toàn bộ bộ lọc
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, index) => {
                  const globalIndex = (currentPage - 1) * pageSize + index + 1;
                  const isPass = item.status === 'Pass';
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                      onClick={() => setActiveItem(item)}
                    >
                      <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 text-2xs">
                        {globalIndex}
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{item.personnelName}</div>
                        <span className="text-2xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.alias}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-500 whitespace-nowrap text-2xs">
                        {item.date}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-800">
                        <div className="flex items-center gap-1.5 max-w-[280px]">
                          <span className="truncate font-semibold text-slate-700" title={item.videoCode}>
                            {item.videoCode}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.videoCode);
                            }}
                            className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-colors flex-shrink-0"
                            title="Sao chép mã video"
                          >
                            {copiedCode === item.videoCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md text-2xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-center whitespace-nowrap font-mono font-bold text-slate-800">
                        {item.durationFormatted}
                        <span className="text-2xs text-slate-400 block font-normal">
                          {formatNumber(item.durationSec)}s
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                        {isPass ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Fail
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5">
                        {isPass ? (
                          <span className="text-2xs text-emerald-600 font-medium">
                            Đạt chuẩn nghiệm thu • Tính đủ công
                          </span>
                        ) : (
                          <div className="text-xs text-rose-700 font-medium max-w-[260px] truncate" title={item.errorReason}>
                            {item.errorReason}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3.5 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveItem(item);
                          }}
                          className="px-2 py-1 text-2xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Hiển thị{' '}
            <strong className="text-slate-900 font-bold">
              {filteredItems.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </strong>{' '}
            -{' '}
            <strong className="text-slate-900 font-bold">
              {Math.min(currentPage * pageSize, filteredItems.length)}
            </strong>{' '}
            trên <strong className="text-slate-900 font-bold">{formatNumber(filteredItems.length)}</strong> bài đối soát
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg">
              Trang {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Item Details Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className={`p-5 text-white flex items-center justify-between ${activeItem.status === 'Pass' ? 'bg-gradient-to-r from-emerald-800 to-teal-800' : 'bg-gradient-to-r from-rose-800 to-red-900'}`}>
              <div className="flex items-center gap-2.5">
                {activeItem.status === 'Pass' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-300" />
                )}
                <div>
                  <h3 className="font-bold text-base text-white">
                    Chi Tiết Đối Soát Video
                  </h3>
                  <p className="text-2xs text-white/80 font-mono">
                    ID: {activeItem.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <div className="text-2xs text-slate-500 font-semibold uppercase">Nhân sự thực hiện</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{activeItem.personnelName}</div>
                  <div className="text-2xs text-slate-500">Tên tự ghi: <strong>{activeItem.alias}</strong> (STT: #{activeItem.personnelId})</div>
                </div>

                <div>
                  <div className="text-2xs text-slate-500 font-semibold uppercase">Ngày nộp & Thời lượng</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5 font-mono">{activeItem.durationFormatted} ({activeItem.durationSec}s)</div>
                  <div className="text-2xs text-slate-500">Ngày ghi nhận: {activeItem.date}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-2xs text-slate-500 font-semibold uppercase">Mã video / Tên tệp</span>
                  <div className="mt-1 p-2.5 bg-slate-100 rounded-xl font-mono text-2xs text-slate-800 break-all flex items-center justify-between gap-2 border border-slate-200">
                    <span>{activeItem.videoCode}</span>
                    <button
                      onClick={() => handleCopy(activeItem.videoCode)}
                      className="p-1 rounded bg-white text-slate-600 hover:text-indigo-600 border border-slate-200 flex-shrink-0"
                    >
                      {copiedCode === activeItem.videoCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {activeItem.originalFile && (
                  <div>
                    <span className="text-2xs text-slate-500 font-semibold uppercase">Tệp gốc đối ứng (Master File)</span>
                    <div className="mt-1 p-2 bg-slate-100 rounded-xl font-mono text-2xs text-slate-700 border border-slate-200">
                      {activeItem.originalFile}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-2xs text-slate-500 font-semibold uppercase">Phân loại nhiệm vụ</span>
                  <div className="mt-1 font-semibold text-slate-800">{activeItem.category}</div>
                </div>
              </div>

              {/* Status and Reason */}
              <div className={`p-3.5 rounded-xl border ${activeItem.status === 'Pass' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs">
                    {activeItem.status === 'Pass' ? '✅ KẾT QUẢ: ĐẠT (PASS)' : '❌ KẾT QUẢ: LỖI (FAIL)'}
                  </span>
                  <span className="text-2xs font-bold">
                    {activeItem.status === 'Pass' ? '+100% Thời lượng tính công' : 'Bị trừ 100% thời lượng'}
                  </span>
                </div>
                <div className="text-xs">
                  {activeItem.status === 'Pass' ? (
                    <p className="text-emerald-800">
                      Video đạt đầy đủ các tiêu chuẩn về khung hình, thao tác hai tay, không gián đoạn, được tính trọn vẹn vào quỹ công nghiệm thu.
                    </p>
                  ) : (
                    <div className="space-y-1 text-rose-900">
                      <div><strong>Nguyên nhân trừ giờ:</strong></div>
                      <div className="p-2 bg-white/80 rounded-lg border border-rose-200 font-medium">
                        {activeItem.errorReason}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {onSelectPerson && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onSelectPerson(activeItem.personnelId);
                      setActiveItem(null);
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    Xem phiếu đối soát cá nhân của {activeItem.personnelName} →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
