import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import DemoBanner from '../components/common/DemoBanner';
import { useAuth } from '../context/AuthContext';
import { CIVIC_CATEGORIES } from '../data/mockData';
import {
  Camera,
  Mic,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Layers,
  Clock,
  Filter,
  FileCheck,
  AlertTriangle,
  Zap,
  Users,
  Compass,
  Building,
  RotateCcw
} from 'lucide-react';

export default function LandingPage() {
  const { user, isCitizen, isAuthority } = useAuth();
  const navigate = useNavigate();

  const handleStartReporting = () => {
    if (user && isCitizen) {
      navigate('/citizen/report');
    } else {
      navigate('/login');
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Report',
      desc: 'Citizen captures multimodal evidence using camera, voice recording, text description and GPS geolocation.',
      icon: Camera
    },
    {
      num: '02',
      title: 'Analyze',
      desc: 'Multimodal input processor extracts visual artifacts, audio transcripts, and spatial metadata.',
      icon: Cpu
    },
    {
      num: '03',
      title: 'Detect',
      desc: 'YOLO Computer Vision model detects defect category, bounding boxes, and calculates confidence score.',
      icon: Sparkles
    },
    {
      num: '04',
      title: 'Prioritize',
      desc: 'Automated impact analyzer calculates civic severity score and runs geo-radius duplicate detection.',
      icon: AlertTriangle
    },
    {
      num: '05',
      title: 'Generate Ticket',
      desc: 'Generative AI synthesizes a structured multilingual grievance and issues an immutable Smart Ticket.',
      icon: FileCheck
    },
    {
      num: '06',
      title: 'Resolve',
      desc: 'Routed directly to municipal authority dashboard. Field crew executes physical repairs.',
      icon: Building
    },
    {
      num: '07',
      title: 'Verify',
      desc: 'Crew submits after-fix photo. CV Re-verification engine verifies defect removal against original photo.',
      icon: ShieldCheck
    },
    {
      num: '08',
      title: 'Close or Revert',
      desc: 'Passing verification cert marks complaint RESOLVED. Failed verification automatically returns ticket to ACTIVE.',
      icon: RotateCcw
    }
  ];

  const benefits = [
    {
      title: 'Clearer Complaints',
      desc: 'Eliminates vague reports by automatically extracting technical civic defect parameters using GenAI.',
      icon: Sparkles
    },
    {
      title: 'Faster Identification',
      desc: 'Sub-second visual object detection categorizes potholes, luminaire faults, and solid waste dumps.',
      icon: Zap
    },
    {
      title: 'Location-Aware Reporting',
      desc: 'High-precision GPS telemetry pins complaints directly to municipal ward boundaries.',
      icon: MapPin
    },
    {
      title: 'Duplicate Detection',
      desc: 'Spatial clustering detects identical nearby reports, preventing duplicate tickets and department clutter.',
      icon: Filter
    },
    {
      title: 'Impact Assessment',
      desc: 'Data-driven priority scoring (High, Medium, Low) ensures life-threatening hazards receive immediate action.',
      icon: AlertTriangle
    },
    {
      title: 'Transparent Tracking',
      desc: 'Real-time 8-stage audit timeline allows citizens and supervisors to observe live repair milestones.',
      icon: Clock
    },
    {
      title: 'Verified Resolution',
      desc: 'No issue is closed based on contractor claims alone. Visual AI re-verification validates the actual fix.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <DemoBanner />

      {/* Public Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              How It Works
            </a>
            <a href="#categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Civic Categories
            </a>
            <a href="#why-civenthra" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Why Civenthra AI
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/authority/login"
              className="text-xs font-semibold px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Authority Login
            </Link>
            {user ? (
              <Button
                onClick={() => navigate(isAuthority ? '/authority/dashboard' : '/citizen/dashboard')}
                size="sm"
              >
                Go to Dashboard
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,70,229,0.25),rgba(15,23,42,0))]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Civic Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Next-Gen Civic Infrastructure AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Report Civic Issues.{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">
                  Powered by AI.
                </span>{' '}
                Verified for Real.
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Civenthra AI uses Computer Vision and Generative AI to detect civic issues, generate structured complaints, prioritize impact, and verify resolutions.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Button
                  onClick={handleStartReporting}
                  size="lg"
                  icon={Camera}
                  className="shadow-lg shadow-indigo-600/30"
                >
                  Report an Issue
                </Button>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
                    Explore How It Works
                  </Button>
                </a>
              </div>

              {/* Verified Badges / Functional Indicators */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>AI-Powered Detection</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Multimodal Reporting</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>GPS-Based Complaints</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Resolution Verification</span>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Smart City / AI Dashboard Visual */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl blur-xl opacity-30 animate-pulse-slow" />

                <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-5 space-y-4">
                  {/* Mock Ticket Preview Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        CIV-2026-000101
                      </span>
                    </div>
                    <span className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded border border-rose-500/20">
                      HIGH PRIORITY
                    </span>
                  </div>

                  {/* AI Detection Visual Box */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 aspect-video group">
                    <img
                      src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80"
                      alt="Civic Pothole Detection Preview"
                      className="w-full h-full object-cover opacity-85"
                    />

                    {/* CV Bounding Box Overlay */}
                    <div className="absolute inset-x-8 inset-y-6 border-2 border-cyan-400 rounded-lg pointer-events-none flex flex-col justify-between p-1 bg-cyan-400/10">
                      <div className="bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded w-max">
                        Pothole: 94.6% Conf
                      </div>
                      <div className="text-[9px] text-cyan-200 font-mono text-right bg-slate-900/80 px-1 rounded w-max self-end">
                        BBox: [120, 150, 480, 410]
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1.5 border border-slate-700">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>GPS: 17.4435° N, 78.3772° E</span>
                    </div>
                  </div>

                  {/* GenAI Synthesis Snapshot */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        GenAI Structured Complaint
                      </span>
                      <span className="text-emerald-600 font-mono">Impact Score: 92/100</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic line-clamp-2">
                      “Severe asphalt rupture identified on Inner Ring Road corridor creating critical accident hazard...”
                    </p>
                  </div>

                  {/* Verification Pipeline Indicator */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500 text-[11px]">Workflow Status:</span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                      Awaiting CV Re-verification
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Civenthra AI Works (8 Steps) */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              End-to-End Civic Intelligence Lifecycle
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              How Civenthra AI Works
            </p>
            <p className="text-base text-slate-600 dark:text-slate-300">
              From street capture to Computer Vision defect verification, our automated pipeline ensures every grievance is legitimate, prioritized, and proven fixed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-indigo-600/30 dark:text-indigo-400/30 group-hover:text-indigo-600 group-hover:dark:text-indigo-400 transition-colors">
                      {step.num}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs text-indigo-600 dark:text-indigo-400 border border-slate-200/60 dark:border-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Civic Categories */}
      <section id="categories" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Supported Civic Grievance Domains
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Civic Issue Categories
            </p>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Trained on real-world municipal infrastructure imagery with deep learning classification models.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CIVIC_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-2 hover:border-indigo-500 transition-colors shadow-2xs"
              >
                <div className={`p-3 rounded-xl border ${cat.color}`}>
                  <Layers className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2">
                  {cat.name}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {cat.count}+ Reports Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Civenthra AI? */}
      <section id="why-civenthra" className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Next-Gen Public Service
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Why Civenthra AI?
            </p>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Modernizing civic administration with authentic computer vision verification and multilingual accessibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Civic Participation Platform
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Help Build a Better Community
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Take a photo of any civic defect in your neighborhood. Let Civenthra AI handle the classification, priority assignment, and resolution verification.
          </p>
          <div className="pt-2 flex justify-center">
            <Button
              onClick={handleStartReporting}
              size="xl"
              icon={Camera}
              className="bg-white text-indigo-950 hover:bg-slate-100 shadow-xl font-bold"
            >
              Report a Civic Issue
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size="md" />
            <p className="text-slate-500 text-[11px] max-w-sm text-center md:text-left mt-1">
              Civenthra AI: A Multimodal GenAI and Computer Vision-Based Civic Issue Detection and Grievance Management System.
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link to="/authority/login" className="hover:text-white transition-colors">
              Authority Portal
            </Link>
            <Link to="/citizen/dashboard" className="hover:text-white transition-colors">
              Citizen Portal
            </Link>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-500">B.Tech Final Year Capstone</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
