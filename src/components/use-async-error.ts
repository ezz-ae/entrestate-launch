'use client';

import { useState, useCallback } from 'react';

/**
 * Hook to bridge asynchronous errors (like API failures) into a React Error Boundary.
 */
export function useAsyncError() {
  const [_, setError] = useState();
  
  return useCallback((e: any) => {
    setError(() => { throw e; });
  }, []);
}