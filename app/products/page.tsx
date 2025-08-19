'use client';

import Link from 'next/link';
import { Code, Search, LayoutTemplate, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

type ServiceCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
};

const ServiceCard = ({ title, description, icon, features, slug }: ServiceCardProps & { slug: string }) => (
  <motion.div 
    variants={item}
    whileHover={{ 
      y: -8, 
      transition: { 
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1]
      } 
    }}
    className="h-full relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/10 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
    <Link href={`/products/${slug}`} className="block h-full">
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-green-500/30 shadow-lg shadow-black/50 hover:shadow-green-500/10 transition-all duration-500 h-full group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-green-500/5">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-900/80 to-emerald-900/50 rounded-xl text-green-400 group-hover:from-green-800/80 group-hover:to-emerald-800/50 transition-all duration-500 shadow-md shadow-green-500/10">
              {icon}
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {title}
            </CardTitle>
          </div>
          <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li 
                key={index} 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0 group-hover:text-green-400 transition-colors" />
                <span className="text-gray-300 group-hover:text-gray-100 transition-colors">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
          <motion.div 
            className="mt-6 text-right"
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Button 
              variant="ghost" 
              className="group relative overflow-hidden px-0 pr-1 text-green-400 hover:bg-transparent hover:text-green-300"
            >
              <span className="relative z-10 flex items-center">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-green-400/0 via-green-400/80 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

export default function ProductsPage() {
  const services = [
    {
      slug: 'fullstack',
      title: 'Full Stack Development',
      description: 'End-to-end web application development with modern technologies and best practices.',
      icon: <Code className="h-6 w-6" />,
      features: [
        'Custom web applications',
        'RESTful API development',
        'Database design & optimization',
        'Cloud deployment & DevOps',
        'Progressive Web Apps (PWA)'
      ]
    },
    {
      slug: 'wordpress',
      title: 'WordPress Solutions',
      description: 'Professional WordPress development, customization, and optimization services.',
      icon: <LayoutTemplate className="h-6 w-6" />,
      features: [
        'Custom theme development',
        'Plugin development',
        'WooCommerce integration',
        'Performance optimization',
        'Security hardening'
      ]
    },
    {
      slug: 'seo',
      title: 'SEO Management',
      description: 'Comprehensive SEO strategies to improve your online visibility and rankings.',
      icon: <Search className="h-6 w-6" />,
      features: [
        'Keyword research',
        'On-page & technical SEO',
        'Content strategy',
        'Link building',
        'Analytics & reporting'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-green-500/5 rounded-full mix-blend-soft-light filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full mix-blend-soft-light filter blur-3xl animate-float animation-delay-2000"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 via-black to-black -z-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-green-900/30 border border-green-800/50 text-green-400 text-sm font-medium mb-6 shadow-lg shadow-green-500/5">
              What We Offer
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">
              Our Products & Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We offer comprehensive digital solutions to help your business thrive in the online world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent opacity-20"></div>
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5"></div>
        </div>
        <div className="container mx-auto">
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <ServiceCard 
                key={service.slug} 
                {...service} 
                slug={service.slug}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-emerald-900/20 to-green-900/30 -z-10">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        <div className="absolute inset-0 -z-20">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <motion.div 
          className="container mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-900/30 border border-green-800/50 text-green-400 text-sm font-medium mb-6 shadow-lg shadow-green-500/5">
            Get Started
          </div>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-300 via-emerald-300 to-green-500 bg-clip-text text-transparent">
            Ready to transform your digital presence?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let's discuss how we can help you achieve your business goals with our expert services.
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg" 
              className="relative overflow-hidden group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-6 px-8 rounded-full transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-400/20 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
