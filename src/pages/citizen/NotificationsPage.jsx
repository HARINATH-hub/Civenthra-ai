import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useComplaints } from '../../context/ComplaintContext';
import { NOTIFICATIONS } from '../../data/mockData';
import { Bell, CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight, PlusCircle } from 'lucide-react';

export default function NotificationsPage() {
  const { complaints, isDemoMode } = useComplaints();

  // Dynamically assemble notifications from real complaint events
  const dynamicNotifications = [];

  complaints.forEach((c) => {
    // If resolved
    if (c.status === 'RESOLVED') {
      dynamicNotifications.push({
        id: `notif_resolved_${c.id}`,
        title: `Resolution Verified & Closed: ${c.ticketId}`,
        message: `Computer Vision verification successfully validated resolution of ${c.issueType}. Ticket has been officially closed.`,
        timestamp: c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        type: 'resolved',
        read: false,
        ticketId: c.ticketId,
        complaintId: c.id
      });
    } else if (c.status === 'AWAITING_VERIFICATION') {
      dynamicNotifications.push({
        id: `notif_verif_${c.id}`,
        title: `Resolution Pending CV Verification: ${c.ticketId}`,
        message: `Field repair image uploaded for ${c.issueType}. Re-verification pending.`,
        timestamp: c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        type: 'verification',
        read: false,
        ticketId: c.ticketId,
        complaintId: c.id
      });
    } else if (c.status === 'UNDER_RESOLUTION') {
      dynamicNotifications.push({
        id: `notif_prog_${c.id}`,
        title: `Work in Progress: ${c.ticketId}`,
        message: `Field crew assigned from ${c.assignedDepartment || 'Municipal Division'} has commenced repair work.`,
        timestamp: c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        type: 'update',
        read: true,
        ticketId: c.ticketId,
        complaintId: c.id
      });
    }

    // Ticket Created Notification
    dynamicNotifications.push({
      id: `notif_created_${c.id}`,
      title: `Smart Ticket Issued: ${c.ticketId}`,
      message: `GenAI synthesized structured grievance for detected ${c.issueType} (${c.aiConfidence || 92}% CV Confidence). Assigned priority: ${c.priority}.`,
      timestamp: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Earlier today',
      type: 'creation',
      read: true,
      ticketId: c.ticketId,
      complaintId: c.id
    });
  });

  const displayNotifications = isDemoMode && complaints.length > 0 && dynamicNotifications.length === 0
    ? NOTIFICATIONS
    : dynamicNotifications;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Notifications & Audit Alerts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Automated updates from Computer Vision models, field inspections, and status transitions
        </p>
      </div>

      {displayNotifications.length === 0 ? (
        <Card className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No notifications yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
            You haven't reported any civic issues yet. Once you submit a grievance, real-time AI classification and resolution updates will appear here.
          </p>
          <Link to="/citizen/report">
            <Button icon={PlusCircle}>Report Civic Issue</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {displayNotifications.map((n) => {
            const isResolved = n.type === 'resolved';
            const isVerification = n.type === 'verification';

            return (
              <Card
                key={n.id}
                className={`p-4 border transition-all ${
                  !n.read
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl mt-0.5 ${
                        isResolved
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : isVerification
                          ? 'bg-purple-500/10 text-purple-600'
                          : 'bg-indigo-500/10 text-indigo-600'
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isVerification ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {n.title}
                        </h3>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono block pt-1">
                        {n.timestamp}
                      </span>
                    </div>
                  </div>

                  {n.complaintId && (
                    <Link
                      to={`/citizen/complaints/${n.complaintId}`}
                      className="shrink-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
