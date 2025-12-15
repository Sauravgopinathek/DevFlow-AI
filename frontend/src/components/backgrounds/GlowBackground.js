import React from 'react';

const GlowBackground = ({ variant = 'aurora', children, intensity = 'medium' }) => {
  const intensityClasses = {
    low: 'opacity-30',
    medium: 'opacity-50',
    high: 'opacity-70'
  };

  if (variant === 'aurora') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        {/* Aurora Effect */}
        <div className={`absolute inset-0 ${intensityClasses[intensity]}`}>
          <div className="absolute top-0 left-0 w-full h-full">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
                filter: 'blur(40px)',
                animationDuration: '4s'
              }}
            ></div>
            <div
              className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(236, 72, 153, 0.1) 40%, transparent 70%)',
                filter: 'blur(40px)',
                animationDuration: '5s',
                animationDelay: '1s'
              }}
            ></div>
            <div
              className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0.1) 40%, transparent 70%)',
                filter: 'blur(40px)',
                animationDuration: '6s',
                animationDelay: '2s'
              }}
            ></div>
            <div
              className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full animate-pulse"
              style={{
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0.1) 40%, transparent 70%)',
                filter: 'blur(40px)',
                animationDuration: '7s',
                animationDelay: '3s'
              }}
            ></div>
          </div>
        </div>

        {/* Floating Light Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
                boxShadow: `0 0 ${10 + Math.random() * 20}px currentColor`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  if (variant === 'neon') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black">
        {/* Neon Grid */}
        <div className={`absolute inset-0 ${intensityClasses[intensity]}`}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              filter: 'drop-shadow(0 0 10px #8b5cf6)'
            }}
          ></div>
        </div>

        {/* Neon Shapes */}
        <div className="absolute inset-0">
          <div
            className="absolute top-20 left-20 w-32 h-32 border-2 border-pink-500 animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 20px #ec4899)',
              animationDuration: '2s'
            }}
          ></div>
          <div
            className="absolute top-40 right-32 w-24 h-24 border-2 border-cyan-500 rounded-full animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 20px #06b6d4)',
              animationDuration: '3s',
              animationDelay: '0.5s'
            }}
          ></div>
          <div
            className="absolute bottom-32 left-1/3 w-40 h-2 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 15px #f97316)',
              animationDuration: '4s',
              animationDelay: '1s'
            }}
          ></div>
          <div
            className="absolute bottom-20 right-20 w-28 h-28 border-2 border-emerald-500 transform rotate-45 animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 20px #10b981)',
              animationDuration: '2.5s',
              animationDelay: '1.5s'
            }}
          ></div>
        </div>

        {/* Neon Text Effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 opacity-10"
            style={{
              textShadow: '0 0 30px #8b5cf6, 0 0 60px #ec4899',
              filter: 'blur(2px)'
            }}
          >
            DEVFLOW
          </div>
        </div>

        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  if (variant === 'plasma') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
        {/* Plasma Effect */}
        <div className={`absolute inset-0 ${intensityClasses[intensity]}`}>
          <div className="absolute inset-0 animate-pulse" style={{ animationDuration: '8s' }}>
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.6) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.6) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.6) 0%, transparent 50%),
                  radial-gradient(circle at 90% 70%, rgba(16, 185, 129, 0.6) 0%, transparent 50%),
                  radial-gradient(circle at 10% 90%, rgba(249, 115, 22, 0.6) 0%, transparent 50%)
                `,
                filter: 'blur(60px)',
                animation: 'plasma-move 10s ease-in-out infinite'
              }}
            ></div>
          </div>
        </div>

        {/* Energy Streams */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${i * 20}%`,
                top: '0',
                width: '2px',
                height: '100%',
                background: `linear-gradient(to bottom, transparent, ${['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][i]}, transparent)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s'
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // Default Glow
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Soft Glows */}
      <div className={`absolute inset-0 ${intensityClasses[intensity]}`}>
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
            animationDuration: '4s'
          }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
            animationDuration: '5s',
            animationDelay: '1s'
          }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-56 h-56 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
            animationDuration: '6s',
            animationDelay: '2s'
          }}
        ></div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowBackground;