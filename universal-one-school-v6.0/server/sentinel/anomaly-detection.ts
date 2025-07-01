/**
 * Sentinel 4.5 Machine Learning Anomaly Detection
 * 
 * This module implements statistical and machine learning techniques to detect
 * anomalous patterns in user behavior, request patterns, and system metrics.
 */

import { sendAlert, AlertSeverity, AlertType } from './alert-system';
import { logSecurityEvent } from './audit-log';
import { createSecurityIncident, IncidentType } from './incident-response';

// Types of metrics to track
export enum MetricType {
  REQUEST_RATE = 'request_rate',
  SESSION_DURATION = 'session_duration',
  ERROR_RATE = 'error_rate',
  DATA_ACCESS_VOLUME = 'data_access_volume',
  LOGIN_FREQUENCY = 'login_frequency',
  FAILED_LOGIN_RATE = 'failed_login_rate',
  API_CALL_DISTRIBUTION = 'api_call_distribution',
  ACTIVE_HOURS = 'active_hours',
  GEOGRAPHIC_DISTRIBUTION = 'geographic_distribution',
  DEVICE_VARIETY = 'device_variety'
}

// Baseline statistics for a metric
interface BaselineStats {
  metricType: MetricType;
  userId?: string;
  endpoint?: string;
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  p95: number;
  p99: number;
  updateCount: number;
  lastUpdated: number;
}

// Current observation for a metric
interface MetricObservation {
  metricType: MetricType;
  userId?: string;
  endpoint?: string;
  value: number;
  timestamp: number;
}

// Detected anomaly
export interface Anomaly {
  id: string;
  metricType: MetricType;
  userId?: string;
  endpoint?: string;
  observedValue: number;
  expectedRange: [number, number];
  zScore: number;
  confidence: number;
  timestamp: number;
  description: string;
  relatedAnomalies?: string[];
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: number;
  falsePositive: boolean;
}

// Store baseline statistics
const baselineStats: Map<string, BaselineStats> = new Map();

// Store recent observations for ongoing analysis
const recentObservations: Map<string, MetricObservation[]> = new Map();

// Maximum number of observations to keep per metric
const MAX_OBSERVATIONS = 1000;

// Store detected anomalies
const detectedAnomalies: Map<string, Anomaly> = new Map();

// Learning rate for updating baselines (0-1)
const LEARNING_RATE = 0.05;

// Z-score threshold for anomaly detection
const ANOMALY_THRESHOLD = 3.0;

// Confidence threshold for alerting
const CONFIDENCE_THRESHOLD = 0.8;

// Initialize the anomaly detection system
export function initAnomalyDetection(): void {
  // Schedule regular baseline updates
  setInterval(() => {
    updateAllBaselines();
  }, 12 * 60 * 60 * 1000); // Every 12 hours
  
  console.log('Anomaly Detection module initialized');
}

/**
 * Record a new metric observation
 */
export function recordMetric(
  metricType: MetricType,
  value: number,
  userId?: string,
  endpoint?: string
): void {
  // Create the observation
  const observation: MetricObservation = {
    metricType,
    userId,
    endpoint,
    value,
    timestamp: Date.now()
  };
  
  // Generate key for this metric
  const metricKey = getMetricKey(metricType, userId, endpoint);
  
  // Store the observation
  if (!recentObservations.has(metricKey)) {
    recentObservations.set(metricKey, []);
  }
  
  const observations = recentObservations.get(metricKey)!;
  observations.push(observation);
  
  // Limit the number of stored observations
  if (observations.length > MAX_OBSERVATIONS) {
    observations.shift();
  }
  
  // Check for anomalies
  checkForAnomaly(observation);
}

/**
 * Check if an observation is anomalous
 */
