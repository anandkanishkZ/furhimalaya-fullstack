'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  overlay?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text,
  overlay = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-indigo-600',
    white: 'text-white'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${overlay ? 'p-8' : 'p-4'}`}>
      <div className="relative">
        {/* Outer rotating ring */}
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className={`${sizeClasses[size]} rounded-full border-4 border-transparent ${
            color === 'white' ? 'border-t-white/30 border-r-white/30' : 'border-t-slate-200 border-r-slate-200'
          }`}></div>
        </div>
        
        {/* Inner rotating ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1s' }}>
          <div className={`${sizeClasses[size]} rounded-full border-4 border-transparent ${colorClasses[color]} border-t-current border-l-current`}></div>
        </div>

        {/* Center dot */}
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className={`rounded-full ${colorClasses[color]} ${
            size === 'sm' ? 'w-1 h-1' : 
            size === 'md' ? 'w-2 h-2' : 
            size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
          } bg-current animate-pulse`}></div>
        </div>
      </div>
      
      {text && (
        <p className={`mt-4 ${textSizeClasses[size]} font-medium ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/50">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}

// Skeleton loading components
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-3/4"></div>
          <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
        <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-5/6"></div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/50 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-1/4 animate-pulse"></div>
      </div>
      <div className="divide-y divide-slate-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-1/3"></div>
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-1/4"></div>
              </div>
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/50 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-16"></div>
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-20"></div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
}