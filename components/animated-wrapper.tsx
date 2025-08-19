'use client';

import { motion, HTMLMotionProps, Variants, ForwardRefComponent } from 'framer-motion';
import { forwardRef, ForwardedRef } from 'react';

// Define the animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Define the props type
type AnimatedWrapperProps = Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> & {
  children: React.ReactNode;
  className?: string;
};

// Create a motion component with proper typing
const MotionDiv = motion.div as ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>;

// Create a forwardRef component for AnimateInView
export const AnimateInView = forwardRef<HTMLDivElement, AnimatedWrapperProps>(({ 
  children, 
  className, 
  ...props 
}, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <MotionDiv
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -50px 0px' }}
      variants={fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </MotionDiv>
  );
});

AnimateInView.displayName = 'AnimateInView';

// Create a forwardRef component for AnimateStagger
export const AnimateStagger = forwardRef<HTMLDivElement, AnimatedWrapperProps>(({ 
  children, 
  className, 
  ...props 
}, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <MotionDiv
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -50px 0px' }}
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </MotionDiv>
  );
});

AnimateStagger.displayName = 'AnimateStagger';

// Create a forwardRef component for AnimateItem
export const AnimateItem = forwardRef<HTMLDivElement, AnimatedWrapperProps>(({ 
  children, 
  className, 
  ...props 
}, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <MotionDiv
      ref={ref}
      variants={fadeInUp}
      className={className}
      {...props}
    >
      {children}
    </MotionDiv>
  );
});

AnimateItem.displayName = 'AnimateItem';
