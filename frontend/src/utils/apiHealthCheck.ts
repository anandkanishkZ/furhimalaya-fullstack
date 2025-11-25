/**
 * API Health Check Utility
 * Provides methods to check API availability and handle graceful degradation
 */

let apiHealthStatus: 'unknown' | 'healthy' | 'unhealthy' = 'unknown';
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 60000; // 1 minute

/**
 * Check if the API is available
 * Uses caching to avoid excessive health checks
 */
export async function isApiAvailable(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'): Promise<boolean> {
  const now = Date.now();
  
  // Return cached result if within interval
  if (apiHealthStatus !== 'unknown' && (now - lastHealthCheck) < HEALTH_CHECK_INTERVAL) {
    return apiHealthStatus === 'healthy';
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    // Try to reach a simple health endpoint or any known endpoint
    const response = await fetch(`${baseUrl.replace('/api', '')}/health`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      apiHealthStatus = 'healthy';
      lastHealthCheck = now;
      return true;
    }
    
    // If health endpoint doesn't exist, try settings endpoint
    const settingsResponse = await fetch(`${baseUrl}/settings/public`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store'
    });
    
    if (settingsResponse.ok || settingsResponse.status === 404) {
      apiHealthStatus = 'healthy';
      lastHealthCheck = now;
      return true;
    }
    
    apiHealthStatus = 'unhealthy';
    lastHealthCheck = now;
    return false;
    
  } catch (error) {
    apiHealthStatus = 'unhealthy';
    lastHealthCheck = now;
    console.debug('API health check failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

/**
 * Reset API health status (useful for retry scenarios)
 */
export function resetApiHealthCheck(): void {
  apiHealthStatus = 'unknown';
  lastHealthCheck = 0;
}

/**
 * Get current API health status without making a request
 */
export function getApiHealthStatus(): 'unknown' | 'healthy' | 'unhealthy' {
  return apiHealthStatus;
}

/**
 * Wrapper for API calls with automatic fallback handling
 */
export async function apiCallWithFallback<T>(
  apiCall: () => Promise<T>,
  fallbackValue: T,
  options: {
    skipHealthCheck?: boolean;
    onError?: (error: Error) => void;
  } = {}
): Promise<T> {
  const { skipHealthCheck = false, onError } = options;
  
  try {
    // Skip health check if specified or if we know API is healthy
    if (!skipHealthCheck && apiHealthStatus !== 'healthy') {
      const isAvailable = await isApiAvailable();
      if (!isAvailable) {
        console.debug('API unavailable, using fallback value');
        return fallbackValue;
      }
    }
    
    const result = await apiCall();
    
    // Mark API as healthy if call succeeds
    if (apiHealthStatus !== 'healthy') {
      apiHealthStatus = 'healthy';
      lastHealthCheck = Date.now();
    }
    
    return result;
    
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    
    // Handle rate limiting
    if (err.message.includes('429')) {
      console.warn('API rate limit exceeded, using fallback');
      apiHealthStatus = 'unhealthy';
    } else if (err.message.includes('500') || err.message.includes('502') || err.message.includes('503')) {
      console.warn('API server error, using fallback');
      apiHealthStatus = 'unhealthy';
    } else {
      console.debug('API call failed, using fallback:', err.message);
    }
    
    lastHealthCheck = Date.now();
    
    if (onError) {
      onError(err);
    }
    
    return fallbackValue;
  }
}