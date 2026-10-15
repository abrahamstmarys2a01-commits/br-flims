import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'gold' | 'gray' | 'green' | 'blue';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  className = '',
}) => {
  const variantStyles = {
    red: 'bg-red-50 text-brand-red border-red-200',
    gold: 'bg-amber-50 text-brand-gold-dark border-amber-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
