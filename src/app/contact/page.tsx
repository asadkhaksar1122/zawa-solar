'use client';

import * as React from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { UserHeader } from '@/components/user/Header';
import { UserFooter } from '@/components/user/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MessageCircle, Facebook, MapPin, AlertTriangle, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useGetContactSettingsQuery } from '@/lib/redux/api/contactApi';
import { Skeleton } from '@/components/ui/skeleton';

// Floating animation component
const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Gradient orb animation
const GradientOrb = ({ className }: { className?: string }) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export default function ContactPage() {
  const { data: contactSettingsData, isLoading, error } = useGetContactSettingsQuery();
  const contactSettings = contactSettingsData?.[0];
  const [copied, setCopied] = React.useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = React.useState(true);
  const { scrollY } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      toast.success('Copied to clipboard', {
        description: value,
        icon: <Sparkles className="h-4 w-4" />
      });
      setTimeout(() => setCopied(null), 1200);
    } catch {
      toast.error('Failed to copy');
    }
  };



  // Enhanced animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
  };

  const item = {
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
  };

  const cardHover = {
    scale: 1.02,
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserHeader />
        <main className="flex-grow py-12 md:py-20 bg-gradient-to-br from-background via-muted/10 to-background">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-12" />
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[...Array(3)].map((_, i) => (
                <Card key={i} variant="aurora">
                  <CardHeader className="items-center text-center pt-6">
                    <Skeleton className="h-14 w-14 rounded-full mb-3" />
                    <Skeleton className="h-6 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent className="text-center">
                    <Skeleton className="h-4 w-3/4 mb-6 mx-auto" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-5 w-1/2 mx-auto mb-8" />
            <Skeleton className="aspect-video max-w-4xl mx-auto rounded-lg" />
          </div>
        </main>
        <UserFooter />
      </div>
    );
  }

  if (error || !contactSettings) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserHeader />
        <main className="flex-grow py-12 md:py-20 flex items-center justify-center">
          <motion.div
            className="container mx-auto px-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            </motion.div>
            <h1 className="font-headline text-3xl font-bold mb-4">Error Loading Contact Information</h1>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t load the contact details at the moment. Please try again later.
            </p>
          </motion.div>
        </main>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <GradientOrb className="w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 -top-72 -left-72" />
        <GradientOrb className="w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 -bottom-60 -right-60" />
        <GradientOrb className="w-80 h-80 bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-orange-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <GradientOrb className="w-64 h-64 bg-gradient-to-br from-violet-500/15 via-indigo-500/15 to-blue-500/15 top-1/4 right-1/4" />
        <GradientOrb className="w-48 h-48 bg-gradient-to-br from-emerald-500/15 via-green-500/15 to-lime-500/15 bottom-1/4 left-1/4" />
      </div>

      {/* Enhanced floating particles with different sizes and colors */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'w-2 h-2 bg-primary/30' :
              i % 3 === 1 ? 'w-1.5 h-1.5 bg-purple-500/25' :
                'w-1 h-1 bg-cyan-500/20'
              }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-15, 15, -15],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Mesh gradient overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-purple-500/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/5 to-transparent" />
      </div>

      <UserHeader />

      <Toaster richColors position="top-center" closeButton />

      <main className="flex-grow py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Enhanced Hero with parallax and stunning effects */}
          <motion.section
            className="text-center mb-16 md:mb-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{ opacity }}
          >
            {/* Hero background glow */}
            <div className="absolute inset-0 -z-10">
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <motion.div style={{ y: y1 }} className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-8"
              >
                <h1 className="font-headline text-6xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-none">
                  <motion.span
                    className="inline-block bg-gradient-to-br from-foreground via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: "300% 300%",
                    }}
                  >
                    Get in Touch
                  </motion.span>
                </h1>

                {/* Decorative elements */}
                <motion.div
                  className="flex justify-center items-center gap-4 mb-6"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <motion.div
                    className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ scaleX: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/50"
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 20px rgba(var(--primary), 0.5)",
                        "0 0 40px rgba(var(--primary), 0.8)",
                        "0 0 20px rgba(var(--primary), 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ scaleX: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div style={{ y: y2 }} className="relative">
              <motion.p
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                We&apos;re here to help you succeed. Reach out through any of the methods below, or visit us at our office.
              </motion.p>

              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <motion.div
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    ✨ Let&apos;s connect and create something amazing together
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Contact methods with enhanced animations */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {contactSettings.whatsappNumbers?.length > 0 && (
              <motion.div variants={item} whileHover={cardHover}>
                <FloatingElement delay={0}>
                  <Card variant="crystal" hover glow className="group h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 to-emerald-600/15 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 opacity-60" />
                    <CardHeader className="items-center text-center pt-8">
                      <motion.div
                        className="relative p-5 rounded-3xl inline-block mb-4 shadow-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white ring-4 ring-green-500/20"
                        whileHover={{
                          rotate: 360,
                          scale: 1.15,
                          boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.5)"
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <MessageCircle className="h-9 w-9" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent" />
                      </motion.div>
                      <CardTitle className="font-headline text-2xl">WhatsApp</CardTitle>
                      <CardDescription className="text-base">Chat with us directly</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2 mb-6">
                        {contactSettings.whatsappNumbers.map((wa: any, index: number) => (
                          <motion.div
                            key={wa._id}
                            className="flex gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button
                              asChild
                              size="lg"
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                              <Link
                                href={`https://wa.me/${wa.value.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Chat on {wa.value}
                                <ExternalLink className="ml-2 h-3.5 w-3.5 opacity-70" />
                              </Link>
                            </Button>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-2 hover:border-emerald-500 transition-colors"
                                aria-label={`Copy ${wa.value}`}
                                onClick={() => handleCopy(wa.value)}
                              >
                                <motion.div
                                  animate={copied === wa.value ? { rotate: 360 } : {}}
                                  transition={{ duration: 0.5 }}
                                >
                                  {copied === wa.value ? (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </motion.div>
                              </Button>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.p
                        className="text-muted-foreground text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Typically replies within minutes.
                      </motion.p>
                    </CardContent>
                  </Card>
                </FloatingElement>
              </motion.div>
            )}

            {contactSettings.emailAddresses?.length > 0 && (
              <motion.div variants={item} whileHover={cardHover}>
                <FloatingElement delay={0.2}>
                  <Card variant="holographic" hover glow className="group h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-indigo-600/15 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 opacity-60" />
                    <CardHeader className="items-center text-center pt-8">
                      <motion.div
                        className="relative p-5 rounded-3xl inline-block mb-4 shadow-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 text-white ring-4 ring-blue-500/20"
                        whileHover={{
                          rotate: 360,
                          scale: 1.15,
                          boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)"
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <Mail className="h-9 w-9" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent" />
                      </motion.div>
                      <CardTitle className="font-headline text-2xl">Email Us</CardTitle>
                      <CardDescription className="text-base">Send us an email</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2 mb-6">
                        {contactSettings.emailAddresses.map((email: any, index: number) => (
                          <motion.div
                            key={email._id}
                            className="flex gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button
                              asChild
                              size="lg"
                              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                              <Link href={`mailto:${email.value}`}>
                                <Mail className="mr-2 h-4 w-4" />
                                Email {email.value}
                              </Link>
                            </Button>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-2 hover:border-blue-500 transition-colors"
                                aria-label={`Copy ${email.value}`}
                                onClick={() => handleCopy(email.value)}
                              >
                                <motion.div
                                  animate={copied === email.value ? { rotate: 360 } : {}}
                                  transition={{ duration: 0.5 }}
                                >
                                  {copied === email.value ? (
                                    <Check className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </motion.div>
                              </Button>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.p
                        className="text-muted-foreground text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        We aim to respond within 24 hours.
                      </motion.p>
                    </CardContent>
                  </Card>
                </FloatingElement>
              </motion.div>
            )}

            {contactSettings.phoneNumbers?.length > 0 && (
              <motion.div variants={item} whileHover={cardHover}>
                <FloatingElement delay={0.4}>
                  <Card variant="neon" hover glow className="group h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-purple-600/15 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-60" />
                    <CardHeader className="items-center text-center pt-8">
                      <motion.div
                        className="relative p-5 rounded-3xl inline-block mb-4 shadow-2xl bg-gradient-to-br from-primary via-purple-500 to-primary text-white ring-4 ring-primary/20"
                        whileHover={{
                          rotate: 360,
                          scale: 1.15,
                          boxShadow: "0 25px 50px -12px rgba(var(--primary), 0.5)"
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <Phone className="h-9 w-9" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent" />
                      </motion.div>
                      <CardTitle className="font-headline text-2xl">Call Us</CardTitle>
                      <CardDescription className="text-base">Speak to our team</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2 mb-6">
                        {contactSettings.phoneNumbers.map((phone: any, index: number) => (
                          <motion.div
                            key={phone._id}
                            className="flex gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Button asChild size="lg" className="flex-1 shadow-lg hover:shadow-xl transition-all">
                              <Link href={`tel:${phone.value}`}>
                                <Phone className="mr-2 h-4 w-4" />
                                Call {phone.value}
                              </Link>
                            </Button>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-2 hover:border-primary transition-colors"
                                aria-label={`Copy ${phone.value}`}
                                onClick={() => handleCopy(phone.value)}
                              >
                                <motion.div
                                  animate={copied === phone.value ? { rotate: 360 } : {}}
                                  transition={{ duration: 0.5 }}
                                >
                                  {copied === phone.value ? (
                                    <Check className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </motion.div>
                              </Button>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.p
                        className="text-muted-foreground text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Mon–Fri, 9am – 5pm.
                      </motion.p>
                    </CardContent>
                  </Card>
                </FloatingElement>
              </motion.div>
            )}
          </motion.div>

          {/* Social and Office */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-12 md:mb-16"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {contactSettings.facebookUrl && (
              <motion.div variants={item} whileHover={cardHover}>
                <Card variant="aurora" hover className="group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="items-center text-center pt-6">
                    <motion.div
                      className="p-4 rounded-2xl inline-block mb-3 shadow-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Facebook className="h-8 w-8" />
                    </motion.div>
                    <CardTitle className="font-headline text-xl">Facebook</CardTitle>
                    <CardDescription>Follow us on Facebook</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <Link href={contactSettings.facebookUrl} target="_blank" rel="noopener noreferrer">
                        Visit our Page <ExternalLink className="ml-2 h-4 w-4 opacity-80" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {contactSettings.officeAddress && (
              <motion.div variants={item} whileHover={cardHover}>
                <Card variant="aurora" hover className="group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="items-center text-center pt-6">
                    <motion.div
                      className="p-4 rounded-2xl inline-block mb-3 shadow-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <MapPin className="h-8 w-8" />
                    </motion.div>
                    <CardTitle className="font-headline text-xl">Our Office</CardTitle>
                    <CardDescription>Find us at our location</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <address className="text-muted-foreground mb-4 not-italic">
                      {contactSettings.officeAddress}
                    </address>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full border-2 hover:border-orange-500 transition-colors"
                    >
                      <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          contactSettings.officeAddress
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Directions <ExternalLink className="ml-2 h-4 w-4 opacity-80" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Map section with beautiful styling and marker */}
          <motion.section
            className="text-center relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Section background glow */}
            <div className="absolute inset-0 -z-10">
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <motion.h2
              className="font-headline text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-br from-foreground via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Visit Our Office Location
              </span>
            </motion.h2>

            <motion.address
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 not-italic font-medium leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              📍 {contactSettings.officeAddress || 'Address not available.'}
            </motion.address>

            <motion.div
              className="aspect-video max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30 dark:border-white/20 relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Enhanced overlay effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />

              {/* Decorative corner elements */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/50 rounded-tl-lg z-20 pointer-events-none" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/50 rounded-tr-lg z-20 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/50 rounded-bl-lg z-20 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/50 rounded-br-lg z-20 pointer-events-none" />

              {/* Custom marker overlay */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    y: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg shadow-red-500/50 flex items-center justify-center text-white text-xl font-bold ring-4 ring-white/80">
                    📍
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-4 bg-gradient-to-b from-red-600 to-transparent" />

                  {/* Pulsing ring effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-500/50"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                </motion.div>
              </motion.div>

              {contactSettings?.officeAddress ? (
                <>
                  {/* Simple map display with address search */}
                  <div className="w-full h-full relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-zinc-800 dark:to-zinc-900">
                    {/* Loading indicator */}
                    {!mapLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center z-10">
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
                          />
                          <p className="text-muted-foreground font-medium">Loading map...</p>
                        </div>
                      </div>
                    )}

                    {/* Simple embedded map that works reliably */}
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(contactSettings.officeAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      className="w-full h-full border-0"
                      loading="lazy"
                      aria-label="Office location map"
                      title="Office Location Map"
                      onLoad={() => setMapLoaded(true)}
                      onError={() => setMapLoaded(false)}
                    />

                    {/* Open in external map button */}
                    <div className="absolute top-4 right-4 z-20">
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-lg"
                      >
                        <Link
                          href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(contactSettings.officeAddress)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open Map
                        </Link>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                  <div className="text-center">
                    {contactSettings?.officeAddress ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <p className="text-muted-foreground font-medium">Loading location...</p>
                        <p className="text-sm text-muted-foreground/70">Finding coordinates for your address</p>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No address available</p>
                        <p className="text-sm text-muted-foreground/70">Please configure the office address</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Additional location info */}
            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              {contactSettings?.officeAddress && (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contactSettings.officeAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Get Directions
                      <ExternalLink className="ml-2 h-4 w-4 opacity-80" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 hover:border-blue-500 transition-colors"
                    onClick={() => handleCopy(contactSettings.officeAddress || '')}
                  >
                    <motion.div
                      animate={copied === contactSettings.officeAddress ? { rotate: 360 } : {}}
                      transition={{ duration: 0.5 }}
                      className="mr-2"
                    >
                      {copied === contactSettings.officeAddress ? (
                        <Check className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </motion.div>
                    Copy Address
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 hover:border-green-500 transition-colors"
                  >
                    <Link
                      href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(contactSettings.officeAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      View on OpenStreetMap
                      <ExternalLink className="ml-2 h-4 w-4 opacity-80" />
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.section>
        </div>
      </main>

      <UserFooter />
    </div>
  );
}