function checkForAnomaly(observation: MetricObservation): void {
  const { metricType, userId, endpoint, value, timestamp } = observation;
  const metricKey = getMetricKey(metricType, userId, endpoint);
  
  // Get baseline stats for this metric
  const stats = baselineStats.get(metricKey);
  
  // If no baseline exists yet, update baseline but don't check for anomalies
  if (!stats) {
    updateBaseline(metricKey);
    return;
  }
  
  // Calculate z-score (how many standard deviations from the mean)
  const zScore = (value - stats.mean) / stats.stdDev;
  
  // Calculate anomaly confidence (0-1)
  let confidence = 0;
  
  if (Math.abs(zScore) > ANOMALY_THRESHOLD) {
    // Higher confidence for more extreme values
    confidence = Math.min(0.5 + (Math.abs(zScore) - ANOMALY_THRESHOLD) * 0.1, 0.99);
    
    // Higher confidence if we have more data points
    confidence = Math.min(confidence * (1 + Math.min(stats.updateCount / 100, 0.5)), 0.99);
    
    // Adjust confidence based on variance stability
    const varianceStability = Math.min(stats.updateCount / 50, 1);
    confidence *= varianceStability;
  }
  
  // If confidence exceeds threshold, record the anomaly
  if (confidence >= CONFIDENCE_THRESHOLD) {
    // Generate anomaly ID
    const anomalyId = `anomaly-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create anomaly record
    const anomaly: Anomaly = {
      id: anomalyId,
      metricType,
      userId,
      endpoint,
      observedValue: value,
      expectedRange: [stats.mean - (stats.stdDev * 2), stats.mean + (stats.stdDev * 2)],
      zScore,
      confidence,
      timestamp,
      description: generateAnomalyDescription(metricType, value, stats, zScore),
      acknowledged: false,
      falsePositive: false
    };
    
    // Store the anomaly
    detectedAnomalies.set(anomalyId, anomaly);
    
    // Log the anomaly detection
    logSecurityEvent(
      'system',
      'Anomaly detected',
      {
        anomalyId,
        metricType,
        userId: userId || 'system',
        zScore,
        confidence
      },
      'system'
    );
    
    // Send alert for high-confidence anomalies
    if (confidence > 0.9) {
      sendAlert(
        AlertSeverity.HIGH,
        AlertType.SUSPICIOUS_ACTIVITY,
        `Anomalous activity detected: ${anomaly.description}`,
        {
          anomalyId,
          metricType,
          userId: userId || 'system',
          value,
          expectedRange: anomaly.expectedRange,
          zScore,
          confidence
        },
        userId
      );
      
      // Create security incident for very high confidence anomalies
      if (confidence > 0.95) {
        createSecurityIncident(
          IncidentType.SUSPICIOUS_ACTIVITY,
          AlertSeverity.HIGH,
          `Critical anomaly detected: ${anomaly.description}`,
          {
            anomalyId,
            metricType,
            userId: userId || 'system',
            value,
            expectedRange: anomaly.expectedRange,
            zScore,
            confidence
          },
          null,
          userId
        );
      }
    }
  }
  
  // Update baseline with this observation
  updateBaselineWithObservation(metricKey, value);
}

/**
 * Generate a human-readable description of an anomaly
 */
function generateAnomalyDescription(
  metricType: MetricType,
  value: number,
  stats: BaselineStats,
  zScore: number
): string {
  const direction = value > stats.mean ? 'higher' : 'lower';
  const severity = Math.abs(zScore) > 5 ? 'significantly' : 'unusually';
  
  let description = '';
  
  switch (metricType) {
    case MetricType.REQUEST_RATE:
      description = `Request rate is ${severity} ${direction} than normal`;
      break;
      
    case MetricType.SESSION_DURATION:
      description = `Session duration is ${severity} ${direction} than normal`;
      break;
      
    case MetricType.ERROR_RATE:
      description = `Error rate is ${severity} ${direction} than normal`;
      break;
      
    case MetricType.DATA_ACCESS_VOLUME:
      description = `Data access volume is ${severity} ${direction} than normal`;
      break;
      
    case MetricType.LOGIN_FREQUENCY:
      description = `Login frequency is ${severity} ${direction} than normal`;
      break;
      
    case MetricType.FAILED_LOGIN_RATE:
      description = `Failed login rate is ${severity} ${direction} than normal`;
      break;
      
    case MetricType.API_CALL_DISTRIBUTION:
      description = `API call distribution is ${severity} different than normal`;
      break;
      
    case MetricType.ACTIVE_HOURS:
      description = `Activity during unusual hours detected`;
      break;
      
    case MetricType.GEOGRAPHIC_DISTRIBUTION:
      description = `Geographic access pattern is unusually different`;
      break;
      
    case MetricType.DEVICE_VARIETY:
      description = `Unusual variety of devices or user agents detected`;
      break;
      
    default:
      description = `Metric ${metricType} is ${severity} ${direction} than normal`;
  }
  
  // Add specific details
  description += ` (${value.toFixed(2)} vs normal range ${stats.mean.toFixed(2)} ± ${(stats.stdDev * 2).toFixed(2)})`;
  
  return description;
}

/**
 * Update the baseline statistics for a metric
 */
function updateBaseline(metricKey: string): void {
  const observations = recentObservations.get(metricKey) || [];
  
  // Need at least 10 observations to establish a baseline
  if (observations.length < 10) {
    return;
  }
  
  // Extract values
  const values = observations.map(obs => obs.value);
  
  // Calculate statistics
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values, mean);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const median = calculateMedian([...values]);
  const p95 = calculatePercentile([...values], 95);
  const p99 = calculatePercentile([...values], 99);
  
  // Get existing stats if any
  const existingStats = baselineStats.get(metricKey);
  
  // Create new baseline stats
  const stats: BaselineStats = {
    metricType: observations[0].metricType,
    userId: observations[0].userId,
    endpoint: observations[0].endpoint,
    mean,
    median,
    stdDev,
    min,
    max,
    p95,
    p99,
    updateCount: (existingStats?.updateCount || 0) + 1,
    lastUpdated: Date.now()
  };
  
  // Store updated stats
  baselineStats.set(metricKey, stats);
}

/**
 * Update baseline statistics with a new observation
 */
function updateBaselineWithObservation(metricKey: string, value: number): void {
  const stats = baselineStats.get(metricKey);
  if (!stats) return;
  
  // Update running statistics using exponential moving average
  stats.mean = (1 - LEARNING_RATE) * stats.mean + LEARNING_RATE * value;
  
  // Update min/max
  stats.min = Math.min(stats.min, value);
  stats.max = Math.max(stats.max, value);
  
  // Approximate standard deviation update
  // This is not mathematically perfect but works for our purposes
  const variance = stats.stdDev * stats.stdDev;
  const newVariance = (1 - LEARNING_RATE) * variance + LEARNING_RATE * Math.pow(value - stats.mean, 2);
  stats.stdDev = Math.sqrt(newVariance);
  
  // Update last updated timestamp
  stats.lastUpdated = Date.now();
  
  // Store updated stats
  baselineStats.set(metricKey, stats);
}

/**
 * Update all baselines
 */
function updateAllBaselines(): void {
  for (const metricKey of recentObservations.keys()) {
    updateBaseline(metricKey);
  }
  
  logSecurityEvent(
    'system',
    'Updated all anomaly detection baselines',
    {
      metricCount: baselineStats.size
    },
    'system'
  );
}

/**
 * Get all detected anomalies
 */
export function getAnomalies(
  limit?: number,
  offset?: number,
  userId?: string,
  metricType?: MetricType
): Anomaly[] {
  let anomalies = Array.from(detectedAnomalies.values());
  
  // Filter by user ID if specified
  if (userId) {
    anomalies = anomalies.filter(a => a.userId === userId);
  }
  
  // Filter by metric type if specified
  if (metricType) {
    anomalies = anomalies.filter(a => a.metricType === metricType);
  }
  
  // Sort by timestamp descending
  anomalies.sort((a, b) => b.timestamp - a.timestamp);
  
  // Apply pagination
  if (offset !== undefined && limit !== undefined) {
    anomalies = anomalies.slice(offset, offset + limit);
  } else if (limit !== undefined) {
    anomalies = anomalies.slice(0, limit);
  }
  
  return anomalies;
}

/**
 * Get baseline statistics for a metric
 */
export function getBaselineStats(
  metricType: MetricType,
  userId?: string,
  endpoint?: string
): BaselineStats | undefined {
  const metricKey = getMetricKey(metricType, userId, endpoint);
  return baselineStats.get(metricKey);
}

/**
 * Acknowledge an anomaly
 */
export function acknowledgeAnomaly(
  anomalyId: string,
  acknowledgedBy: string,
  falsePositive: boolean = false
): boolean {
  const anomaly = detectedAnomalies.get(anomalyId);
  if (!anomaly) return false;
  
  // Update anomaly
  anomaly.acknowledged = true;
  anomaly.acknowledgedBy = acknowledgedBy;
  anomaly.acknowledgedAt = Date.now();
  anomaly.falsePositive = falsePositive;
  
  // Save anomaly
  detectedAnomalies.set(anomalyId, anomaly);
  
  // Log the acknowledgement
  logSecurityEvent(
    acknowledgedBy,
    `Anomaly ${falsePositive ? 'marked as false positive' : 'acknowledged'}`,
    {
      anomalyId,
      falsePositive
    },
    'system'
  );
  
  return true;
}

/**
 * Generate a unique key for a metric
 */
function getMetricKey(metricType: MetricType, userId?: string, endpoint?: string): string {
  return `${metricType}:${userId || '*'}:${endpoint || '*'}`;
}

/**
 * Calculate the mean of an array of numbers
 */
function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculate the standard deviation of an array of numbers
 */
function calculateStdDev(values: number[], mean: number): number {
  if (values.length <= 1) return 0;
  
  const sumSquaredDiffs = values.reduce((acc, val) => {
    const diff = val - mean;
    return acc + (diff * diff);
  }, 0);
  
  return Math.sqrt(sumSquaredDiffs / (values.length - 1));
}

/**
 * Calculate the median of an array of numbers
 */
function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  
  values.sort((a, b) => a - b);
  
  const midIndex = Math.floor(values.length / 2);
  
  if (values.length % 2 === 0) {
    return (values[midIndex - 1] + values[midIndex]) / 2;
  } else {
    return values[midIndex];
  }
}

/**
 * Calculate a percentile value from an array of numbers
 */
function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  
  values.sort((a, b) => a - b);
  
  const index = Math.ceil((percentile / 100) * values.length) - 1;
  return values[Math.max(0, Math.min(index, values.length - 1))];
}