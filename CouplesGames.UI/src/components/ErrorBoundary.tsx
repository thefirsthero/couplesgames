import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '../utils/logger';

// ErrorBoundary catches React render errors and displays a fallback UI.
interface Props {
  fallback?: ReactNode;
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(error, {
      component: 'ErrorBoundary',
      additionalInfo: { componentStack: errorInfo.componentStack }
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}