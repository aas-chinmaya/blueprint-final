

'use client';

import { motion } from 'framer-motion';

export default function PreLoader() {
  const letters = 'BLUEPRINT...'.split('');

  return (
    <div className="flex items-center justify-center h-screen bg-[#0F1D40]">
      <div className="flex space-x-1">
        {letters.map((char, index) => (
          <motion.span
            key={index}
            className="text-blue-600 text-4xl font-extrabold font-mono"
            initial={{ y: 0 }}
            animate={{ y: [-4, 4, -4] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1,
              ease: 'easeInOut',
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
