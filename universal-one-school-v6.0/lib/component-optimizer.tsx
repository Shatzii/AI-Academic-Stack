import React, { Suspense, lazy, memo, useMemo, useCallback } from 'react';
import { Performance, usePerformanceTracking } from './performance';

// Component lazy loading utilities
const createLazyComponent = <T extends object>(
  componentImport: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ComponentType
) => {
  return lazy(componentImport);
};

// Memoization wrapper for expensive components
export function withMemoization<T extends object>(
  Component: React.ComponentType<T>,
  areEqual?: (prevProps: T, nextProps: T) => boolean
) {
  return memo(Component, areEqual);
}

// Performance-optimized component wrapper
export function withOptimization<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return memo(function OptimizedComponent(props: T) {
    usePerformanceTracking(componentName);
    
    return <Component {...props} />;
  });
}

// Virtualization wrapper for large lists
interface VirtualizedListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function VirtualizedList({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5
}: VirtualizedListProps) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={visibleRange.startIndex + index}
            style={{
              position: 'absolute',
              top: (visibleRange.startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, visibleRange.startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Intersection Observer for lazy loading content
export function useLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const targetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { threshold }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [threshold, hasLoaded]);

  return { ref: targetRef, isVisible, hasLoaded };
}

// Lazy loading wrapper component
interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  threshold?: number;
}

export function LazyLoad({ children, fallback, className, threshold }: LazyLoadProps) {
  const { ref, isVisible } = useLazyLoad(threshold);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}

// Debounced input component
interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
  className?: string;
}

export function DebouncedInput({
  value,
  onChange,
  delay = 300,
  placeholder,
  className
}: DebouncedInputProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, delay);
  }, [onChange, delay]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

// Error boundary with performance tracking
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class PerformanceErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Track error for performance monitoring
    Performance.start('error-boundary');
    Performance.end('error-boundary');
    
    console.error('Component error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} />;
      }

      return (
        <div className="error-boundary p-4 border border-red-200 rounded-lg bg-red-50">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600 text-sm mt-2">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Suspense wrapper with error boundary
interface OptimizedSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error }>;
}

export function OptimizedSuspense({ 
  children, 
  fallback = <div>Loading...</div>,
  errorFallback 
}: OptimizedSuspenseProps) {
  return (
    <PerformanceErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </PerformanceErrorBoundary>
  );
}

// Bundle splitting utility for lazy loaded routes
export const createOptimizedRoute = (
  componentImport: () => Promise<{ default: React.ComponentType<any> }>,
  componentName: string,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(componentImport);
  
  return function OptimizedRoute(props: any) {
    return (
      <OptimizedSuspense 
        fallback={fallback || <div className="flex items-center justify-center p-8">Loading {componentName}...</div>}
      >
        <LazyComponent {...props} />
      </OptimizedSuspense>
    );
  };
};

// Memory optimization hook
export function useMemoryOptimization(dependencies: any[] = []) {
  const previousDeps = React.useRef(dependencies);
  
  React.useEffect(() => {
    // Force garbage collection hint (in development)
    if (process.env.NODE_ENV === 'development' && global.gc) {
      const hasChanged = dependencies.some((dep, index) => 
        dep !== previousDeps.current[index]
      );
      
      if (hasChanged) {
        setTimeout(() => {
          if (global.gc) {
            global.gc();
          }
        }, 1000);
      }
    }
    
    previousDeps.current = dependencies;
  }, dependencies);
}

// Component size analyzer (development only)
export function analyzeComponentSize(Component: React.ComponentType<any>) {
  if (process.env.NODE_ENV !== 'development') {
    return Component;
  }

  return function AnalyzedComponent(props: any) {
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    React.useEffect(() => {
      const endTime = performance.now();
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      const renderTime = endTime - startTime;
      const memoryDelta = endMemory - startMemory;
      
      if (renderTime > 16 || memoryDelta > 1024 * 1024) { // 16ms or 1MB
        console.warn(`Component performance warning:`, {
          component: Component.name,
          renderTime: `${renderTime.toFixed(2)}ms`,
          memoryUsage: `${Math.round(memoryDelta / 1024)}KB`
        });
      }
    });
    
    return <Component {...props} />;
  };
}

// Export all optimization utilities
export const ComponentOptimizer = {
  memo: withMemoization,
  optimize: withOptimization,
  lazy: createLazyComponent,
  route: createOptimizedRoute,
  virtualize: VirtualizedList,
  lazyLoad: LazyLoad,
  debouncedInput: DebouncedInput,
  suspense: OptimizedSuspense,
  errorBoundary: PerformanceErrorBoundary,
  analyze: analyzeComponentSize
};