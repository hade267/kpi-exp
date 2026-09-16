import React, { useState } from 'react';
import { Header } from './components/Header';
import { PersonalLookupView } from './components/PersonalLookupView';
import { PersonnelTable } from './components/PersonnelTable';
import { DetailedReconView } from './components/DetailedReconView';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { PERSONNEL_DATA, PROJECT_SUMMARY } from './data/reconData';
import { ShieldCheck } from 'lucide-react';
import { formatHours, formatNumber, formatPercent } from './utils/formatters';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lookup' | 'table' | 'detailed' | 'analytics'>('lookup');
  const [selectedPersonId, setSelectedPersonId] = useState<number>(18); // Default to Nguyễn Thế Hân
  const [detailFilterPersonId, setDetailFilterPersonId] = useState<number | null>(null);

  const handleSelectPerson = (id: number) => {
    setSelectedPersonId(id);
    setActiveTab('lookup');
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetailedWithPerson = (id: number) => {
    setDetailFilterPersonId(id);
    setActiveTab('detailed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Top Project Quick Ticker Banner */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 text-xs border-b border-slate-800 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">DỰ ÁN EGO GIAI ĐOẠN II</span>
          </div>

          <div className="flex items-center gap-4 text-2xs font-mono overflow-x-auto">
            <span>Bài hợp lệ: <strong className="text-white">{formatNumber(PROJECT_SUMMARY.totalValidCount)}</strong></span>
            <span>•</span>
            <span>TG Pass: <strong className="text-emerald-400">{formatHours(PROJECT_SUMMARY.totalValidPassDurationHours)}</strong></span>
            <span>•</span>
            <span>% Pass: <strong className="text-emerald-400">{formatPercent(PROJECT_SUMMARY.overallPassDurationRate)}</strong></span>
            <span>•</span>
            <span>Trùng: <strong className="text-amber-400">4</strong></span>
            <span>•</span>
            <span>Chưa gốc: <strong className="text-rose-400">83</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'lookup' && (
          <PersonalLookupView
            personnelList={PERSONNEL_DATA}
            projectSummary={PROJECT_SUMMARY}
            selectedPersonId={selectedPersonId}
            onSelectPerson={handleSelectPerson}
            onViewDetailedTab={handleOpenDetailedWithPerson}
          />
        )}

        {activeTab === 'table' && (
          <PersonnelTable
            personnelList={PERSONNEL_DATA}
            projectSummary={PROJECT_SUMMARY}
            onSelectPerson={handleSelectPerson}
          />
        )}

        {activeTab === 'detailed' && (
          <DetailedReconView
            initialPersonnelId={detailFilterPersonId}
            onSelectPerson={handleSelectPerson}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsCharts
            personnelList={PERSONNEL_DATA}
            projectSummary={PROJECT_SUMMARY}
            onSelectPerson={handleSelectPerson}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-5 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Đối soát nghiệm thu EGO Giai đoạn II • 27 nhân sự</span>
          </div>

          <div className="text-slate-400 text-2xs">
            Khớp 100% từng giây với file gốc
          </div>
        </div>
      </footer>
    </div>
  );
}
