import React from 'react'
import { toast } from 'react-hot-toast'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and analytics
    // Send error to analytics if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      })
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Show user-friendly error message
    toast.error('Something went wrong. Please refresh the page or contact support if the problem persists.')
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary text-center p-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card shadow">
                  <div className="card-body">
                    <h2 className="card-title text-danger mb-4">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Oops! Something went wrong
                    </h2>
                    <p className="card-text text-muted mb-4">
                      We&apos;re sorry, but something unexpected happened. This error has been logged and our team will look into it.
                    </p>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                      <button
                        className="btn btn-primary me-md-2"
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
                        <pre className="mt-2 small text-danger bg-light p-2 rounded">
                          {this.state.error && this.state.error.toString()}
                          {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
