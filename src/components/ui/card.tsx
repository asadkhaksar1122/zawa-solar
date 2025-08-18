import * as React from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "glass" | "gradient" | "aurora" | "glossy" | "neon" | "crystal" | "holographic";

interface BaseProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  glow?: boolean;
  animated?: boolean;
}

// Enhanced card variants with stunning visual effects
const cardBase =
  "rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 text-card-foreground shadow-xl shadow-zinc-200/40 dark:shadow-zinc-900/40 backdrop-blur-sm";

const cardGlass =
  "rounded-3xl border border-white/30 dark:border-white/20 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-2xl backdrop-saturate-200 supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-900/50 text-card-foreground shadow-2xl shadow-zinc-200/50 dark:shadow-zinc-950/50 ring-1 ring-white/20 dark:ring-white/10";

const cardGradient =
  "rounded-3xl border border-transparent bg-gradient-to-br from-white via-zinc-50/90 to-zinc-100/80 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-zinc-800/80 text-card-foreground shadow-2xl shadow-zinc-300/40 dark:shadow-zinc-950/60 ring-1 ring-zinc-200/40 dark:ring-zinc-800/40";

const cardAurora =
  "rounded-3xl border border-transparent bg-white/95 dark:bg-zinc-950/95 text-card-foreground shadow-2xl shadow-zinc-300/30 dark:shadow-zinc-950/60 ring-1 ring-zinc-200/60 dark:ring-zinc-800/60 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-violet-500/20 before:via-pink-500/20 before:to-cyan-500/20 dark:before:from-violet-500/10 dark:before:via-pink-500/10 dark:before:to-cyan-500/10 before:blur-2xl before:-z-10 after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-tr after:from-blue-500/10 after:via-purple-500/10 after:to-pink-500/10 dark:after:from-blue-500/5 dark:after:via-purple-500/5 dark:after:to-pink-500/5 after:blur-xl after:-z-10";

const cardGlossy =
  "rounded-3xl border border-white/60 dark:border-white/20 bg-gradient-to-b from-white/95 to-white/80 dark:from-zinc-900/95 dark:to-zinc-900/80 backdrop-blur-xl text-card-foreground shadow-2xl shadow-zinc-400/30 dark:shadow-zinc-950/60 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 dark:before:via-white/30 before:to-transparent after:absolute after:inset-0 after:rounded-3xl after:ring-1 after:ring-inset after:ring-white/30 dark:after:ring-white/15";

const cardNeon =
  "rounded-3xl border border-cyan-500/30 dark:border-cyan-400/30 bg-zinc-950/90 dark:bg-zinc-950/95 text-white shadow-2xl shadow-cyan-500/20 dark:shadow-cyan-400/20 ring-1 ring-cyan-500/20 dark:ring-cyan-400/20 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-cyan-500/10 before:to-blue-500/10 before:blur-xl before:-z-10";

const cardCrystal =
  "rounded-3xl border border-white/40 dark:border-white/20 bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-zinc-900/90 dark:via-zinc-900/70 dark:to-zinc-900/50 backdrop-blur-2xl text-card-foreground shadow-2xl shadow-zinc-300/40 dark:shadow-zinc-950/60 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-tr before:from-white/20 before:to-transparent before:blur-sm before:-z-10 after:absolute after:top-0 after:left-1/4 after:w-1/2 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/60 dark:after:via-white/30 after:to-transparent";

const cardHolographic =
  "rounded-3xl border border-transparent bg-gradient-to-br from-white/95 to-white/85 dark:from-zinc-950/95 dark:to-zinc-950/85 text-card-foreground shadow-2xl shadow-zinc-300/40 dark:shadow-zinc-950/60 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-pink-500/20 before:via-purple-500/20 before:via-blue-500/20 before:to-cyan-500/20 dark:before:from-pink-500/10 dark:before:via-purple-500/10 dark:before:via-blue-500/10 dark:before:to-cyan-500/10 before:blur-2xl before:-z-10 before:animate-pulse after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-conic after:from-transparent after:via-rainbow after:to-transparent after:opacity-20 dark:after:opacity-10 after:blur-sm after:-z-10";

