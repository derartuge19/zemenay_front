'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Code, ExternalLink, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Project = {
  id: string;
  title: string;
  type: 'ecommerce' | 'saas' | 'content';
  description: string;
  image: string;
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
};

const projects: Project[] = [
  {
    id: 'content',
    title: 'Content Management System',
    type: 'content',
    description: 'A robust content management system for creating, managing, and publishing digital content with ease.',
    image: '/images/content.webp',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Sanity.io', 'Vercel'],
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Platform',
    type: 'ecommerce',
    description: 'A complete e-commerce solution with product management, cart, and secure checkout process.',
    image: '/images/e_commerce.avif',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 'saas',
    title: 'SaaS Application',
    type: 'saas',
    description: 'A scalable software-as-a-service platform with subscription management and analytics.',
    image: '/images/sass.avif',
    techStack: ['TypeScript', 'Next.js', 'PostgreSQL', 'GraphQL', 'Docker'],
    demoUrl: '#',
    githubUrl: '#'
  }
];

const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-all duration-300 cursor-pointer h-full flex flex-col"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
          <span 
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              project.type === 'ecommerce' ? 'bg-green-900/50 text-green-400' : 
              project.type === 'saas' ? 'bg-blue-900/50 text-blue-400' :
              'bg-purple-900/50 text-purple-400'
            }`}
          >
            {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-4 flex-1">{project.description}</p>
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-gray-800 text-xs rounded text-gray-300">
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-1 bg-gray-800 text-xs rounded text-gray-500">
                +{project.techStack.length - 3} more
              </span>
            )}
          </div>
          <button 
            className="text-green-400 text-sm font-medium hover:text-green-300 transition-colors flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            View details
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800" onClick={e => e.stopPropagation()}>
        <div className="relative h-64 md:h-80">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover rounded-t-xl"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full mb-3" 
                    style={{ backgroundColor: project.type === 'ecommerce' ? '#10B981' : '#3B82F6' }}>
                {project.type === 'ecommerce' ? 'E-Commerce' : 'SaaS'}
              </span>
              <h2 className="text-2xl font-bold text-white">{project.title}</h2>
            </div>
            <div className="flex space-x-2">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {project.demoUrl && (
                <a 
                  href={project.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          
          <p className="text-gray-300 mb-6">{project.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Code className="w-5 h-5 mr-2 text-green-400" />
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span key={index} className="px-3 py-1 bg-gray-800 text-sm rounded-full text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {project.demoUrl && (
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
                onClick={e => e.stopPropagation()}
              >
                View Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
                onClick={e => e.stopPropagation()}
              >
                View on GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FullstackPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const ecommerceProjects = projects.filter(p => p.type === 'ecommerce');
  const saasProjects = projects.filter(p => p.type === 'saas');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Full Stack Development
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our expertise through these showcase projects built with cutting-edge technologies.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
