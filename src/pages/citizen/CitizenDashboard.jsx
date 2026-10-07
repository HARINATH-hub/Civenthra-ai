import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Cpu,
  Inbox
} from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { complaints, stats } = useComplaints();
  const navigate = useNavigate();

  // If a citizen is logged in, filter to their complaints; otherwise show all registered in data layer
  const myComplaints = user
    ? complaints.filter(c => !c.reportedBy?.id || c.reportedBy.id === user.id || c.reportedBy.email === user.email)
    : complaints;

  const statCards = [
    {
      label: 'Total Complaints',
      value: myComplaints.length,
      icon: FileText,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800'
    },
    {
      label: 'Active',
      value: myComplaints.filter(c => c.status === 'ACTIVE').length,
      icon: AlertCircle,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
    },
    {
      label: 'In Progress',
      value: myComplaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'AWAITING_VERIFICATION').length,
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'
    },
    {
      label: 'Resolved',
      value: myComplaints.filter(c => c.status === 'RESOLVED').length,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI-Assisted Municipal Grievance Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            {user?.email ? `Logged in as ${user.email}.` : 'Connected to citizen services.'} Report civic infrastructure defects with multimodal AI detection and track verified fixes in real time.
          </p>
        </div>

        <div className="shrink-0">
          <Button
            onClick={() => navigate('/citizen/report')}
            size="lg"
            icon={PlusCircle}
            className="w-full sm:w-auto bg-white text-indigo-950 hover:bg-slate-100 shadow-lg font-bold"
          >
            + Report New Issue
          </Button>
        </div>
      </div>

      {/* Dashboard KPI Cards (0 initially) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-5 flex items-center justify-between border">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {c.label}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {c.value}
                </p>
              </div>
              <div className={`p-3 rounded-2xl border ${c.color}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Section: Recent Complaints */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Complaints
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track Computer Vision verification milestones for your reported issues
            </p>
          </div>
          {myComplaints.length > 0 && (
            <Link
              to="/citizen/complaints"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({myComplaints.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* When 0 complaints, show REQUIRED empty state: "You haven't reported any civic issues yet." */}
        {myComplaints.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="You haven't reported any civic issues yet."
            description="Take a photo of any civic problem such as a pothole, broken streetlight, or garbage pile. Civenthra AI will analyze the problem and generate a smart ticket."
            actionLabel="Report Your First Civic Issue"
            onAction={() => navigate('/citizen/report')}
          />
        ) : (
          /* Complaints Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myComplaints.slice(0, 6).map((item) => (
              <Card
                key={item.id}
                hover
                onClick={() => navigate(`/citizen/complaints/${item.id}`)}
                className="overflow-hidden flex flex-col justify-between border"
              >
                <div>
                  {/* Image and Badges */}
                  <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.issueType}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No photo attached
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-slate-900/90 backdrop-blur-xs text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {item.ticketId}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <PriorityBadge priority={item.priority} size="xs" />
                    </div>
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="bg-indigo-600/90 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        <span>{item.aiConfidence}% AI Conf</span>
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
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

                {/* Status and Progress bar */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <StatusBadge status={item.status} size="xs" />
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <span>Track</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === 'RESOLVED'
                          ? 'w-full bg-emerald-500'
                          : item.status === 'AWAITING_VERIFICATION'
                          ? 'w-4/5 bg-purple-500'
                          : item.status === 'IN_PROGRESS'
                          ? 'w-3/5 bg-blue-500'
                          : 'w-1/4 bg-amber-500'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                    <span>Reported</span>
                    <span>AI Analyzed</span>
                    <span>Assigned</span>
                    <span>Verified</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
