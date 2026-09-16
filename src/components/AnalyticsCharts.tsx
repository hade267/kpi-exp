import React, { useState } from 'react';
import { PersonnelRecon, ProjectSummary } from '../types';
import { formatNumber, formatHours, formatPercent } from '../utils/formatters';
import { BarChart3, TrendingUp, Award, CheckCircle, PieChart, Users, Clock, AlertTriangle } from 'lucide-react';

interface AnalyticsChartsProps {
  personnelList: PersonnelRecon[];
  projectSummary: ProjectSummary;
  onSelectPerson: (id: number) => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  personnelList,
  projectSummary,
  onSelectPerson,
}) => {
  const [chartMode, setChartMode] = useState<'hours' | 'passRate'>('hours');

  // Top 10 by Pass Working Hours
  const sortedByHours = [...personnelList].sort((a, b) => b.passDurationHours - a.passDurationHours).slice(0, 10);
  const maxHours = Math.max(...sortedByHours.map((p) => p.passDurationHours));

  // Top by Pass Rate (chỉ tính nhân sự có TG Pass > 5h theo quy định)
  const eligibleForRank = personnelList
    .filter((p) => p.passDurationHours > 5 && p.rankPassRate !== null)
    .sort((a, b) => (a.rankPassRate || 99) - (b.rankPassRate || 99))
    .slice(0, 10);

  // Group by performance tiers
  const tier100 = personnelList.filter((p) => p.passRatePercent === 100).length;
  const tier70to99 = personnelList.filter((p) => p.passRatePercent >= 70 && p.passRatePercent < 100).length;
  const tier60to69 = personnelList.filter((p) => p.passRatePercent >= 60 && p.passRatePercent < 70).length;
  const tier50to59 = personnelList.filter((p) => p.passRatePercent >= 50 && p.passRatePercent < 60).length;
  const tierUnder50 = personnelList.filter((p) => p.passRatePercent < 50).length;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Bài Hợp Lệ</span>
            <CheckCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {formatNumber(projectSummary.totalValidCount)}
          </div>
          <div className="text-2xs text-slate-400 mt-1">
            Đã trừ trùng & ngoài gốc
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>TG Pass Tính Công</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2">
            {formatHours(projectSummary.totalValidPassDurationHours)}
          </div>
          <div className="text-2xs text-emerald-700 mt-1">
            60,4% tổng thời lượng
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between text-xs text-rose-700 font-medium">
            <span>TG Fail (Bị Trừ)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-900 mt-2">
            {formatHours(projectSummary.totalValidFailDurationHours)}
          </div>
          <div className="text-2xs text-rose-700 mt-1">
            1.426 bài lỗi (38,3%)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Quy Mô Nhân Sự</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            27 Nhân Sự
          </div>
          <div className="text-2xs text-emerald-700 font-medium mt-1">
            Xếp hạng theo Giờ Pass thực tế
          </div>
        </div>
      </div>

      {/* Top 10 Chart with Toggle */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              {chartMode === 'hours'
                ? 'Top 10 Thời Lượng Pass Tính Công Cao Nhất'
                : 'Top 10 Xếp Hạng Pass (% Pass cao nhất - ĐK: TG Pass > 5h)'}
            </h3>
            <p className="text-xs text-slate-500">
              {chartMode === 'hours'
                ? 'Tổng giờ Pass nghiệm thu thực tế'
                : 'Chỉ xếp hạng 21 nhân sự có thời lượng Pass trên 5 giờ'}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
            <button
              onClick={() => setChartMode('hours')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                chartMode === 'hours'
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Theo Giờ Pass
            </button>
            <button
              onClick={() => setChartMode('passRate')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                chartMode === 'passRate'
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Theo % Pass (&gt;5h)
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-3">
          {(chartMode === 'hours' ? sortedByHours : eligibleForRank).map((person, index) => {
            const percentage = chartMode === 'hours'
              ? (person.passDurationHours / maxHours) * 100
              : person.passRatePercent;

            return (
              <div
                key={person.id}
                onClick={() => onSelectPerson(person.id)}
                className="group cursor-pointer"
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-2xs flex-shrink-0 ${
                      index === 0 ? 'bg-amber-400 text-slate-900 shadow-2xs' : index === 1 ? 'bg-slate-300 text-slate-800' : index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {chartMode === 'passRate' ? `#${person.rankPassRate}` : `#${person.rankPassHours}`}
                    </span>
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {person.name}
                    </span>
                    <span className="text-2xs text-slate-400">({person.validCount} bài)</span>
                  </div>
                  <div className="text-right font-mono font-bold text-emerald-700">
                    {chartMode === 'hours' ? (
                      <>
                        {formatHours(person.passDurationHours)}
                        <span className="text-slate-400 font-normal text-2xs ml-1.5">
                          ({formatPercent(person.passRatePercent)} Pass)
                        </span>
                      </>
                    ) : (
                      <>
                        {formatPercent(person.passRatePercent)} Pass
                        <span className="text-slate-400 font-normal text-2xs ml-1.5">
                          ({formatHours(person.passDurationHours)})
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500 group-hover:bg-emerald-600"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pass Rate Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-600" />
            Phân Bố Tỷ Lệ Pass Bài Của 27 Nhân Sự
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Số lượng nhân sự theo từng khung tỷ lệ đạt nghiệm thu
          </p>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Xuất sắc tuyệt đối (100% Pass)</span>
              </span>
              <span className="font-bold text-slate-800">{tier100} người</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                <span>Khá giỏi (70% - 99% Pass)</span>
              </span>
              <span className="font-bold text-slate-800">{tier70to99} người</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                <span>Trung bình khá (60% - 69% Pass)</span>
              </span>
              <span className="font-bold text-slate-800">{tier60to69} người</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Đạt yêu cầu (50% - 59% Pass)</span>
              </span>
              <span className="font-bold text-slate-800">{tier50to59} người</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span>Cần cải thiện chất lượng (&lt;50% Pass)</span>
              </span>
              <span className="font-bold text-slate-800">{tierUnder50} người</span>
            </div>
          </div>
        </div>

        {/* Global Hours Structure */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Cơ Cấu Thời Lượng Nghiệm Thu Hợp Lệ
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Tổng 1.418,41 giờ (5.106.275 giây) được phân bổ theo kết quả kiểm duyệt
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-700">TG Pass: 856,83 giờ (60,4%)</span>
                <span className="text-rose-700">TG Fail: 561,58 giờ (39,6%)</span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex">
                <div style={{ width: '60.4%' }} className="h-full bg-emerald-500"></div>
                <div style={{ width: '39.6%' }} className="h-full bg-rose-400"></div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Tổng số bài kiểm duyệt:</span>
                <strong className="text-slate-800">3.721 bài</strong>
              </div>
              <div className="flex justify-between">
                <span>Bài Pass (tính công):</span>
                <strong className="text-emerald-700">2.295 bài (61,7%)</strong>
              </div>
              <div className="flex justify-between">
                <span>Bài Fail (lỗi trừ):</span>
                <strong className="text-rose-700">1.426 bài (38,3%)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
