'use client';

// This component loads all benchmark code to ensure it gets bundled
// It's designed to generate very large sourcemaps for benchmarking purposes

import { useEffect } from 'react';

export function BenchmarkLoader() {
  useEffect(() => {
    // Dynamically import benchmark code in production
    if (process.env.NODE_ENV === 'production') {
      import('./benchmark').then((benchmark) => {
        // Store reference to prevent tree-shaking
        (window as any).__BENCHMARK_LOADED__ = benchmark;
        console.log('Benchmark code loaded for sourcemap generation');
      }).catch((err) => {
        console.warn('Benchmark code not yet generated:', err.message);
      });
    }
  }, []);

  // Component renders nothing
  return null;
}

