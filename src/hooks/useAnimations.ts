import { useReducedMotion } from "framer-motion";

export const useAnimations = () => {
  const shouldReduceMotion = useReducedMotion();

  // Spring animation configs
  const springConfig = {
    type: "spring" as const,
    stiffness: shouldReduceMotion ? 1000 : 260,
    damping: shouldReduceMotion ? 100 : 20,
    mass: 0.8,
  };

  const bounceConfig = {
    type: "spring" as const,
    stiffness: shouldReduceMotion ? 1000 : 400,
    damping: shouldReduceMotion ? 100 : 17,
  };

  const smoothConfig = {
    type: "spring" as const,
    stiffness: shouldReduceMotion ? 1000 : 300,
    damping: shouldReduceMotion ? 100 : 25,
    mass: 0.6,
  };

  const snappyConfig = {
    type: "spring" as const,
    stiffness: shouldReduceMotion ? 1000 : 500,
    damping: shouldReduceMotion ? 100 : 30,
    mass: 0.5,
  };

  // Common variants
  const fadeIn = {
    initial: { opacity: shouldReduceMotion ? 1 : 0 },
    animate: { 
      opacity: 1,
      transition: shouldReduceMotion ? { duration: 0 } : smoothConfig,
    },
    exit: { 
      opacity: shouldReduceMotion ? 1 : 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
  };

  const slideUp = {
    initial: { 
      opacity: shouldReduceMotion ? 1 : 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : springConfig,
    },
    exit: { 
      opacity: shouldReduceMotion ? 1 : 0, 
      y: shouldReduceMotion ? 0 : -20,
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
  };

  const slideRight = {
    initial: { 
      opacity: shouldReduceMotion ? 1 : 0, 
      x: shouldReduceMotion ? 0 : -20 
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: shouldReduceMotion ? { duration: 0 } : springConfig,
    },
    exit: { 
      opacity: shouldReduceMotion ? 1 : 0, 
      x: shouldReduceMotion ? 0 : 20,
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
  };

  const scaleIn = {
    initial: { 
      scale: shouldReduceMotion ? 1 : 0.95, 
      opacity: shouldReduceMotion ? 1 : 0 
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: shouldReduceMotion ? { duration: 0 } : springConfig,
    },
    exit: { 
      scale: shouldReduceMotion ? 1 : 0.95, 
      opacity: shouldReduceMotion ? 1 : 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
  };

  const popIn = {
    initial: { 
      scale: shouldReduceMotion ? 1 : 0.8, 
      opacity: shouldReduceMotion ? 1 : 0 
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: shouldReduceMotion ? { duration: 0 } : bounceConfig,
    },
    exit: { 
      scale: shouldReduceMotion ? 1 : 0.8, 
      opacity: shouldReduceMotion ? 1 : 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.2 },
    },
  };

  // Hover states
  const hoverScale = {
    scale: shouldReduceMotion ? 1 : 1.02,
    transition: snappyConfig,
  };

  const hoverLift = {
    y: shouldReduceMotion ? 0 : -4,
    transition: springConfig,
  };

  const hoverGlow = {
    boxShadow: shouldReduceMotion 
      ? "0 0 0 rgba(0, 0, 0, 0)" 
      : "0 8px 30px rgba(0, 0, 0, 0.12)",
    transition: { duration: 0.3 },
  };

  // Tap states
  const tapScale = {
    scale: shouldReduceMotion ? 1 : 0.98,
  };

  const tapShrink = {
    scale: shouldReduceMotion ? 1 : 0.95,
  };

  // Stagger configurations
  const staggerFast = {
    delayChildren: shouldReduceMotion ? 0 : 0,
    staggerChildren: shouldReduceMotion ? 0 : 0.05,
  };

  const staggerNormal = {
    delayChildren: shouldReduceMotion ? 0 : 0.1,
    staggerChildren: shouldReduceMotion ? 0 : 0.1,
  };

  const staggerSlow = {
    delayChildren: shouldReduceMotion ? 0 : 0.2,
    staggerChildren: shouldReduceMotion ? 0 : 0.15,
  };

  return {
    shouldReduceMotion,
    springConfig,
    bounceConfig,
    smoothConfig,
    snappyConfig,
    variants: {
      fadeIn,
      slideUp,
      slideRight,
      scaleIn,
      popIn,
    },
    hover: {
      scale: hoverScale,
      lift: hoverLift,
      glow: hoverGlow,
    },
    tap: {
      scale: tapScale,
      shrink: tapShrink,
    },
    stagger: {
      fast: staggerFast,
      normal: staggerNormal,
      slow: staggerSlow,
    },
  };
};
