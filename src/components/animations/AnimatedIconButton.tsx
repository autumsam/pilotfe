import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface AnimatedIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const AnimatedIconButton = ({ 
  children, 
  className = "", 
  ...props 
}: AnimatedIconButtonProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={shouldReduceMotion ? {} : { 
        scale: 1.1,
        rotate: 5,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10,
        }
      }}
      whileTap={shouldReduceMotion ? {} : { 
        scale: 0.95,
        rotate: 0,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedIconButton;
