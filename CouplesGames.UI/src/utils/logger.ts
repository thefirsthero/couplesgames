// Centralized logger utility for frontend error and event logging.
// Sends errors to backend and logs to console in development.

type ErrorMetadata = {
  component?: string;
  action?: string;
  userId?: string;
  additionalInfo?: Record<string, unknown>;
};

export const isDev = () => import.meta.env.VITE_ENV === 'DEV';

async function logFrontendErrorToBackend(
  message: string,
  stack: string,
  metadata: ErrorMetadata = {}
) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Send error details to backend for persistent logging
    await fetch(`${apiUrl.replace(/\/$/, '')}/api/logs/frontend-error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        stack,
        metadata,
        timestamp: new Date().toISOString(),
      }),
      
      signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined,
    });
  } catch {
    if (isDev()) {
      console.error('Failed to send error to backend:', message);
    }
  }
}

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev()) {
      console.log(...args);
    }
  },

  error: (error: Error | string, metadata: ErrorMetadata = {}) => {
    if (isDev()) {
      console.error(error);
    }

    const errorObj = error instanceof Error ? error : new Error(String(error));
    const message = errorObj.message;
    const stack = errorObj.stack || '';

    logFrontendErrorToBackend(message, stack, metadata);
  },

  warn: (...args: unknown[]) => {
    if (isDev()) {
      console.warn(...args);
    }
  }
};