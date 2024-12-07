'use client';

import { useEffect, useRef } from 'react';

export function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.8; // 80vh
    };
    resize();
    window.addEventListener('resize', resize);

    const stars: Star[] = [];
    const starCount = 200;

    class Star {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = this.getStarColor();
        this.speed = Math.random() * 0.05 + 0.02;
      }

      getStarColor() {
        const colors = [
          'rgba(255, 255, 255, 0.8)',
          'rgba(173, 216, 230, 0.7)',
          'rgba(230, 230, 250, 0.7)',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speed;
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    function drawPurpleAccent() {
      if (!ctx) return;
      // Bottom fade
      const fadeGradient = ctx.createLinearGradient(
        0,
        canvas.height * 0.5,
        0,
        canvas.height
      );
      fadeGradient.addColorStop(0, 'rgba(10, 10, 20, 1)');
      fadeGradient.addColorStop(1, 'rgba(10, 10, 20, 0)');
      ctx.fillStyle = fadeGradient;
      ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.5);

      // Purple accent
      const purpleGradient = ctx.createRadialGradient(
        canvas.width,
        canvas.height,
        0,
        canvas.width,
        canvas.height,
        canvas.width * 0.7
      );
      purpleGradient.addColorStop(0, 'rgba(128, 0, 128, 0.1)');
      purpleGradient.addColorStop(0.6, 'rgba(128, 0, 128, 0.03)');
      purpleGradient.addColorStop(1, 'rgba(10, 10, 20, 0)');

      ctx.fillStyle = purpleGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgb(10, 10, 20)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawPurpleAccent();

      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
