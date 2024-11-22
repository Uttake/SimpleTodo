import React, { Component } from "react";

class ErrorBoundary extends Component<{}, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Что-то пошло не так...</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
