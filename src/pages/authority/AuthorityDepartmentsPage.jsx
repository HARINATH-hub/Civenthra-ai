import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { DEPARTMENTS } from '../../data/mockData';
import { useComplaints } from '../../context/ComplaintContext';
import { Building2, Users, CheckCircle2, Clock, Wrench, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthorityDepartmentsPage() {
  const navigate = useNavigate();
  const { complaints } = useComplaints();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Departmental Fleet & Division Workloads
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Municipal division rosters, active grievance tickets, and Computer Vision resolution metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEPARTMENTS.map((dept) => {
          const deptComplaints = complaints.filter(c => c.assignedDepartment === dept.name);
          const activeCount = deptComplaints.filter(c => c.status !== 'RESOLVED').length;
          const resolvedCount = deptComplaints.filter(c => c.status === 'RESOLVED').length;

          return (
            <Card key={dept.id} className="p-6 border flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    Avg: {dept.avgResolutionDays} Days
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{dept.officerCount} Registered Field Engineers</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase">
                      Active Tickets
                    </span>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {activeCount}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                      CV Resolved
                    </span>
                    <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {resolvedCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  onClick={() => navigate(`/authority/complaints?search=${encodeURIComponent(dept.name)}`)}
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs font-semibold"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  View Department Queue ({deptComplaints.length})
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
