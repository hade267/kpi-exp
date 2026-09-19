import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar, MainSection } from './components/Sidebar';
import { PersonalLookupView } from './components/PersonalLookupView';
import { PersonnelTable } from './components/PersonnelTable';
import { DetailedReconView } from './components/DetailedReconView';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { ConsolidatedSalaryView } from './components/ConsolidatedSalaryView';
import { NutellaTimesheetView } from './components/NutellaTimesheetView';
import { UploadIssueModal } from './components/UploadIssueModal';
import { PERSONNEL_DATA, PROJECT_SUMMARY } from './data/reconData';
import { getPersonnelWithUploadPolicy, getProjectSummaryWithUploadPolicy } from './data/uploadIssueData';
import { ShieldCheck, Sparkles, Wallet, Calendar, FolderOpen, ExternalLink } from 'lucide-react';
import { formatHours, formatNumber, formatPercent } from './utils/formatters';
import { DRIVE_LINKS } from './data/driveLinks';

export default function App() {
  const [currentSection, setCurrentSection] = useState<MainSection>('ego_inspection');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'lookup' | 'table' | 'detailed' | 'analytics'>('lookup');
  const [selectedPersonId, setSelectedPersonId] = useState<number>(18); // Default to Nguyễn Thế Hân
  const [detailFilterPersonId, setDetailFilterPersonId] = useState<number | null>(null);

  // Policy: Calculate 280 items of 上传问题 (103.55h) for 19 personnel as Valid
  const [includeUploadValid, setIncludeUploadValid] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Dynamically adjusted personnel list and project summary based on policy toggle
  const currentPersonnelList = useMemo(
    () => getPersonnelWithUploadPolicy(PERSONNEL_DATA, includeUploadValid),
    [includeUploadValid]
  );

  const currentProjectSummary = useMemo(
    () => getProjectSummaryWithUploadPolicy(PROJECT_SUMMARY, includeUploadValid),
    [includeUploadValid]
  );

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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Left Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={(sec) => {
          setCurrentSection(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        egoPassHours={currentProjectSummary.totalValidPassDurationHours}
        includeUploadValid={includeUploadValid}
      />

      {/* Main Content Area with Desktop Sidebar Offset */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalPassHours={currentProjectSummary.totalValidPassDurationHours}
          includeUploadValid={includeUploadValid}
          onToggleUploadValid={setIncludeUploadValid}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />

        {/* Top Project Quick Ticker Banner - Only for EGO section */}
        {currentSection === 'ego_inspection' && (
          <div className="bg-slate-900 text-slate-300 py-2 px-4 text-xs border-b border-slate-800 no-print">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-semibold text-white">DỰ ÁN EGO GIAI ĐOẠN II</span>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-2xs border border-emerald-500/30 cursor-pointer transition-colors ml-2"
                  title="Xem danh sách 19 nhân sự có 280 bài 上传问题 được tính Valid (+103,55h)"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Valid 上传问题: <strong>+103,55h</strong> (19 NS)</span>
                </button>
              </div>

              <div className="flex items-center gap-4 text-2xs font-mono overflow-x-auto">
                <span>Bài hợp lệ: <strong className="text-white">{formatNumber(currentProjectSummary.totalValidCount)}</strong></span>
                <span>•</span>
                <span>
                  TG Pass: <strong className="text-emerald-400">{formatHours(currentProjectSummary.totalValidPassDurationHours)}</strong>
                  {includeUploadValid && (
                    <span className="text-emerald-400/80 text-3xs ml-1">(+103,55h upload)</span>
                  )}
                </span>
                <span>•</span>
                <span>% Pass: <strong className="text-emerald-400">{formatPercent(currentProjectSummary.overallPassDurationRate)}</strong></span>
                <span>•</span>
                <span>Trùng: <strong className="text-amber-400">4</strong></span>
                <span>•</span>
                <span>Chưa gốc: <strong className="text-rose-400">83</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentSection === 'ego_inspection' ? (
            <>
              {activeTab === 'lookup' && (
                <PersonalLookupView
                  personnelList={currentPersonnelList}
                  projectSummary={currentProjectSummary}
                  selectedPersonId={selectedPersonId}
                  onSelectPerson={handleSelectPerson}
                  onViewDetailedTab={handleOpenDetailedWithPerson}
                />
              )}

              {activeTab === 'table' && (
                <PersonnelTable
                  personnelList={currentPersonnelList}
                  projectSummary={currentProjectSummary}
                  onSelectPerson={handleSelectPerson}
                  includeUploadValid={includeUploadValid}
                  onOpenUploadModal={() => setIsUploadModalOpen(true)}
                />
              )}

              {activeTab === 'detailed' && (
                <DetailedReconView
                  initialPersonnelId={detailFilterPersonId}
                  onSelectPerson={handleSelectPerson}
                  onSwitchSection={setCurrentSection}
                  onSwitchTab={setActiveTab}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsCharts
                  personnelList={currentPersonnelList}
                  projectSummary={currentProjectSummary}
                  onSelectPerson={handleSelectPerson}
                />
              )}
            </>
          ) : currentSection === 'nutella_timesheet' ? (
            <NutellaTimesheetView onSwitchSection={setCurrentSection} />
          ) : (
            <ConsolidatedSalaryView onSwitchSection={setCurrentSection} />
          )}
        </main>

        {/* Upload Issue Approval Breakdown Modal */}
        <UploadIssueModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          includeUploadValid={includeUploadValid}
          onTogglePolicy={setIncludeUploadValid}
          onSelectPersonnel={(id) => {
            setCurrentSection('ego_inspection');
            handleSelectPerson(id);
          }}
        />

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-12 py-5 text-xs text-slate-500 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {currentSection === 'ego_inspection' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Đối soát nghiệm thu EGO Giai đoạn II • 27 nhân sự</span>
                </>
              ) : currentSection === 'nutella_timesheet' ? (
                <>
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Dự án NUTELLA • Chấm công & Giờ làm việc</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>Bảng tổng hợp công & thù lao (VIN - EGO - NUTELLA) • 36 nhân sự</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-2xs text-slate-500 flex-wrap">
              <span className="text-slate-400">Hồ sơ Google Drive:</span>
              <a
                id="footer-link-drive-ego"
                href={DRIVE_LINKS.egoInspection}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
              >
                <FolderOpen className="w-3 h-3" />
                <span>Drive EGO</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              <span className="text-slate-300">•</span>
              <a
                id="footer-link-drive-nutella"
                href={DRIVE_LINKS.nutellaInspection}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-medium hover:underline"
              >
                <FolderOpen className="w-3 h-3" />
                <span>Drive Nutella</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
