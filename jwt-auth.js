
// JWT authentication helper functions for the browser
// This is a simplified version that works in browser environment

// Helper functions for browser environment
(function() {
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
      // Generate a simple JWT token for TinyMCE
      window.generateTinyMCEJWT = function() {
        const origin = window.location.origin;
        const now = Math.floor(Date.now() / 1000);

        // Create a simple token for demonstration purposes
        // In production, this should be generated on the server
        const header = btoa(JSON.stringify({
          "alg": "HS256",
          "typ": "JWT"
        }));
        
        const payload = btoa(JSON.stringify({
          "sub": "user-123",
          "name": "Replit User",
          "origin": origin,
          "iat": now,
          "exp": now + 3600
        }));
        
        return `${header}.${payload}.signature`;
      };

      // Verify JWT token validity (simplified)
      window.verifyJWT = function(token) {
        try {
          // Parse JWT payload (second part)
          const payloadBase64 = token.split('.')[1];
          const payload = JSON.parse(atob(payloadBase64));

          // Check expiration
          const now = Math.floor(Date.now() / 1000);
          return payload.exp > now;
        } catch (error) {
          console.error('Error verifying JWT:', error);
          return false;
        }
      };
    });
  }
})();
