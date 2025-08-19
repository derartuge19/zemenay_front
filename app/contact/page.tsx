'use client';

import { MapPin, Mail, Phone, Clock, Send, MessageSquare, PhoneCall } from 'lucide-react';
import ContactForm from './contact-form';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-black/80 z-0"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions or want to get in touch? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-900/50 p-8 rounded-xl border border-green-900/30">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-green-900/50 rounded-lg text-green-400">
                  <Send className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Send us a message</h2>
              </div>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-gray-900/50 p-8 rounded-xl border border-green-900/30">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-900/30 rounded-lg text-green-400 mt-1">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Our Office</h3>
                      <p className="text-gray-400 mt-1">
                        Bole Road, Mega Building<br />
                        Addis Ababa, Ethiopia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-900/30 rounded-lg text-green-400 mt-1">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Email Us</h3>
                      <p className="text-gray-400 mt-1">
                        info@zemenay.com<br />
                        support@zemenay.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-900/30 rounded-lg text-green-400 mt-1">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Call Us</h3>
                      <p className="text-gray-400 mt-1">
                        +251 911 123 456<br />
                        +251 911 789 012
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-900/30 rounded-lg text-green-400 mt-1">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Working Hours</h3>
                      <p className="text-gray-400 mt-1">
                        Monday - Friday: 9:00 - 17:00<br />
                        Saturday: 10:00 - 14:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-8 rounded-xl border border-green-900/50">
                <h3 className="text-xl font-bold mb-4">Need help right away?</h3>
                <p className="text-gray-300 mb-6">
                  Our support team is here to help you with any questions or issues you might have.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="mailto:support@zemenay.com" 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Chat with us
                  </a>
                  <a 
                    href="tel:+251911123456" 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-green-500 text-green-400 hover:bg-green-900/30 rounded-lg transition-colors"
                  >
                    <PhoneCall className="h-5 w-5" />
                    Call Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="container mx-auto">
          <div className="bg-gray-900/50 p-8 rounded-xl border border-green-900/30">
            <h2 className="text-2xl font-bold mb-6">Find Us on Map</h2>
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/30 flex items-center justify-center text-green-400">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium mb-2">Our Location</h3>
                <p className="text-gray-400 mb-4">Bole Road, Addis Ababa, Ethiopia</p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-400 hover:text-green-300"
                >
                  View on Google Maps
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
