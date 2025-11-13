"use client";

import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type VoiceInputVariant = "default" | "compact";

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  className?: string;
  /**
   * When true, the component becomes a passive visualizer that relies on the
   * `listening` prop instead of handling its own click behaviour.
   */
  controlled?: boolean;
  /** Active state for the visualizer in controlled mode */
  listening?: boolean;
  /** Adjust overall layout size */
  variant?: VoiceInputVariant;
  /** Toggle timer badge */
  showTimer?: boolean;
  /** Toggle helper label text */
  showLabel?: boolean;
  /** Text shown while idle (when showLabel = true) */
  idleLabel?: string;
  /** Text shown while active (when showLabel = true) */
  activeLabel?: string;
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  className,
  controlled = false,
  listening = false,
  variant = "default",
  showTimer = true,
  showLabel = true,
  idleLabel = "Click to speak",
  activeLabel = "Listening..."
}: AIVoiceInputProps) {
  const [internalActive, setInternalActive] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(demoMode);
  const active = controlled ? Boolean(listening) : internalActive;

  const prevActiveRef = useRef(active);
  const firstRenderRef = useRef(true);
  const timeRef = useRef(0);

  useEffect(() => setIsClient(true), []);
  useEffect(() => setIsDemo(demoMode), [demoMode]);
  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    if (!active) return;
    const intervalId = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [active]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      prevActiveRef.current = active;
      return;
    }
    if (active && !prevActiveRef.current) {
      onStart?.();
    }
    if (!active && prevActiveRef.current) {
      onStop?.(timeRef.current);
      setTime(0);
    }
    prevActiveRef.current = active;
  }, [active, onStart, onStop]);

  useEffect(() => {
    if (controlled || !isDemo) return;
    let timeoutId: NodeJS.Timeout | undefined;

    const runAnimation = () => {
      setInternalActive(true);
      timeoutId = setTimeout(() => {
        setInternalActive(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [controlled, isDemo, demoInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (controlled) return;
    if (isDemo) {
      setIsDemo(false);
      setInternalActive(false);
      return;
    }
    setInternalActive((prev) => !prev);
  };

  const outerClasses = cn(
    variant === "compact" ? "py-0" : "w-full py-4",
    className
  );

  const containerClasses = cn(
    variant === "compact"
      ? "relative flex items-center gap-2"
      : "relative max-w-xl w-full mx-auto flex items-center flex-col gap-2",
    controlled && "pointer-events-none select-none"
  );

  const buttonClasses = cn(
    variant === "compact"
      ? "group w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
      : "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
    active ? "bg-none" : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
  );

  const iconClasses = cn(
    variant === "compact" ? "w-4 h-4" : "w-6 h-6",
    "text-black/70 dark:text-white/70"
  );

  const timerClasses = cn(
    "font-mono transition-opacity duration-300",
    variant === "compact" ? "text-[11px]" : "text-sm",
    active ? "text-black/70 dark:text-white/70" : "text-black/30 dark:text-white/30"
  );

  const visualizerClasses = cn(
    "flex items-center justify-center gap-0.5",
    variant === "compact" ? "h-4 w-24" : "h-4 w-64"
  );

  const labelClasses = cn(
    variant === "compact" ? "text-[11px]" : "text-xs",
    "text-black/70 dark:text-white/70"
  );

  const labelText = active ? activeLabel : idleLabel;

  return (
    <div className={outerClasses}>
      <div className={containerClasses}>
        {!controlled && (
          <button
            className={buttonClasses}
            type="button"
            onClick={handleClick}
          >
            {active ? (
              <div
                className={cn(
                  variant === "compact" ? "w-5 h-5" : "w-6 h-6",
                  "rounded-sm animate-spin bg-black dark:bg-white"
                )}
                style={{ animationDuration: "3s" }}
              />
            ) : (
              <Mic className={iconClasses} />
            )}
          </button>
        )}

        {showTimer && (
          <span className={timerClasses}>{formatTime(time)}</span>
        )}

        <div className={visualizerClasses}>
          {Array.from({ length: visualizerBars }).map((_, i) => (
            <div
              key={i}
              className={cn(
                variant === "compact" ? "w-[2px]" : "w-0.5",
                "rounded-full transition-all duration-300",
                active
                  ? "bg-black/50 dark:bg-white/50 animate-pulse"
                  : "bg-black/10 dark:bg-white/10 h-1"
              )}
              style={
                active && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`
                    }
                  : undefined
              }
            />
          ))}
        </div>

        {showLabel && labelText && (
          <p className={labelClasses}>{labelText}</p>
        )}
      </div>
    </div>
  );
}