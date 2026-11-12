import React, { useEffect, useRef } from 'react';
import { TOTAL_FRAMES } from '../data/glacierData';

interface BottleCanvasProps {
  virtualProgress: number;
  frames: (HTMLImageElement | null)[];
  isLoaded: boolean;
}

export const BottleCanvas: React.FC<BottleCanvasProps> = ({ virtualProgress, frames, isLoaded }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentFrameFloatRef = useRef<number>(1.0);
  const lastDrawnFloatRef = useRef<number>(-1);

  // Robust, jitter-free image retriever
  const getActiveImage = (frameIdx: number): HTMLImageElement | null => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIdx)));

    // Exact requested frame
    if (frames[clamped - 1]?.complete && frames[clamped - 1]?.naturalWidth !== 0) {
      return frames[clamped - 1];
    }

    // For the opening section (Frames 1-5), strictly never leap forward into later scenes
    if (clamped <= 5) {
      for (let prev = clamped; prev >= 1; prev--) {
        if (frames[prev - 1]?.complete && frames[prev - 1]?.naturalWidth !== 0) {
          return frames[prev - 1];
        }
      }
      return frames[0] || null;
    }

    // For later sections, search nearby cached frames within a tight window
    for (let off = 1; off <= 15; off++) {
      const prev = clamped - off;
      if (prev >= 1 && frames[prev - 1]?.complete && frames[prev - 1]?.naturalWidth !== 0) {
        return frames[prev - 1];
      }
      const next = clamped + off;
      if (next <= TOTAL_FRAMES && frames[next - 1]?.complete && frames[next - 1]?.naturalWidth !== 0) {
        return frames[next - 1];
      }
    }

    return frames[0] || null;
  };

  // High-fidelity subpixel frame blender (Apple-style alpha cross-dissolve)
  const renderBlendedScene = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    frameFloat: number
  ) => {
    const clampedFloat = Math.max(1, Math.min(TOTAL_FRAMES, frameFloat));
    const floorFrame = Math.floor(clampedFloat);
    const ceilFrame = Math.min(TOTAL_FRAMES, floorFrame + 1);
    const blend = clampedFloat - floorFrame;

    const imgA = getActiveImage(floorFrame);
    if (!imgA || !imgA.complete || imgA.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = imgA.naturalWidth;
    const ih = imgA.naturalHeight;
    const isMobile = window.innerWidth <= 768;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const cx = isMobile ? (cw - nw) * 0.5 : cw - nw; // Desktop anchored right
    const cy = (ch - nh) * 0.5;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Base pass: draw primary frame at 100% opacity
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#0b1523';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(imgA, cx, cy, nw, nh);

    // Subpixel cross-dissolve pass: blend next frame seamlessly
    if (blend > 0.01 && ceilFrame !== floorFrame) {
      const imgB = getActiveImage(ceilFrame);
      if (imgB && imgB.complete && imgB.naturalWidth !== 0 && imgB !== imgA) {
        ctx.globalAlpha = blend;
        ctx.drawImage(imgB, cx, cy, nw, nh);
        ctx.globalAlpha = 1.0;
      }
    }
  };

  // 60 FPS Render & Frame Scrub Loop with Continuous Subpixel Blending
  useEffect(() => {
    let animId: number;

    const loop = () => {
      const canvas = canvasRef.current;
      if (canvas && isLoaded) {
        // Calculate target frame from virtual scroll progress (1 .. TOTAL_FRAMES)
        const targetFrame = 1 + virtualProgress * (TOTAL_FRAMES - 1);
        const fDelta = targetFrame - currentFrameFloatRef.current;
        const distance = Math.abs(fDelta);

        if (distance > 0.001) {
          // Dynamic max speed clamp: ensures every single frame is rendered sequentially
          // without frame skips, while keeping multi-slide jumps responsive (~1.1s)
          const maxStep = Math.min(1.8, Math.max(0.92, distance * 0.04));
          let step = fDelta * 0.22;
          if (Math.abs(step) > maxStep) {
            step = Math.sign(step) * maxStep;
          }
          currentFrameFloatRef.current += step;
        } else {
          currentFrameFloatRef.current = targetFrame;
        }

        // Redraw whenever the float frame position moves by more than 0.003
        if (Math.abs(currentFrameFloatRef.current - lastDrawnFloatRef.current) > 0.003) {
          const ctx = canvas.getContext('2d', { alpha: false });
          if (ctx) {
            renderBlendedScene(canvas, ctx, currentFrameFloatRef.current);
            lastDrawnFloatRef.current = currentFrameFloatRef.current;
          }
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [virtualProgress, frames, isLoaded]);

  // Handle High-DPR Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const winW = window.innerWidth || 1280;
      const winH = window.innerHeight || 720;
      const bw = Math.round(winW * dpr);
      const bh = Math.round(winH * dpr);

      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        renderBlendedScene(canvas, ctx, currentFrameFloatRef.current);
        lastDrawnFloatRef.current = currentFrameFloatRef.current;
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [frames]);

  // Initial guaranteed paint once loaded
  useEffect(() => {
    if (isLoaded && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        renderBlendedScene(canvas, ctx, 1.0);
        currentFrameFloatRef.current = 1.0;
        lastDrawnFloatRef.current = 1.0;
      }
    }
  }, [isLoaded, frames]);

  return <canvas ref={canvasRef} id="global-canvas" className="global-canvas" />;
};
