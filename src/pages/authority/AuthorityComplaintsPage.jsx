import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import EmptyState from '../../components/common/EmptyState';
import { useComplaints } from '../../context/ComplaintContext';
import { DEPARTMENTS } from '../../data/mockData';
import {
  Search,
  Filter,
  Download,
  Eye,
  Wrench,
  ShieldCheck,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';

export default function AuthorityComplaintsPage() {
  const navigate = useNavigate();
  const { complaints } = useComplaints();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      !search ||
      c.ticketId.toLowerCase().includes(search.toLowerCase()) ||
      c.issueType.toLowerCase().includes(search.toLowerCase()) ||
      (c.location?.address && c.location.address.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchesDept = deptFilter === 'ALL' || c.assignedDepartment === deptFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesDept;
  });

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['TicketID,Issue,Priority,Status,ImpactScore,Department,Date']
        .concat(
          filtered.map(
            (c) =>
              `${c.ticketId},${c.issueType},${c.priority},${c.status},${c.impactScore},"${c.assignedDepartment}",${c.createdAt}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'civenthra_grievances_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Grievance Administration & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Master register of multimodal civic reports, departmental workloads, and resolution tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={exportCSV} variant="secondary" size="sm" icon={Download}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Multi-Criteria Filters Bar */}
      <Card className="p-4 border">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Ticket ID, issue, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="AWAITING_VERIFICATION">AWAITING VERIFICATION</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white truncate"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <Card className="border overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <EmptyState
            title="No records found"
            description="No municipal grievances match your filter parameters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Defect Photo & Category</th>
                  <th className="py-3 px-4">Jurisdiction / Ward</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Impact</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/authority/complaints/${item.id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                      {item.ticketId}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                            {item.issueType}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {item.aiConfidence}% AI Conf
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">
                      {item.location?.address}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} size="xs" />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                      {item.impactScore}/100
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-[150px] truncate">
                      {item.assignedDepartment}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="xs" />
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/authority/complaints/${item.id}`}>
                          <button
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link to={`/authority/resolution/${item.id}`}>
                          <button
                            className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                            title="Resolution & CV Verification"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
