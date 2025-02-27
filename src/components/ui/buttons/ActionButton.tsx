// src/components/shared/ActionButton.tsx

import React, { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

export function ActionButton({
  label,
  href,
  variant = 'primary',
  icon,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}: ActionButtonProps) {
  // Define variant-specific styles
  const variantStyles = {
    primary: 'bg-teal-500 hover:bg-teal-600 text-white',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  // Common button styles
  const baseStyles = 'font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50';
  const widthStyles = fullWidth ? 'w-full' : '';
  const focusRingColor = variant === 'primary' ? 'focus:ring-teal-400' : variant === 'secondary' ? 'focus:ring-slate-400' : 'focus:ring-red-400';
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${widthStyles} ${focusRingColor} ${className}`;

  // Button content with optional icon
  const buttonContent = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </>
  );

  // Return link or button based on whether href is provided
  if (href) {
    return (
      <Link href={href} className={buttonStyles}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonStyles}
      {...props}
    >
      {buttonContent}
    </button>
  );
}