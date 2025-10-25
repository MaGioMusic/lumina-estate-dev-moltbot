'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

interface CollapseToggleButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

const CollapseToggleButton: React.FC<CollapseToggleButtonProps> = ({
  isCollapsed,
  onToggle,
  className = ''
}) => {
  return (
    <motion.button
      onClick={onToggle}
      className={`
        absolute -right-3 top-1/2 transform -translate-y-1/2 
        w-6 h-6 bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-full shadow-sm hover:shadow-md 
        transition-all duration-200 
        flex items-center justify-center 
        text-gray-500 hover:text-primary-500 
        z-10 group
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isCollapsed ? "ფილტრების გაშლა" : "ფილტრების ჩაკეცვა"}
    >
      <motion.div
        animate={{ rotate: isCollapsed ? 0 : 180 }}
        transition={{ duration: 0.2 }}
      >
        {isCollapsed ? (
          <CaretRight className="w-3 h-3" weight="bold" />
        ) : (
          <CaretLeft className="w-3 h-3" weight="bold" />
        )}
      </motion.div>
      
      {/* Tooltip */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
        {isCollapsed ? "ფილტრების გაშლა" : "ფილტრების ჩაკეცვა"}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
      </div>
    </motion.button>
  );
};

export default CollapseToggleButton; 