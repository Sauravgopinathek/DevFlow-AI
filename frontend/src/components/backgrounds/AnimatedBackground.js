import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

const AnimatedBackground = ({ variant = 'default', children }) => {
  const { isDarkMode } = useSettings();
  if (variant === 'geometric') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated Geometric Shapes */}
        <div className="absolute inset-0">
          {/* Large Triangles */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 transform rotate-45 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 transform rotate-12 animate-bounce" style={{animationDuration: '3s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-orange-500/20 to-red-500/20 transform -rotate-12 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Hexagons */}
          <svg className="absolute top-1/3 right-1/4 w-20 h-20 text-emerald-400/30 animate-spin" style={{animationDuration: '8s'}} viewBox="0 0 100 100">
            <polygon points="50,5 85,25 85,75 50,95 15,75 15,25" fill="currentColor" />
          </svg>
          
          <svg className="absolute bottom-1/3 left-1/3 w-16 h-16 text-yellow-400/30 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}} viewBox="0 0 100 100">
            <polygon points="50,5 85,25 85,75 50,95 15,75 15,25" fill="currentColor" />
          </svg>
          
          {/* Circles */}
          <div className="absolute top-1/2 left-10 w-12 h-12 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-1/3 w-8 h-8 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-40 right-10 w-16 h-16 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          
          {/* Lines */}
          <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-pulse"></div>
          <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-400/50 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  if (variant === 'particles') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-white/40 rounded-full animate-float`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
          
          {/* Larger Glowing Orbs */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className={`absolute rounded-full animate-float opacity-60`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                background: `radial-gradient(circle, ${['#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#10b981'][Math.floor(Math.random() * 5)]}/30, transparent)`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 6}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  if (variant === 'waves') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        {/* Animated Wave Layers */}
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 w-full h-64 text-purple-600/20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z" fill="currentColor">
              <animate attributeName="d" dur="10s" repeatCount="indefinite" 
                values="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z;
                        M0,80 C300,40 600,100 900,40 C1050,10 1150,80 1200,40 L1200,120 L0,120 Z;
                        M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z" />
            </path>
          </svg>
          
          <svg className="absolute bottom-0 w-full h-48 text-pink-600/15" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,40 C400,80 800,0 1200,40 L1200,120 L0,120 Z" fill="currentColor">
              <animate attributeName="d" dur="8s" repeatCount="indefinite" 
                values="M0,40 C400,80 800,0 1200,40 L1200,120 L0,120 Z;
                        M0,60 C400,20 800,80 1200,20 L1200,120 L0,120 Z;
                        M0,40 C400,80 800,0 1200,40 L1200,120 L0,120 Z" />
            </path>
          </svg>
          
          <svg className="absolute bottom-0 w-full h-32 text-cyan-600/10" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,20 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,120 L0,120 Z" fill="currentColor">
              <animate attributeName="d" dur="6s" repeatCount="indefinite" 
                values="M0,20 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,120 L0,120 Z;
                        M0,40 C200,0 400,60 600,10 C800,0 1000,60 1200,10 L1200,120 L0,120 Z;
                        M0,20 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,120 L0,120 Z" />
            </path>
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
          
          {/* Grid Highlights */}
          <div className="absolute top-20 left-20 w-12 h-12 bg-purple-500/50 rounded animate-pulse"></div>
          <div className="absolute top-40 right-32 w-8 h-8 bg-pink-500/50 rounded animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-cyan-500/50 rounded animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 right-20 w-10 h-10 bg-orange-500/50 rounded animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  // Default Gradient Background
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-float shadow-2xl"></div>
      <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-r from-orange-400/30 to-red-400/30 rounded-full animate-float shadow-2xl" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full animate-float shadow-2xl" style={{animationDelay: '4s'}}></div>
      <div className="absolute top-60 right-10 w-12 h-12 bg-gradient-to-r from-emerald-400/30 to-green-400/30 rounded-full animate-float shadow-2xl" style={{animationDelay: '1s'}}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;