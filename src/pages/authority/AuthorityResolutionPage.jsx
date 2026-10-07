import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { useComplaints } from '../../context/ComplaintContext';
import confetti from 'canvas-confetti';
import {
  Wrench,
  Camera,
  Upload,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Cpu,
  RefreshCw,
  Clock,
  Layers,
  FileCheck
} from 'lucide-react';

const SAMPLE_AFTER_FIX_IMAGES = [
  {
    name: 'Asphalt Leveled & Resurfaced (Passes CV)',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
    notes: 'Hot-mix bituminous concrete laid, rolled and compacted with 10-ton tandem vibratory roller. Surface tested for gradient.',
    outcome: 'success'
  },
  {
    name: 'Sub-standard Unfinished Gravel (Fails CV)',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    notes: 'Contractor gang loosely spread crushed stone without bitumen binder. Severe unevenness persists.',
    outcome: 'fail'
  }
];

export default function AuthorityResolutionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { getComplaintById, submitAfterFixImage, reverifyResolution } = useComplaints();

  const complaint = getComplaintById(id);

  // Resolution form state (clean by default unless complaint already has afterImageUrl)
  const [afterImage, setAfterImage] = useState(complaint?.afterImageUrl || '');
  const [resolutionNotes, setResolutionNotes] = useState(complaint?.resolutionNotes || '');

  // Verification pipeline simulation state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(complaint?.verificationResult || null);
  const [forceFailDemo, setForceFailDemo] = useState(false);

  if (!complaint) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold">Complaint not found</h2>
        <Button onClick={() => navigate('/authority/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  const handleSelectSample = (sample) => {
    setAfterImage(sample.url);
    setResolutionNotes(sample.notes);
    setForceFailDemo(sample.outcome === 'fail');
    setVerificationResult(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAfterImage(URL.createObjectURL(file));
      setVerificationResult(null);
    }
  };

  // Trigger Computer Vision Re-verification
  const handleExecuteVerification = async () => {
    if (!afterImage) {
      alert('Please upload or select an after-fix photo of the resolved civic site.');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    // First save the after-fix image and notes to complaint context
    submitAfterFixImage(complaint.id, afterImage, resolutionNotes);

    // Run the CV re-verification algorithm
    const result = await reverifyResolution(complaint.id, forceFailDemo);
    setVerificationResult(result);
    setIsVerifying(false);

    if (result.verified) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
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
              Civic Defect: <strong>{complaint.issueType}</strong> • {complaint.location?.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800">
            CV Model: CivicVision-ReVerify-v3.1
          </span>
        </div>
      </div>

      {/* CORE PROJECT RULE EXPLANATION */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Core Automated Verification Rule:</span>
        </div>
        <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
          An issue cannot become <strong>RESOLVED</strong> simply because an authority marks it as fixed. The status transition is mathematically governed by Computer Vision re-verification of the after-fix image. If CV confirms defect clearance: <span className="font-bold">ACTIVE → VERIFIED → RESOLVED</span>. If CV fails: <span className="font-bold">ACTIVE → VERIFICATION FAILED → ACTIVE</span>.
        </p>
      </div>

      {/* DEMO CONTROLS: Switch between Pass and Fail testing */}
      <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            Presentation Demo Mode (Simulate Verification Outcomes):
          </span>
          <span className="text-slate-500 text-[11px]">
            Choose a test scenario to demonstrate Success vs Failure workflows to evaluators
          </span>
        </div>

        <div className="flex items-center gap-2">
          {SAMPLE_AFTER_FIX_IMAGES.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                afterImage === sample.url
                  ? sample.outcome === 'success'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {sample.outcome === 'success' ? '✓ Test Successful Fix' : '✗ Test Failed Fix (Returns to Active)'}
            </button>
          ))}
        </div>
      </div>

      {/* SIDE-BY-SIDE VISUAL COMPARISON: Original Image vs After-Fix Image (Section 13) */}
      <Card className="p-6 border space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Computer Vision Re-verification Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* 1. ORIGINAL IMAGE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                1. Original Reported Defect (Before)
              </span>
              <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">
                Defect Present (94.6% Conf)
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-950 aspect-video">
              <img src={complaint.imageUrl} alt="Before" className="w-full h-full object-cover" />
              <div className="absolute inset-6 border-2 border-dashed border-rose-500 rounded-lg pointer-events-none flex items-start justify-end p-1.5">
                <span className="bg-rose-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                  DEFECT ROI
                </span>
              </div>
              <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                Reported: {new Date(complaint.createdAt).toLocaleDateString()}
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Spatial reference coordinates: {complaint.location?.latitude}° N, {complaint.location?.longitude}° E
            </p>
          </div>

          {/* 2. AFTER-FIX IMAGE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                2. After-Fix Work Photo (After)
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> Upload Custom Photo
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-900 bg-slate-950 aspect-video group">
              {afterImage ? (
                <>
                  <img src={afterImage} alt="After" className="w-full h-full object-cover" />
                  {/* Scanning laser animation during CV verification */}
                  {isVerifying && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent h-16 w-full animate-bounce pointer-events-none border-b-2 border-cyan-400" />
                  )}
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    Target Verification Tensor
                  </div>
                </>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center p-4 text-center cursor-pointer border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors"
                >
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <p className="text-xs text-slate-300 font-semibold">Upload After-Fix Photo</p>
                  <p className="text-[10px] text-slate-500 mt-1">Click to upload photo or choose a test scenario above</p>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Submitted by field engineering crew for automated feature comparison
            </p>
          </div>
        </div>

        {/* Resolution Notes Input */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Work Execution Notes & Machinery Deployed
          </label>
          <textarea
            rows={2}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
          />
        </div>

        {/* Action Button: Submit for CV Re-verification */}
        <div className="pt-2">
          <Button
            onClick={handleExecuteVerification}
            loading={isVerifying}
            size="xl"
            icon={ShieldCheck}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg shadow-purple-600/25"
          >
            {isVerifying ? 'Running Computer Vision Re-verification Neural Net...' : 'Submit for AI Verification'}
          </Button>
        </div>
      </Card>

      {/* VERIFICATION RESULT CARD (Section 13) */}
      {verificationResult && (
        <Card
          className={`p-6 sm:p-8 border-2 shadow-xl animate-in zoom-in-95 duration-200 ${
            verificationResult.verified
              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-800'
              : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-400 dark:border-rose-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl text-white ${
                  verificationResult.verified ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {verificationResult.verified ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4
                  className={`text-lg font-black ${
                    verificationResult.verified
                      ? 'text-emerald-900 dark:text-emerald-300'
                      : 'text-rose-900 dark:text-rose-300'
                  }`}
                >
                  {verificationResult.statusText}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {verificationResult.aiModel} • {verificationResult.verificationDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Updated Status:</span>
              <StatusBadge status={complaint.status} size="sm" />
            </div>
          </div>

          {/* Diagnostic Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Confidence</span>
              <p className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">
                {verificationResult.confidence}%
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Structural Match</span>
              <p className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
                {verificationResult.structuralSimilarityScore}
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Defect Clearance</span>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {verificationResult.defectClearanceRate}
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Residual Hazard</span>
              <p className="text-base font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                {verificationResult.defectResidualRate}
              </p>
            </div>
          </div>

          {/* Reason & Recommendation */}
          <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <p className="font-bold text-slate-900 dark:text-white">
              AI Verification Finding:
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {verificationResult.reason}
            </p>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
              {verificationResult.recommendation}
            </p>
          </div>

          {/* Follow-up Action */}
          <div className="pt-5 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={() => {
                setVerificationResult(null);
              }}
            >
              Re-run Test
            </Button>

            <Button
              onClick={() => navigate('/authority/dashboard')}
              size="md"
              icon={ArrowRight}
              iconPosition="right"
            >
              Return to Authority Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
