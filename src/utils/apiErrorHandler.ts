import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../config/constants';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const { response, request, message } = error;

    // Server responded with error status
    if (response) {
      const { status, data } = response;
      
      return {
        message: data?.message || getErrorMessageByStatus(status),
        code: data?.code,
        status,
        details: data?.details,
      };
    }

    // Request was made but no response received
    if (request) {
      return {
        message: ERROR_MESSAGES.NETWORK_ERROR,
        code: 'NETWORK_ERROR',
        status: 0,
      };
    }

    // Something else happened
    return {
      message: message || ERROR_MESSAGES.UNKNOWN_ERROR,
      code: 'UNKNOWN_ERROR',
    };
  }

  // Non-Axios error
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'CLIENT_ERROR',
    };
  }

  return {
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    code: 'UNKNOWN_ERROR',
  };
}

function getErrorMessageByStatus(status: number): string {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 408:
      return ERROR_MESSAGES.TIMEOUT;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}

export function isRetryableError(error: ApiError): boolean {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT'];
  
  return (
    retryableStatuses.includes(error.status || 0) ||
    retryableCodes.includes(error.code || '') ||
    error.message.includes('timeout')
  );
}
