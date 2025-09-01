import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Oops! Something went wrong</h2>
          <p>
            We're sorry, but something unexpected happened. Please try refreshing the page
            or contact support if the problem persists.
          </p>

          <div className="error-actions">
            <button
              className="btn btn-primary"
              onClick={this.handleRetry}
            >
              <i className="fas fa-redo me-2"></i>
              Try Again
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => window.location.href = '/'}
            >
              <i className="fas fa-home me-2"></i>
              Go Home
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-start">
              <summary className="text-muted small">Error Details (Development Only)</summary>
              <pre className="mt-2 p-3 bg-light rounded small text-danger">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
