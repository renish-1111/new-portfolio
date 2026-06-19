import React, { useRef } from 'react';
import { playHoverSound, playClickSound } from '../utils/sound';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  href?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Detect touch/mobile once at module level — avoids per-render checks
const isTouchDevice =
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024);

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = "", 
  onClick, 
  href,
  onMouseEnter,
  onMouseLeave
}) => {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isTouchDevice) return; // Skip magnetic effect on touch devices
    const el = buttonRef.current;
    if (!el) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = el.getBoundingClientRect();
    
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) playHoverSound();
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    if (buttonRef.current && !isTouchDevice) {
      buttonRef.current.style.transform = 'translate3d(0px, 0px, 0)';
    }
    onMouseLeave?.();
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (!isTouchDevice) playClickSound();
    if (onClick) onClick(e);
  };

  if (href) {
    return (
      <a
        href={href}
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick as any}
        className={`inline-block transition-transform duration-300 ease-out ${isTouchDevice ? '' : 'cursor-none'} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick as any}
      className={`inline-block transition-transform duration-300 ease-out ${isTouchDevice ? '' : 'cursor-none'} ${className}`}
    >
      {children}
    </button>
  );
};

export default MagneticButton;
