"use client";

import { useEffect, useRef } from "react";

export default function TestMotiffPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const width = Math.floor(window.innerWidth);
      const height = 220; // fixed height for Siri-style strip
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    let t = 0;

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // baseline subtle
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.restore();

      // gradient fill across the wave
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0.2, "#34d399"); // green
      grad.addColorStop(0.5, "#60a5fa"); // blue
      grad.addColorStop(0.7, "#f472b6"); // pink
      grad.addColorStop(1, "#ffffff"); // white tail

      const amplitude = 26 + 6 * Math.sin(t * 0.006);
      const wavelength = width * 0.015;
      const speed = 0.04;

      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.35)";
      ctx.shadowBlur = 24;
      ctx.fillStyle = grad;
      ctx.beginPath();
      // upper lobe
      for (let x = 0; x <= width; x += 2) {
        const normalized = x / width; // 0..1
        const envelope = Math.pow(Math.sin(Math.PI * normalized), 1.8);
        const y = centerY - envelope * amplitude * Math.sin(x / wavelength + t * speed);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // lower lobe (mirror back)
      for (let x = width; x >= 0; x -= 2) {
        const normalized = x / width;
        const envelope = Math.pow(Math.sin(Math.PI * normalized), 1.8);
        const y = centerY + envelope * amplitude * Math.sin(x / wavelength + t * speed);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      t += 1;
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="bg-[#1d1d1d] h-screen w-screen flex items-center justify-center">
      <canvas ref={canvasRef} aria-label="voice-activity-visual" />
    </div>
  );
}