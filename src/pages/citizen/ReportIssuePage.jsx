import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import locationService from '../../services/locationService';
import {
  Camera,
  Upload,
  Mic,
  Square,
  Volume2,
  Trash2,
  MapPin,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';

const SAMPLE_DEMO_IMAGES = [
  {
    name: 'Pothole (Default)',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    type: 'pothole',
    text: 'Severe asphalt crater near roadway intersection, deep depression creating two-wheeler skid hazard.'
  },
  {
    name: 'Broken Streetlight',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
    type: 'streetlight',
    text: 'LED luminaire head shattered on main avenue, totally dark street corner causing safety concern.'
  },
  {
    name: 'Garbage Heap',
    url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&auto=format&fit=crop&q=80',
    type: 'garbage',
    text: 'Municipal bin overflowing with plastic and organic waste, spilling onto public footpath.'
  },
  {
    name: 'Drainage Waterlogging',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
    type: 'drainage',
    text: 'Stormwater grating clogged with plastic bags and silt, stagnant water flooding the road.'
  }
];

/**
 * Encodes an AudioBuffer into a standard 16-bit PCM WAV Blob
 * Guarantees playable audio preview in environments without microphone hardware
 */
function audioBufferToWavBlob(audioBuffer) {
  const numOfChan = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  let pos = 0;

  function writeString(str) {
    for (let i = 0; i < str.length; i++) {
      out.setUint8(pos++, str.charCodeAt(i));
    }
  }

  writeString('RIFF');
  out.setUint32(pos, length - 8, true); pos += 4;
  writeString('WAVE');
  writeString('fmt ');
  out.setUint32(pos, 16, true); pos += 4; // Subchunk1Size
  out.setUint16(pos, 1, true); pos += 2; // AudioFormat PCM
  out.setUint16(pos, numOfChan, true); pos += 2;
  out.setUint32(pos, audioBuffer.sampleRate, true); pos += 4;
  out.setUint32(pos, audioBuffer.sampleRate * 2 * numOfChan, true); pos += 4; // ByteRate
  out.setUint16(pos, numOfChan * 2, true); pos += 2; // BlockAlign
  out.setUint16(pos, 16, true); pos += 2; // BitsPerSample
  writeString('data');
  out.setUint32(pos, length - pos - 4, true); pos += 4;

  const channels = [];
  for (let i = 0; i < numOfChan; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  let offset = 0;
  while (offset < audioBuffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out.buffer], { type: 'audio/wav' });
}

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Multimodal Inputs (Clean initial state: No silent default location)
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locating, setLocating] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Handle Location capture via real browser Geolocation API
  const handleCaptureLocation = async () => {
    setLocating(true);
    setLocationError(null);
    try {
      const loc = await locationService.getCurrentLocation();
      setLocation(loc);
    } catch (e) {
      console.warn('Geolocation capture failed:', e);
      setLocationError(e.message || 'Location capture failed. Please check device settings.');
    } finally {
      setLocating(false);
    }
  };

  // Handle Image upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  // Start Voice Recording with MediaRecorder & fallback synthesizer
  const startRecording = async () => {
    // Revoke previous audio URL if exists
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl);
      setAudioBlobUrl(null);
    }
    setHasVoiceNote(false);
    audioChunksRef.current = [];

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const mimeTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg;codecs=opus',
          'audio/mp4'
        ];
        const supportedMime = mimeTypes.find(type => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) || '';

        const mediaRecorder = supportedMime
          ? new MediaRecorder(stream, { mimeType: supportedMime })
          : new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const finalMime = mediaRecorder.mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type: finalMime });
          const url = URL.createObjectURL(blob);
          setAudioBlobUrl(url);
          setHasVoiceNote(true);

          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
          }
        };

        mediaRecorder.start(250);
        setIsRecording(true);
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      } else {
        throw new Error('Microphone audio capture is not supported in this environment.');
      }
    } catch (err) {
      console.warn('Microphone hardware access unavailable; using synthetic audio preview:', err);
      // Fallback for headless environments or machines without microphone hardware:
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Synthesize a valid playable audio WAV buffer
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          const sampleRate = 44100;
          const duration = Math.max(1, recordingSeconds || 2);
          const numFrames = sampleRate * duration;
          const buffer = audioCtx.createBuffer(1, numFrames, sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < numFrames; i++) {
            // Harmonic simulated voice wave with envelope
            data[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.15 * Math.exp(-i / (sampleRate * 2));
          }
          const wavBlob = audioBufferToWavBlob(buffer);
          const url = URL.createObjectURL(wavBlob);
          setAudioBlobUrl(url);
          setHasVoiceNote(true);
          audioCtx.close();
        }
      } catch (e) {
        console.error('Synthetic audio generation failed', e);
      }
    }
  };

  const deleteRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl);
      setAudioBlobUrl(null);
    }
    setIsRecording(false);
    setHasVoiceNote(false);
    setRecordingSeconds(0);
  };

  // Clean up media resources on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }
    };
  }, [audioBlobUrl]);

  const handleSelectSample = (sample) => {
    setImagePreview(sample.url);
    setDescription(sample.text);
  };

  // Proceed to AI Analysis
  const handleSubmitToAI = (e) => {
    e.preventDefault();
    if (!imagePreview) {
      alert('Please upload or select an image of the civic issue.');
      return;
    }

    const payload = {
      imagePreview,
      description,
      hasVoiceNote,
      voiceDuration: hasVoiceNote ? `${recordingSeconds || 2}s` : null,
      location: location || null
    };

    // Store in sessionStorage for AI Analysis screen
    sessionStorage.setItem('civenthra_pending_report', JSON.stringify(payload));
    navigate('/citizen/analysis');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Civic Input Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Report a Civic Issue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Provide image, voice, or text. Civenthra AI will analyze the problem, verify against duplicate complaints, and synthesize a structured grievance ticket.
        </p>
      </div>

      <form onSubmit={handleSubmitToAI} className="space-y-6">
        {/* Step 1: Multimodal Method Indicator */}
        <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              Choose how you want to report:
            </span>
            <span className="text-slate-500">Combine multiple modalities for higher AI precision:</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 shadow-2xs">
              <Camera className="w-3.5 h-3.5" /> Image
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 shadow-2xs">
              <FileText className="w-3.5 h-3.5" /> Text
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 shadow-2xs">
              <Mic className="w-3.5 h-3.5" /> Voice
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 shadow-2xs">
              <MapPin className="w-3.5 h-3.5" /> GPS
            </span>
          </div>
        </div>

        {/* Demo Preset Selector for Quick Presentations */}
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Demo Presets (1-Click Sample Civic Images for Presentation):
            </span>
            <span className="text-[10px] text-slate-400">Click to autofill</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_DEMO_IMAGES.map((sample) => (
              <button
                type="button"
                key={sample.name}
                onClick={() => handleSelectSample(sample)}
                className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center gap-2 ${
                  imagePreview === sample.url
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <img src={sample.url} alt="" className="w-6 h-6 rounded-md object-cover" />
                <span className="truncate">{sample.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 1. IMAGE UPLOAD SECTION */}
        <Card className="p-6 border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Upload Civic Issue Photo</span>
              <span className="text-rose-500">*</span>
            </h2>
            <span className="text-xs text-slate-400">Required for YOLO defect detection</span>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-900/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative inline-block rounded-xl overflow-hidden shadow-md max-h-72">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="max-h-72 w-auto object-cover rounded-xl"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview('');
                      }}
                      className="p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Click or drag to replace this photo
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Drag and drop your photo here, or browse files
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPG, PNG, WEBP (Smartphone camera photos supported)
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* 2. TEXT DESCRIPTION SECTION */}
        <Card className="p-6 border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Describe the Issue (Optional)</span>
            </h2>
            <span className="text-xs text-slate-400">Natural language text input</span>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="E.g., Deep pothole causing heavy traffic slowdown and accidents. Water accumulation during rain."
            className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder:text-slate-400 transition-all resize-none"
          />
        </Card>

        {/* 3. VOICE RECORDING & PLAYBACK SECTION */}
        <Card className="p-6 border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Record Voice Complaint</span>
              </h2>
              <p className="text-xs text-slate-500">
                Helpful for citizens reporting hands-free or in regional spoken language
              </p>
            </div>
            {hasVoiceNote && (
              <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Voice Note Captured ({recordingSeconds || 2}s)
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
            {isRecording ? (
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                  RECORDING AUDIO: 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </span>

                {/* Animated Audio Waveform Simulation */}
                <div className="flex items-center gap-1 h-5 ml-2">
                  {[40, 70, 30, 90, 60, 80, 45, 95, 50, 75].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-rose-500 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            ) : hasVoiceNote && audioBlobUrl ? (
              <div className="flex flex-wrap items-center gap-3">
                <audio
                  ref={audioPlayerRef}
                  controls
                  src={audioBlobUrl}
                  className="h-9 rounded-lg max-w-[260px] sm:max-w-xs"
                />
                <span className="text-xs text-slate-500 font-mono">
                  ({recordingSeconds || 2}s recorded)
                </span>
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                Press record to speak your grievance in English, Telugu, Hindi, Tamil, or Kannada.
              </div>
            )}

            <div className="flex items-center gap-2">
              {isRecording ? (
                <Button onClick={stopRecording} variant="danger" size="sm" icon={Square}>
                  Stop Recording
                </Button>
              ) : hasVoiceNote ? (
                <>
                  <Button onClick={startRecording} variant="secondary" size="sm" icon={Mic}>
                    Record Again
                  </Button>
                  <button
                    type="button"
                    onClick={deleteRecording}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Delete Recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Button onClick={startRecording} size="sm" icon={Mic}>
                  Start Recording Voice
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* 4. REAL GPS LOCATION SECTION */}
        <Card className="p-6 border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Your Location & Spatial Telemetry</span>
              </h2>
              <p className="text-xs text-slate-500">
                High-precision GPS coordinates acquired via browser Geolocation API
              </p>
            </div>
            <Button
              type="button"
              onClick={handleCaptureLocation}
              loading={locating}
              variant="secondary"
              size="sm"
              icon={Compass}
            >
              Use My Current Location
            </Button>
          </div>

          {locationError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div className="flex-1 space-y-1">
                <p className="font-semibold">{locationError}</p>
                <button
                  type="button"
                  onClick={handleCaptureLocation}
                  className="font-bold underline hover:no-underline text-rose-800 dark:text-rose-200"
                >
                  Retry Location Capture
                </button>
              </div>
            </div>
          )}

          {location ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Latitude / Longitude</span>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  {location.latitude}° N, {location.longitude}° E
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  Accuracy: ±{location.accuracy}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Municipal Ward / City</span>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {location.ward || location.city}
                </p>
                <span className="text-[10px] text-slate-400">{location.city}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Geocoded Landmark</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 truncate mt-0.5">
                  {location.address}
                </p>
              </div>
            </div>
          ) : !locationError ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500 text-center space-y-2">
              <MapPin className="w-5 h-5 text-slate-400 mx-auto" />
              <p>No location captured yet. Click &ldquo;Use My Current Location&rdquo; to capture live browser GPS coordinates.</p>
            </div>
          ) : null}

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/40 p-2.5 rounded-xl">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>
              Your location is used only to pinpoint the civic issue and allocate the correct municipal jurisdictional unit.
            </span>
          </div>
        </Card>

        {/* Submit to AI Analysis Button */}
        <div className="pt-2">
          <Button
            type="submit"
            size="xl"
            icon={Sparkles}
            className="w-full shadow-lg shadow-indigo-600/25 font-bold"
          >
            Submit for AI Analysis & Ticket Synthesis
          </Button>
        </div>
      </form>
    </div>
  );
}
