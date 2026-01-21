'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of our context data
interface BrochureContextType {
  brochureFile: File | null;
  setBrochureFile: (file: File | null) => void;
}

// Create the context with an undefined default value
const BrochureContext = createContext<BrochureContextType | undefined>(undefined);

// Create a provider component that will wrap our application
export function BrochureProvider({ children }: { children: ReactNode }) {
  const [brochureFile, setBrochureFile] = useState<File | null>(null);

  return (
    <BrochureContext.Provider value={{ brochureFile, setBrochureFile }}>
      {children}
    </BrochureContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useBrochure() {
  const context = useContext(BrochureContext);
  if (context === undefined) {
    throw new Error('useBrochure must be used within a BrochureProvider');
  }
  return context;
}