"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgoraStore } from "@/store/useAgoraStore";

interface ActionButtonsProps {
  phase: number;
}

export default function ActionButtons({ phase }: ActionButtonsProps) {
  const { user } = useAgoraStore();
  const isShow = phase >= 5;

  // Smart Navigation
  const homePath = user ? "/dashboard" : "/";

  // Stagger animation setup
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 20 } },
  };

  return (
    <div className="min-h-[140px] flex items-center justify-center mt-6">
      <AnimatePresence>
        {isShow && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4"
          >
            {/* Button 1: Primary - Retour à Agora */}
            <motion.div variants={itemVariants} className="w-full sm:w-auto">
              <Link href={homePath}>
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 10px 20px -10px var(--teal)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium rounded-xl text-[#F5FAFA] bg-teal hover:bg-teal/90 transition-colors shadow-sm focus:outline-hidden focus:ring-2 focus:ring-teal-light focus:ring-offset-2 cursor-pointer font-sans"
                >
                  Retour à Agora
                </motion.button>
              </Link>
            </motion.div>

            {/* Button 2: Secondary - Explorer les leçons */}
            <motion.div variants={itemVariants} className="w-full sm:w-auto">
              <Link href="/lessons">
                <motion.button
                  whileHover={{ y: -2, backgroundColor: "rgba(14, 124, 123, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-3.5 text-sm font-medium rounded-xl text-teal border border-teal/30 hover:border-teal bg-transparent transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-light focus:ring-offset-2 cursor-pointer font-sans"
                >
                  Explorer les leçons
                </motion.button>
              </Link>
            </motion.div>

            {/* Button 3: Ghost - Lancer MedQuest */}
            <motion.div variants={itemVariants} className="w-full sm:w-auto">
              <Link href="/medquest">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center justify-center gap-1.5 w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-teal-dark hover:text-teal transition-colors focus:outline-hidden cursor-pointer font-sans"
                >
                  <span className="relative py-0.5">
                    Lancer MedQuest
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
