/**
 * Location Service - Real Browser Geolocation Capture
 * 
 * NOTE: Captures live device coordinates directly from the browser's Geolocation API.
 * Silent fallbacks to hardcoded cities (Hyderabad, Tirupati, etc.) are strictly disallowed.
 */

export const locationService = {
  /**
   * Fetches current GPS location from browser navigator.geolocation
   * Captures high-accuracy latitude, longitude, accuracy, and timestamp.
   * Throws explicit errors on permission denial or device timeout.
   */
  async getCurrentLocation() {
    if (!('geolocation' in navigator)) {
      throw new Error('Geolocation is not supported by your browser.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 10);
          const timestamp = new Date(position.timestamp || Date.now()).toISOString();

          let address = `Coordinates: ${lat.toFixed(5)}° N, ${lon.toFixed(5)}° E`;
          let city = 'Local Municipality';
          let ward = 'Ward Auto-detected';
          let pincode = '';

          // Reverse geocoding via OpenStreetMap Nominatim with a fast timeout
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16`,
              {
                signal: controller.signal,
                headers: { 'Accept-Language': 'en' }
              }
            );
            clearTimeout(timeoutId);
            if (res.ok) {
              const data = await res.json();
              if (data && data.display_name) {
                address = data.display_name.split(',').slice(0, 3).join(', ');
                city = data.address?.city || data.address?.town || data.address?.suburb || 'Local Municipality';
                ward = data.address?.suburb || data.address?.neighbourhood || data.address?.road || 'Auto-detected Ward';
                pincode = data.address?.postcode || '';
              }
            }
          } catch (e) {
            // Network or CORS issue; fallback to high-precision formatted GPS string
            address = `GPS Telemetry: ${lat.toFixed(5)}° N, ${lon.toFixed(5)}° E (±${accuracy}m)`;
          }

          resolve({
            latitude: parseFloat(lat.toFixed(6)),
            longitude: parseFloat(lon.toFixed(6)),
            accuracy: `${accuracy} meters`,
            timestamp,
            address,
            city,
            ward,
            pincode
          });
        },
        (error) => {
          let message = 'Unable to capture GPS location.';
          if (error.code === 1) {
            // PERMISSION_DENIED
            message = 'Location permission is required to automatically capture your current location. Please allow location access in your browser/device settings.';
          } else if (error.code === 2) {
            // POSITION_UNAVAILABLE
            message = 'GPS is temporarily unavailable. Please verify device location settings and try again.';
          } else if (error.code === 3) {
            // TIMEOUT
            message = 'Location request timed out. Please check your GPS connection and try again.';
          }
          const err = new Error(message);
          err.code = error.code;
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }
};

export default locationService;
