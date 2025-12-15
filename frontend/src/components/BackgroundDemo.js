import React, { useState } from 'react';
import GlowBackground from './backgrounds/GlowBackground';
import AnimatedBackground from './backgrounds/AnimatedBackground';

const BackgroundDemo = () => {
  const [currentBackground, setCurrentBackground] = useState('glow-aurora');

  const backgrounds = [
    { id: 'glow-aurora', name: 'Aurora Glow', component: 'GlowBackground', variant: 'aurora' },
    { id: 'glow-neon', name: 'Neon Glow', component: 'GlowBackground', variant: 'neon' },
    { id: 'glow-plasma', name: 'Plasma Glow', component: 'GlowBackground', variant: 'plasma' },
    { id: 'glow-default', name: 'Default Glow', component: 'GlowBackground', variant: 'default' },
    { id: 'animated-particles', name: 'Particles', component: 'AnimatedBackground', variant: 'particles' },
    { id: 'animated-geometric', name: 'Geometric', component: 'AnimatedBackground', variant: 'geometric' },
    { id: 'animated-waves', name: 'Waves', component: 'AnimatedBackground', variant: 'waves' },
    { id: 'animated-grid', name: 'Grid', component: 'AnimatedBackground', variant: 'grid' },
  ];

  const renderBackground = () => {
    const bg = backgrounds.find(b => b.id === currentBackground);
    if (!bg) return null;

    const content = (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            {bg.name} Background
          </h1>
          <p className="text-white/80 mb-8">
            This is a demonstration of the {bg.name.toLowerCase()} background variant.
            The background creates beautiful visual effects while maintaining readability.
          </p>
          
          {/* Background Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {backgrounds.map((background) => (
              <button
                key={background.id}
                onClick={() => setCurrentBackground(background.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentBackground === background.id
                    ? 'bg-white text-black'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {background.name}
              </button>
            ))}
          </div>

          <div className="text-white/60 text-sm">
            <p>Component: {bg.component}</p>
            <p>Variant: {bg.variant}</p>
          </div>
        </div>
      </div>
    );

    if (bg.component === 'GlowBackground') {
      return (
        <GlowBackground variant={bg.variant} intensity="medium">
          {content}
        </GlowBackground>
      );
    } else {
      return (
        <AnimatedBackground variant={bg.variant}>
          {content}
        </AnimatedBackground>
      );
    }
  };

  return renderBackground();
};

export default BackgroundDemo;