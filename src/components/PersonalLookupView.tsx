import React, { useState, useMemo } from 'react';
import { PersonnelRecon, ProjectSummary } from '../types';
import { PersonalSlipCard } from './PersonalSlipCard';
import { Search, UserCheck, X, Sparkles, Filter, ChevronRight, Award, ShieldCheck, Check, FolderOpen, ExternalLink } from 'lucide-react';
import { formatNumber, formatHours, formatPercent } from '../utils/formatters';
import { DRIVE_LINKS } from '../data/driveLinks';

interface PersonalLookupViewProps {
  personnelList: PersonnelRecon[];
  projectSummary: ProjectSummary;
  selectedPersonId: number;
  onSelectPerson: (id: number) => void;
  onViewDetailedTab?: (personnelId: number) => void;
}

export const PersonalLookupView: React.FC<PersonalLookupViewProps> = ({
  personnelList,
  projectSummary,
  selectedPersonId,
  onSelectPerson,
  onViewDetailedTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter list by search query (supports name, initialAlias, sheetName)
  const filteredPersonnel = useMemo(() => {
    if (!searchTerm.trim()) return personnelList;
    const term = searchTerm.toLowerCase().trim();
    return personnelList.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.initialAlias.toLowerCase().includes(term) ||
        p.sheetName.toLowerCase().includes(term) ||
        p.id.toString() === term
    );
  }, [personnelList, searchTerm]);

  const selectedPerson = useMemo(() => {
    return personnelList.find((p) => p.id === selectedPersonId) || personnelList[0];
  }, [personnelList, selectedPersonId]);

  return (
    <div className="space-y-6">
      {/* Search & Selection Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              Tra Cứu Đối Soát Cá Nhân
            </h2>
            <p className="text-xs text-slate-500">
              Tìm theo tên nhân sự hoặc tên tự ghi để xem kết quả đối soát
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <a
              id="btn-lookup-drive-ego"
              href={DRIVE_LINKS.egoInspection}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200 transition-colors shadow-2xs font-semibold cursor-pointer"
              title="Mở thư mục Google Drive chứa hồ sơ đối soát EGO"
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Drive Đối Soát EGO</span>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>

            <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              27 nhân sự
            </div>
          </div>
        </div>

        {/* Input field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            id="search-person-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên nhân sự, tên tự ghi..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick selection chips */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center justify-between">
            <span>Danh sách nhân sự ({filteredPersonnel.length}):</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-indigo-600 hover:text-indigo-800 text-xs"
              >
                Hiện tất cả
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {filteredPersonnel.map((p) => {
              const isSelected = p.id === selectedPerson.id;
              return (
                <button
                  key={p.id}
                  id={`btn-select-person-${p.id}`}
                  onClick={() => onSelectPerson(p.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs ring-2 ring-indigo-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white/20 text-2xs flex items-center justify-center font-bold">
                    {p.id}
                  </span>
                  <span>{p.name}</span>
                  {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Person Card */}
      {selectedPerson && (
        <div className="space-y-4">
          <PersonalSlipCard
            person={selectedPerson}
            onSelectPerson={(p) => onSelectPerson(p.id)}
            onViewDetailedTab={onViewDetailedTab}
          />

          {/* Benchmark comparison card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              So Sánh Với Bình Quân Dự Án
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-500 font-medium">Tỷ lệ Pass vs Dự án</div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-extrabold text-indigo-900">
                    {formatPercent(selectedPerson.passRatePercent)}
                  </span>
                  <span className="text-slate-500">
                    BQ: <strong>{formatPercent(projectSummary.overallPassItemRate)}</strong>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${Math.min(100, selectedPerson.passRatePercent)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-500 font-medium">TG Pass tính công</div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-base font-extrabold text-emerald-700">
                    {formatHours(selectedPerson.passDurationHours)}
                  </span>
                  <span className="text-slate-500">
                    Dự án: <strong>{formatHours(projectSummary.totalValidPassDurationHours)}</strong>
                  </span>
                </div>
                <div className="text-2xs text-slate-400 mt-2">
                  Chiếm {((selectedPerson.passDurationHours / projectSummary.totalValidPassDurationHours) * 100).toFixed(1)}% tổng TG Pass.
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-500 font-medium">Hạng Giờ Pass Dự Án</div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className={`text-base font-extrabold ${selectedPerson.duplicateCount === 0 && selectedPerson.notFoundInOriginalCount === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedPerson.duplicateCount === 0 && selectedPerson.notFoundInOriginalCount === 0 ? 'Khớp 100%' : `Trừ ${selectedPerson.duplicateCount + selectedPerson.notFoundInOriginalCount} bài`}
                  </span>
                  <span className="text-indigo-700 font-black text-lg">
                    #{selectedPerson.rankPassHours}/27
                  </span>
                </div>
                <div className="text-2xs text-slate-400 mt-2">
                  {selectedPerson.rankPassHours === 1
                    ? '🏆 Đứng đầu toàn dự án về giờ Pass'
                    : selectedPerson.rankPassHours <= 3
                    ? '🌟 Top 3 thời lượng Pass cao nhất'
                    : selectedPerson.rankPassHours <= 10
                    ? 'Top 10 thời lượng Pass cao nhất'
                    : `Vị trí #${selectedPerson.rankPassHours} trên 27 nhân sự`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
