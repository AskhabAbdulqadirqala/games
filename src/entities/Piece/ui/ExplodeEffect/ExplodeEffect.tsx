import { useExplodeEffect } from '../../lib/hooks/useExplodeEffect';

interface Props {
  color: string;
  className?: string;
}

export const ExplodeEffect = ({ color, className }: Props) => {
  const { canvasRef } = useExplodeEffect({ color });

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={80}
      className={className}
      style={{ pointerEvents: 'none' }}
    />
  );
};
