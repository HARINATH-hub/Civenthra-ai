import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import PriorityBadge from '../../components/common/PriorityBadge';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import { aiService } from '../../services/aiService';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  MapPin,
  AlertTriangle,
  Globe,
  Edit3,
  RotateCw,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Check
} from 'lucide-react';

const ANALYSIS_PIPELINE_STEPS = [
  'Image received & visual tensor preprocessed',
  'Multimodal input cross-referenced',
  'Computer Vision (YOLOv11) analyzing features',
  'Civic issue defect & bounding box detected',
  'High-precision GPS coordinates verified',
  'Duplicate proximity clustering check completed',
  'Civic impact & safety severity assessed',
  'Priority level calculated',
  'GenAI complaint synthesized across languages',
  'Smart Ticket ready for final confirmation'
];

export default function AIAnalysisPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { complaints, addComplaint } = useComplaints();
  const { currentLanguage, setLanguage } = useLanguage();

  // Load pending report from sessionStorage
  const [reportData, setReportData] = useState(() => {
    const raw = sessionStorage.getItem('civenthra_pending_report');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Pipeline simulation state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [aiResult, setAiResult] = useState(null);

  // Editable complaint state
  const [editedComplaintText, setEditedComplaintText] = useState('');
  const [selectedLang, setSelectedLang] = useState(currentLanguage);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!reportData) {
      navigate('/citizen/report');
      return;
    }

    // Run simulated steps with realistic pacing
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < ANALYSIS_PIPELINE_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        // Execute AI Service analysis
        aiService
          .analyzeCivicIssue({
            imagePreview: reportData.imagePreview,
            text: reportData.description,
            hasVoiceNote: reportData.hasVoiceNote,
            location: reportData.location,
            existingComplaints: complaints
          })
          .then((res) => {
            setAiResult(res);
            setEditedComplaintText(res.multilingualComplaints?.[selectedLang] || res.complaintText);
            setIsProcessing(false);
          });
      }
    }, 280);

    return () => clearInterval(interval);
  }, [reportData]);

  // When language switches, update displayed complaint text from synthesized language samples
  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode);
    setLanguage(langCode);
    if (aiResult?.multilingualComplaints?.[langCode]) {
      setEditedComplaintText(aiResult.multilingualComplaints[langCode]);
    }
  };

  const handleRegenerate = () => {
    if (aiResult) {
      const refreshed = aiResult.multilingualComplaints?.[selectedLang] || aiResult.complaintText;
      setEditedComplaintText(refreshed);
      setIsEditing(false);
    }
  };

  // Submit and create final smart ticket
  const handleConfirmAndIssueTicket = () => {
    if (!aiResult) return;

    const newComplaint = addComplaint({
      issueType: aiResult.issueType,
      category: aiResult.category,
      title: `${aiResult.issueType} on ${reportData.location?.address?.split(',')[0] || 'Roadway'}`,
      description: editedComplaintText,
      rawInputText: reportData.description,
      hasVoiceNote: reportData.hasVoiceNote,
      voiceDuration: reportData.voiceDuration,
      imageUrl: reportData.imagePreview,
      location: reportData.location,
      priority: aiResult.priority,
      impactScore: aiResult.impactScore,
      impactLevel: aiResult.impactLevel,
      duplicateStatus: aiResult.duplicateCheck.isDuplicate ? 'DUPLICATE_FLAGGED' : 'NO_DUPLICATE',
      aiConfidence: aiResult.aiConfidence,
      aiDetectionModel: aiResult.aiModel,
      detectedObjects: aiResult.detectedObjects,
      assignedDepartment: aiResult.suggestedDepartment
    }, user);

    sessionStorage.removeItem('civenthra_pending_report');
    navigate(`/citizen/ticket/${newComplaint.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Automated AI Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            AI Analysis & Grievance Synthesis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time Computer Vision detection, spatial duplicate verification, and GenAI complaint generation
          </p>
        </div>
      </div>

      {/* PROCESSING STATE: 10-STEP PIPELINE TRACKER */}
      {isProcessing ? (
        <Card className="p-6 sm:p-8 border shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Cpu className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Processing in Progress...</span>
              </h3>
              <p className="text-xs text-slate-500">
                Running YOLOv11 defect neural net & spatial geospatial proximity clustering
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / ANALYSIS_PIPELINE_STEPS.length) * 100}%` }}
            />
          </div>

          {/* Step by step checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {ANALYSIS_PIPELINE_STEPS.map((stepText, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-medium'
                      : isCurrent
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{stepText}</span>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        /* COMPLETED AI ANALYSIS RESULT */
        <div className="space-y-6 animate-in zoom-in-95 duration-200">
          {/* Main Visual & Diagnostics Card */}
          <Card className="p-6 sm:p-8 border shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AI Analysis Completed
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {aiResult.aiModel}
                </span>
              </div>
              <PriorityBadge priority={aiResult.priority} size="md" />
            </div>

            {/* Split view: Image with Bounding Box Overlay + Diagnostic Key-Values */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Image with CV Box */}
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 aspect-4/3 flex items-center justify-center">
                <img
                  src={reportData?.imagePreview}
                  alt="Detected Civic Defect"
                  className="w-full h-full object-cover opacity-90"
                />

                {/* Simulated Computer Vision Detection Bounding Box */}
                <div className="absolute inset-x-6 inset-y-6 border-2 border-cyan-400 rounded-lg pointer-events-none flex flex-col justify-between p-1 bg-cyan-400/15">
                  <div className="bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded w-max">
                    {aiResult.issueType} • {aiResult.aiConfidence}% Conf
                  </div>
                  <div className="text-[9px] text-cyan-200 font-mono text-right bg-slate-900/80 px-1 rounded w-max self-end">
                    BBox: [120, 150, 480, 410]
                  </div>
                </div>

                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700">
                  Model: YOLOv11-CivicVision
                </div>
              </div>

              {/* Diagnostic Key Values */}
              <div className="md:col-span-7 grid grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Detected Issue
                  </span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {aiResult.issueType}
                  </p>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {aiResult.category}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Detection Confidence
                  </span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    {aiResult.aiConfidence}%
                  </p>
                  <span className="text-[10px] text-slate-400">
                    High Model Accuracy
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Impact Severity
                  </span>
                  <p className="text-base font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                    {aiResult.impactLevel} ({aiResult.impactScore}/100)
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Calculated Safety Hazard
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    Priority Rating
                  </span>
                  <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {aiResult.priority}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    Dispatch Tier 1
                  </span>
                </div>

                {/* Full-width Duplicate Check Badge */}
                <div className="col-span-2 p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {aiResult.duplicateCheck.isDuplicate ? (
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    <div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        Duplicate Proximity Check
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {aiResult.duplicateCheck.statusText}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    75m Radius
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* AI GENERATED COMPLAINT & MULTILINGUAL SUPPORT */}
          <Card className="p-6 sm:p-8 border shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>AI Generated Complaint</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Synthesized technical civic statement for official department dispatch
                </p>
              </div>

              {/* Multilingual Selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Language:
                </span>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedLang === lang.code
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Complaint Text Box */}
            <div className="relative">
              {isEditing ? (
                <textarea
                  rows={4}
                  value={editedComplaintText}
                  onChange={(e) => setEditedComplaintText(e.target.value)}
                  className="w-full p-4 text-sm bg-slate-50 dark:bg-slate-800 border border-indigo-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white leading-relaxed"
                />
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {editedComplaintText}
                </div>
              )}

              {/* Action buttons on the complaint */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Save Edits' : 'Edit Complaint'}</span>
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Regenerate Text</span>
                  </button>
                </div>

                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready for Smart Ticket
                </span>
              </div>
            </div>
          </Card>

          {/* Confirm & Issue Ticket Action */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/citizen/report')}
            >
              ← Back to Report
            </Button>

            <Button
              onClick={handleConfirmAndIssueTicket}
              size="xl"
              icon={ArrowRight}
              iconPosition="right"
              className="shadow-xl shadow-indigo-600/30 font-bold"
            >
              Generate Official Smart Ticket
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
