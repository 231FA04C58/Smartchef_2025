// Global API response interceptor to handle authentication errors

// Handle API errors globally
export const handleApiError = (error) => {
  // Handle 401 - Unauthorized (token expired or invalid)
  if (error.status === 401 || error.message?.includes('Token has expired') || error.message?.includes('Access token is required')) {
    console.warn('⚠️ Authentication failed - clearing session');
    
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    
    return true; // Indicate error was handled
  }
  
  return false; // Let error propagate normally
};
