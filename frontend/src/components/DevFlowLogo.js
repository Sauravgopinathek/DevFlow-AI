import React from 'react';

const DevFlowLogo = ({ size = 'md', animated = true, variant = 'default' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6',
    '3xl': 'w-8 h-8'
  };

  // Navbar variant - simplified and more visible
  if (variant === 'navbar') {
    return (
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg className="w-full h-full" viewBox="0 0 80 80">
          <defs>
            <linearGradient id="navbarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="25%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#db2777" />
              <stop offset="75%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <filter id="navbarGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main Circle */}
          <circle cx="40" cy="40" r="35" fill="url(#navbarGradient)" filter="url(#navbarGlow)" className={animated ? 'animate-pulse' : ''} />
          <circle cx="40" cy="40" r="28" fill="rgba(255,255,255,0.1)" />
          
          {/* DF Text - Large and Visible */}
          <text x="40" y="48" textAnchor="middle" fill="url(#textGradient)" fontSize="20" fontWeight="bold" fontFamily="system-ui">
            DF
          </text>
          
          {/* Small Integration Dots - Core Trio */}
          <circle cx="40" cy="15" r="3" fill="#0066cc" className={animated ? 'animate-bounce' : ''} />
          <circle cx="20" cy="60" r="3" fill="#0079bf" className={animated ? 'animate-bounce' : ''} style={animated ? { animationDelay: '0.3s' } : {}} />
          <circle cx="60" cy="60" r="3" fill="#4a154b" className={animated ? 'animate-bounce' : ''} style={animated ? { animationDelay: '0.6s' } : {}} />
        </svg>
      </div>
    );
  }

  // Enhanced 3D variant
  if (variant === '3d') {
    return (
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="25%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="innerShadow">
              <feOffset dx="0" dy="2"/>
              <feGaussianBlur stdDeviation="2" result="offset-blur"/>
              <feFlood floodColor="#000000" floodOpacity="0.3"/>
              <feComposite in2="offset-blur" operator="in"/>
            </filter>
          </defs>
          
          {/* 3D Base Shadow */}
          <ellipse cx="60" cy="110" rx="45" ry="8" fill="url(#shadowGradient)" opacity="0.3" />
          
          {/* Main 3D Cylinder */}
          <ellipse cx="60" cy="60" rx="40" ry="12" fill="url(#mainGradient)" filter="url(#glow)" />
          <rect x="20" y="48" width="80" height="24" fill="url(#mainGradient)" />
          <ellipse cx="60" cy="48" rx="40" ry="12" fill="url(#mainGradient)" filter="url(#innerShadow)" />
          
          {/* Central Core */}
          <circle cx="60" cy="54" r="25" fill="rgba(255,255,255,0.9)" />
          <circle cx="60" cy="54" r="20" fill="url(#mainGradient)" className={animated ? 'animate-pulse' : ''} />
          
          {/* DevFlow Text with 3D effect - Enhanced visibility */}
          <text x="60" y="50" textAnchor="middle" fill="#1e1b4b" fontSize="9" fontWeight="bold" fontFamily="system-ui" stroke="white" strokeWidth="0.5">
            DEV
          </text>
          <text x="60" y="62" textAnchor="middle" fill="#1e1b4b" fontSize="9" fontWeight="bold" fontFamily="system-ui" stroke="white" strokeWidth="0.5">
            FLOW
          </text>
          
          {/* Floating Integration Icons - Core Trio */}
          <g className={animated ? 'animate-bounce' : ''} style={animated ? { animationDelay: '0s', animationDuration: '3s' } : {}}>
            <circle cx="40" cy="25" r="8" fill="#0066cc" />
            <text x="40" y="30" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">GH</text>
          </g>
          
          <g className={animated ? 'animate-bounce' : ''} style={animated ? { animationDelay: '0.7s', animationDuration: '3s' } : {}}>
            <circle cx="25" cy="75" r="8" fill="#0079bf" />
            <text x="25" y="80" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">T</text>
          </g>
          
          <g className={animated ? 'animate-bounce' : ''} style={animated ? { animationDelay: '1.4s', animationDuration: '3s' } : {}}>
            <circle cx="75" cy="75" r="8" fill="#4a154b" />
            <text x="75" y="80" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">S</text>
          </g>
          
          {/* Connection Lines */}
          <g stroke="url(#mainGradient)" strokeWidth="2" fill="none" opacity="0.6" className={animated ? 'animate-pulse' : ''}>
            <line x1="38" y1="38" x2="45" y2="45" />
            <line x1="82" y1="38" x2="75" y2="45" />
            <line x1="38" y1="82" x2="45" y2="75" />
            <line x1="82" y1="82" x2="75" y2="75" />
            <line x1="60" y1="28" x2="60" y2="34" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      {/* Outer Ring with Gradient */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 ${animated ? 'animate-spin' : ''}`} 
           style={animated ? { animationDuration: '8s' } : {}}>
        <div className="absolute inset-1 rounded-full bg-white"></div>
      </div>
      
      {/* Inner Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {/* Central Hub */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center">
          {/* DF Text */}
          <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
            DF
          </span>
        </div>
        
        {/* Workflow Nodes */}
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${iconSizes[size]} bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-md ${animated ? 'animate-pulse' : ''}`}>
          <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 ${iconSizes[size]} bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-md ${animated ? 'animate-pulse' : ''}`}
             style={animated ? { animationDelay: '0.5s' } : {}}>
          <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-1/2 h-1/2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        
        <div className={`absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${iconSizes[size]} bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-md ${animated ? 'animate-pulse' : ''}`}
             style={animated ? { animationDelay: '1s' } : {}}>
          <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-1/2 h-1/2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <div className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 ${iconSizes[size]} bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-md ${animated ? 'animate-pulse' : ''}`}
             style={animated ? { animationDelay: '1.5s' } : {}}>
          <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-1/2 h-1/2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Connecting lines between nodes */}
          <line x1="50" y1="15" x2="50" y2="35" stroke="url(#connectionGradient)" strokeWidth="1" className={animated ? 'animate-pulse' : ''} />
          <line x1="50" y1="65" x2="50" y2="85" stroke="url(#connectionGradient)" strokeWidth="1" className={animated ? 'animate-pulse' : ''} />
          <line x1="15" y1="50" x2="35" y2="50" stroke="url(#connectionGradient)" strokeWidth="1" className={animated ? 'animate-pulse' : ''} />
          <line x1="65" y1="50" x2="85" y2="50" stroke="url(#connectionGradient)" strokeWidth="1" className={animated ? 'animate-pulse' : ''} />
          
          {/* Diagonal connections */}
          <line x1="35" y1="35" x2="25" y2="25" stroke="url(#connectionGradient)" strokeWidth="0.5" opacity="0.5" className={animated ? 'animate-pulse' : ''} />
          <line x1="65" y1="35" x2="75" y2="25" stroke="url(#connectionGradient)" strokeWidth="0.5" opacity="0.5" className={animated ? 'animate-pulse' : ''} />
          <line x1="35" y1="65" x2="25" y2="75" stroke="url(#connectionGradient)" strokeWidth="0.5" opacity="0.5" className={animated ? 'animate-pulse' : ''} />
          <line x1="65" y1="65" x2="75" y2="75" stroke="url(#connectionGradient)" strokeWidth="0.5" opacity="0.5" className={animated ? 'animate-pulse' : ''} />
        </svg>
      </div>
    </div>
  );
};

export default DevFlowLogo;