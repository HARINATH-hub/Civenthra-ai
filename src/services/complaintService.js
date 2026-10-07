// Complaint Service for Data Layer Persistence and Demo Mode Management

export const complaintService = {
  getStoredComplaints() {
    const stored = localStorage.getItem('civenthra_complaints');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return [];
      }
    }
    // Default to empty array for a clean/fresh system
    return [];
  },

  saveComplaints(complaints) {
    localStorage.setItem('civenthra_complaints', JSON.stringify(complaints));
  },

  isDemoModeActive() {
    return localStorage.getItem('civenthra_demo_mode') === 'true';
  },

  setDemoModeActive(active) {
    localStorage.setItem('civenthra_demo_mode', active ? 'true' : 'false');
  },

  generateTicketId(sequence) {
    const year = new Date().getFullYear();
    const pad = String(sequence).padStart(6, '0');
    return `CIV-${year}-${pad}`;
  }
};

export default complaintService;
