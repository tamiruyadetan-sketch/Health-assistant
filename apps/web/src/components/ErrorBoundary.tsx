import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Fallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

function Fallback({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">{t('errors.generic')}</h1>
      <button
        type="button"
        onClick={() => {
          onReset();
          window.location.href = '/';
        }}
        className="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
      >
        {t('common.backHome')}
      </button>
    </div>
  );
}

export default ErrorBoundary;