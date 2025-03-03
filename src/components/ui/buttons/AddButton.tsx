// src/components/shared/AddButton.tsx

import React from 'react';
import { ActionButton } from './ActionButton';

// You can add a PlusIcon component or import from a library like heroicons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

type AddButtonProps = {
  entityType: 'Friend' | 'Task' | 'Date' | 'Note' | 'Topic';
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
};

export function AddButton({
  entityType,
  href,
  onClick,
  variant = 'primary',
  fullWidth = false,
}: AddButtonProps) {
  return (
    <ActionButton
      label={`+ Add ${entityType}`}
      icon={<PlusIcon />}
      variant={variant}
      href={href}
      onClick={onClick}
      fullWidth={fullWidth}
    />
  );
}