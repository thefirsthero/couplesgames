export const isDev = () => import.meta.env.VITE_ENV === 'DEV';

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
  }
};