#!/usr/bin/env node

// Build script for Render deployment
// This ensures vite is run via Node.js
// Using .cjs extension to support CommonJS in ES module project

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // Try to find vite in node_modules
  const viteJsPath = join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  
  // Try different methods to run vite
  try {
    execSync(`node "${viteJsPath}" build`, { stdio: 'inherit', cwd: __dirname });
  } catch (e) {
    try {
      // Fallback to npx
      execSync('npx vite build', { stdio: 'inherit', cwd: __dirname });
    } catch (e2) {
      // Final fallback
      execSync('npm exec vite build', { stdio: 'inherit', cwd: __dirname });
    }
  }
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}


