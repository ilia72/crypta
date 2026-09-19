import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', glow = false, onClick }: CardProps) {
  return (
    <div className={`bg-bg-panel border border-border-light rounded-xl p-4 shadow-card transition-all duration-200 hover:shadow-cardHover hover:border-border ${glow ? 'glow-accent' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
