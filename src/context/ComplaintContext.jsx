import React, { createContext, useContext, useState, useEffect } from 'react';
import complaintService from '../services/complaintService';
import verificationService from '../services/verificationService';
import { DEMO_SAMPLE_COMPLAINTS } from '../data/mockData';

const ComplaintContext = createContext();

export function ComplaintProvider({ children }) {
  // Empty array by default for a clean/fresh system
  const [complaints, setComplaints] = useState(() => complaintService.getStoredComplaints());
  const [isDemoMode, setIsDemoMode] = useState(() => complaintService.isDemoModeActive());
  const [activeComplaint, setActiveComplaint] = useState(null);

  useEffect(() => {
    complaintService.saveComplaints(complaints);
  }, [complaints]);

  useEffect(() => {
    complaintService.setDemoModeActive(isDemoMode);
  }, [isDemoMode]);

  /**
   * Explicitly Load Demo Data (behind button)
   */
  const loadDemoData = () => {
    setComplaints(DEMO_SAMPLE_COMPLAINTS);
    setIsDemoMode(true);
    complaintService.saveComplaints(DEMO_SAMPLE_COMPLAINTS);
    complaintService.setDemoModeActive(true);
  };

  /**
   * Reset Demo Data (Clears everything back to fresh clean state)
   */
  const resetDemoData = () => {
    setComplaints([]);
    setIsDemoMode(false);
    setActiveComplaint(null);
    complaintService.saveComplaints([]);
    complaintService.setDemoModeActive(false);
  };

  const getComplaintById = (idOrTicket) => {
    return complaints.find(c => c.id === idOrTicket || c.ticketId === idOrTicket);
  };

  /**
   * Add a new civic complaint from citizen reporting workflow
   */
  const addComplaint = (newComplaintData, citizenUser) => {
    const nextSeq = complaints.length + 1;
    const ticketId = complaintService.generateTicketId(nextSeq);
    const newId = `comp_${Date.now()}`;

    const complaint = {
      id: newId,
      ticketId,
      issueType: newComplaintData.issueType || 'Civic Issue',
      category: newComplaintData.category || 'General Municipal Infrastructure',
      title: newComplaintData.title || `${newComplaintData.issueType || 'Civic Issue'} Detected`,
      description: newComplaintData.description,
      rawInputText: newComplaintData.rawInputText || '',
      hasVoiceNote: Boolean(newComplaintData.hasVoiceNote),
      voiceDuration: newComplaintData.voiceDuration || null,
      imageUrl: newComplaintData.imageUrl || '',
      afterImageUrl: null,
      location: newComplaintData.location || {
        latitude: null,
        longitude: null,
        address: 'Location unavailable',
        city: 'N/A',
        ward: 'N/A',
        pincode: ''
      },
      priority: newComplaintData.priority || 'HIGH',
      impactScore: newComplaintData.impactScore || 85,
      impactLevel: newComplaintData.impactLevel || 'HIGH',
      duplicateStatus: newComplaintData.duplicateStatus || 'NO_DUPLICATE',
      aiConfidence: newComplaintData.aiConfidence || 94.6,
      aiDetectionModel: newComplaintData.aiDetectionModel || 'YOLOv11-CivicVision-v2.4',
      detectedObjects: newComplaintData.detectedObjects || [],
      status: 'ACTIVE',
      assignedDepartment: newComplaintData.assignedDepartment || 'Municipal Operations Division',
      assignedOfficer: 'Pending Assignment',
      assignedOfficerContact: null,
      reportedBy: {
        id: citizenUser?.id || 'cit_user',
        name: citizenUser?.name || 'Registered Citizen',
        email: citizenUser?.email || '',
        phone: citizenUser?.phone || ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolutionNotes: null,
      timeline: [
        {
          stage: 'SUBMITTED',
          title: 'Complaint Submitted',
          date: new Date().toLocaleString(),
          status: 'completed',
          desc: 'Citizen submitted multimodal grievance report'
        },
        {
          stage: 'AI_ANALYZED',
          title: 'Computer Vision & AI Processed',
          date: new Date().toLocaleString(),
          status: 'completed',
          desc: `Detected ${newComplaintData.issueType || 'Civic Issue'} (${newComplaintData.aiConfidence || 94.6}% confidence)`
        },
        {
          stage: 'TICKET_CREATED',
          title: 'Smart Ticket Issued',
          date: new Date().toLocaleString(),
          status: 'completed',
          desc: `Smart Ticket ${ticketId} generated and queued for authority review`
        }
      ],
      verificationResult: null
    };

    setComplaints(prev => [complaint, ...prev]);
    setActiveComplaint(complaint);
    return complaint;
  };

  const assignDepartmentAndOfficer = (id, department, officer, officerContact) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id || c.ticketId === id) {
          const updatedTimeline = [
            ...c.timeline,
            {
              stage: 'ASSIGNED',
              title: 'Assigned to Department',
              date: new Date().toLocaleString(),
              status: 'completed',
              desc: `Allocated to ${department} — In-charge: ${officer}`
            }
          ];
          return {
            ...c,
            assignedDepartment: department,
            assignedOfficer: officer,
            assignedOfficerContact: officerContact || '+91 98000 00000',
            status: c.status === 'ACTIVE' ? 'IN_PROGRESS' : c.status,
            timeline: updatedTimeline,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );
  };

  const updatePriority = (id, priority) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id || c.ticketId === id) {
          return { ...c, priority, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );
  };

  const startResolution = (id, internalNote) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id || c.ticketId === id) {
          const updatedTimeline = [
            ...c.timeline,
            {
              stage: 'UNDER_RESOLUTION',
              title: 'Work Under Resolution',
              date: new Date().toLocaleString(),
              status: 'completed',
              desc: internalNote || 'Field engineering crew deployed for on-site grievance remediation.'
            }
          ];
          return {
            ...c,
            status: 'IN_PROGRESS',
            resolutionNotes: internalNote,
            timeline: updatedTimeline,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );
  };

  const submitAfterFixImage = (id, afterImageUrl, notes) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id || c.ticketId === id) {
          const updatedTimeline = [
            ...c.timeline,
            {
              stage: 'AFTER_FIX_UPLOADED',
              title: 'After-Fix Photo Uploaded',
              date: new Date().toLocaleString(),
              status: 'completed',
              desc: 'Field crew submitted repair photographic evidence for Computer Vision re-verification.'
            },
            {
              stage: 'AWAITING_VERIFICATION',
              title: 'Awaiting Computer Vision Re-verification',
              date: new Date().toLocaleString(),
              status: 'current',
              desc: 'Automated CV model comparison scheduled.'
            }
          ];
          return {
            ...c,
            afterImageUrl,
            resolutionNotes: notes,
            status: 'AWAITING_VERIFICATION',
            timeline: updatedTimeline,
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );
  };

  /**
   * Computer Vision Re-verification Engine
   */
  const reverifyResolution = async (id, forceFail = false) => {
    const complaint = getComplaintById(id);
    if (!complaint) return null;

    const result = await verificationService.reverifyResolution({
      complaintId: complaint.id,
      originalImageUrl: complaint.imageUrl,
      afterImageUrl: complaint.afterImageUrl,
      resolutionNotes: complaint.resolutionNotes,
      forceFail
    });

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === id || c.ticketId === id) {
          if (result.verified) {
            // SUCCESSFUL VERIFICATION -> RESOLVED
            const updatedTimeline = [
              ...c.timeline.filter(t => t.stage !== 'AWAITING_VERIFICATION'),
              {
                stage: 'CV_VERIFICATION',
                title: 'CV Verification SUCCESS',
                date: new Date().toLocaleString(),
                status: 'completed',
                desc: `Computer Vision verified defect clearance (${result.confidence}% match). Surface integrity confirmed.`
              },
              {
                stage: 'RESOLVED',
                title: 'Complaint Formally Resolved',
                date: new Date().toLocaleString(),
                status: 'completed',
                desc: 'Smart Ticket officially certified and closed.'
              }
            ];
            return {
              ...c,
              status: 'RESOLVED',
              verificationResult: result,
              timeline: updatedTimeline,
              updatedAt: new Date().toISOString()
            };
          } else {
            // FAILED VERIFICATION -> RETURN TO ACTIVE!
            const updatedTimeline = [
              ...c.timeline.filter(t => t.stage !== 'AWAITING_VERIFICATION'),
              {
                stage: 'CV_VERIFICATION_FAILED',
                title: 'CV Verification FAILED',
                date: new Date().toLocaleString(),
                status: 'failed',
                desc: `Visual verification failed (${result.reason}). Residual defect rate: ${result.defectResidualRate}. Ticket returned to ACTIVE state.`
              },
              {
                stage: 'ACTIVE',
                title: 'Returned to Active Queue',
                date: new Date().toLocaleString(),
                status: 'current',
                desc: 'Re-inspection and complete remediation required.'
              }
            ];
            return {
              ...c,
              status: 'ACTIVE',
              verificationResult: result,
              timeline: updatedTimeline,
              updatedAt: new Date().toISOString()
            };
          }
        }
        return c;
      })
    );

    return result;
  };

  // KPI Statistics (0 by default in clean fresh system)
  const stats = {
    total: complaints.length,
    active: complaints.filter(c => c.status === 'ACTIVE').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    awaitingVerification: complaints.filter(c => c.status === 'AWAITING_VERIFICATION').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    highPriority: complaints.filter(c => c.priority === 'HIGH' && c.status !== 'RESOLVED').length
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        isDemoMode,
        activeComplaint,
        setActiveComplaint,
        getComplaintById,
        addComplaint,
        assignDepartmentAndOfficer,
        updatePriority,
        startResolution,
        submitAfterFixImage,
        reverifyResolution,
        loadDemoData,
        resetDemoData,
        stats
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
}
