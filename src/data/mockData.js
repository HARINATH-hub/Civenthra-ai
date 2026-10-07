// Civenthra AI - Optional Demo Sample Fixtures (Used ONLY when "Load Demo Data" is explicitly triggered)

export const DEMO_SAMPLE_COMPLAINTS = [
  {
    id: 'demo_comp_001',
    ticketId: 'CIV-2026-000101',
    issueType: 'Pothole',
    category: 'Roads & Highways',
    title: 'Severe Asphalt Pothole on Inner Ring Road',
    description: 'A large pothole with exposed aggregate and broken asphalt has been identified on the roadway. The damaged road surface creates a severe safety hazard for two-wheelers and night traffic. Immediate asphalt cold-mix filling and compaction recommended.',
    rawInputText: 'Large pothole on the roadway, tires are getting impacted.',
    hasVoiceNote: true,
    voiceDuration: '12s',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    afterImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
    location: {
      latitude: 17.4435,
      longitude: 78.3772,
      address: 'Main Ring Road Corridor, Municipal Zone 4',
      city: 'Metropolitan City',
      state: 'State',
      pincode: '500081',
      ward: 'Ward 104'
    },
    priority: 'HIGH',
    impactScore: 92,
    impactLevel: 'HIGH',
    duplicateStatus: 'NO_DUPLICATE',
    aiConfidence: 94.6,
    aiDetectionModel: 'YOLOv11-CivicVision-v2.4',
    detectedObjects: [
      { label: 'Deep Asphalt Pothole', confidence: 0.946, bbox: [120, 150, 480, 410] },
      { label: 'Surface Rutting', confidence: 0.871, bbox: [80, 110, 560, 490] }
    ],
    status: 'AWAITING_VERIFICATION', // Ready for immediate verification demo
    assignedDepartment: 'Roads & Infrastructure Division',
    assignedOfficer: 'Field Assistant Engineer',
    assignedOfficerContact: '+91 98000 00001',
    reportedBy: {
      name: 'Demo Citizen',
      email: 'citizen@civenthra.demo',
      phone: '+91 98000 00002',
      id: 'cit_demo_01'
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    resolutionNotes: 'Hot-mix bitumen emulsion and vibratory roller compactor deployed. Surface leveled and sealed.',
    timeline: [
      { stage: 'SUBMITTED', title: 'Complaint Submitted', date: 'Day -2, 09:30 AM', status: 'completed', desc: 'Report submitted via Multimodal Mobile Interface' },
      { stage: 'AI_ANALYZED', title: 'Computer Vision & AI Processed', date: 'Day -2, 09:31 AM', status: 'completed', desc: 'Pothole detected (94.6% conf), Priority High, GenAI ticket synthesized' },
      { stage: 'TICKET_CREATED', title: 'Smart Ticket Issued', date: 'Day -2, 09:31 AM', status: 'completed', desc: 'Smart Ticket CIV-2026-000101 assigned to Roads Division' },
      { stage: 'ASSIGNED', title: 'Assigned to Authority', date: 'Day -2, 11:45 AM', status: 'completed', desc: 'Assigned to Field Assistant Engineer' },
      { stage: 'UNDER_RESOLUTION', title: 'Work In Progress', date: 'Day -1, 08:00 AM', status: 'completed', desc: 'Repair crew dispatched with asphalt mixture and road roller' },
      { stage: 'AFTER_FIX_UPLOADED', title: 'After-Fix Photo Uploaded', date: 'Today, 11:15 AM', status: 'completed', desc: 'Field engineer uploaded completed work photo for CV verification' },
      { stage: 'CV_VERIFICATION', title: 'CV Re-verification Pending', date: 'Pending Action', status: 'current', desc: 'Requires automated Computer Vision feature match before closure' }
    ],
    verificationResult: null
  },
  {
    id: 'demo_comp_002',
    ticketId: 'CIV-2026-000102',
    issueType: 'Broken Streetlight',
    category: 'Electricity & Street Lighting',
    title: 'Non-functional Streetlight Pole Creating Nocturnal Darkspot',
    description: 'A non-functional municipal LED streetlight pole has been detected. The total lack of illumination causes severe poor visibility during nocturnal hours, increasing accident and harassment risks.',
    rawInputText: 'Streetlight pole unlit for several days.',
    hasVoiceNote: false,
    voiceDuration: null,
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
    afterImageUrl: null,
    location: {
      latitude: 17.4374,
      longitude: 78.3614,
      address: '4th Cross Road, Ward 105',
      city: 'Metropolitan City',
      state: 'State',
      pincode: '500032',
      ward: 'Ward 105'
    },
    priority: 'MEDIUM',
    impactScore: 68,
    impactLevel: 'MEDIUM',
    duplicateStatus: 'NO_DUPLICATE',
    aiConfidence: 91.2,
    aiDetectionModel: 'YOLOv11-CivicVision-v2.4',
    detectedObjects: [
      { label: 'Unlit LED Luminaire', confidence: 0.912, bbox: [200, 50, 420, 220] }
    ],
    status: 'IN_PROGRESS',
    assignedDepartment: 'Electricity & Public Lighting',
    assignedOfficer: 'Lineman Supervisor',
    assignedOfficerContact: '+91 98000 00003',
    reportedBy: {
      name: 'Demo Citizen 2',
      email: 'citizen2@civenthra.demo',
      phone: '+91 98000 00004',
      id: 'cit_demo_02'
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    resolutionNotes: null,
    timeline: [
      { stage: 'SUBMITTED', title: 'Complaint Submitted', date: 'Yesterday, 06:40 PM', status: 'completed', desc: 'Citizen submitted image & location' },
      { stage: 'AI_ANALYZED', title: 'AI Detection Completed', date: 'Yesterday, 06:41 PM', status: 'completed', desc: 'Luminaire fault detected with 91.2% confidence' },
      { stage: 'TICKET_CREATED', title: 'Smart Ticket Issued', date: 'Yesterday, 06:41 PM', status: 'completed', desc: 'Ticket CIV-2026-000102 routed to Electricity Board' },
      { stage: 'ASSIGNED', title: 'Work Order Dispatched', date: 'Today, 08:20 AM', status: 'completed', desc: 'Assigned to Lineman Supervisor' },
      { stage: 'UNDER_RESOLUTION', title: 'Under Resolution', date: 'Today, 10:00 AM', status: 'current', desc: 'Electrician inspecting faulty driver module' }
    ],
    verificationResult: null
  },
  {
    id: 'demo_comp_003',
    ticketId: 'CIV-2026-000103',
    issueType: 'Garbage & Solid Waste',
    category: 'Sanitation & Solid Waste Management',
    title: 'Overflowing Municipal Dumper Bin on Public Roadside',
    description: 'An overflowing municipal waste accumulation has been detected on the public roadside. The uncollected organic and plastic refuse poses severe hygiene risks, foul odor, and attracts stray animals.',
    rawInputText: 'Large garbage heap overflowing onto road.',
    hasVoiceNote: true,
    voiceDuration: '08s',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&auto=format&fit=crop&q=80',
    afterImageUrl: null,
    location: {
      latitude: 17.4502,
      longitude: 78.3889,
      address: 'Market Access Road, Ward 104',
      city: 'Metropolitan City',
      state: 'State',
      pincode: '500081',
      ward: 'Ward 104'
    },
    priority: 'HIGH',
    impactScore: 85,
    impactLevel: 'HIGH',
    duplicateStatus: 'NO_DUPLICATE',
    aiConfidence: 96.1,
    aiDetectionModel: 'YOLOv11-CivicVision-v2.4',
    detectedObjects: [
      { label: 'Unsegregated Solid Waste', confidence: 0.961, bbox: [100, 200, 520, 500] }
    ],
    status: 'ACTIVE',
    assignedDepartment: 'Sanitation & Solid Waste',
    assignedOfficer: 'Pending Assignment',
    assignedOfficerContact: null,
    reportedBy: {
      name: 'Demo Citizen',
      email: 'citizen@civenthra.demo',
      phone: '+91 98000 00002',
      id: 'cit_demo_01'
    },
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    resolutionNotes: null,
    timeline: [
      { stage: 'SUBMITTED', title: 'Complaint Submitted', date: 'Today, 07:15 AM', status: 'completed', desc: 'Multimodal input received' },
      { stage: 'AI_ANALYZED', title: 'AI Analysis Completed', date: 'Today, 07:16 AM', status: 'completed', desc: 'Waste heap classified, 96.1% confidence' },
      { stage: 'TICKET_CREATED', title: 'Smart Ticket Issued', date: 'Today, 07:16 AM', status: 'completed', desc: 'CIV-2026-000103 generated' },
      { stage: 'ASSIGNED', title: 'Pending Department Queue', date: 'In Queue', status: 'current', desc: 'Awaiting officer dispatch' }
    ],
    verificationResult: null
  }
];

export const CIVIC_CATEGORIES = [
  { id: 'potholes', name: 'Potholes', icon: 'AlertTriangle', count: 0, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { id: 'damaged_roads', name: 'Damaged Roads', icon: 'Car', count: 0, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { id: 'streetlights', name: 'Broken Streetlights', icon: 'Lightbulb', count: 0, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
  { id: 'garbage', name: 'Garbage & Waste', icon: 'Trash2', count: 0, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'drainage', name: 'Drainage Issues', icon: 'Droplets', count: 0, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
  { id: 'other', name: 'Other Civic Problems', icon: 'Layers', count: 0, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' }
];

export const DEPARTMENTS = [
  { id: 'dept_roads', name: 'Roads & Infrastructure Division', officerCount: 14, activeTickets: 0, avgResolutionDays: 2.4 },
  { id: 'dept_sanitation', name: 'Sanitation & Solid Waste Management', officerCount: 28, activeTickets: 0, avgResolutionDays: 1.1 },
  { id: 'dept_lighting', name: 'Electricity & Public Lighting', officerCount: 11, activeTickets: 0, avgResolutionDays: 1.8 },
  { id: 'dept_water', name: 'Water Supply & Sewerage Board', officerCount: 19, activeTickets: 0, avgResolutionDays: 3.2 },
  { id: 'dept_planning', name: 'Town Planning & Public Works', officerCount: 8, activeTickets: 0, avgResolutionDays: 4.5 }
];

export const DEMO_NOTIFICATIONS = [
  {
    id: 'notif_001',
    title: 'Resolution Verification Pending',
    message: 'Field engineer uploaded after-fix photo for CIV-2026-000101. CV re-verification ready.',
    timestamp: '15 minutes ago',
    type: 'verification',
    read: false,
    ticketId: 'CIV-2026-000101',
    complaintId: 'demo_comp_001'
  },
  {
    id: 'notif_002',
    title: 'Smart Ticket CIV-2026-000103 Dispatched',
    message: 'Sanitation grievance assigned to Municipal Solid Waste Division queue.',
    timestamp: '6 hours ago',
    type: 'update',
    read: true,
    ticketId: 'CIV-2026-000103',
    complaintId: 'demo_comp_003'
  }
];

export const NOTIFICATIONS = DEMO_NOTIFICATIONS;
