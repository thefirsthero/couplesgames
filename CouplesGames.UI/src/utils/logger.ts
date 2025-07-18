export const isDev = () => import.meta.env.VITE_ENV === 'DEV';

async function logFrontendErrorToBackend(message: string, stack: string) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    await fetch(`${apiUrl.replace(/\/$/, '')}/api/logs/frontend-error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, stack }),
    });
  } catch {
    // Ignore errors to avoid infinite loops
  }
}

export const logger = {
  log: (...args: any[]) => {
    if (isDev()) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDev()) {
      console.error(...args);
    }
    // Send error to backend
    const message = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
    const stack = (args.find(a => a instanceof Error) as Error)?.stack || '';
    logFrontendErrorToBackend(message, stack);
  }
};