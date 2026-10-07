import config from './api';
import { TRANSLATION_SAMPLES } from '../context/LanguageContext';

/**
 * Calculates geographical distance using the Haversine formula
 */
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * AI Service for Multimodal Civic Issue Analysis
 */
export const aiService = {
  /**
   * Runs Computer Vision detection and GenAI analysis on multimodal input
   */
  async analyzeCivicIssue({ imageFile, imagePreview, text, voiceBlob, location, existingComplaints = [] }) {
    if (!config.useMock) {
      // Real FastAPI call structure
      const formData = new FormData();
      if (imageFile) formData.append('image', imageFile);
      if (text) formData.append('text', text);
      if (voiceBlob) formData.append('voice', voiceBlob);
      if (location) formData.append('location', JSON.stringify(location));

      const res = await fetch(`${config.baseUrl}${config.endpoints.detectIssue}`, {
        method: 'POST',
        body: formData,
      });
      return await res.json();
    }

    // Realistic Mock AI / Computer Vision Simulation
    // 1. Detect issue type based on input text keywords or default to high-fidelity Pothole
    let issueType = 'Pothole';
    let category = 'Roads & Highways';
    let key = 'pothole';
    let confidence = 94.6;
    let impactScore = 88;
    let priority = 'HIGH';
    let detectedObjects = [
      { label: 'Deep Asphalt Pothole', confidence: 0.946, bbox: [120, 150, 480, 410] },
      { label: 'Surface Rutting', confidence: 0.872, bbox: [80, 110, 560, 490] }
    ];

    const lowerText = (text || '').toLowerCase();
    if (lowerText.includes('light') || lowerText.includes('lamp') || lowerText.includes('dark')) {
      issueType = 'Broken Streetlight';
      category = 'Electricity & Street Lighting';
      key = 'streetlight';
      confidence = 92.1;
      impactScore = 68;
      priority = 'MEDIUM';
      detectedObjects = [{ label: 'Non-Functional LED Luminaire', confidence: 0.921, bbox: [180, 60, 410, 240] }];
    } else if (lowerText.includes('garbage') || lowerText.includes('waste') || lowerText.includes('trash') || lowerText.includes('bin') || lowerText.includes('dump')) {
      issueType = 'Garbage & Solid Waste';
      category = 'Sanitation & Solid Waste Management';
      key = 'garbage';
      confidence = 96.4;
      impactScore = 85;
      priority = 'HIGH';
      detectedObjects = [{ label: 'Illegal Solid Waste Accumulation', confidence: 0.964, bbox: [110, 190, 510, 490] }];
    } else if (lowerText.includes('drain') || lowerText.includes('water') || lowerText.includes('sewer') || lowerText.includes('flood')) {
      issueType = 'Drainage Issues';
      category = 'Water Supply & Sewerage Board';
      key = 'drainage';
      confidence = 93.8;
      impactScore = 90;
      priority = 'HIGH';
      detectedObjects = [{ label: 'Clogged Stormwater Grating', confidence: 0.938, bbox: [130, 170, 470, 430] }];
    }

    // 2. Duplicate Detection Check within 75 meters radius
    let isDuplicate = false;
    let matchedTicket = null;
    let duplicateDistance = null;

    if (location && location.latitude && location.longitude && existingComplaints.length > 0) {
      for (const comp of existingComplaints) {
        if (comp.status !== 'RESOLVED' && comp.location?.latitude && comp.location?.longitude) {
          const dist = calculateDistanceMeters(
            location.latitude,
            location.longitude,
            comp.location.latitude,
            comp.location.longitude
          );
          if (dist < 75 && comp.issueType.toLowerCase().includes(key)) {
            isDuplicate = true;
            matchedTicket = comp.ticketId;
            duplicateDistance = Math.round(dist);
            break;
          }
        }
      }
    }

    // 3. GenAI Structured Multilingual Complaint Generation
    const multilingualComplaints = {
      en: TRANSLATION_SAMPLES[key]?.en || TRANSLATION_SAMPLES.pothole.en,
      te: TRANSLATION_SAMPLES[key]?.te || TRANSLATION_SAMPLES.pothole.te,
      hi: TRANSLATION_SAMPLES[key]?.hi || TRANSLATION_SAMPLES.pothole.hi,
      ta: TRANSLATION_SAMPLES[key]?.ta || TRANSLATION_SAMPLES.pothole.ta,
      kn: TRANSLATION_SAMPLES[key]?.kn || TRANSLATION_SAMPLES.pothole.kn,
    };

    return {
      issueType,
      category,
      aiConfidence: confidence,
      aiModel: 'YOLOv11-CivicVision-v2.4 + GenAI MultiModal Core',
      impactScore,
      impactLevel: priority,
      priority,
      detectedObjects,
      duplicateCheck: {
        isDuplicate,
        matchedTicketId: matchedTicket,
        distanceMeters: duplicateDistance,
        statusText: isDuplicate
          ? `Duplicate Alert: Matches active ticket ${matchedTicket} within ${duplicateDistance}m`
          : 'No matching active complaint found in 75m zone'
      },
      complaintText: multilingualComplaints.en,
      multilingualComplaints,
      suggestedDepartment: category,
      timestamp: new Date().toISOString()
    };
  }
};

export default aiService;
