'use client';

import React from 'react';
import LiquidGlass from 'liquid-glass-react';

export default function TestGlass() {
  return (
    <div style={{ 
      padding: '50px', 
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      minHeight: '100vh'
    }}>
      <LiquidGlass
        displacementScale={50}
        blurAmount={0.1}
        saturation={140}
        elasticity={0.3}
        cornerRadius={16}
        padding="20px"
      >
        <div style={{ color: 'white', fontSize: '18px' }}>
          <h2>Test Glass Effect</h2>
          <p>This should have liquid glass effect</p>
        </div>
      </LiquidGlass>
    </div>
  );
} 