import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import EmptyState from '../../components/common/EmptyState';
import { useComplaints } from '../../context/ComplaintContext';
import {
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Cpu,
  Layers
} from 'lucide-react';

export default function MyComplaintsPage() {
  const navigate = useNavigate();
  const { complaints } = useComplaints();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = complaints.filter((c) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && (c.status === 'ACTIVE' || c.status === 'IN_PROGRESS' || c.status === 'AWAITING_VERIFICATION')) ||
      c.status === statusFilter;

    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      c.ticketId.toLowerCase().includes(query) ||
      c.issueType.toLowerCase().includes(query) ||
      (c.location?.address && c.location.address.toLowerCase().includes(query));

    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Registered Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track status, review AI diagnostics, and follow Computer Vision resolution verification
          </p>
        </div>

        <Button
          onClick={() => navigate('/citizen/report')}
          icon={PlusCircle}
          className="shadow-md shadow-indigo-600/20"
        >
          Report New Issue
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ticket ID (CIV-2026-...), issue, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active / In Progress</option>
            <option value="AWAITING_VERIFICATION">Awaiting Verification</option>
            <option value="RESOLVED">Verified & Resolved</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="sm:col-span-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      {filtered.length === 0 ? (
        <EmptyState
          title={complaints.length === 0 ? "You haven't reported any civic issues yet." : "No matching complaints found"}
          description={
            complaints.length === 0
              ? "Submit your first report using camera photos, text description, and GPS location."
              : "No civic complaints match your current filter parameters or search keyword."
          }
          actionLabel="Report a Civic Issue"
          onAction={() => navigate('/citizen/report')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              hover
              onClick={() => navigate(`/citizen/complaints/${item.id}`)}
              className="overflow-hidden flex flex-col justify-between border"
            >
              <div>
                {/* Photo & Badges */}
                <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.issueType}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-slate-900/90 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {item.ticketId}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <PriorityBadge priority={item.priority} size="xs" />
                  </div>
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="bg-indigo-600/90 text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      <span>{item.aiConfidence}% Conf</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location?.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">
                        Impact: {item.impactScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Action */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <StatusBadge status={item.status} size="xs" />
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span>Track Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
