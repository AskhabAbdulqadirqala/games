import { useState, useRef, useEffect } from 'react';

export const usePieceDragging = (onClick?: () => void) => {
  const pieceRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);

    if (pieceRef.current) {
      const rect = pieceRef.current.getBoundingClientRect();
      setOffset({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }

    onClick?.();
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging || !pieceRef.current) return;

    pieceRef.current.style.position = 'fixed';
    pieceRef.current.style.left = `${event.clientX - offset.x}px`;
    pieceRef.current.style.top = `${event.clientY - offset.y}px`;
    pieceRef.current.style.pointerEvents = 'none';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (pieceRef.current) {
      pieceRef.current.style.position = '';
      pieceRef.current.style.left = '';
      pieceRef.current.style.top = '';
      pieceRef.current.style.pointerEvents = '';
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  return {
    pieceRef,
    isDragging,
    handleMouseDown,
  };
};
