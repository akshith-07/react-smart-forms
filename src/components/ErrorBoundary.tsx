import React, { Component, ReactNode, ErrorInfo } from 'react';
import styled from 'styled-components';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.md} 0;
  background-color: ${({ theme }) => theme.colors.error}11;
  border: 2px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const ErrorDetails = styled.details`
  margin-top: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
`;

const ErrorSummary = styled.summary`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ErrorStack = styled.pre`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow-x: auto;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.text};
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
`;

const ReloadButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorContainer>
          <ErrorTitle>⚠️ Something went wrong</ErrorTitle>
          <ErrorMessage>
            We encountered an error while rendering this form. This has been logged and we'll look into it.
          </ErrorMessage>
          {this.state.error && (
            <ErrorMessage>
              <strong>Error:</strong> {this.state.error.toString()}
            </ErrorMessage>
          )}
          <ReloadButton onClick={this.handleReload}>Try Again</ReloadButton>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <ErrorDetails>
              <ErrorSummary>Show Error Details (Development Only)</ErrorSummary>
              <ErrorStack>{this.state.errorInfo.componentStack}</ErrorStack>
              {this.state.error && this.state.error.stack && (
                <ErrorStack>{this.state.error.stack}</ErrorStack>
              )}
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}
