import React, { useRef, useState } from 'react';
import { playHoverSound, playClickSound } from '../utils/sound';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  href?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = "", 
  onClick, 
  href,
  onMouseEnter,
  onMouseLeave
}) => {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Magnetic pull strength (0.3 = 30% pull towards cursor)
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const handleMouseEnter = () => {
    playHoverSound();
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    if (onMouseLeave) onMouseLeave();
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    playClickSound();
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
        className={`inline-block transition-transform duration-300 ease-out cursor-none ${className}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
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
      className={`inline-block transition-transform duration-300 ease-out cursor-none ${className}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      {children}
    </button>
  );
};

export default MagneticButton;
