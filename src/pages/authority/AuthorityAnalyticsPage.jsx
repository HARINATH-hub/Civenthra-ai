import React from 'react';
import Card from '../../components/common/Card';
import { useComplaints } from '../../context/ComplaintContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  MapPin,
  Sparkles,
  Zap
} from 'lucide-react';

export default function AuthorityAnalyticsPage() {
  const { stats, complaints } = useComplaints();

  // Analytics Metric Calculations
  const resolutionRate = Math.round((stats.resolved / (stats.total || 1)) * 100);
  const avgResolutionHours = 48.5; // Average 2.0 days

  const issueTypeCounts = [
    { type: 'Potholes & Asphalt Rupture', count: 42, percentage: 38, color: 'bg-indigo-600' },
    { type: 'Broken Streetlights', count: 28, percentage: 25, color: 'bg-amber-500' },
    { type: 'Garbage & Solid Waste', count: 24, percentage: 21, color: 'bg-emerald-500' },
    { type: 'Drainage Waterlogging', count: 18, percentage: 16, color: 'bg-cyan-500' }
  ];

  const wardDistribution = [
    { ward: 'Ward 104 - Kondapur', total: 34, resolved: 28, rate: '82%' },
    { ward: 'Ward 105 - Gachibowli', total: 29, resolved: 25, rate: '86%' },
    { ward: 'Ward 98 - Jubilee Hills', total: 24, resolved: 21, rate: '87%' },
    { ward: 'Ward 106 - Serilingampally', total: 19, resolved: 14, rate: '73%' },
    { ward: 'Ward 92 - Panjagutta', total: 16, resolved: 13, rate: '81%' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Civic Intelligence & Machine Learning Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Authority Performance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quantitative telemetry on grievance volume, Computer Vision verification accuracy, and department resolution speed
        </p>
      </div>

      {/* Top 4 KPI metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Resolution Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {resolutionRate}%
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">
            +4.2% increase with automated CV verification
          </p>
        </Card>

        <Card className="p-5 border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Avg Resolution Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {avgResolutionHours} hrs
          </p>
          <p className="text-[11px] text-indigo-600 font-medium">
            ~2.0 days from submission to AI cert
          </p>
        </Card>

        <Card className="p-5 border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">CV Model Precision</span>
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            94.6%
          </p>
          <p className="text-[11px] text-cyan-600 font-medium">
            YOLOv11-CivicVision-v2.4 mean average precision
          </p>
        </Card>

        <Card className="p-5 border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Duplicate Detection Rate</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            18.2%
          </p>
          <p className="text-[11px] text-amber-600 font-medium">
            Filtered before ticket generation
          </p>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Complaints by Issue Type */}
        <div className="lg:col-span-6">
          <Card className="p-6 border space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Complaints by Civic Issue Type
              </h3>
              <span className="text-xs text-slate-400">112 Incidents Logged</span>
            </div>

            <div className="space-y-4">
              {issueTypeCounts.map((item) => (
                <div key={item.type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.type}
                    </span>
                    <span className="font-mono text-slate-500">
                      {item.count} tickets ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Verified vs Failed Resolutions Card */}
        <div className="lg:col-span-6">
          <Card className="p-6 border space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Verified vs Failed CV Resolutions</span>
              </h3>
              <span className="text-xs text-slate-400">AI Quality Audit</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div>
                  <p className="text-3xl font-black text-emerald-800 dark:text-emerald-200">
                    91.8%
                  </p>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                    CV Verified & Closed
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">
                    Zero residual defect detected
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-2">
                <XCircle className="w-8 h-8 text-rose-600 mx-auto" />
                <div>
                  <p className="text-3xl font-black text-rose-800 dark:text-rose-200">
                    8.2%
                  </p>
                  <p className="text-xs font-bold text-rose-700 dark:text-rose-400 mt-1">
                    Failed & Reverted to Active
                  </p>
                  <p className="text-[10px] text-rose-600 mt-0.5">
                    Defects still visible to AI
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              “Civenthra AI guarantees algorithmic accountability: contractor invoices are withheld until the visual re-verification model confirms defect eradication.”
            </p>
          </Card>
        </div>
      </div>

      {/* Ward Geographical Breakdown */}
      <Card className="p-6 border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Complaints & Resolution by Municipal Ward</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">GHMC West Division</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Ward Name & Unit</th>
                <th className="py-2.5 px-3">Total Reported</th>
                <th className="py-2.5 px-3">Successfully Verified</th>
                <th className="py-2.5 px-3">Resolution Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {wardDistribution.map((w) => (
                <tr key={w.ward} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {w.ward}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                    {w.total}
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {w.resolved}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: w.rate }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                        {w.rate}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
