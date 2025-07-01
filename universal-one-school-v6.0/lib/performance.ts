import { performance } from 'perf_hooks';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface ComponentMetrics {
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRender: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private componentMetrics: Map<string, ComponentMetrics> = new Map();
  private apiMetrics: Map<string, number[]> = new Map();
  private memorySnapshots: Array<{ timestamp: number; usage: NodeJS.MemoryUsage }> = [];

  // Start timing a performance metric
  startTiming(name: string, metadata?: Record<string, any>): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata
    });
  }

  // End timing and calculate duration
  endTiming(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    metric.endTime = endTime;
    metric.duration = duration;

    // Log slow operations (>100ms)
    if (duration > 100) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Track component render performance
  trackComponentRender(componentName: string, renderTime: number): void {
    const existing = this.componentMetrics.get(componentName) || {
      renderCount: 0,
      totalRenderTime: 0,
      averageRenderTime: 0,
      lastRender: 0
    };

    existing.renderCount++;
    existing.totalRenderTime += renderTime;
    existing.averageRenderTime = existing.totalRenderTime / existing.renderCount;
    existing.lastRender = Date.now();

    this.componentMetrics.set(componentName, existing);

    // Warn about slow components (>16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`Slow component render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  // Track API call performance
  trackAPICall(endpoint: string, duration: number): void {
    const times = this.apiMetrics.get(endpoint) || [];
    times.push(duration);
    
    // Keep only last 100 measurements
    if (times.length > 100) {
      times.shift();
    }
    
    this.apiMetrics.set(endpoint, times);

    // Warn about slow API calls (>500ms)
    if (duration > 500) {
      console.warn(`Slow API call: ${endpoint} took ${duration.toFixed(2)}ms`);
    }
  }

  // Take memory snapshot
  takeMemorySnapshot(): void {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      this.memorySnapshots.push({
        timestamp: Date.now(),
        usage: process.memoryUsage()
      });

      // Keep only last 50 snapshots
      if (this.memorySnapshots.length > 50) {
        this.memorySnapshots.shift();
      }

      // Check for memory leaks (>1GB heap usage)
      const currentUsage = process.memoryUsage();
      if (currentUsage.heapUsed > 1024 * 1024 * 1024) {
        console.warn(`High memory usage detected: ${Math.round(currentUsage.heapUsed / 1024 / 1024)}MB`);
      }
    }
  }

  // Get performance report
  getReport(): {
    operations: PerformanceMetric[];
    components: Record<string, ComponentMetrics>;
    apis: Record<string, { average: number; min: number; max: number; count: number }>;
    memory: { current?: NodeJS.MemoryUsage; trend: string };
  } {
    // Process API metrics
    const apiReport: Record<string, { average: number; min: number; max: number; count: number }> = {};
    
    for (const [endpoint, times] of this.apiMetrics) {
      const average = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      
      apiReport[endpoint] = { average, min, max, count: times.length };
    }

    // Analyze memory trend
    let memoryTrend = 'stable';
    if (this.memorySnapshots.length >= 2) {
      const recent = this.memorySnapshots.slice(-10);
      const older = this.memorySnapshots.slice(-20, -10);
      
      if (recent.length > 0 && older.length > 0) {
        const recentAvg = recent.reduce((sum, snap) => sum + snap.usage.heapUsed, 0) / recent.length;
        const olderAvg = older.reduce((sum, snap) => sum + snap.usage.heapUsed, 0) / older.length;
        
        if (recentAvg > olderAvg * 1.2) {
          memoryTrend = 'increasing';
        } else if (recentAvg < olderAvg * 0.8) {
          memoryTrend = 'decreasing';
        }
      }
    }

    return {
      operations: Array.from(this.metrics.values()).filter(m => m.duration !== undefined),
      components: Object.fromEntries(this.componentMetrics),
      apis: apiReport,
      memory: {
        current: typeof process !== 'undefined' ? process.memoryUsage() : undefined,
        trend: memoryTrend
      }
    };
  }

  // Clear old metrics
  cleanup(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    // Clean up old performance metrics
    for (const [name, metric] of this.metrics) {
      if (metric.startTime < oneHourAgo) {
        this.metrics.delete(name);
      }
    }

    // Clean up old memory snapshots
    this.memorySnapshots = this.memorySnapshots.filter(
      snapshot => snapshot.timestamp > oneHourAgo
    );
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React component performance wrapper
export function withPerformanceTracking<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  return function PerformanceTrackedComponent(props: T) {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const renderTime = performance.now() - startTime;
      performanceMonitor.trackComponentRender(displayName, renderTime);
    });

    return React.createElement(WrappedComponent, props);
  };
}

// Hook for tracking component performance
export function usePerformanceTracking(componentName: string) {
  const startTime = React.useRef(performance.now());
  
  React.useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    performanceMonitor.trackComponentRender(componentName, renderTime);
    startTime.current = performance.now(); // Reset for next render
  });
}

// API call performance wrapper
export async function trackAPICall<T>(
  endpoint: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    performanceMonitor.trackAPICall(endpoint, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    performanceMonitor.trackAPICall(`${endpoint} (error)`, duration);
    throw error;
  }
}

// Utility functions
export const Performance = {
  start: (name: string, metadata?: Record<string, any>) => 
    performanceMonitor.startTiming(name, metadata),
  
  end: (name: string) => 
    performanceMonitor.endTiming(name),
  
  track: (name: string, fn: () => void) => {
    performanceMonitor.startTiming(name);
    fn();
    return performanceMonitor.endTiming(name);
  },
  
  trackAsync: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    performanceMonitor.startTiming(name);
    try {
      const result = await fn();
      performanceMonitor.endTiming(name);
      return result;
    } catch (error) {
      performanceMonitor.endTiming(name);
      throw error;
    }
  },
  
  report: () => performanceMonitor.getReport(),
  
  snapshot: () => performanceMonitor.takeMemorySnapshot(),
  
  cleanup: () => performanceMonitor.cleanup()
};

// Auto-cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    performanceMonitor.cleanup();
  }, 60 * 60 * 1000);
}

// Auto-memory snapshots every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    performanceMonitor.takeMemorySnapshot();
  }, 5 * 60 * 1000);
}