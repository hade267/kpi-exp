import React, { useState } from 'react';
import { ConsolidatedSalaryItem } from '../data/salaryConsolidatedData';
import { formatCurrencyVND } from '../utils/formatters';
import {
  X,
  User,
  Calculator,
  Copy,
  Check,
  Briefcase,
  Calendar,
  DollarSign,
  Share2
} from 'lucide-react';

interface ConsolidatedSalaryModalProps {
  person: ConsolidatedSalaryItem | null;
  onClose: () => void;
}

export const ConsolidatedSalaryModal: React.FC<ConsolidatedSalaryModalProps> = ({
  person,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!person) return null;

  const handleCopyText = () => {
    const lines: string[] = [
      `🧾 PHIẾU TỔNG HỢP CÔNG & LƯƠNG`,
      `Nhân sự: ${person.name} (STT: ${person.stt})`,
      `---------------------------------`,
    ];

    if (person.kpiVinHours) {
      lines.push(
        `• KPI VIN: ${person.kpiVinHours} giờ × 50.000 đ = ${formatCurrencyVND(person.kpiVinSalary || 0)}`
      );
    }
    if (person.kpiEgoHours) {
      lines.push(
        `• KPI EGO: ${person.kpiEgoHours} giờ × 50.000 đ = ${formatCurrencyVND(person.kpiEgoSalary || 0)}`
      );
    }
    if (person.kpiNutellaHours) {
      lines.push(
        `• KPI NUTELLA: ${person.kpiNutellaHours} giờ × 7.000 đ = ${formatCurrencyVND(person.kpiNutellaSalary || 0)}`
      );
    }
    if (person.kpiQaNutellaHours) {
      lines.push(
        `• KPI QA NUTELLA: ${person.kpiQaNutellaHours} giờ × 2.000 đ = ${formatCurrencyVND(person.kpiQaNutellaSalary || 0)}`
      );
    }
    if (person.workdaysVin) {
      lines.push(
        `• Lương cứng VIN: ${person.workdaysVin} ngày × 153.000 đ = ${formatCurrencyVND(person.fixedSalaryVin || 0)}`
      );
    }
    if (person.workdaysNutella) {
      lines.push(
        `• Lương cứng NUTELLA: ${person.workdaysNutella} ngày × 166.000 đ = ${formatCurrencyVND(person.fixedSalaryNutella || 0)}`
      );
    }

    lines.push(`---------------------------------`);
    lines.push(`💰 TỔNG LƯƠNG THỰC LĨNH: ${formatCurrencyVND(person.totalSalary)}`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  STT #{person.stt}
                </span>
                <h3 className="font-bold text-base text-white">{person.name}</h3>
              </div>
              <p className="text-2xs text-slate-400">
                Phiếu tính chi tiết công và thù lao các dự án
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Breakdown Items */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Total Highlight */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-2xs uppercase tracking-wider font-bold text-emerald-800">
                Tổng Lương Thực Nhận
              </span>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono">
                {formatCurrencyVND(person.totalSalary)}
              </div>
            </div>
            <button
              onClick={handleCopyText}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép phiếu'}</span>
            </button>
          </div>

          {/* Sub Items List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Chi Tiết Từng Khoản
            </h4>

            {/* KPI EGO */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>KPI EGO (50.000 đ/h)</span>
                </div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  {person.kpiEgoHours ? `${person.kpiEgoHours} giờ nghiệm thu` : 'Không phát sinh giờ'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-slate-900">
                  {person.kpiEgoSalary ? formatCurrencyVND(person.kpiEgoSalary) : '-'}
                </div>
                {person.kpiEgoHours && (
                  <div className="text-3xs text-slate-500 font-mono">
                    {person.kpiEgoHours}h × 50k
                  </div>
                )}
              </div>
            </div>

            {/* KPI VIN */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>KPI VIN (50.000 đ/h)</span>
                </div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  {person.kpiVinHours ? `${person.kpiVinHours} giờ nghiệm thu` : 'Không phát sinh giờ'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-slate-900">
                  {person.kpiVinSalary ? formatCurrencyVND(person.kpiVinSalary) : '-'}
                </div>
                {person.kpiVinHours && (
                  <div className="text-3xs text-slate-500 font-mono">
                    {person.kpiVinHours}h × 50k
                  </div>
                )}
              </div>
            </div>

            {/* KPI NUTELLA */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>KPI NUTELLA (7.000 đ/h)</span>
                </div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  {person.kpiNutellaHours ? `${person.kpiNutellaHours} giờ tự ghi / đối soát` : 'Không phát sinh giờ'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-slate-900">
                  {person.kpiNutellaSalary ? formatCurrencyVND(person.kpiNutellaSalary) : '-'}
                </div>
                {person.kpiNutellaHours && (
                  <div className="text-3xs text-slate-500 font-mono">
                    {person.kpiNutellaHours}h × 7k
                  </div>
                )}
              </div>
            </div>

            {/* KPI QA NUTELLA */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>KPI QA NUTELLA (2.000 đ/h)</span>
                </div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  {person.kpiQaNutellaHours ? `${person.kpiQaNutellaHours} giờ QA kiểm định` : 'Không phát sinh giờ'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-slate-900">
                  {person.kpiQaNutellaSalary ? formatCurrencyVND(person.kpiQaNutellaSalary) : '-'}
                </div>
                {person.kpiQaNutellaHours && (
                  <div className="text-3xs text-slate-500 font-mono">
                    {person.kpiQaNutellaHours}h × 2k
                  </div>
                )}
              </div>
            </div>

            {/* LƯƠNG CỨNG NUTELLA */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span>Lương Cứng NUTELLA (166.000 đ/ngày)</span>
                </div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  {person.workdaysNutella ? `${person.workdaysNutella} ngày công` : 'Không tham gia'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-slate-900">
                  {person.fixedSalaryNutella ? formatCurrencyVND(person.fixedSalaryNutella) : '-'}
                </div>
                {person.workdaysNutella && (
                  <div className="text-3xs text-slate-500 font-mono">
                    {person.workdaysNutella} ngày × 166k
                  </div>
                )}
              </div>
            </div>

            {/* LƯƠNG CỨNG VIN */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  <span>Lương Cứng VIN (153.000 đ/ngày)</span>
                </div>
                <div className="text-2xs text-slate-500 mt-0.5">
                  {person.workdaysVin ? `${person.workdaysVin} ngày công` : 'Không tham gia'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-slate-900">
                  {person.fixedSalaryVin ? formatCurrencyVND(person.fixedSalaryVin) : '-'}
                </div>
                {person.workdaysVin && (
                  <div className="text-3xs text-slate-500 font-mono">
                    {person.workdaysVin} ngày × 153k
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formula Note */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-2xs text-slate-600 font-mono">
            <strong>Công thức:</strong> Tổng = (KPI VIN × 50k) + (KPI EGO × 50k) + (KPI Nutella × 7k) + (KPI QA × 2k) + (Công VIN × 153k) + (Công Nutella × 166k)
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
