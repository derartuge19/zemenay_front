"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { Home, BookOpen, Contact, Box, User, LogIn, UserPlus, Menu, X, Bell, Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import { ThemeSwitcher } from './theme-switcher';

export default function Navbar() {
  const { user, isAdmin, isAuthor, isEditor, signOut } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: <Home size={18} /> },
    { href: '/about', label: 'About Us', icon: <User size={18} /> },
    { href: '/blog', label: 'Blog', icon: <BookOpen size={18} /> },
    { href: '/products', label: 'Product', icon: <Box size={18} /> },
    { href: '/contact', label: 'Contact Us', icon: <Contact size={18} /> },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/95 backdrop-blur-md shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      {/* Animated border bottom */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-green-500/30 to-transparent animate-pulse"></div>
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group relative">
            <div className="relative h-14 w-14 transition-all duration-500 group-hover:rotate-12">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
              <div className="relative h-full w-full flex items-center justify-center">
                <Image 
                  src="/images/Zemenay Black-White.png" 
                  alt="Zemenay Tech Logo"
                  width={32}
                  height={32}
                  className="object-contain z-10"
                  priority
                />
              </div>
            </div>
            <div className="relative">
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Zemenay
                </span>
                <span className="text-xs font-medium text-emerald-300/80 tracking-widest -mt-1.5 ml-0.5">TECH</span>
              </div>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left"></div>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300"></div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.href) ? 'text-white bg-white/10' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {/* Admin Panel Button - Visible only to admin/author/editor */}
            {(isAdmin || isAuthor || isEditor) && (
              <Link 
                href="/admin"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin') ? 'text-white bg-purple-900/30' : 'text-purple-300 hover:bg-purple-900/20 hover:text-white'}`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right Side Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Switcher */}
            <ThemeSwitcher />
            
            {/* Notification Bell */}
            <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Section */}
            <div className="h-8 w-px bg-gray-700 mx-1"></div>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden lg:flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">
                    {user.email.split('@')[0]}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="border-green-400 text-green-400 hover:bg-green-900/30 hover:text-white transition-all duration-300 group"
                >
                  <span className="relative z-10">Logout</span>
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 transition-all duration-300 group-hover:w-full rounded-md"></span>
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button 
                    variant="outline"
                    className="relative overflow-hidden border-green-400 text-green-400 hover:bg-transparent hover:text-white px-6 py-2 transition-all duration-300 group"
                  >
                    <span className="relative z-10 flex items-center space-x-1.5">
                      <LogIn size={16} />
                      <span>Login</span>
                    </span>
                    <span className="absolute inset-0 w-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 transition-all duration-300 group-hover:w-full"></span>
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 transition-all duration-300 group">
                    <span className="relative z-10 flex items-center space-x-1.5">
                      <UserPlus size={16} />
                      <span>Sign Up</span>
                    </span>
                    <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-300 group-hover:w-full"></span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 shadow-2xl overflow-hidden transition-all duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-medium rounded-lg ${
                    isActive(link.href)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              
              {/* Admin Panel Link - Mobile - Only for admin/author/editor */}
              {(isAdmin || isAuthor || isEditor) && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 text-base font-medium rounded-lg text-purple-300 hover:bg-purple-900/20 hover:text-white"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="mr-3"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                  Admin Panel
                </Link>
              )}
              
              {/* Notifications in Mobile Menu */}
              <button 
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors flex items-center space-x-2"
                onClick={() => {
                  // Handle notification click
                  setIsMenuOpen(false);
                }}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {user ? (
                <div className="pt-2 mt-2 border-t border-gray-800">
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Logged in as: {user.email}
                  </div>
                  {(isAdmin || isEditor || isAuthor) && (
                    <Link 
                      href="/admin"
                      className="block px-4 py-3 text-emerald-400 hover:bg-emerald-900/20 rounded-lg transition-colors mb-2 flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" x2="9" y1="12" y2="12"/>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 mt-2 border-t border-gray-800">
                  <Link 
                    href="/login" 
                    className="px-4 py-3 text-center rounded-lg border border-green-500 text-green-400 hover:bg-green-900/30 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="px-4 py-3 text-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
