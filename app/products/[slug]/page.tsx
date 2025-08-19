import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

type Product = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  icon: React.ReactNode;
  image: string;
  benefits: string[];
  cta: string;
};

const products: Record<string, Product> = {
  'fullstack': {
    slug: 'fullstack',
    title: 'Full Stack Development',
    description: 'End-to-end web application development with modern technologies and best practices.',
    longDescription: 'Our Full Stack Development service provides comprehensive solutions for building robust, scalable, and high-performance web applications. We handle everything from frontend to backend, ensuring seamless integration and optimal performance across all devices and platforms.',
    features: [
      'Custom web applications',
      'RESTful API development',
      'Database design & optimization',
      'Cloud deployment & DevOps',
      'Progressive Web Apps (PWA)'
    ],
    benefits: [
      'Faster time to market with our agile development approach',
      'Scalable architecture that grows with your business',
      'Cross-platform compatibility',
      'Ongoing support and maintenance',
      'Performance optimization for better user experience'
    ],
    icon: '💻',
    image: '/fullstack.jpg',
    cta: 'Start Your Project'
  },
  'wordpress': {
    slug: 'wordpress',
    title: 'WordPress Solutions',
    description: 'Professional WordPress development, customization, and optimization services.',
    longDescription: 'Transform your WordPress site into a powerful business tool with our expert development services. We create custom themes, plugins, and optimize your site for performance, security, and search engines.',
    features: [
      'Custom theme development',
      'Plugin development',
      'WooCommerce integration',
      'Performance optimization',
      'Security hardening'
    ],
    benefits: [
      'Custom design that matches your brand',
      'Improved site performance and speed',
      'Enhanced security measures',
      'Mobile-responsive design',
      'SEO-friendly structure'
    ],
    icon: '🖥️',
    image: '/wordpress.jpg',
    cta: 'Get WordPress Help'
  },
  'seo': {
    slug: 'seo',
    title: 'SEO Management',
    description: 'Comprehensive SEO strategies to improve your online visibility and rankings.',
    longDescription: 'Our SEO Management service is designed to increase your website\'s visibility in search engine results. We use white-hat SEO techniques to drive targeted traffic, improve rankings, and boost your online presence.',
    features: [
      'Keyword research',
      'On-page & technical SEO',
      'Content strategy',
      'Link building',
      'Analytics & reporting'
    ],
    benefits: [
      'Higher search engine rankings',
      'Increased organic traffic',
      'Better user experience',
      'Detailed performance reports',
      'Competitive advantage in your industry'
    ],
    icon: '🔍',
    image: '/seo.jpg',
    cta: 'Boost My SEO'
  }
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products[params.slug];

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/products" className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                {product.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8">{product.longDescription}</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 rounded-lg transition-colors">
                {product.cta}
              </Button>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-black/50 rounded-2xl p-8 border border-green-800/50">
              <div className="text-6xl mb-6">{product.icon}</div>
              <h2 className="text-2xl font-semibold mb-4">Key Benefits</h2>
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
          <div className="grid gap-6">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-start p-6 bg-gray-800/50 rounded-xl">
                <div className="bg-green-900/50 p-2 rounded-lg mr-4 text-green-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                  <p className="text-gray-400">
                    Comprehensive {feature.toLowerCase()} services tailored to your specific needs and goals.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started with {product.title}?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact us today to discuss how we can help you achieve your goals with our {product.title.toLowerCase()} services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6 rounded-lg transition-colors">
              {product.cta}
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6 rounded-lg border-green-400 text-green-400 hover:bg-green-900/30">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
