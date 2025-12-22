import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
}

const AnimatedCard = ({ children, delay = 0, className = "", hover = true }: AnimatedCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 24,
      scale: shouldReduceMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: shouldReduceMotion ? 1000 : 260,
        damping: shouldReduceMotion ? 100 : 20,
        delay: shouldReduceMotion ? 0 : delay,
        mass: 0.8,
      },
    },
  };

  const hoverEffect = hover && !shouldReduceMotion ? {
    y: -4,
    scale: 1.01,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  } : {};

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={hoverEffect}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
