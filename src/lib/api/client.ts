/**
 * API Client for Lumina Estate
 * Centralized fetch wrapper with error handling, authentication, and interceptors
 */

import {
  ApiError,
  ApiErrorCode,
  ApiResponse,
  HttpMethod,
  RequestConfig,
  ApiClientConfig,
} from '@/types/api';

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build URL with query parameters
 */
function buildUrl(
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(
    endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`,
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Get authentication headers
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // In a Next.js app, we can't easily access the session token client-side
  // The session cookie is automatically sent with requests
  // For server-side requests, you'd need to pass the token explicitly

  return headers;
}

/**
 * Handle API response and parse JSON
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  let data: unknown;

  try {
    data = isJson ? await response.json() : await response.text();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorData = data as { error?: string; details?: Array<{ path: string | number; message: string }> } | null;
    
    const message = errorData?.error || `HTTP Error ${response.status}: ${response.statusText}`;
    const details = errorData?.details;

    // Map HTTP status to error code
    let code = ApiErrorCode.UNKNOWN_ERROR;
    switch (response.status) {
      case 401:
        code = ApiErrorCode.UNAUTHORIZED;
        break;
      case 403:
        code = ApiErrorCode.FORBIDDEN;
        break;
      case 404:
        code = ApiErrorCode.NOT_FOUND;
        break;
      case 400:
      case 422:
        code = ApiErrorCode.VALIDATION_ERROR;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        code = ApiErrorCode.SERVER_ERROR;
        break;
    }

    throw new ApiError(message, code, response.status, details);
  }

  return data as T;
}

/**
 * Create a timeout promise
 */
function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new ApiError('Request timeout', ApiErrorCode.NETWORK_ERROR, 408));
    }, ms);
  });
}

// ============================================================================
// Request Interceptors
// ============================================================================

type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = <T>(response: T) => T | Promise<T>;
type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const errorInterceptors: ErrorInterceptor[] = [];

export function addRequestInterceptor(interceptor: RequestInterceptor): () => void {
  requestInterceptors.push(interceptor);
  return () => {
    const index = requestInterceptors.indexOf(interceptor);
    if (index > -1) requestInterceptors.splice(index, 1);
  };
}

export function addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
  responseInterceptors.push(interceptor);
  return () => {
    const index = responseInterceptors.indexOf(interceptor);
    if (index > -1) responseInterceptors.splice(index, 1);
  };
}

export function addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
  errorInterceptors.push(interceptor);
  return () => {
    const index = errorInterceptors.indexOf(interceptor);
    if (index > -1) errorInterceptors.splice(index, 1);
  };
}

// ============================================================================
// Core API Client
// ============================================================================

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.defaultTimeout = config.timeout || DEFAULT_TIMEOUT;
    this.defaultHeaders = config.headers || {};
  }

  /**
   * Perform an HTTP request
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = buildUrl(this.baseUrl, endpoint, config.params);
    const timeout = config.timeout || this.defaultTimeout;

    // Build request config
    let requestConfig: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...(await getAuthHeaders()),
        ...config.headers,
      },
      ...config,
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Apply request interceptors
    for (const interceptor of requestInterceptors) {
      requestConfig = await interceptor(requestConfig);
    }

    try {
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(url, requestConfig),
        createTimeoutPromise(timeout),
      ]);

      let data = await handleResponse<T>(response);

      // Apply response interceptors
      for (const interceptor of responseInterceptors) {
        data = await interceptor(data);
      }

      return data;
    } catch (error) {
      let apiError: ApiError;

      if (error instanceof ApiError) {
        apiError = error;
      } else if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          apiError = new ApiError('Network error', ApiErrorCode.NETWORK_ERROR, 0);
        } else {
          apiError = new ApiError(error.message, ApiErrorCode.UNKNOWN_ERROR, 500);
        }
      } else {
        apiError = new ApiError('Unknown error', ApiErrorCode.UNKNOWN_ERROR, 500);
      }

      // Apply error interceptors
      for (const interceptor of errorInterceptors) {
        apiError = await interceptor(apiError);
      }

      throw apiError;
    }
  }

  // ============================================================================
  // HTTP Methods
  // ============================================================================

  /**
   * Perform a GET request
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  /**
   * Perform a POST request
   */
  async post<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>('POST', endpoint, body, config);
  }

  /**
   * Perform a PUT request
   */
  async put<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, body, config);
  }

  /**
   * Perform a PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>('PATCH', endpoint, body, config);
  }

  /**
   * Perform a DELETE request
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}

// ============================================================================
// Default Export
// ============================================================================

export const apiClient = new ApiClient();

export default apiClient;

// Re-export types
export type { ApiClientConfig, RequestConfig };
