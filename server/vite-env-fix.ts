/**
 * Vite Environment Variable Fix
 * 
 * This module safely processes environment variables without relying on Vite's loadEnv
 * function to avoid the "value.replace is not a function" error.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

type EnvMap = { [key: string]: string };

export function patchViteLoadEnv() {
  try {
    const safeEnv: EnvMap = {};
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const envPath = path.join(path.resolve(__dirname, '..'), '.env');

    console.log('🔧 Loading environment variables from', envPath);

    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');

      envContent.split('\n').forEach(line => {
        if (!line || line.trim().startsWith('#')) return;

        const equalIndex = line.indexOf('=');
        if (equalIndex > 0) {
          const key = line.substring(0, equalIndex).trim();
          let value = line.substring(equalIndex + 1).trim();
          value = value.replace(/^["'](.*)["']$/, '$1');

          if (typeof value === 'string') {
            process.env[key] = value;
            safeEnv[key] = value;
          }
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to patch Vite environment:', error);
    return false;
  }
}

export function restoreViteLoadEnv() {
  console.log('⚠️ Environment restoration not needed');
  return true;
}