// Enhanced hover effects with more dramatic animations
const hoverEffects = {
  default: "transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-zinc-300/60 dark:hover:shadow-zinc-900/60 hover:ring-2 hover:ring-zinc-200/50 dark:hover:ring-zinc-800/50",
  glass: "transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] hover:bg-white/90 dark:hover:bg-zinc-900/70 hover:backdrop-blur-3xl hover:border-white/50 dark:hover:border-white/30 hover:ring-2 hover:ring-white/30 dark:hover:ring-white/20",
  gradient: "transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] hover:bg-gradient-to-br hover:from-white hover:via-zinc-50/95 hover:to-zinc-100/95 dark:hover:from-zinc-900 dark:hover:via-zinc-800/95 dark:hover:to-zinc-700/95 hover:ring-2 hover:ring-zinc-300/50 dark:hover:ring-zinc-700/50",
  aurora: "transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_30px_100px_-15px_rgba(139,92,246,0.3)] dark:hover:shadow-[0_30px_100px_-15px_rgba(139,92,246,0.5)] hover:before:opacity-100 hover:after:opacity-100 hover:ring-2 hover:ring-violet-500/30 dark:hover:ring-violet-400/30",
  glossy: "transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_30px_100px_-15px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_30px_100px_-15px_rgba(0,0,0,0.8)] hover:before:opacity-100 hover:after:ring-white/50 dark:hover:after:ring-white/30 hover:ring-2 hover:ring-white/40 dark:hover:ring-white/20",
  neon: "transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_30px_100px_-15px_rgba(6,182,212,0.5)] dark:hover:shadow-[0_30px_100px_-15px_rgba(6,182,212,0.7)] hover:border-cyan-400/50 dark:hover:border-cyan-300/50 hover:ring-2 hover:ring-cyan-400/40 dark:hover:ring-cyan-300/40 hover:before:opacity-100",
  crystal: "transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_30px_100px_-15px_rgba(255,255,255,0.6)] dark:hover:shadow-[0_30px_100px_-15px_rgba(0,0,0,0.8)] hover:before:opacity-100 hover:after:opacity-100 hover:ring-2 hover:ring-white/50 dark:hover:ring-white/30",
  holographic: "transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_30px_100px_-15px_rgba(168,85,247,0.4)] dark:hover:shadow-[0_30px_100px_-15px_rgba(168,85,247,0.6)] hover:before:opacity-100 hover:after:opacity-30 dark:hover:after:opacity-20 hover:ring-2 hover:ring-purple-500/30 dark:hover:ring-purple-400/30"
};

const getCardStyles = (variant: CardVariant) => {
  switch (variant) {
    case "glass":
      return cardGlass;
    case "gradient":
      return cardGradient;
    case "aurora":
      return cardAurora;
    case "glossy":
      return cardGlossy;
    case "neon":
      return cardNeon;
    case "crystal":
      return cardCrystal;
    case "holographic":
      return cardHolographic;
    default:
      return cardBase;
  }
};

const Card = React.forwardRef<HTMLDivElement, BaseProps>(
  ({ className, variant = "default", hover = false, glow = false, animated = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        getCardStyles(variant),
        hover && hoverEffects[variant],
        glow && "ring-2 ring-primary/20 dark:ring-primary/30 shadow-lg shadow-primary/20 dark:shadow-primary/30",
        animated && "animate-pulse",
        "relative overflow-hidden group",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-3 p-8 pb-6",
        "relative after:absolute after:bottom-0 after:left-8 after:right-8 after:h-px after:bg-gradient-to-r after:from-transparent after:via-zinc-200/60 dark:after:via-zinc-700/60 after:to-transparent",
        "before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-16 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/40 before:to-transparent",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-2xl font-bold tracking-tight leading-tight",
        "bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-600 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300 bg-clip-text text-transparent",
        "drop-shadow-sm",
        "group-hover:bg-gradient-to-br group-hover:from-primary group-hover:via-primary/80 group-hover:to-primary/60 transition-all duration-500",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed",
        "group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-300",
        "font-medium tracking-wide",
        className
      )}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-8 pt-0",
        "relative",
        className
      )}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-8 pt-0",
        "relative before:absolute before:top-0 before:left-8 before:right-8 before:h-px before:bg-gradient-to-r before:from-transparent before:via-zinc-200/60 dark:before:via-zinc-700/60 before:to-transparent",
        "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/40 after:to-transparent",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };