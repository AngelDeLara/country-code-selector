import React, { ErrorInfo, ReactNode } from 'react';

/**
 * ErrorBoundary is a React component that catches JavaScript errors
 * in its child component tree and displays a fallback UI.
 * 
 * Usage:
 * Wrap any component that may throw an error with <ErrorBoundary> to 
 * prevent the entire application from crashing.
 * 
 * Example:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
interface Props {
  children: ReactNode; // The child elements to render within the ErrorBoundary
}

interface State {
  hasError: boolean; // State to track if an error has occurred
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false }; // Initialize state to track errors
  }

  /**
   * Updates state when an error is thrown in a child component.
   * 
   * @param {Error} _ - The error that was thrown. Not used in this implementation.
   * @returns {State} - Updated state indicating an error has occurred.
   */
  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }; // Set hasError to true to indicate an error
  }

  /**
   * Logs error information to the console for debugging purposes.
   * 
   * @param {Error} error - The error that was thrown.
   * @param {ErrorInfo} errorInfo - An object containing information about the error.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo); // Log error details
  }

  /**
   * Renders the fallback UI if an error has occurred, otherwise renders the children.
   * 
   * @returns {ReactNode} - The fallback UI or the child components.
   */
  render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>; // Fallback UI
    }

    return this.props.children; // Render child components if no error
  }
}

export default ErrorBoundary; // Export the ErrorBoundary component