'use client';

import { motion } from 'framer-motion';
import { Code2, Zap, Shield, Headphones, ArrowRight, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stats = [
  { id: 1, name: 'Projects Completed', value: '100+', icon: Code2 },
  { id: 2, name: 'Satisfied Clients', value: '50+', icon: Users },
  { id: 3, name: 'Years Experience', value: '5+', icon: Award },
];

const whyChooseUs = [
  {
    title: 'Expert Team',
    description: 'Our team consists of industry experts with years of experience in their respective fields, delivering exceptional results with cutting-edge technologies.',
    icon: Zap,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Quality Assurance',
    description: 'We implement rigorous testing and quality control measures to ensure every project meets the highest standards of excellence and reliability.',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to address your concerns and ensure your complete satisfaction.',
    icon: Headphones,
    color: 'from-purple-500 to-indigo-500'
  }
];

const features = [
  'Custom Software Development',
  'Web & Mobile Applications',
  'UI/UX Design',
  'Cloud Solutions',
  'E-commerce Solutions',
  'Maintenance & Support'
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/5 rounded-full mix-blend-soft-light filter blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full mix-blend-soft-light filter blur-3xl"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-black to-black z-0"></div>
        <div className="container mx-auto relative z-10 px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
              About Zemenay Tech
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              We are a passionate team of developers, designers, and innovators dedicated to creating exceptional digital experiences that drive business growth and success.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  className="text-center px-6 py-4 bg-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * stat.id }}
                >
                  <stat.icon className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Why Choose <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Zemenay Tech</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We combine innovation, expertise, and dedication to deliver outstanding results for our clients.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)' }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Expertise</h3>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {features.map((feature, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-gray-800/50 text-sm font-medium text-gray-300 rounded-full border border-gray-700 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <Link href="/contact">
                <Button className="group mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5">
                  Get in Touch
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
