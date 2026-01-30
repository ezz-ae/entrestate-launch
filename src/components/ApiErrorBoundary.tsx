'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ApiErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ApiErrorBoundary] Caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="w-full max-w-md p-8 rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Application Error</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {this.state.error?.message || "An unexpected error occurred while communicating with our services."}
              </p>
            </div>
            <Button 
              onClick={this.handleReset}
              className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-12 rounded-2xl"
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Retry Request
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
