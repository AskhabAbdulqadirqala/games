import { useEffect, useRef } from "react";

interface Props {
  color: string;
}

export const useExplodeEffect = (props: Props) => {
  const { color } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const particles = Array.from({ length: 50 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: Math.random() * 4 + 2,
      color,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
      alpha: 1,
    }));

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.velocity.x;
        p.y += p.velocity.y;
        p.alpha -= 0.02;
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      if (frame < 60) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [color]);

  return { canvasRef };
};
