// Shared motion variants for consistent, wellness-appropriate animations

// Hook to detect reduced motion preference
export const useReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Gentle entrance animations suitable for mental wellness
export const gentleEntranceVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

export const cardEntranceVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -15, 
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export const pageTransitionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export const heroTextVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Gentle hover animations - reduced motion friendly
export const createHoverVariants = (reduceMotion = false) => ({
  whileHover: reduceMotion ? {} : { 
    scale: 1.02, 
    y: -1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  },
  whileTap: reduceMotion ? {} : { 
    scale: 0.98,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25 
    }
  }
});

export const createButtonVariants = (reduceMotion = false) => ({
  whileHover: reduceMotion ? {} : { 
    scale: 1.05, 
    y: -2,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 17 
    }
  },
  whileTap: reduceMotion ? {} : { 
    scale: 0.95,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25 
    }
  }
});

// Staggered children animations
export const staggeredContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggeredChildVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Message animations for chat interface
export const messageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      bounce: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Typing indicator animation (finite, gentle)
export const typingDotVariants = {
  initial: { scale: 0.8, opacity: 0.3 },
  animate: {
    scale: 1,
    opacity: 0.7,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};