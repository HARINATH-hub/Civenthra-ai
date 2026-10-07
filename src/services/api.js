/**
 * Civenthra AI - API Client Abstraction Layer
 * 
 * Prepares the React frontend for connection to a Python/FastAPI backend and MySQL database.
 * To connect to the real FastAPI backend:
 * 1. Set VITE_API_BASE_URL=http://localhost:8000/api/v1 in .env
 * 2. Set VITE_USE_MOCK_API=false in .env
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const config = {
  baseUrl: API_BASE_URL,
  useMock: USE_MOCK_API,
  endpoints: {
    // Authentication Endpoints (FastAPI OAuth2 / JWT + MySQL)
    registerCitizen: '/auth/citizen/register',
    loginCitizen: '/auth/citizen/login',
    loginAuthority: '/auth/authority/login',
    getCurrentUser: '/auth/me',
    
    // Grievance / Complaint Management Endpoints
    getComplaints: '/complaints',
    getComplaintById: (id) => `/complaints/${id}`,
    createComplaint: '/complaints',
    updateStatus: (id) => `/complaints/${id}/status`,
    assignDepartment: (id) => `/complaints/${id}/assign`,
    getTimeline: (id) => `/complaints/${id}/timeline`,

    // AI & Computer Vision Service Endpoints
    detectIssue: '/ai/computer-vision/detect',       // YOLOv11 Tensor Defect Detection
    generateComplaintText: '/ai/genai/synthesize',  // LLM Multilingual Structured Grievance
    checkDuplicates: '/ai/geo/duplicate-check',     // Haversine Spatial Radius Clustering
    verifyResolution: (id) => `/ai/computer-vision/reverify/${id}` // Siamese / SSIM After-fix verification
  }
};

export default config;
