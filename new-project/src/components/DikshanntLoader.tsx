import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface DikshanntLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
}

export default function DikshanntLoader({ size = 'md', overlay = false }: DikshanntLoaderProps) {
  const heights = {
    sm: '24px',
    md: '48px',
    lg: '80px'
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Logo height={heights[size]} />
      </motion.div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div 
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-sm flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
