import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Modal from '../../components/common/Modal';
import { useComplaints } from '../../context/ComplaintContext';
import { DEPARTMENTS } from '../../data/mockData';
import {
  FileText,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Eye,
  UserCheck,
  Wrench,
  Search,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function AuthorityDashboard() {
  const navigate = useNavigate();
  const { complaints, stats, assignDepartmentAndOfficer } = useComplaints();

  // Quick Assign Modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(DEPARTMENTS[0].name);
  const [officerName, setOfficerName] = useState('Er. Ramesh Babu (Assistant Engineer)');

  const kpiCards = [
    {
      label: 'Total Complaints',
      value: stats.total,
      icon: FileText,
      border: 'border-slate-200 dark:border-slate-800',
      text: 'text-slate-900 dark:text-white',
      badge: 'All municipal logs'
    },
    {
      label: 'Active Complaints',
      value: stats.active,
      icon: AlertCircle,
      border: 'border-amber-200 dark:border-amber-900',
      text: 'text-amber-600 dark:text-amber-400',
      badge: 'Unassigned & Pending'
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      icon: AlertTriangle,
      border: 'border-rose-200 dark:border-rose-900',
      text: 'text-rose-600 dark:text-rose-400',
      badge: 'Critical life-safety hazard'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      border: 'border-blue-200 dark:border-blue-900',
      text: 'text-blue-600 dark:text-blue-400',
      badge: 'Under field repair'
    },
    {
      label: 'Awaiting Verification',
      value: stats.awaitingVerification,
      icon: ShieldCheck,
      border: 'border-purple-200 dark:border-purple-900',
      text: 'text-purple-600 dark:text-purple-400',
      badge: 'After-fix photo uploaded'
    },
    {
      label: 'Verified Resolved',
      value: stats.resolved,
      icon: CheckCircle2,
      border: 'border-emerald-200 dark:border-emerald-900',
      text: 'text-emerald-600 dark:text-emerald-400',
      badge: 'CV validated & closed'
    }
  ];

  // Priority complaints (High and Active/In Progress first)
  const priorityComplaints = complaints;

  const handleOpenAssignModal = (complaint, e) => {
    e.stopPropagation();
    setSelectedComplaint(complaint);
    setSelectedDepartment(complaint.assignedDepartment || DEPARTMENTS[0].name);
    setAssignModalOpen(true);
  };

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    if (selectedComplaint) {
      assignDepartmentAndOfficer(selectedComplaint.id, selectedDepartment, officerName);
      setAssignModalOpen(false);
      setSelectedComplaint(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Greater Municipal Corporation — Engineering & Public Works Control Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Authority Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time oversight of computer vision verified grievances across West Zone
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              if (complaints.length > 0) {
                const pending = complaints.find(c => c.status === 'AWAITING_VERIFICATION') || complaints[0];
                navigate(`/authority/resolution/${pending.id}`);
              } else {
                navigate('/authority/complaints');
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20"
            icon={ShieldCheck}
            size="sm"
          >
            Review Pending CV Verification ({stats.awaitingVerification})
          </Button>
        </div>
      </div>

      {/* KPI Cards (Section 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className={`p-4 border ${kpi.border} flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {kpi.label}
                </span>
                <Icon className={`w-4 h-4 ${kpi.text} shrink-0`} />
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-black ${kpi.text}`}>
                  {kpi.value}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-1">
                  {kpi.badge}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Table: Priority Complaints (Section 11) */}
      <Card className="border overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Priority Complaints Queue
            </h2>
            <p className="text-xs text-slate-500">
              Ranked by impact assessment and automated Computer Vision severity score
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/authority/complaints">
              <Button variant="secondary" size="sm" icon={Filter}>
                Advanced Filters
              </Button>
            </Link>
          </div>
        </div>

        {/* Data Table or Empty State */}
        {priorityComplaints.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
              No civic complaints recorded in the system yet.
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              The database is clean and fresh. When a citizen submits a grievance through the citizen portal, it will be automatically routed and displayed here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Issue / Category</th>
                  <th className="py-3 px-4">Location & Ward</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Impact Score</th>
                  <th className="py-3 px-4">Reported Date</th>
                  <th className="py-3 px-4">Assigned Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {priorityComplaints.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/authority/complaints/${item.id}`)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  {/* Ticket ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                    {item.ticketId}
                  </td>

                  {/* Issue */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">
                          {item.issueType}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {item.aiConfidence}% CV Conf
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">
                    {item.location?.address}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={item.priority} size="xs" />
                  </td>

                  {/* Impact */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                    {item.impactScore}/100
                  </td>

                  {/* Reported Date */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  {/* Assigned Department */}
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-[150px] truncate">
                    {item.assignedDepartment}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={item.status} size="xs" />
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {item.status === 'AWAITING_VERIFICATION' ? (
                        <Link to={`/authority/resolution/${item.id}`}>
                          <button
                            className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            title="Perform CV Re-verification"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verify Fix</span>
                          </button>
                        </Link>
                      ) : item.status === 'ACTIVE' ? (
                        <button
                          onClick={(e) => handleOpenAssignModal(item, e)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                          title="Assign Department & Officer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Assign</span>
                        </button>
                      ) : (
                        <Link to={`/authority/resolution/${item.id}`}>
                          <button
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Resolution</span>
                          </button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </Card>

      {/* QUICK ASSIGN MODAL */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Grievance: ${selectedComplaint?.ticketId}`}
      >
        <form onSubmit={handleConfirmAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Designated Officer / Engineer In-charge
            </label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" icon={UserCheck}>
              Confirm Allocation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
