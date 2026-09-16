import React, { useState, useMemo } from 'react';
import { PersonnelRecon } from '../types';
import { formatNumber, formatHours, formatPercent, formatSecondsToDetailed, formatCurrencyVND } from '../utils/formatters';
import { generatePersonnelItems } from '../data/detailedReconData';
import { UPLOAD_ISSUE_MAP } from '../data/uploadIssueData';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  Clock,
  CheckCheck,
  Copy,
  Sparkles,
  ShieldCheck,
  XCircle,
  Info,
  ListFilter,
  Search,
  ArrowUpRight,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Coins,
  Calculator,
  Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PersonalSlipCardProps {
  person: PersonnelRecon;
  onSelectPerson?: (person: PersonnelRecon) => void;
  onViewDetailedTab?: (personnelId: number) => void;
}

export const PersonalSlipCard: React.FC<PersonalSlipCardProps> = ({ person, onViewDetailedTab }) => {
  const [copied, setCopied] = useState(false);
  const [showDetailedList, setShowDetailedList] = useState<boolean>(true);
  const [itemStatusFilter, setItemStatusFilter] = useState<'all' | 'Pass' | 'Fail'>('all');
  const [itemSearchQuery, setItemSearchQuery] = useState<string>('');
  const [copiedItemCode, setCopiedItemCode] = useState<string | null>(null);

  // Salary Calculator State for this person
  const [hourlyRate, setHourlyRate] = useState<number>(50000); // 50,000 VND / hour default
  const [allowance, setAllowance] = useState<number>(0);
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);

  const isTopPassHours = person.rankPassHours <= 3;
  const uploadInfo = UPLOAD_ISSUE_MAP.get(person.id);

  // Salary calculations
  const baseSalary = Math.round(person.passDurationHours * hourlyRate);
  const totalSalary = baseSalary + (allowance || 0);

  // Load detailed items for this person
  const personalItems = useMemo(() => generatePersonnelItems(person.id), [person.id]);

  // Filter personal items
  const filteredPersonalItems = useMemo(() => {
    return personalItems.filter((item) => {
      if (itemStatusFilter !== 'all' && item.status !== itemStatusFilter) return false;
      if (itemSearchQuery.trim()) {
        const q = itemSearchQuery.toLowerCase().trim();
        return (
          item.videoCode.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.errorReason && item.errorReason.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [personalItems, itemStatusFilter, itemSearchQuery]);

  const handleCopy = () => {
    const text = `📋 [ĐỐI SOÁT NGHIỆM THU EGO - GIAI ĐOẠN II]
👤 Nhân sự: ${person.name} (${person.initialAlias})
📁 Sheet: ${person.sheetName}
🏆 Xếp hạng Giờ Pass: #${person.rankPassHours}/27 toàn dự án (${formatHours(person.passDurationHours)})
-----------------------------
📊 Số bài:
- Hợp lệ tính công: ${person.validCount} bài
- Bài Đạt (Pass): ${person.passCount} bài (${formatPercent(person.passRatePercent)})
- Bài Lỗi (Fail): ${person.failCount} bài (${formatPercent(person.failRatePercent)})
${person.duplicateCount > 0 ? `- Trùng lặp: ${person.duplicateCount} bài (đã trừ)\n` : ''}${person.notFoundInOriginalCount > 0 ? `- Chưa có gốc: ${person.notFoundInOriginalCount} bài (đã trừ)\n` : ''}${uploadInfo ? `✨ Đã tính Valid lỗi 上传问题: +${uploadInfo.uploadCount} bài (+${formatHours(uploadInfo.uploadDurationHours)} ~ ${formatNumber(uploadInfo.uploadDurationSec)}s)\n` : ''}-----------------------------
⏱️ Thời lượng:
⭐ TG PASS TÍNH CÔNG: ${formatHours(person.passDurationHours)} (${formatNumber(person.passDurationSec)}s)
❌ TG Fail: ${formatHours(person.failDurationHours)} (${formatNumber(person.failDurationSec)}s)
📈 Tỷ lệ TG Pass: ${formatPercent(person.passDurationPercent)}
-----------------------------
💰 TẠM TÍNH THÙ LAO (${formatCurrencyVND(hourlyRate)}/giờ):
- Lương theo giờ Pass: ${formatCurrencyVND(baseSalary)} (${formatHours(person.passDurationHours)})
${allowance > 0 ? `- Phụ cấp/thưởng thêm: ${formatCurrencyVND(allowance)}\n` : ''}👉 TỔNG THU NHẬP TẠM TÍNH: ${formatCurrencyVND(totalSalary)}
-----------------------------
✅ Khớp 100% từng giây với file gốc.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    // Fire tiny celebratory confetti if top pass hours or high pass rate
    if (person.rankPassHours <= 5 || person.passRatePercent >= 75) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div id={`slip-${person.id}`} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/80 border border-indigo-400/30 flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0">
              {person.id}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {person.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {person.initialAlias}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>Sheet: <strong>{person.sheetName}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Khớp gốc 100%
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right min-w-[130px]">
              <div className="text-2xs text-slate-300 uppercase tracking-wider font-semibold">Xếp Hạng Giờ Pass</div>
              <div className="text-2xl font-black text-amber-400 flex items-center justify-end gap-1">
                <Award className="w-5 h-5 text-amber-400" />
                <span>#{person.rankPassHours}</span>
                <span className="text-xs text-slate-300 font-normal">/ 27</span>
              </div>
              <div className="text-2xs text-slate-300 font-normal mt-0.5">
                {person.rankPassHours === 1 ? '🏆 Quán quân dự án' : person.rankPassHours <= 3 ? '🌟 Top 3 dự án' : person.rankPassHours <= 10 ? 'Top 10 dự án' : 'Toàn dự án'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Highlights Grid */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Upload Issue Approval Banner (if applicable) */}
        {uploadInfo && (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-indigo-50/30 border border-emerald-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    Đã Tính Valid Lỗi Tải Lên (上传问题)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    +{uploadInfo.uploadCount} bài • +{formatHours(uploadInfo.uploadDurationHours)}
                  </span>
                </div>
                <p className="text-2xs text-slate-600 mt-0.5">
                  Nhân sự có <strong>{uploadInfo.uploadCount} video</strong> ({formatNumber(uploadInfo.uploadDurationSec)}s) bị dính lỗi kỹ thuật tải lên (上传问题) đã được phê duyệt tính là <strong>Valid (Đạt tính công)</strong> và cộng đầy đủ vào thời lượng nhận thù lao.
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right sm:border-l sm:border-emerald-200 sm:pl-4 shrink-0">
              <div className="text-2xs text-slate-500 uppercase font-semibold">Cộng thêm vào Pass</div>
              <div className="text-base font-extrabold text-emerald-700 font-mono">
                +{formatHours(uploadInfo.uploadDurationHours)}
              </div>
              <div className="text-2xs text-emerald-600 font-mono">+{formatNumber(uploadInfo.uploadDurationSec)}s</div>
            </div>
          </div>
        )}

        {/* Core Big Metric: Pass Working Hours */}
        <div className="bg-emerald-50/60 rounded-xl p-4 sm:p-5 border border-emerald-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Thời Lượng Pass Tính Công
              </span>
              <div className="mt-1.5 flex items-baseline gap-2.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tracking-tight">
                  {formatHours(person.passDurationHours)}
                </span>
                <span className="text-sm text-emerald-700 font-medium font-mono">
                  ({formatNumber(person.passDurationSec)}s)
                </span>
              </div>
              <p className="text-xs text-emerald-800/80 mt-1 font-mono">
                {formatSecondsToDetailed(person.passDurationSec)}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-2xs font-semibold bg-emerald-100/70 text-emerald-900 border border-emerald-300/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span>Đã loại bỏ 100% bài ngoài gốc (0h) &amp; chỉ tính 1 lần bài trùng lặp</span>
              </div>
            </div>

            <div className="sm:text-right bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">Tỷ lệ thời lượng Pass</div>
              <div className="text-xl font-black text-emerald-700 mt-0.5">
                {formatPercent(person.passDurationPercent)}
              </div>
              <div className="text-2xs text-slate-400 mt-0.5">
                Tổng {formatHours(Number((person.totalOriginalDurationSec / 3600).toFixed(2)))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Breakdown Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <div className="text-xs text-slate-500 font-medium">Bài tự ghi</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5">
              {formatNumber(person.selfRecordedCount)} <span className="text-xs font-normal text-slate-500">bài</span>
            </div>
          </div>

          <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-200/70">
            <div className="text-xs text-indigo-700 font-bold">Bài hợp lệ tính công</div>
            <div className="text-xl font-bold text-indigo-900 mt-0.5">
              {formatNumber(person.validCount)} <span className="text-xs font-normal text-indigo-600">bài</span>
            </div>
          </div>

          <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-200/70">
            <div className="text-xs text-emerald-700 font-bold flex items-center justify-between">
              <span>Bài Đạt (Pass)</span>
              <span className="text-emerald-800 font-extrabold">{formatPercent(person.passRatePercent)}</span>
            </div>
            <div className="text-xl font-bold text-emerald-900 mt-0.5">
              {formatNumber(person.passCount)} <span className="text-xs font-normal text-emerald-600">bài</span>
            </div>
          </div>

          <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-200/70">
            <div className="text-xs text-rose-700 font-bold flex items-center justify-between">
              <span>Bài Lỗi (Fail)</span>
              <span className="text-rose-800 font-extrabold">{formatPercent(person.failRatePercent)}</span>
            </div>
            <div className="text-xl font-bold text-rose-900 mt-0.5">
              {formatNumber(person.failCount)} <span className="text-xs font-normal text-rose-600">bài</span>
            </div>
          </div>
        </div>

        {/* Deductions if any */}
        {(person.duplicateCount > 0 || person.notFoundInOriginalCount > 0) ? (
          <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200 flex flex-wrap items-center gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div className="flex items-center gap-3 flex-wrap">
              {person.duplicateCount > 0 && (
                <span>Trùng lặp: <strong>{person.duplicateCount} bài</strong> (Đã bỏ qua, chỉ tính 1 lần)</span>
              )}
              {person.duplicateCount > 0 && person.notFoundInOriginalCount > 0 && <span>•</span>}
              {person.notFoundInOriginalCount > 0 && (
                <span>Không có trong gốc: <strong>{person.notFoundInOriginalCount} bài</strong> (Đã loại bỏ 100%, 0 giờ)</span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-2.5 px-3 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Toàn bộ bài tự ghi đều chuẩn gốc, không có trùng lặp (100% hợp lệ).</span>
          </div>
        )}

        {/* Visual Ratio Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-700">
            <span>Tỷ Lệ Đạt/Lỗi:</span>
            <span>
              <strong className="text-emerald-700">{person.passCount} Pass ({formatPercent(person.passRatePercent)})</strong>
              {' / '}
              <strong className="text-rose-700">{person.failCount} Fail ({formatPercent(person.failRatePercent)})</strong>
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
            <div
              style={{ width: `${person.passRatePercent}%` }}
              className="h-full bg-emerald-500 transition-all duration-500"
            ></div>
            <div
              style={{ width: `${person.failRatePercent}%` }}
              className="h-full bg-rose-400 transition-all duration-500"
            ></div>
          </div>
        </div>

        {/* Salary Calculator Section */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  Tạm Tính Thù Lao & Lương Nghiệm Thu
                </h4>
                <p className="text-2xs text-slate-500">
                  Tính theo thời lượng Đạt (Pass) chuẩn gốc: <strong>{formatHours(person.passDurationHours)}</strong> ({formatNumber(person.passDurationSec)}s)
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Chỉ tính trên giờ Pass</span>
            </div>
          </div>

          {/* Controls: Hourly rate & allowance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Hourly rate picker */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Đơn giá giờ (VNĐ/giờ):</span>
                <span className="font-mono text-emerald-700 font-bold">{formatCurrencyVND(hourlyRate)}/h</span>
              </label>

              {/* Quick rate chips */}
              <div className="flex flex-wrap gap-1.5">
                {[40000, 45000, 50000, 60000, 70000].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setHourlyRate(rate);
                      setIsCustomRate(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      hourlyRate === rate && !isCustomRate
                        ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {(rate / 1000).toLocaleString('vi-VN')}k/h
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomRate(!isCustomRate)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isCustomRate
                      ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Tùy chỉnh
                </button>
              </div>

              {isCustomRate && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full max-w-xs py-1.5 px-3 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    placeholder="Nhập số tiền VNĐ/giờ..."
                  />
                  <span className="text-xs text-slate-500 font-medium">VNĐ/giờ</span>
                </div>
              )}
            </div>

            {/* Optional allowance */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Phụ cấp / Thưởng (VNĐ):</span>
                <span className="font-mono text-slate-500">{formatCurrencyVND(allowance)}</span>
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                value={allowance || ''}
                onChange={(e) => setAllowance(Math.max(0, Number(e.target.value) || 0))}
                className="w-full py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                placeholder="0 đ (chuyên cần, hỗ trợ...)"
              />
            </div>
          </div>

          {/* Result Highlight Box */}
          <div className="bg-white rounded-xl p-3.5 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Lương giờ Pass:</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatHours(person.passDurationHours)} × {formatCurrencyVND(hourlyRate)} = {formatCurrencyVND(baseSalary)}
                </span>
              </div>
              {allowance > 0 && (
                <div className="flex items-center gap-2 text-2xs text-emerald-700 font-medium">
                  <span>+ Phụ cấp/thưởng: {formatCurrencyVND(allowance)}</span>
                </div>
              )}
              <div className="text-2xs text-slate-400">
                100% bài Lỗi ({person.failCount} bài) &amp; bài ngoài gốc/trùng lặp đã loại bỏ khỏi giờ tính công.
              </div>
            </div>

            <div className="sm:text-right bg-emerald-50/70 p-2.5 px-4 rounded-xl border border-emerald-200 flex-shrink-0">
              <div className="text-2xs uppercase tracking-wider text-emerald-800 font-bold">
                TỔNG THU NHẬP TẠM TÍNH
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono mt-0.5">
                {formatCurrencyVND(totalSalary)}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Video Tasks Section */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div
            className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
            onClick={() => setShowDetailedList(!showDetailedList)}
          >
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Chi Tiết Đối Soát Từng Bài ({personalItems.length} video)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {person.passCount} Pass • {person.failCount} Fail
              </span>
              {showDetailedList ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </div>

          {showDetailedList && (
            <div className="p-3.5 space-y-3">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setItemStatusFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-2xs font-semibold transition-all ${
                      itemStatusFilter === 'all'
                        ? 'bg-slate-800 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả ({personalItems.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemStatusFilter('Pass')}
                    className={`px-2.5 py-1 rounded-lg text-2xs font-semibold transition-all flex items-center gap-1 ${
                      itemStatusFilter === 'Pass'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Pass ({person.passCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemStatusFilter('Fail')}
                    className={`px-2.5 py-1 rounded-lg text-2xs font-semibold transition-all flex items-center gap-1 ${
                      itemStatusFilter === 'Fail'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    <XCircle className="w-3 h-3" />
                    Fail ({person.failCount})
                  </button>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    placeholder="Tìm mã video, lỗi..."
                    className="w-full pl-8 pr-7 py-1 text-2xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {itemSearchQuery && (
                    <button
                      onClick={() => setItemSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable list */}
              <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                {filteredPersonalItems.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    Không có bài đối soát nào khớp với bộ lọc.
                  </div>
                ) : (
                  filteredPersonalItems.map((item, idx) => {
                    const isPass = item.status === 'Pass';
                    return (
                      <div
                        key={item.id}
                        className="p-2.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors text-xs"
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="w-5 font-mono text-2xs text-slate-400 text-right flex-shrink-0 pt-0.5">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono font-semibold text-slate-800 text-2xs truncate max-w-[260px] sm:max-w-[340px]">
                                {item.videoCode}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.videoCode);
                                  setCopiedItemCode(item.videoCode);
                                  setTimeout(() => setCopiedItemCode(null), 1500);
                                }}
                                className="text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Sao chép mã video"
                              >
                                {copiedItemCode === item.videoCode ? (
                                  <CheckCheck className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>

                            <div className="text-2xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                              <span>Ngày: <strong>{item.date}</strong></span>
                              <span>•</span>
                              <span>{item.category}</span>
                              {!isPass && item.errorReason && (
                                <>
                                  <span>•</span>
                                  <span className="text-rose-600 font-medium">
                                    {item.errorReason}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                          <span className="font-mono text-xs font-bold text-slate-700">
                            {item.durationFormatted}
                          </span>
                          {isPass ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Pass
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" /> Fail
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {onViewDetailedTab && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onViewDetailedTab(person.id)}
                    className="inline-flex items-center gap-1 text-2xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    <span>Mở toàn bộ trong tab Đối Soát Chi Tiết</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button: Only Copy summary */}
        <div className="flex items-center justify-between gap-3 pt-1 no-print">
          <button
            id={`btn-copy-slip-${person.id}`}
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
          >
            {copied ? (
              <>
                <CheckCheck className="w-4 h-4" />
                <span>Đã sao chép tóm tắt</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Sao chép tóm tắt đối soát</span>
              </>
            )}
          </button>

          <span className="text-2xs text-slate-400 font-mono">
            ID: #{person.id}
          </span>
        </div>
      </div>
    </div>
  );
};
