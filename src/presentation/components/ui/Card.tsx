"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  borderTint?: "default" | "teal" | "accent" | "red" | "blue" | "green";
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, borderTint = "default", children, ...props }, ref) => {
    const baseStyles = "bg-beige-light rounded-md p-6 border transition-all shadow-[0_2px_12px_rgba(26,60,70,0.02)]";

    const borders = {
      default: "border-border-brand",
      teal: "border-green-light/30 hover:border-green-mid",
      accent: "border-gold-brand/20 hover:border-gold-brand",
      red: "border-error-brand/20 hover:border-error-brand",
      blue: "border-blue-accent/20 hover:border-blue-accent",
      green: "border-green-mid/20 hover:border-green-mid",
    };

    if (hoverEffect) {
      return (
        <motion.div
          ref={ref as any}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={twMerge(clsx(baseStyles, borders[borderTint], className))}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={twMerge(clsx(baseStyles, borders[borderTint], className))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
