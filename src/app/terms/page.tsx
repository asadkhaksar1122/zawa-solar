'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollText,
    Scale,
    ShieldCheck,
    FileCheck,
    Gavel,
    UserX,
    CreditCard,
    AlertTriangle,
    RefreshCw,
    Globe2,
    Sparkles,
    BookOpen,
    CheckCircle2,
    XCircle,
    Info,
    Zap,
    Sun,
    Battery,
    Wrench,
    Calendar,
    Clock,
    ArrowRight,
    ChevronRight,
    Layers,
    Award,
    Ban,
    Link,
    MessageSquare,
    HelpCircle,
    Circle
} from 'lucide-react';
import { UserHeader } from '@/components/user/Header';
import { UserFooter } from '@/components/user/Footer';

const TermsOfService = () => {
    const [acceptedSections, setAcceptedSections] = useState<Set<string>>(new Set());
    const [activeSection, setActiveSection] = useState<string>('');
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Add new state for sidebar positioning
    const [sidebarFixed, setSidebarFixed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState<number>(0);
    const [sidebarLeft, setSidebarLeft] = useState<number>(0);
    const heroRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const sidebarContainerRef = useRef<HTMLDivElement>(null);

    // Scroll progress indicator and sidebar fixing
    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress = (window.scrollY / totalScroll) * 100;
            setScrollProgress(currentProgress);

            // Check if hero section has been scrolled past
            if (heroRef.current && sidebarContainerRef.current) {
                const heroBottom = heroRef.current.getBoundingClientRect().bottom;
                const shouldFix = heroBottom <= 88; // 88px is the header height

                // Get sidebar dimensions before fixing
                if (!sidebarFixed && shouldFix) {
                    const rect = sidebarContainerRef.current.getBoundingClientRect();
                    setSidebarWidth(rect.width);
                    setSidebarLeft(rect.left);
                }

                setSidebarFixed(shouldFix);
            }
        };

        // Initial setup
        const handleResize = () => {
            if (sidebarContainerRef.current && !sidebarFixed) {
                const rect = sidebarContainerRef.current.getBoundingClientRect();
                setSidebarWidth(rect.width);
                setSidebarLeft(rect.left);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        handleScroll(); // Call once on mount
        handleResize(); // Get initial dimensions

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [sidebarFixed]);

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
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const sections = [
        { id: 'agreement', title: 'Agreement to Terms', icon: FileCheck, color: 'primary' },
        { id: 'services', title: 'Use of Services', icon: Sparkles, color: 'chart-2' },
        { id: 'accounts', title: 'User Accounts', icon: UserX, color: 'accent' },
        { id: 'payment', title: 'Payment Terms', icon: CreditCard, color: 'chart-3' },
        { id: 'intellectual', title: 'Intellectual Property', icon: Award, color: 'chart-4' },
        { id: 'warranties', title: 'Warranties', icon: ShieldCheck, color: 'chart-5' },
        { id: 'liability', title: 'Limitation of Liability', icon: AlertTriangle, color: 'destructive' },
        { id: 'termination', title: 'Termination', icon: Ban, color: 'primary' },
        { id: 'governing', title: 'Governing Law', icon: Gavel, color: 'accent' },
        { id: 'changes', title: 'Changes to Terms', icon: RefreshCw, color: 'chart-2' },
    ];

    const scrollToSection = (sectionId: string) => {
        const el = sectionRefs.current[sectionId];
        const headerOffset = 88; // account for sticky header height
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    const toggleSectionAcceptance = (sectionId: string) => {
        setAcceptedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 overflow-x-hidden">
            {/* Site Header */}
            <UserHeader />
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-border z-50">
                <div
                    className="h-full bg-gradient-to-r from-primary via-chart-2 to-accent transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Animated Background Solar System */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0">
                    {/* Central Sun */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            <Sun className="w-32 h-32 text-primary/10 animate-spin-slow" />
                            <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Orbiting Elements */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            style={{
                                animation: `orbit ${20 + i * 5}s linear infinite`,
                                animationDelay: `${i * 2}s`
                            }}
                        >
                            <div
                                className="absolute"
                                style={{
                                    transform: `translateX(${150 + i * 50}px)`
                                }}
                            >
                                <Battery className={`w-6 h-6 text-chart-${(i % 5) + 1}/30`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-float-random"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 20}s`,
                                animationDuration: `${15 + Math.random() * 10}s`
                            }}
                        >
                            <Zap className="w-3 h-3 text-primary/10" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                {/* Hero Section - Add ref here */}
                <div ref={heroRef} className="relative bg-gradient-to-b from-primary/5 via-transparent to-transparent">
                    <div className="container mx-auto px-4 py-24 md:py-36">
                        <div className="max-w-5xl mx-auto">
                            {/* Animated Badge */}
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
                                    <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-lg rounded-full border border-primary/20">
                                        <ScrollText className="w-4 h-4 text-primary animate-bounce" />
                                        <span className="text-sm font-body text-primary">Legal Agreement</span>
                                        <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">v2.0</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Title with Gradient Animation */}
                            <h1 className="font-headline text-5xl md:text-7xl font-bold text-center mb-8">
                                <span className="inline-block animate-slide-in-left">Terms of</span>{' '}
                                <span className="inline-block animate-slide-in-right bg-gradient-to-r from-primary via-chart-2 to-accent bg-clip-text text-transparent animate-gradient-shift">
                                    Service
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="font-body text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in-up">
                                Welcome to Zawa Solar Energy. These terms govern your use of our solar energy services
                                and products. By using our services, you agree to these terms.
                            </p>

                            {/* Info Cards */}
                            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                {[
                                    { icon: Calendar, label: 'Effective Date', value: 'January 1, 2024', delay: '0ms' },
                                    { icon: Globe2, label: 'Jurisdiction', value: 'Global', delay: '100ms' },
                                    { icon: Clock, label: 'Last Updated', value: '2 days ago', delay: '200ms' }
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="group relative animate-scale-in"
                                            style={{ animationDelay: item.delay }}
                                            onMouseEnter={() => setHoveredCard(index)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="relative bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300">
                                                <Icon className={`w-8 h-8 mb-3 text-primary transition-transform duration-300 ${hoveredCard === index ? 'rotate-12 scale-110' : ''}`} />
                                                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                                                <p className="font-headline font-semibold text-lg">{item.value}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Animated Wave Divider */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 120" className="w-full h-24">
                            <path
                                fill="currentColor"
                                className="text-background"
                                d="M0,32 Q360,96 720,32 T1440,32 L1440,120 L0,120 Z"
                            >
                                <animate
                                    attributeName="d"
                                    values="M0,32 Q360,96 720,32 T1440,32 L1440,120 L0,120 Z;
                          M0,64 Q360,0 720,64 T1440,64 L1440,120 L0,120 Z;
                          M0,32 Q360,96 720,32 T1440,32 L1440,120 L0,120 Z"
                                    dur="15s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Floating Navigation Sidebar - Fixed positioning */}
                        <aside className="lg:w-1/4" ref={sidebarContainerRef}>
                            <div
                                ref={sidebarRef}
                                className={`lg:sticky lg:top-24 static`}
                                style={sidebarFixed && window.innerWidth >= 1024 ? {
                                    position: 'fixed',
                                    top: '5px',
                                    left: `${sidebarLeft}px`,
                                    width: `${sidebarWidth}px`,
                                    zIndex: 40
                                } : {}}
                            >
                                <div className="bg-card/30 backdrop-blur-xl rounded-3xl p-6 border border-border shadow-2xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Layers className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="font-headline text-lg font-semibold">Quick Navigation</h3>
                                    </div>

                                    <div className="space-y-2">
                                        {sections.map((section, index) => {
                                            const Icon = section.icon;
                                            const isActive = activeSection === section.id;
                                            const isAccepted = acceptedSections.has(section.id);

                                            return (
                                                <button
                                                    key={section.id}
                                                    onClick={() => scrollToSection(section.id)}
                                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 group relative overflow-hidden
                            ${isActive ? 'bg-primary/70 border border-primary/20' : 'hover:bg-muted/50'}`}
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    {isActive && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent animate-shimmer" />
                                                    )}
                                                    <div className={`relative transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                        <Icon className={`w-4 h-4 text-${section.color}`} />
                                                    </div>
                                                    <span className="relative font-body text-sm flex-1">{section.title}</span>
                                                    {isAccepted && (
                                                        <CheckCircle2 className="w-4 h-4 text-chart-3 animate-scale-in" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Progress Indicator */}
                                    <div className="mt-6 pt-6 border-t border-border">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground">Reading Progress</span>
                                            <span className="text-sm font-semibold text-primary">{Math.round(scrollProgress)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                                                style={{ width: `${scrollProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Spacer div to maintain layout when sidebar becomes fixed */}
                            {sidebarFixed && (
                                <div
                                    className="hidden lg:block"
                                    style={{ height: '580px' }}
                                />
                            )}
                        </aside>

                        {/* Main Content Area */}
                        <main className="lg:w-3/4 space-y-8">
                            {/* Agreement to Terms Section */}
                            <section
                                id="agreement"
                                ref={(el: HTMLElement | null): void => { sectionRefs.current.agreement = el; }}
                                className={`relative transition-all duration-700 ${isVisible.agreement ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl overflow-hidden">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 70px)`,
                                        }} />
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="p-3 bg-primary/10 rounded-xl animate-pulse-slow">
                                                <FileCheck className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="font-headline text-3xl font-bold mb-2 flex items-center gap-3">
                                                    Agreement to Terms
                                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">Required</span>
                                                </h2>
                                                <p className="text-muted-foreground">Effective as of January 1, 2024</p>
                                            </div>
                                            <button
                                                onClick={() => toggleSectionAcceptance('agreement')}
                                                className={`p-2 rounded-lg transition-all duration-300 ${acceptedSections.has('agreement')
                                                    ? 'bg-chart-3/10 text-chart-3'
                                                    : 'bg-muted hover:bg-muted/80'
                                                    }`}
                                            >
                                                {acceptedSections.has('agreement') ? (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                ) : (
                                                    <Circle className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="font-body space-y-4 text-muted-foreground">
                                            <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-4 border-primary p-4 rounded-lg">
                                                <p className="font-semibold text-foreground mb-2">By accessing or using Zawa Solar Energy services, you agree to:</p>
                                                <ul className="space-y-2 ml-4">
                                                    {[
                                                        'Be bound by these Terms of Service',
                                                        'Comply with all applicable laws and regulations',
                                                        'Accept our Privacy Policy and Cookie Policy',
                                                        'Be at least 18 years of age or have parental consent'
                                                    ].map((item, index) => (
                                                        <li key={index} className="flex items-start gap-2 animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                                                            <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 mt-6">
                                                <div className="group bg-background/50 rounded-xl p-4 border border-border hover:border-primary/50 transition-all duration-300">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Info className="w-5 h-5 text-chart-2" />
                                                        <h4 className="font-headline font-semibold">Important Notice</h4>
                                                    </div>
                                                    <p className="text-sm">
                                                        If you disagree with any part of these terms, you may not access our services.
                                                    </p>
                                                </div>
                                                <div className="group bg-background/50 rounded-xl p-4 border border-border hover:border-accent/50 transition-all duration-300">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <HelpCircle className="w-5 h-5 text-accent" />
                                                        <h4 className="font-headline font-semibold">Need Help?</h4>
                                                    </div>
                                                    <p className="text-sm">
                                                        Contact our legal team for clarification on any terms.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Use of Services Section */}
                            <section
                                id="services"
                                ref={(el: HTMLElement | null): void => { sectionRefs.current.services = el; }}
                                className={`relative transition-all duration-700 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-chart-2/10 rounded-full blur-3xl" />

                                    <div className="relative">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="p-3 bg-chart-2/10 rounded-xl">
                                                <Sparkles className="w-6 h-6 text-chart-2" />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="font-headline text-3xl font-bold mb-2">Use of Services</h2>
                                                <p className="text-muted-foreground">How you can use our solar solutions</p>
                                            </div>
                                        </div>

                                        <div className="font-body space-y-6">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {[
                                                    {
                                                        title: 'Permitted Uses',
                                                        icon: CheckCircle2,
                                                        color: 'chart-3',
                                                        items: [
                                                            'Monitor solar panel performance',
                                                            'Track energy production and savings',
                                                            'Schedule maintenance services',
                                                            'Access customer support'
                                                        ]
                                                    },
                                                    {
                                                        title: 'Prohibited Uses',
                                                        icon: XCircle,
                                                        color: 'destructive',
                                                        items: [
                                                            'Reverse engineer our technology',
                                                            'Interfere with system operations',
                                                            'Use for illegal purposes',
                                                            'Violate intellectual property rights'
                                                        ]
                                                    }
                                                ].map((category, idx) => {
                                                    const Icon = category.icon;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="bg-background/50 rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300"
                                                        >
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <Icon className={`w-6 h-6 text-${category.color}`} />
                                                                <h3 className="font-headline text-lg font-semibold">{category.title}</h3>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {category.items.map((item, index) => (
                                                                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                                        <ChevronRight className={`w-4 h-4 mt-0.5 text-${category.color}/50`} />
                                                                        <span>{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Service Features */}
                                            <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-chart-2/5 rounded-2xl p-6">
                                                <h3 className="font-headline text-lg font-semibold mb-4 flex items-center gap-2">
                                                    <Battery className="w-5 h-5 text-primary" />
                                                    Service Features
                                                </h3>
                                                <div className="grid sm:grid-cols-3 gap-4">
                                                    {[
                                                        { icon: Sun, label: '24/7 Monitoring', desc: 'Real-time system tracking' },
                                                        { icon: Wrench, label: 'Maintenance', desc: 'Regular service schedules' },
                                                        { icon: Zap, label: 'Performance', desc: 'Optimized energy output' }
                                                    ].map((feature, index) => {
                                                        const Icon = feature.icon;
                                                        return (
                                                            <div
                                                                key={index}
                                                                className="text-center p-4 bg-card/50 rounded-xl hover:scale-105 transition-transform duration-300"
                                                            >
                                                                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                                                                <h4 className="font-semibold text-sm mb-1">{feature.label}</h4>
                                                                <p className="text-xs text-muted-foreground">{feature.desc}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* User Accounts Section */}
                            <section
                                id="accounts"
                                ref={(el: HTMLElement | null): void => { sectionRefs.current.accounts = el; }}
                                className={`relative transition-all duration-700 ${isVisible.accounts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-accent/10 rounded-xl">
                                            <UserX className="w-6 h-6 text-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="font-headline text-3xl font-bold mb-2">User Accounts</h2>
                                            <p className="text-muted-foreground">Account creation and management</p>
                                        </div>
                                    </div>

                                    <div className="font-body space-y-4 text-muted-foreground">
                                        <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
                                            <h3 className="font-headline font-semibold text-foreground mb-3">Account Responsibilities</h3>
                                            <div className="space-y-3">
                                                {[
                                                    'Provide accurate and complete information',
                                                    'Maintain the security of your account credentials',
                                                    'Notify us immediately of any unauthorized access',
                                                    'Accept responsibility for all activities under your account',
                                                    'Keep your contact information up to date'
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <div className="mt-1">
                                                            <div className="w-2 h-2 bg-accent rounded-full" />
                                                        </div>
                                                        <span className="text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Payment Terms Section */}
                            <section
                                id="payment"
                                ref={(el: HTMLElement | null): void => { sectionRefs.current.payment = el; }}
                                className={`relative transition-all duration-700 ${isVisible.payment ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-chart-3/10 rounded-xl">
                                            <CreditCard className="w-6 h-6 text-chart-3" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="font-headline text-3xl font-bold mb-2">Payment Terms</h2>
                                            <p className="text-muted-foreground">Billing and payment policies</p>
                                        </div>
                                    </div>

                                    <div className="font-body space-y-6">
                                        <div className="grid md:grid-cols-3 gap-4">
                                            {[
                                                { title: 'Payment Methods', icon: CreditCard, desc: 'Credit cards, bank transfers, financing options' },
                                                { title: 'Billing Cycle', icon: RefreshCw, desc: 'Monthly or annual billing available' },
                                                { title: 'Refund Policy', icon: ArrowRight, desc: '30-day money-back guarantee' }
                                            ].map((item, index) => {
                                                const Icon = item.icon;
                                                return (
                                                    <div
                                                        key={index}
                                                        className="bg-gradient-to-br from-chart-3/5 to-transparent rounded-xl p-5 border border-chart-3/20 hover:border-chart-3/40 transition-all duration-300"
                                                    >
                                                        <Icon className="w-6 h-6 text-chart-3 mb-3" />
                                                        <h4 className="font-semibold mb-2">{item.title}</h4>
                                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Intellectual Property Section */}
                            <section
                                id="intellectual"
                                ref={(el: HTMLElement | null): void => { sectionRefs.current.intellectual = el; }}
                                className={`relative transition-all duration-700 ${isVisible.intellectual ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-chart-4/10 rounded-xl">
                                            <Award className="w-6 h-6 text-chart-4" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="font-headline text-3xl font-bold mb-2">Intellectual Property</h2>
                                            <p className="text-muted-foreground">Ownership and usage rights</p>
                                        </div>
                                    </div>

                                    <div className="font-body space-y-4 text-muted-foreground">
                                        <p>
                                            All content, features, and functionality of Zawa Solar Energy services, including but not limited to text,
                                            graphics, logos, and software, are the exclusive property of Zawa Solar Energy and are protected by
                                            international copyright, trademark, and other intellectual property laws.
                                        </p>
                                        <div className="bg-chart-4/5 border border-chart-4/20 rounded-xl p-5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Link className="w-5 h-5 text-chart-4" />
                                                <h4 className="font-semibold text-foreground">License Grant</h4>
                                            </div>
                                            <p className="text-sm">
                                                We grant you a limited, non-exclusive, non-transferable license to access and use our services
                                                for personal or internal business purposes only.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Warranties Section */}
                            <section
                                id="warranties"
                                ref={(el: HTMLElement | null): void => { sectionRefs.current.warranties = el; }}
                                className={`relative transition-all duration-700 ${isVisible.warranties ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-chart-5/10 rounded-xl">
                                            <ShieldCheck className="w-6 h-6 text-chart-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="font-headline text-3xl font-bold mb-2">Warranties & Disclaimers</h2>
                                            <p className="text-muted-foreground">Service guarantees and limitations</p>
                                        </div>
                                    </div>

                                    <div className="font-body space-y-4">
                                        <div className="bg-gradient-to-r from-chart-5/10 to-transparent rounded-xl p-6">
                                            <h3 className="font-headline font-semibold mb-3">Our Commitments</h3>
                                            <ul className="space-y-2">
                                                {[
                                                    'Professional installation by certified technicians',
                                                    'Quality solar equipment from trusted manufacturers',
                                                    'Responsive customer support',
                                                    'Performance monitoring and maintenance'
                                                ].map((item, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <CheckCircle2 className="w-4 h-4 text-chart-5" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Limitation of Liability Section */}
                            <section
                                id="liability"
                                ref={(el: HTMLElement | null): void => { sectionRefs.current.liability = el; }}
                                className={`relative transition-all duration-700 ${isVisible.liability ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-destructive/10 rounded-xl">
                                            <AlertTriangle className="w-6 h-6 text-destructive" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="font-headline text-3xl font-bold mb-2">Limitation of Liability</h2>
                                            <p className="text-muted-foreground">Legal limitations and exclusions</p>
                                        </div>
                                    </div>

                                    <div className="font-body space-y-4 text-muted-foreground">
                                        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                                            <p className="font-semibold text-foreground mb-3">Important Legal Notice</p>
                                            <p className="text-sm">
                                                To the maximum extent permitted by law, Zawa Solar Energy shall not be liable for any indirect,
                                                incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
                                                whether incurred directly or indirectly.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Termination Section */}
                            <section
                                id="termination"
                                ref={(el: HTMLElement | null): void => { sectionRefs.current.termination = el; }}
                                className={`relative transition-all duration-700 ${isVisible.termination ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-primary/10 rounded-xl">
                                            <Ban className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="font-headline text-3xl font-bold mb-2">Termination</h2>
                                            <p className="text-muted-foreground">Account suspension and termination</p>
                                        </div>
                                    </div>

                                    <div className="font-body space-y-4 text-muted-foreground">
                                        <p>
                                            We may terminate or suspend your account and access to our services immediately, without prior notice or liability,
                                            for any reason, including breach of these Terms of Service.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Governing Law Section */}
                            <section
                                id="governing"
                                ref={(el: HTMLElement | null): void => { sectionRefs.current.governing = el; }}
                                className={`relative transition-all duration-700 ${isVisible.governing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-accent/10 rounded-xl">
                                            <Gavel className="w-6 h-6 text-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="font-headline text-3xl font-bold mb-2">Governing Law</h2>
                                            <p className="text-muted-foreground">Legal jurisdiction and disputes</p>
                                        </div>
                                    </div>

                                    <div className="font-body space-y-4 text-muted-foreground">
                                        <p>
                                            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
                                            in which Zawa Solar Energy operates, without regard to its conflict of law provisions.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Changes to Terms Section */}
                            <section
                                id="changes"
                                ref={(el: HTMLElement | null): void => { sectionRefs.current.changes = el; }}
                                className={`relative transition-all duration-700 ${isVisible.changes ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-chart-2/10 rounded-xl">
                                            <RefreshCw className="w-6 h-6 text-chart-2" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="font-headline text-3xl font-bold mb-2">Changes to Terms</h2>
                                            <p className="text-muted-foreground">Updates and modifications</p>
                                        </div>
                                    </div>

                                    <div className="font-body space-y-4 text-muted-foreground">
                                        <p>
                                            We reserve the right to modify or replace these Terms at any time. If a revision is material,
                                            we will provide at least 30 days notice prior to any new terms taking effect.
                                        </p>
                                        <div className="bg-chart-2/5 border border-chart-2/20 rounded-xl p-5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare className="w-5 h-5 text-chart-2" />
                                                <h4 className="font-semibold text-foreground">Stay Informed</h4>
                                            </div>
                                            <p className="text-sm">
                                                Subscribe to our updates to receive notifications about changes to our terms and policies.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Accept Terms CTA */}
                            <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 border border-primary/30 shadow-2xl">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
                                        <ScrollText className="w-10 h-10 text-primary" />
                                    </div>
                                    <h2 className="font-headline text-3xl font-bold mb-4">Ready to Get Started?</h2>
                                    <p className="font-body text-muted-foreground mb-8 max-w-2xl mx-auto">
                                        By clicking "Accept Terms", you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-headline font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Accept Terms
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button className="px-8 py-4 bg-card/50 backdrop-blur-lg rounded-xl font-headline font-semibold border border-border hover:bg-card transition-all duration-300 flex items-center justify-center gap-2">
                                            <FileCheck className="w-5 h-5" />
                                            Download PDF
                                        </button>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-border">
                                        <p className="text-sm text-muted-foreground">
                                            Questions about our terms?
                                            <a href="#" className="text-primary hover:underline ml-1">Contact our legal team</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                {/* Footer */}
                <UserFooter />
            </div>

            <style jsx>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes float-random {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slide-in-left {
          from {
            transform: translateX(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slide-in {
          from {
            transform: translateX(-10px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-float-random {
          animation: float-random 20s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default TermsOfService;