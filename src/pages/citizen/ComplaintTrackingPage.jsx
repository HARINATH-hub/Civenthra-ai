import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { useComplaints } from '../../context/ComplaintContext';
import {
  FileText,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  User,
  Building2,
  ChevronLeft,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function ComplaintTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getComplaintById } = useComplaints();

  const complaint = getComplaintById(id);

  if (!complaint) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold">Complaint not found</h2>
        <Button onClick={() => navigate('/citizen/complaints')}>Back to Complaints</Button>
      </div>
    );
  }

  const isFailedVerification = complaint.verificationResult && !complaint.verificationResult.verified;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronLeft}
            onClick={() => navigate('/citizen/complaints')}
          >
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {complaint.ticketId}
              </span>
              <PriorityBadge priority={complaint.priority} size="xs" />
              <StatusBadge status={complaint.status} size="xs" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reported on {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/citizen/ticket/${complaint.id}`}>
            <Button variant="outline" size="sm" icon={FileText}>
              View Smart Ticket
            </Button>
          </Link>
          <Link to={`/authority/resolution/${complaint.id}`}>
            <Button variant="secondary" size="sm" icon={ExternalLink} className="text-amber-600 border-amber-300">
              Authority Resolution View
            </Button>
          </Link>
        </div>
      </div>

      {/* Critical Workflow Notice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-indigo-900 dark:text-indigo-200">
            Civenthra Automated Computer Vision Verification Protocol
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            By system policy, municipal authorities cannot manually mark a grievance as “RESOLVED”. The resolution must include photographic evidence that is independently inspected by Computer Vision against the original reported defect.
          </p>
        </div>
      </div>

      {/* Verification Failure Warning (if applicable) */}
      {isFailedVerification && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-rose-900 dark:text-rose-200">
              AI Verification Failed — Complaint Returned to ACTIVE State
            </p>
            <p className="text-rose-700 dark:text-rose-300 leading-relaxed">
              {complaint.verificationResult.reason} The complaint has been automatically reverted to the municipal queue for remediation.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Details + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Summary & Images */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 border space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Issue Evidence & Diagnostics
            </h3>

            {/* Original Image */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Original Citizen Upload:</span>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 aspect-video">
                <img src={complaint.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  {complaint.issueType} ({complaint.aiConfidence}%)
                </div>
              </div>
            </div>

            {/* After-Fix Image (if available) */}
            {complaint.afterImageUrl && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">After-Fix Evidence:</span>
                  {complaint.status === 'RESOLVED' ? (
                    <span className="text-[10px] text-emerald-600 font-bold">Verified Fix</span>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-bold">Pending Re-check</span>
                  )}
                </div>
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 aspect-video">
                  <img src={complaint.afterImageUrl} alt="After fix" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Department Details */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Department</span>
                <p className="font-bold text-slate-900 dark:text-white">{complaint.assignedDepartment}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Assigned Officer</span>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {complaint.assignedOfficer || 'Pending Department Dispatch'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Location</span>
                <p className="text-slate-700 dark:text-slate-300">{complaint.location?.address}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Step-by-Step Lifecycle Timeline */}
        <div className="lg:col-span-7">
          <Card className="p-6 border space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Lifecycle & Verification Timeline
              </h3>
              <p className="text-xs text-slate-500">
                End-to-end transparent verification trail
              </p>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {complaint.timeline?.map((item, index) => {
                const isCompleted = item.status === 'completed';
                const isFailed = item.status === 'failed';
                const isCurrent = item.status === 'current';

                return (
                  <div key={index} className="relative group">
                    {/* Circle Indicator */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isFailed
                          ? 'bg-rose-500 text-white'
                          : isCurrent
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : isFailed ? (
                        <XCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                    </div>

                    {/* Content Box */}
                    <div
                      className={`p-3.5 rounded-xl border text-xs transition-colors ${
                        isFailed
                          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                          : isCurrent
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
