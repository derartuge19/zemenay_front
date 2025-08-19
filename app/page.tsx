'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/5 rounded-full mix-blend-soft-light filter blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full mix-blend-soft-light filter blur-3xl"></div>
      </div>
      
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center pt-24"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-8 relative">
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full animate-pulse opacity-20"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Image 
                src="/images/Zemenay Black-White.png" 
                alt="Zemenay Tech"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>
          <motion.div 
            className="relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-transparent mb-6 bg-300% animate-gradient">
              Welcome to Zemenay <span className="text-white">Tech</span>
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-green-500/0 via-green-400 to-emerald-500/0 rounded-full"></div>
          </motion.div>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Empowering businesses with cutting-edge web solutions. 
            We create beautiful, functional, and high-performance applications.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-5 mt-2"
          variants={item}
        >
          <Link 
            href="/products"
            className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Our Work
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 transition-all duration-500 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/about"
            className="group relative px-8 py-4 bg-transparent border-2 border-emerald-500/30 text-white rounded-xl font-medium overflow-hidden transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <span className="relative z-10">
              Learn More About Us
            </span>
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent transition-all duration-500 group-hover:w-full"></span>
          </Link>
        </motion.div>

        <motion.div 
          className="mt-24 text-gray-400 text-sm relative"
          variants={item}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent"></div>
          <div className="flex flex-col items-center">
            <p className="mb-3 text-emerald-300/80 text-xs font-medium tracking-widest">SCROLL TO EXPLORE</p>
            <motion.div
              className="w-10 h-16 rounded-full border-2 border-emerald-400/30 flex items-start justify-center p-2"
              animate={{ 
                y: [0, 10, 0],
                borderColor: ["rgba(52, 211, 153, 0.3)", "rgba(16, 185, 129, 0.6)", "rgba(52, 211, 153, 0.3)"]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2.5,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="w-1 h-3 rounded-full bg-emerald-400"
                animate={{ 
                  y: [0, 8, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
