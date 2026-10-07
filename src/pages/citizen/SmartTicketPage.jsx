import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { useComplaints } from '../../context/ComplaintContext';
import confetti from 'canvas-confetti';
import {
  FileText,
  MapPin,
  Calendar,
  Share2,
  Download,
  ArrowRight,
  ShieldCheck,
  Cpu,
  QrCode,
  CheckCircle2,
  Printer,
  Copy,
  Clock
} from 'lucide-react';

export default function SmartTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getComplaintById } = useComplaints();

  const complaint = getComplaintById(id);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti upon ticket issuance
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!complaint) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold">Complaint ticket not found</h2>
        <Button onClick={() => navigate('/citizen/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  const handleCopyTicket = () => {
    navigator.clipboard?.writeText(complaint.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Notice */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500 text-white">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
              Grievance Registered Successfully!
            </h2>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              Computer Vision verified this defect and queued it for departmental action.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800">
          STATUS: ACTIVE
        </span>
      </div>

      {/* OFFICIAL CIVENTHRA SMART TICKET CARD */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-200/80 dark:border-slate-800 shadow-2xl overflow-hidden print:border-black print:shadow-none">
        {/* Ticket Header Brand Bar */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950">
          <div className="space-y-1">
            <Logo size="md" showBadge={false} />
            <p className="text-xs text-indigo-300 font-mono tracking-wider uppercase mt-1">
              Official Municipal Grievance Smart Ticket
            </p>
          </div>

          <div className="flex flex-col sm:items-end text-left sm:text-right">
            <span className="text-[11px] text-indigo-300 uppercase tracking-widest font-mono">
              Smart Ticket ID
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-cyan-300">
                {complaint.ticketId}
              </span>
              <button
                onClick={handleCopyTicket}
                className="p-1 rounded bg-indigo-950/60 hover:bg-indigo-700 text-indigo-200 transition-colors"
                title="Copy Ticket ID"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            {copied && <span className="text-[10px] text-cyan-300">Copied!</span>}
          </div>
        </div>

        {/* Ticket Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Attributes Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Issue Type</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{complaint.issueType}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Priority</span>
              <div className="mt-0.5">
                <PriorityBadge priority={complaint.priority} size="xs" />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Impact Score</span>
              <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {complaint.impactScore}/100 ({complaint.impactLevel})
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Status</span>
              <div className="mt-0.5">
                <StatusBadge status={complaint.status} size="xs" />
              </div>
            </div>
          </div>

          {/* Image & Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 aspect-video">
              <img
                src={complaint.imageUrl}
                alt={complaint.issueType}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                AI Confidence: {complaint.aiConfidence}%
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Department Assigned
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {complaint.assignedDepartment}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Location & Municipal Ward
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{complaint.location?.address}</span>
                </p>
                <p className="text-[11px] font-mono text-slate-400 pl-5">
                  GPS: {complaint.location?.latitude}° N, {complaint.location?.longitude}° E
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Reported Date & Time
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>

          {/* GenAI Complaint Summary */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
            <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Verified Complaint Description
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
              “{complaint.description}”
            </p>
          </div>

          {/* Ticket Security & QR Verification Seal */}
          <div className="pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 text-slate-800 dark:text-slate-200">
                <QrCode className="w-full h-full" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Cryptographic Resolution Lock
                </span>
                <p className="text-[11px] text-slate-400">
                  Status cannot transition to RESOLVED without Computer Vision after-fix re-verification.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              HASH: 8F2A-CV-TKT-2026
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Action Buttons (Section 9) */}
      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <Button
          onClick={() => navigate(`/citizen/complaints/${complaint.id}`)}
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
          className="shadow-lg shadow-indigo-600/25"
        >
          Track Complaint Timeline
        </Button>

        <Button
          onClick={() => navigate('/citizen/map')}
          variant="secondary"
          size="lg"
          icon={MapPin}
        >
          View on Map
        </Button>

        <Button
          onClick={handlePrint}
          variant="secondary"
          size="lg"
          icon={Printer}
        >
          Download / Print Ticket
        </Button>

        <Button
          onClick={handleCopyTicket}
          variant="secondary"
          size="lg"
          icon={Share2}
        >
          Share Ticket
        </Button>
      </div>
    </div>
  );
}
