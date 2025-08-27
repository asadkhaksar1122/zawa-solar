'use client';

import { Logo } from '@/components/shared/Logo';
import Link from 'next/link';
import { useState } from 'react';
import { useSubscribeMutation } from '@/lib/redux/api/subscriptionApi';
import { useSiteBranding } from '@/contexts/SettingsContext';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Sun,
  Zap,
  Shield,
  Heart,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function UserFooter() {
  const currentYear = new Date().getFullYear();
  const { siteName, siteDescription } = useSiteBranding();
  
  // Subscription state
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Redux Toolkit Query mutation hook
  const [subscribe, { isLoading }] = useSubscribeMutation();

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle subscription form submission
  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    
    // Validation
    if (!trimmedEmail) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setMessage('');
    setMessageType('');

    try {
      const result = await subscribe({ email: trimmedEmail }).unwrap();
      
      if (result.success) {
        setMessage(result.message);
        setMessageType('success');
        setEmail(''); // Clear the form
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error: any) {
      // Handle RTK Query error with better error messages
      let errorMessage = 'Something went wrong. Please try again later.';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === 400) {
        errorMessage = 'Invalid email address or email already subscribed.';
      } else if (error?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.status === 'FETCH_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  // Handle input change with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error message when user starts typing
    if (message && messageType === 'error') {
      setMessage('');
      setMessageType('');
    }
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  const quickLinks = [
    { label: 'Solution', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Terms and Services', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ];

  const features = [
    { icon: Sun, text: 'Clean Energy' },
    { icon: Zap, text: 'High Efficiency' },
    { icon: Shield, text: '25 Year Warranty' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-background via-muted/30 to-muted/50 border-t border-border/40">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Features Bar */}
        <div className="border-b border-border/30 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between items-center gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-12">
            {/* Company Info */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-300" />
                  <Logo iconSize={24} textSize="text-xl sm:text-2xl" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
                {siteDescription}
              </p>
              {/* Social Links */}
              <div className="flex gap-2 sm:gap-3 pt-2">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="group relative p-1.5 sm:p-2 bg-muted/50 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                  >
                    <social.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-lg transition-all duration-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2">
                <div className="h-6 sm:h-8 w-1 bg-primary rounded-full" />
                Quick Links
              </h3>
              <ul className="space-y-2 sm:space-y-2.5">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-flex transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2">
                <div className="h-6 sm:h-8 w-1 bg-primary rounded-full" />
                Contact Us
              </h3>
              <ul className="space-y-2.5 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground group">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  <span className="hover:text-primary transition-colors cursor-pointer break-all">
                    zawasoler@gmail.com
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground group">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    +923449212613
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground group">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  <span>
                    Zaida Swabi KPK Pakistan
                  </span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
              <h3 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2">
                <div className="h-6 sm:h-8 w-1 bg-primary rounded-full" />
                Stay Updated
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Subscribe to get the latest news and updates about solar energy.
              </p>
              <form onSubmit={handleSubscription} className="space-y-2 max-w-full sm:max-w-xs lg:max-w-full">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
                
                {/* Success/Error Message */}
                {message && (
                  <div className={`flex items-center gap-2 p-2 rounded-lg text-xs sm:text-sm ${
                    messageType === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {messageType === 'success' ? (
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm">{message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 py-4 sm:py-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Copyright and Built with Love */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                <span>Built with</span>
                <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500 fill-red-500 animate-pulse" />
                <span className="text-center sm:text-left">by Zawa Solar Energy Solutions</span>
              </div>

              <span className="text-xs sm:text-sm text-muted-foreground order-1 sm:order-2">
                © {currentYear} All rights reserved
              </span>
            </div>

            {/* Links - Separate row on mobile */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 text-xs sm:text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-primary after:transition-all"
              >
                Privacy Policy
              </Link>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-primary after:transition-all"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </footer>
  );
}