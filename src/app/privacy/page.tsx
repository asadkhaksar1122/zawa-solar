"use client";

import React, { useEffect, useRef, useState } from 'react';
import { UserHeader } from '@/components/user/Header';
import Link from 'next/link';
import {
    Shield,
    Lock,
    Eye,
    Database,
    Mail,
    Globe,
    Users,
    FileText,
    Sun,
    Zap,
    ChevronDown,
    Check,
    AlertCircle,
    Calendar,
    MapPin,
    Phone,
    Cookie,
    UserCheck,
    Server
} from 'lucide-react';
import { UserFooter } from '@/components/user/Footer';

const PrivacyPolicy: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('');
    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    // Intersection Observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                        if (entry.intersectionRatio > 0.5) {
                            setActiveSection(entry.target.id);
                        }
                    }
                });
            },
            { threshold: [0.1, 0.5] }
        );

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref && ref instanceof Element) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const sections = [
        { id: 'overview', title: 'Overview', icon: Shield },
        { id: 'collection', title: 'Information Collection', icon: Database },
        { id: 'usage', title: 'How We Use Information', icon: Eye },
        { id: 'sharing', title: 'Information Sharing', icon: Users },
        { id: 'security', title: 'Data Security', icon: Lock },
        { id: 'cookies', title: 'Cookies Policy', icon: Cookie },
        { id: 'rights', title: 'Your Rights', icon: UserCheck },
        { id: 'contact', title: 'Contact Us', icon: Mail },
    ];

    const scrollToSection = (sectionId: string) => {
        sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <UserHeader />
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-2/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Solar Particles Animation */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${10 + Math.random() * 20}s`
                        }}
                    >
                        <Sun className="w-2 h-2 text-primary/20" />
                    </div>
                ))}
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
                    <div className="container mx-auto px-4 py-20 md:py-32">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6 animate-bounce">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>

                            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-chart-2 bg-clip-text text-transparent animate-gradient">
                                Privacy Policy
                            </h1>

                            <p className="font-body text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in">
                                At Zawa Solar Solution, we are committed to protecting your privacy and ensuring the security of your personal information.
                            </p>

                            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground animate-slide-up">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Last Updated: January 2024
                                </span>
                                <span className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Global Coverage
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Animated Wave */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 120" className="w-full h-20">
                            <path
                                fill="currentColor"
                                className="text-background"
                                d="M0,64 C240,128 480,0 720,64 C960,128 1200,0 1440,64 L1440,120 L0,120 Z"
                                opacity="0.5"
                            >
                                <animate
                                    attributeName="d"
                                    values="M0,64 C240,128 480,0 720,64 C960,128 1200,0 1440,64 L1440,120 L0,120 Z;
                          M0,64 C240,0 480,128 720,64 C960,0 1200,128 1440,64 L1440,120 L0,120 Z;
                          M0,64 C240,128 480,0 720,64 C960,128 1200,0 1440,64 L1440,120 L0,120 Z"
                                    dur="10s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Sticky Navigation */}
                        <aside className="hidden lg:block lg:w-1/4">
                            <div className="sticky top-4 h-fit">
                                <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border shadow-xl">
                                    <h3 className="font-headline text-lg font-semibold mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        Quick Navigation
                                    </h3>
                                    <nav className="space-y-2">
                                        {sections.map((section) => {
                                            const Icon = section.icon;
                                            return (
                                                <button
                                                    key={section.id}
                                                    onClick={() => scrollToSection(section.id)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 group
                          ${activeSection === section.id
                                                            ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                                                            : 'hover:bg-primary/10 hover:scale-102'}`}
                                                >
                                                    <Icon className={`w-4 h-4 ${activeSection === section.id ? 'animate-pulse' : 'group-hover:rotate-12'}`} />
                                                    <span className="font-body text-sm">{section.title}</span>
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="lg:w-3/4 space-y-8">
                            {/* Overview Section */}
                            <section
                                id="overview"
                                ref={(el) => { sectionRefs.current.overview = el; }}
                                className={`bg-card/50 backdrop-blur-lg rounded-2xl p-8 border border-border shadow-xl transition-all duration-700 ${isVisible.overview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <Shield className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-headline text-2xl font-bold mb-4">Overview</h2>
                                        <div className="font-body text-muted-foreground space-y-4">
                                            <p>
                                                Zawa Solar Solution ("we," "our," or "us") respects your privacy and is committed to protecting your personal data.
                                                This privacy policy explains how we collect, use, and safeguard your information when you use our solar energy solutions and services.
                                            </p>
                                            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-lg">
                                                <p className="flex items-start gap-2">
                                                    <Zap className="w-5 h-5 text-primary mt-0.5" />
                                                    We believe in transparency and giving you control over your personal information while powering your sustainable future.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Information Collection */}
                            <section
                                id="collection"
                                ref={(el) => { sectionRefs.current.collection = el; }}
                                className={`bg-card/50 backdrop-blur-lg rounded-2xl p-8 border border-border shadow-xl transition-all duration-700 ${isVisible.collection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-accent/10 rounded-xl">
                                        <Database className="w-6 h-6 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-headline text-2xl font-bold mb-4">Information We Collect</h2>
                                        <div className="font-body space-y-6">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {[
                                                    { title: 'Personal Information', items: ['Name and contact details', 'Email address', 'Phone number', 'Physical address'] },
                                                    { title: 'Technical Data', items: ['Energy consumption patterns', 'Solar panel performance', 'System diagnostics', 'Usage statistics'] },
                                                    { title: 'Financial Information', items: ['Payment details', 'Billing information', 'Credit information', 'Transaction history'] },
                                                    { title: 'Location Data', items: ['Installation address', 'Service locations', 'GPS coordinates', 'Regional preferences'] }
                                                ].map((category, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-background/50 rounded-xl p-5 border border-border hover:shadow-lg transition-all duration-300 hover:scale-102"
                                                    >
                                                        <h3 className="font-headline font-semibold mb-3 text-primary">{category.title}</h3>
                                                        <ul className="space-y-2">
                                                            {category.items.map((item, i) => (
                                                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <Check className="w-4 h-4 text-chart-3" />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* How We Use Information */}
                            <section
                                id="usage"
                                ref={(el) => { sectionRefs.current.usage = el; }}
                                className={`bg-card/50 backdrop-blur-lg rounded-2xl p-8 border border-border shadow-xl transition-all duration-700 ${isVisible.usage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-chart-2/10 rounded-xl">
                                        <Eye className="w-6 h-6 text-chart-2" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-headline text-2xl font-bold mb-4">How We Use Your Information</h2>
                                        <div className="font-body space-y-4">
                                            {[
                                                { icon: Sun, text: 'To provide and maintain our solar energy services' },
                                                { icon: Users, text: 'To communicate with you about your account and services' },
                                                { icon: Zap, text: 'To optimize your solar energy system performance' },
                                                { icon: Shield, text: 'To ensure the security and integrity of our services' },
                                                { icon: Globe, text: 'To comply with legal obligations and regulations' },
                                                { icon: Mail, text: 'To send you updates about new features and offerings' }
                                            ].map((item, index) => {
                                                const Icon = item.icon;
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-4 p-4 bg-background/50 rounded-lg hover:bg-primary/5 transition-all duration-300 group"
                                                    >
                                                        <Icon className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                                                        <span className="text-muted-foreground">{item.text}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Information Sharing */}
                            <section
                                id="sharing"
                                ref={(el) => { sectionRefs.current.sharing = el; }}
                                className={`bg-card/50 backdrop-blur-lg rounded-2xl p-8 border border-border shadow-xl transition-all duration-700 ${isVisible.sharing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-chart-4/10 rounded-xl">
                                        <Users className="w-6 h-6 text-chart-4" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-headline text-2xl font-bold mb-4">Information Sharing</h2>
                                        <div className="font-body text-muted-foreground space-y-4">
                                            <p>We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:</p>
                                            <div className="space-y-3">
                                                {[
                                                    'With service providers who assist in our operations',
                                                    'With installation and maintenance partners',
                                                    'When required by law or legal proceedings',
                                                    'With your explicit consent',
                                                    'In connection with a merger or acquisition'
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Data Security */}
                            <section
                                id="security"
                                ref={(el) => { sectionRefs.current.security = el; }}
                                className={`bg-card/50 backdrop-blur-lg rounded-2xl p-8 border border-border shadow-xl transition-all duration-700 ${isVisible.security ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-destructive/10 rounded-xl">
                                        <Lock className="w-6 h-6 text-destructive" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-headline text-2xl font-bold mb-4">Data Security</h2>
                                        <div className="font-body space-y-4">
                                            <p className="text-muted-foreground">
                                                We implement industry-standard security measures to protect your personal information:
                                            </p>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                {[
                                                    { icon: Server, title: 'Encryption', desc: 'End-to-end data encryption' },
                                                    { icon: Shield, title: 'Access Control', desc: 'Strict access limitations' },
                                                    { icon: Lock, title: 'Secure Storage', desc: 'Protected data centers' }
                                                ].map((item, index) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="text-center p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border hover:shadow-lg transition-all duration-300 hover:scale-105"
                                                        >
                                                            <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                                                            <h3 className="font-headline font-semibold mb-2">{item.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Cookies Policy */}
                            <section
                                id="cookies"
                                ref={(el) => { sectionRefs.current.cookies = el; }}
                                className={`bg-card/50 backdrop-blur-lg rounded-2xl p-8 border border-border shadow-xl transition-all duration-700 ${isVisible.cookies ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-chart-5/10 rounded-xl">
                                        <Cookie className="w-6 h-6 text-chart-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-headline text-2xl font-bold mb-4">Cookies & Tracking</h2>
                                        <div className="font-body text-muted-foreground space-y-4">
                                            <p>We use cookies and similar tracking technologies to improve your experience:</p>
                                            <div className="bg-background/50 rounded-xl p-6 space-y-3">
                                                {[
                                                    { type: 'Essential', desc: 'Required for basic site functionality' },
                                                    { type: 'Analytics', desc: 'Help us understand how you use our services' },
                                                    { type: 'Preferences', desc: 'Remember your settings and preferences' },
                                                    { type: 'Marketing', desc: 'Used to deliver relevant advertisements' }
                                                ].map((cookie, index) => (
                                                    <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                                                        <div>
                                                            <span className="font-semibold text-foreground">{cookie.type}</span>
                                                            <p className="text-sm text-muted-foreground">{cookie.desc}</p>
                                                        </div>
                                                        <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                                                            Manage
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Your Rights */}
                            <section
                                id="rights"
                                ref={(el) => { sectionRefs.current.rights = el; }}
                                className={`bg-card/50 backdrop-blur-lg rounded-2xl p-8 border border-border shadow-xl transition-all duration-700 ${isVisible.rights ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-chart-3/10 rounded-xl">
                                        <UserCheck className="w-6 h-6 text-chart-3" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-headline text-2xl font-bold mb-4">Your Privacy Rights</h2>
                                        <div className="font-body space-y-4">
                                            <p className="text-muted-foreground">You have the following rights regarding your personal data:</p>
                                            <div className="grid gap-3">
                                                {[
                                                    'Access your personal information',
                                                    'Correct inaccurate data',
                                                    'Request deletion of your data',
                                                    'Object to data processing',
                                                    'Data portability',
                                                    'Withdraw consent at any time'
                                                ].map((right, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg hover:from-primary/10 transition-all duration-300"
                                                    >
                                                        <Check className="w-5 h-5 text-primary" />
                                                        <span className="text-muted-foreground">{right}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Contact Section */}
                            <section
                                id="contact"
                                ref={(el) => { sectionRefs.current.contact = el; }}
                                className={`bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-border shadow-xl transition-all duration-700 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                                        <Mail className="w-8 h-8 text-primary" />
                                    </div>
                                    <h2 className="font-headline text-2xl font-bold mb-4">Contact Us</h2>
                                    <p className="font-body text-muted-foreground mb-8">
                                        If you have any questions about this Privacy Policy or our data practices, please contact us:
                                    </p>

                                    <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                                        <div className="bg-card/50 backdrop-blur-lg rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                                            <Mail className="w-6 h-6 text-primary mx-auto mb-3" />
                                            <h3 className="font-headline font-semibold mb-2">Email</h3>
                                            <p className="text-sm text-muted-foreground">Zawasoler@gmail.com</p>
                                        </div>
                                        <div className="bg-card/50 backdrop-blur-lg rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                                            <Phone className="w-6 h-6 text-primary mx-auto mb-3" />
                                            <h3 className="font-headline font-semibold mb-2">Phone</h3>
                                            <p className="text-sm text-muted-foreground">+923449212613</p>
                                        </div>
                                        <div className="bg-card/50 backdrop-blur-lg rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                                            <MapPin className="w-6 h-6 text-primary mx-auto mb-3" />
                                            <h3 className="font-headline font-semibold mb-2">Address</h3>
                                            <p className="text-sm text-muted-foreground">Zaida Swabi KPK Pakistan</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/contact"
                                        className="mt-10 px-10 py-4 bg-primary text-white rounded-xl w-56 shadow-md border-2 border-primary font-headline font-semibold tracking-wide transition-transform duration-300 hover:scale-110 hover:shadow-lg flex items-center gap-3 mx-auto"
                                    >
                                        Get in Touch
                                        <ChevronDown className="w-5 h-5 animate-bounce" />
                                    </Link>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </div>

            <UserFooter />

            <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-gradient {
          animation: gradient 8s ease infinite;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
        </div>
    );
};

export default PrivacyPolicy;