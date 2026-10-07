import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Modal from '../../components/common/Modal';
import { useComplaints } from '../../context/ComplaintContext';
import { DEPARTMENTS } from '../../data/mockData';
import {
  FileText,
  MapPin,
  Calendar,
  UserCheck,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  MessageSquare,
  Building2,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export default function AuthorityComplaintDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getComplaintById,
    assignDepartmentAndOfficer,
    updatePriority,
    startResolution
  } = useComplaints();

  const complaint = getComplaintById(id);

  // Edit / Action states
  const [department, setDepartment] = useState(complaint?.assignedDepartment || DEPARTMENTS[0].name);
  const [officer, setOfficer] = useState(complaint?.assignedOfficer || 'Er. Ramesh Babu (Assistant Engineer)');
  const [officerContact, setOfficerContact] = useState(complaint?.assignedOfficerContact || '+91 98480 22311');
  const [priority, setPriority] = useState(complaint?.priority || 'HIGH');
  const [internalNote, setInternalNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  if (!complaint) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold">Complaint not found</h2>
        <Button onClick={() => navigate('/authority/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  const handleUpdateAssignment = (e) => {
    e.preventDefault();
    assignDepartmentAndOfficer(complaint.id, department, officer, officerContact);
    alert('Department and officer allocation updated!');
  };

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    updatePriority(complaint.id, newPriority);
  };

  const handleStartResolution = () => {
    startResolution(complaint.id, internalNote || 'Field repair crew dispatched with equipment.');
    navigate(`/authority/resolution/${complaint.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronLeft}
            onClick={() => navigate('/authority/dashboard')}
          >
            Dashboard
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {complaint.ticketId}
              </span>
              <PriorityBadge priority={complaint.priority} size="xs" />
              <StatusBadge status={complaint.status} size="xs" />
            </div>
            <p className="text-xs text-slate-500">
              Department: {complaint.assignedDepartment}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {complaint.status === 'AWAITING_VERIFICATION' ? (
            <Link to={`/authority/resolution/${complaint.id}`}>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20"
                icon={ShieldCheck}
                size="sm"
              >
                Perform CV Verification
              </Button>
            </Link>
          ) : (
            <Link to={`/authority/resolution/${complaint.id}`}>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                icon={Wrench}
                size="sm"
              >
                Go to Resolution & After-Fix Upload
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Details & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Photo with Bounding Box + AI Diagnostics */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Visual Evidence & Computer Vision Telemetry
            </h2>

            {/* Photo with CV Detection Box */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 aspect-video">
              <img src={complaint.imageUrl} alt="" className="w-full h-full object-cover opacity-90" />

              {/* Bounding box */}
              <div className="absolute inset-x-8 inset-y-6 border-2 border-cyan-400 rounded-lg pointer-events-none flex flex-col justify-between p-1 bg-cyan-400/10">
                <div className="bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded w-max">
                  {complaint.issueType} ({complaint.aiConfidence}%)
                </div>
                <div className="text-[9px] text-cyan-200 font-mono text-right bg-slate-900/80 px-1 rounded w-max self-end">
                  BBox: [120, 150, 480, 410]
                </div>
              </div>
            </div>

            {/* Diagnostic Badges */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Confidence</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  {complaint.aiConfidence}%
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Impact Score</span>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                  {complaint.impactScore}/100
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Duplicate Check</span>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {complaint.duplicateStatus === 'NO_DUPLICATE' ? 'Clear (Unique)' : 'Flagged Proximity'}
                </p>
              </div>
            </div>

            {/* Complaint Text */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                GenAI Formatted Grievance Description:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                {complaint.description}
              </p>
            </div>

            {/* Raw citizen text note */}
            {complaint.rawInputText && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">
                  Citizen Raw Input / Voice Transcript:
                </span>
                <p className="text-xs italic text-slate-500 bg-slate-100/50 dark:bg-slate-800/40 p-2.5 rounded-lg">
                  “{complaint.rawInputText}”
                </p>
              </div>
            )}
          </Card>

          {/* Location & Spatial Ward Details */}
          <Card className="p-6 border space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Spatial Geolocation & Jurisdiction
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">{complaint.location?.address}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                <span>GPS Lat: {complaint.location?.latitude}</span>
                <span>GPS Lon: {complaint.location?.longitude}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Authority Operational Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Assignment Management Card */}
          <Card className="p-6 border space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Department & Officer Assignment</span>
            </h3>

            <form onSubmit={handleUpdateAssignment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designated Officer In-charge
                </label>
                <input
                  type="text"
                  value={officer}
                  onChange={(e) => setOfficer(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Officer Contact Hotline
                </label>
                <input
                  type="text"
                  value={officerContact}
                  onChange={(e) => setOfficerContact(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <Button type="submit" size="sm" className="w-full">
                Update Department Allocation
              </Button>
            </form>
          </Card>

          {/* Priority Adjustment */}
          <Card className="p-6 border space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Change Grievance Priority Level
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {['HIGH', 'MEDIUM', 'LOW'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePriorityChange(p)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    priority === p
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Card>

          {/* Internal Notes & Start Resolution */}
          <Card className="p-6 border space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Official Resolution Action
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Field Engineering Dispatch Note
              </label>
              <textarea
                rows={3}
                placeholder="Log internal work order details, asphalt contractor gang, or machinery deployed..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
              />
            </div>

            <Button
              onClick={handleStartResolution}
              size="md"
              icon={Wrench}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md shadow-amber-600/20"
            >
              Start Resolution & Upload After-Fix Photo
            </Button>
          </Card>

          {/* Citizen Privacy Mask */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Citizen Privacy Protection:
            </p>
            <p>
              Reported by citizen {complaint.reportedBy?.name || 'Citizen'} ({complaint.reportedBy?.id}). Contact phone masked for privacy compliance under Civic Data Act.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
