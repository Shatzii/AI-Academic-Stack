/**
 * Type definitions for the startup-utils module
 */

import { Server } from 'http';

export function getBestFilePath(tsPath: string): string;
export function canImportModule(modulePath: string): Promise<boolean>;
export function getMemoryUsage(): string;
export function performGracefulShutdown(server: Server, db?: any): Promise<void>;
export function setupShutdownHandlers(server: Server, db?: any): void;