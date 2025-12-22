import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
  format?: (value: number) => string;
}

const AnimatedNumber = ({ 
  value, 
  className = "", 
  duration = 1.5,
  format = (n) => Math.round(n).toLocaleString()
}: AnimatedNumberProps) => {
  const shouldReduceMotion = useReducedMotion();
  
  const spring = useSpring(0, {
    stiffness: shouldReduceMotion ? 1000 : 100,
    damping: shouldReduceMotion ? 100 : 30,
    mass: shouldReduceMotion ? 0.1 : 1,
  });
  
  const display = useTransform(spring, (current) => format(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
};

export default AnimatedNumber;
