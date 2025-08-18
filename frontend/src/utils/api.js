// Robust API utility with error handling and retry logic

const API_BASE_URL = 'http://localhost:5001';

// Function to detect if we're in development and try different ports
const getApiUrl = async () => {
  const ports = [5001, 5000, 5002];
  
  for (const port of ports) {
    try {
      const url = `http://localhost:${port}`;
      const response = await fetch(`${url}/api/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      if (response.ok) {
        console.log(`✅ Backend found on port ${port}`);
        return url;
      }
    } catch (error) {
      console.log(`❌ Port ${port} not available:`, error.message);
    }
  }
  
  // Fallback to default
  console.log('⚠️ Using default port 5001');
  return API_BASE_URL;
};

// Enhanced fetch function with retry logic
export const apiRequest = async (endpoint, options = {}) => {
  const maxRetries = 3;
  let lastError;
  
  // Get the correct API URL
  const baseUrl = await getApiUrl();
  const url = `${baseUrl}${endpoint}`;
  
  // Default options
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  // If sending FormData, let the browser set the correct multipart boundary
  if (options.isFormData || (typeof FormData !== 'undefined' && defaultOptions.body instanceof FormData)) {
    if (defaultOptions.headers && defaultOptions.headers['Content-Type']) {
      delete defaultOptions.headers['Content-Type'];
    }
  }

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 API Request (attempt ${attempt}): ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...defaultOptions,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (response.ok) {
        console.log(`✅ API Success:`, data);
        return { success: true, data, status: response.status };
      } else {
        console.log(`❌ API Error:`, data);
        return { success: false, data, status: response.status };
      }

    } catch (error) {
      lastError = error;
      console.log(`❌ Network error (attempt ${attempt}/${maxRetries}):`, error.message);
      
      // Don't retry on abort errors (timeout)
      if (error.name === 'AbortError') {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`⏳ Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All attempts failed
  console.log('💥 All API attempts failed');
  throw new Error(`Network error: ${lastError.message}. Please check if the server is running.`);
};

// Specific API functions
export const authApi = {
  login: (credentials) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

export const dashboardApi = {
  getJobseekerDashboard: () => apiRequest('/api/jobseeker/dashboard'),
};

export const healthCheck = () => apiRequest('/api/health');