import config from './api';

/**
 * Service for Computer Vision Re-Verification of Civic Issue Resolutions
 */
export const verificationService = {
  /**
   * Evaluates before vs after resolution images using simulated CV defect detection
   * @param {Object} params
   * @param {string} params.complaintId
   * @param {string} params.originalImageUrl
   * @param {string} params.afterImageUrl
   * @param {string} params.resolutionNotes
   * @param {boolean} [params.forceFail=false] Option for demo toggle to demonstrate failure state
   */
  async reverifyResolution({
    complaintId,
    originalImageUrl,
    afterImageUrl,
    resolutionNotes = '',
    forceFail = false
  }) {
    if (!config.useMock) {
      const res = await fetch(
        `${config.baseUrl}${config.endpoints.verifyResolution(complaintId)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ originalImageUrl, afterImageUrl, resolutionNotes })
        }
      );
      return await res.json();
    }

    // Simulate Computer Vision feature matching and structural analysis delay
    await new Promise(resolve => setTimeout(resolve, 2200));

    if (forceFail) {
      return {
        verified: false,
        confidence: 38.4,
        structuralSimilarityScore: '42.1%',
        defectClearanceRate: '31.5%',
        defectResidualRate: '68.5%',
        statusText: 'CV VERIFICATION FAILED',
        reason: 'Severe surface defect and uneven asphalt density detected. Residual hazard remains.',
        recommendation: 'Resolution rejected by AI. The complaint remains ACTIVE. Re-inspection required.',
        verificationDate: new Date().toLocaleString(),
        aiModel: 'CivicVision-ReVerify-v3.1'
      };
    }

    // Default Success Verification
    return {
      verified: true,
      confidence: 96.8,
      structuralSimilarityScore: '94.2%',
      defectClearanceRate: '98.5%',
      defectResidualRate: '1.5%',
      statusText: 'RESOLUTION VISUALLY VERIFIED',
      reason: 'Computer Vision analysis confirms complete removal of defect. Surface structural integrity verified.',
      recommendation: 'Civic resolution verified successfully. Status transitioned to RESOLVED.',
      verificationDate: new Date().toLocaleString(),
      aiModel: 'CivicVision-ReVerify-v3.1'
    };
  }
};

export default verificationService;
