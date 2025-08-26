import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

const PatternBackground = ({ pattern = 'dots', children, animated = true }) => {
  const { isDarkMode } = useSettings();
  if (pattern === 'circuit') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        {/* Circuit Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <g stroke="#8b5cf6" strokeWidth="0.5" fill="none">
                {/* Horizontal lines */}
                <line x1="0" y1="25" x2="40" y2="25" className={animated ? 'animate-pulse' : ''} />
                <line x1="60" y1="25" x2="100" y2="25" className={animated ? 'animate-pulse' : ''} />
                <line x1="0" y1="75" x2="30" y2="75" className={animated ? 'animate-pulse' : ''} />
                <line x1="70" y1="75" x2="100" y2="75" className={animated ? 'animate-pulse' : ''} />
                
                {/* Vertical lines */}
                <line x1="25" y1="0" x2="25" y2="40" className={animated ? 'animate-pulse' : ''} />
                <line x1="25" y1="60" x2="25" y2="100" className={animated ? 'animate-pulse' : ''} />
                <line x1="75" y1="0" x2="75" y2="30" className={animated ? 'animate-pulse' : ''} />
                <line x1="75" y1="70" x2="75" y2="100" className={animated ? 'animate-pulse' : ''} />
                
                {/* Circuit nodes */}
                <circle cx="25" cy="25" r="2" fill="#ec4899" className={animated ? 'animate-ping' : ''} />
                <circle cx="75" cy="25" r="2" fill="#06b6d4" className={animated ? 'animate-ping' : ''} />
                <circle cx="25" cy="75" r="2" fill="#10b981" className={animated ? 'animate-ping' : ''} />
                <circle cx="75" cy="75" r="2" fill="#f59e0b" className={animated ? 'animate-ping' : ''} />
                
                {/* Microchips */}
                <rect x="40" y="20" width="20" height="10" fill="#8b5cf6" opacity="0.6" />
                <rect x="60" y="70" width="15" height="10" fill="#ec4899" opacity="0.6" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
        
        {/* Glowing Nodes */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${animated ? 'animate-ping' : ''}`}
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${15 + Math.floor(i / 4) * 30}%`,
                background: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][i % 5],
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  if (pattern === 'hexagon') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Hexagon Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 400 400">
          <defs>
            <pattern id="hexagons" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon 
                points="30,4 52,15 52,37 30,48 8,37 8,15" 
                fill="none" 
                stroke="url(#hexGradient)" 
                strokeWidth="1"
                className={animated ? 'animate-pulse' : ''}
              />
            </pattern>
            <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
        
        {/* Highlighted Hexagons */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <svg
              key={i}
              className={`absolute w-16 h-16 ${animated ? 'animate-pulse' : ''}`}
              style={{
                left: `${15 + (i % 3) * 30}%`,
                top: `${20 + Math.floor(i / 3) * 25}%`,
                animationDelay: `${i * 0.3}s`
              }}
              viewBox="0 0 60 52"
            >
              <polygon 
                points="30,4 52,15 52,37 30,48 8,37 8,15" 
                fill={['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][i % 5]}
                opacity="0.3"
              />
            </svg>
          ))}
        </div>
        
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  if (pattern === 'waves') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        {/* Wave Patterns */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full opacity-20"
              style={{
                height: '200px',
                top: `${i * 20}%`,
                background: `linear-gradient(90deg, transparent, ${['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][i]}, transparent)`,
                borderRadius: '50%',
                transform: `rotate(${i * 15}deg)`,
                animation: animated ? `wave${i} ${8 + i * 2}s ease-in-out infinite` : 'none'
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  if (pattern === 'triangles') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
        {/* Triangle Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
          <defs>
            <pattern id="triangles" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <polygon points="40,10 70,60 10,60" fill="#8b5cf6" opacity="0.3" className={animated ? 'animate-pulse' : ''} />
              <polygon points="40,70 10,20 70,20" fill="#ec4899" opacity="0.3" className={animated ? 'animate-pulse' : ''} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#triangles)" />
        </svg>
        
        {/* Floating Triangles */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`absolute ${animated ? 'animate-float' : ''}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30">
                <polygon 
                  points="15,5 25,20 5,20" 
                  fill={['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][i % 5]}
                  opacity="0.4"
                />
              </svg>
            </div>
          ))}
        </div>
        
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // Default Dots Pattern
  return (
    <div className={`relative min-h-screen overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900'
    }`}>
      {/* Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, #00FFFF 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          animation: animated ? 'dotMove 15s linear infinite' : 'none'
        }}
      ></div>
      
      {/* Highlighted Dots */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${animated ? 'animate-ping' : ''}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#00FFFF', '#FF00FF', '#00FFFF', '#FF00FF', '#00FFFF'][i % 5],
              animationDelay: `${i * 0.1}s`
            }}
          ></div>
        ))}
      </div>
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PatternBackground;