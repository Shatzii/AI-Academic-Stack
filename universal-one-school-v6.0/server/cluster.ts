import cluster from 'cluster';
import os from 'os';
import { performance } from 'perf_hooks';

const numCPUs = Math.min(os.cpus().length, 3); // Reserve 1 CPU for system on 4 vCPU server

interface WorkerMetrics {
  pid: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  requests: number;
  uptime: number;
}

class ClusterManager {
  private workers: Map<number, WorkerMetrics> = new Map();
  private maxMemoryPerWorker = 3 * 1024 * 1024 * 1024; // 3GB limit on 16GB server
  private maxRequestsPerWorker = 10000; // Restart worker after 10k requests

  constructor() {
    if (cluster.isPrimary) {
      console.log(`Master ${process.pid} is running`);
      this.setupMaster();
    } else {
      this.setupWorker();
    }
  }

  private setupMaster() {
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      this.forkWorker();
    }

    // Monitor worker health every 30 seconds
    setInterval(() => {
      this.monitorWorkers();
    }, 30000);

    // Handle worker exits
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`);
      this.workers.delete(worker.process.pid!);
      
      // Restart worker if not intentional shutdown
      if (code !== 0 && !worker.exitedAfterDisconnect) {
        console.log('Starting a new worker...');
        this.forkWorker();
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('Master received SIGTERM, shutting down gracefully');
      this.shutdown();
    });

    process.on('SIGINT', () => {
      console.log('Master received SIGINT, shutting down gracefully');
      this.shutdown();
    });
  }

  private forkWorker() {
    const worker = cluster.fork();
    
    if (worker.process.pid) {
      this.workers.set(worker.process.pid, {
        pid: worker.process.pid,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        requests: 0,
        uptime: Date.now()
      });
    }

    // Handle worker messages
    worker.on('message', (msg) => {
      if (msg.type === 'metrics' && worker.process.pid) {
        const metrics = this.workers.get(worker.process.pid);
        if (metrics) {
          metrics.requests = msg.requests;
          metrics.memoryUsage = msg.memoryUsage;
          metrics.cpuUsage = msg.cpuUsage;
        }
      }
    });
  }

  private monitorWorkers() {
    console.log('\n=== Worker Health Report ===');
    
    for (const [pid, metrics] of this.workers) {
      const memoryMB = Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024);
      const uptimeHours = Math.round((Date.now() - metrics.uptime) / 1000 / 3600 * 100) / 100;
      
      console.log(`Worker ${pid}: ${memoryMB}MB memory, ${metrics.requests} requests, ${uptimeHours}h uptime`);
      
      // Check if worker needs restart
      if (this.shouldRestartWorker(metrics)) {
        console.log(`Restarting worker ${pid} due to resource limits`);
        this.restartWorker(pid);
      }
    }
    
    console.log('===========================\n');
  }

  private shouldRestartWorker(metrics: WorkerMetrics): boolean {
    return (
      metrics.memoryUsage.heapUsed > this.maxMemoryPerWorker ||
      metrics.requests > this.maxRequestsPerWorker
    );
  }

  private restartWorker(pid: number) {
    const worker = Object.values(cluster.workers || {}).find(w => w?.process.pid === pid);
    if (worker) {
      worker.disconnect();
      setTimeout(() => {
        worker.kill();
      }, 5000); // Give 5 seconds for graceful shutdown
    }
  }

  private shutdown() {
    console.log('Shutting down all workers...');
    
    for (const worker of Object.values(cluster.workers || {})) {
      if (worker) {
        worker.disconnect();
      }
    }

    setTimeout(() => {
      console.log('Force killing remaining workers...');
      for (const worker of Object.values(cluster.workers || {})) {
        if (worker) {
          worker.kill();
        }
      }
      process.exit(0);
    }, 10000); // Force exit after 10 seconds
  }

  private setupWorker() {
    // Worker process setup
    console.log(`Worker ${process.pid} started`);
    
    // Track worker metrics
    let requestCount = 0;
    const startTime = Date.now();

    // Send metrics to master every 10 seconds
    setInterval(() => {
      if (process.send) {
        process.send({
          type: 'metrics',
          requests: requestCount,
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage(),
          uptime: Date.now() - startTime
        });
      }
    }, 10000);

    // Increment request counter
    process.on('request', () => {
      requestCount++;
    });

    // Graceful shutdown for worker
    process.on('SIGTERM', () => {
      console.log(`Worker ${process.pid} received SIGTERM, shutting down gracefully`);
      // Close server gracefully
      process.exit(0);
    });

    // Load the main application
    require('./index.js');
  }
}

// Initialize cluster manager
export const clusterManager = new ClusterManager();

// Export performance tracking utilities
export function trackRequest() {
  process.emit('request' as any);
}

export function getWorkerMetrics() {
  return {
    pid: process.pid,
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    uptime: process.uptime()
  };
}