import React, { useState } from 'react';
import { UPLOAD_ISSUE_RECON_ITEMS, UPLOAD_ISSUE_TOTALS } from '../data/uploadIssueData';
import { X, CheckCircle, Copy, Check, Download, ArrowRight, Info, Sparkles } from 'lucide-react';
import { formatHours, formatNumber } from '../utils/formatters';

interface UploadIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  includeUploadValid: boolean;
  onToggleUploadValid: (value: boolean) => void;
  onSelectPerson?: (id: number) => void;
}

export const UploadIssueModal: React.FC<UploadIssueModalProps> = ({
  isOpen,
  onClose,
  includeUploadValid,
  onToggleUploadValid,
  onSelectPerson,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const headers = ['STT', 'Họ và tên nhân sự', 'Số bài bị dính 上传问题', 'Thời lượng (giây)', 'Thời lượng (giờ)'];
    const rows = UPLOAD_ISSUE_RECON_ITEMS.map((item) => [
      item.stt,
      item.name,
      item.uploadCount,
      `${item.uploadDurationSec.toLocaleString('vi-VN')} s`,
      `${item.uploadDurationHours.toLocaleString('vi-VN')} h`,
    ]);
    const summaryRow = ['Tổng', `${UPLOAD_ISSUE_TOTALS.personnelCount} nhân sự`, `${UPLOAD_ISSUE_TOTALS.totalVideos} bài`, `${UPLOAD_ISSUE_TOTALS.totalDurationSec.toLocaleString('vi-VN')} s`, `${UPLOAD_ISSUE_TOTALS.totalDurationHours.toLocaleString('vi-VN')} h`];

    const tsv = [headers.join('\t'), ...rows.map((r) => r.join('\t')), summaryRow.join('\t')].join('\n');
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = ['STT', 'Ho va ten nhan su', 'So bai bi dinh upload', 'Thoi luong (s)', 'Thoi luong (h)'];
    const rows = UPLOAD_ISSUE_RECON_ITEMS.map((item) => [
      item.stt,
      `"${item.name}"`,
      item.uploadCount,
      item.uploadDurationSec,
      item.uploadDurationHours,
    ]);
    const summaryRow = ['Tong', `"${UPLOAD_ISSUE_TOTALS.personnelCount} nhan su"`, UPLOAD_ISSUE_TOTALS.totalVideos, UPLOAD_ISSUE_TOTALS.totalDurationSec, UPLOAD_ISSUE_TOTALS.totalDurationHours];

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(',')), summaryRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bang_Nhan_Su_Valid_Upload_Issue_EGO.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-indigo-50/40 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Phê Duyệt Tính Valid Lỗi Tải Lên (上传问题)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  280 bài • +103,55 giờ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Chính sách đối soát: Các video bị dính lỗi hệ thống tải lên (上传问题) được công nhận là VALID (Pass tính công)
              </p>
            </div>
          </div>

          <button
            id="btn-close-upload-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy status banner & actions */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-slate-700">Trạng thái áp dụng trong hệ thống:</span>
            <button
              id="btn-toggle-upload-valid-policy"
              onClick={() => onToggleUploadValid(!includeUploadValid)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-2xs ${
                includeUploadValid
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-300'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {includeUploadValid ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  ĐANG ÁP DỤNG (ĐÃ TÍNH PASS)
                </>
              ) : (
                <>
                  <Info className="w-4 h-4 text-slate-500" />
                  CHƯA ÁP DỤNG (TÍNH THEO GỐC)
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Đã sao chép' : 'Copy Bảng TSV'}</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Xuất CSV</span>
            </button>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border-b border-slate-100 text-xs">
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="text-slate-500 font-medium">Nhân sự được hưởng</div>
            <div className="text-lg font-bold text-emerald-900 mt-0.5">19 / 27</div>
            <div className="text-2xs text-emerald-700 mt-0.5">nhân sự có bài upload</div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="text-slate-500 font-medium">Số bài công nhận Valid</div>
            <div className="text-lg font-bold text-emerald-900 mt-0.5">280 bài</div>
            <div className="text-2xs text-emerald-700 mt-0.5">chuyển từ Fail ➔ Pass</div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="text-slate-500 font-medium">Thời lượng cộng thêm</div>
            <div className="text-lg font-bold text-emerald-900 mt-0.5">+103,55 giờ</div>
            <div className="text-2xs text-emerald-700 mt-0.5">372.771 giây tính công</div>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <div className="text-slate-500 font-medium">Ước tính thù lao thêm</div>
            <div className="text-lg font-bold text-indigo-900 mt-0.5">~5.177.500 đ</div>
            <div className="text-2xs text-indigo-700 mt-0.5">tính theo 50.000 đ/giờ</div>
          </div>
        </div>

        {/* Table list */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">STT</th>
                  <th className="py-2.5 px-3">Họ và tên nhân sự</th>
                  <th className="py-2.5 px-3 text-right">Số bài 上传问题</th>
                  <th className="py-2.5 px-3 text-right">Thời lượng (giây)</th>
                  <th className="py-2.5 px-3 text-right font-bold text-emerald-700">Cộng thêm (giờ)</th>
                  <th className="py-2.5 px-3 text-center w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {UPLOAD_ISSUE_RECON_ITEMS.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 text-center text-slate-500 font-mono">{item.stt}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                        {item.uploadCount} bài
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">
                      {item.uploadDurationSec.toLocaleString('vi-VN')} s
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">
                      +{item.uploadDurationHours.toLocaleString('vi-VN', { minimumFractionDigits: 2 })} h
                    </td>
                    <td className="py-2 px-3 text-center">
                      {onSelectPerson && (
                        <button
                          onClick={() => {
                            onSelectPerson(item.id);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 text-2xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          Xem phiếu <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 text-slate-900 font-bold border-t border-slate-300">
                <tr>
                  <td colSpan={2} className="py-3 px-3">
                    Tổng cộng (19 nhân sự được công nhận Valid)
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-800">
                    280 bài
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-800">
                    372.771 s
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-800 text-sm">
                    +103,55 h
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Dữ liệu đối soát khớp 100% từng giây với hồ sơ chất lượng dự án EGO Giai đoạn II.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors shadow-xs"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
};
