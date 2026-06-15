"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-sans font-medium rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-mid focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
    
    const variants = {
      primary: "bg-green-mid text-white hover:bg-green-dark shadow-sm border border-transparent",
      secondary: "bg-blue-light text-blue-dark hover:bg-blue-accent hover:text-white border border-transparent",
      outline: "border border-border-brand text-text-dark bg-transparent hover:bg-beige-light hover:border-green-mid",
      ghost: "text-text-mid hover:text-green-mid hover:bg-beige-light",
      danger: "bg-error-brand text-white hover:bg-red-800",
      accent: "bg-gold-brand text-white hover:bg-amber-700 shadow-sm border border-transparent",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg",
    };

    return (
      <motion.button
        ref={ref as any}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.15 }}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
