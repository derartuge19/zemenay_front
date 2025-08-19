import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 relative">
                <Image 
                  src="/images/Zemenay Black-White.png" 
                  alt="Zemenay Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold">
                Zemenay
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-green-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-green-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-green-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Connect</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <a 
                  href="https://facebook.com/Zemenay_Tech_Solutions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 mr-2" />
                  Zemenay Tech Solutions
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <a 
                  href="mailto:zemenaytechsolutions@gmail.com" 
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  zemenaytechsolutions@gmail.com
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Zemenay Tech Solutions</p>
              <a 
                href="mailto:zemenaytechsolutions@gmail.com" 
                className="text-green-400 hover:underline inline-flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                zemenaytechsolutions@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p> 2025 Zemenay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
