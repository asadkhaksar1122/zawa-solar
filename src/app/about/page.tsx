// about.jsx - Updated with enhanced animated hero section
"use client"
import React, { useState } from "react";
import Image from "next/image";
import { UserHeader } from "@/components/user/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Mail, ExternalLink, GraduationCap, Briefcase, Award, Sparkles, Sun, Zap } from "lucide-react";
import { motion } from 'framer-motion';

const About = () => {
    const teamMembers = [
        {
            name: "Wahid Amin",
            role: "CEO",
            img: "/wahid.png",
            email: "john.smith@zawasolar.com",
            linkedin: "linkedin.com/in/johnsmith",
            education: "Master in te renewable energy, ",
            experience: "10+ years in renewable energy",
            achievements: "Led 500+ solar installations"
        },
        {
            name: "Umair Khan",
            role: "Senior Manager",
            img: "/umair.png",
            email: "sarah.johnson@zawasolar.com",
            linkedin: "linkedin.com/in/sarahjohnson",
            education: "B-tech in the civil engineering",
            experience: "12+ years in solar technology",
            achievements: "30+ patents in solar innovation"
        },
        {
            name: "Sohaib Hassan",
            role: "Lead Engineer",
            img: "/sohaibhassan.jpg",
            email: "michael.chen@zawasolar.com",
            linkedin: "linkedin.com/in/michaelchen",
            education: "Diploma in the electrical engineering,",
            experience: "1+ years in system design",
            achievements: "Certified Solar Professional (CSP)"
        },
        {
            name: "Asad Khan",
            role: "Techninal Manager",
            img: "/asadimg.jpg",
            email: "emily.brown@zawasolar.com",
            linkedin: "linkedin.com/in/emilybrown",
            education: "The software engineer ",
            experience: "1 year experience ",
            achievements: "99% customer satisfaction rate"
        },
    ];

    const cardVariants = {
        rest: { scale: 1, y: 0 },
        hover: { scale: 1.05, y: -6 }
    };

    const frontVariants = {
        rest: { opacity: 1 },
        hover: { opacity: 0 }
    };

    const overlayVariants = {
        rest: { opacity: 0, y: 8 },
        hover: { opacity: 1, y: 0 }
    };

    const [hovered, setHovered] = useState<number | null>(null);

    // Hero Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const titleVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        },
        hover: {
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    const subtitleVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                delay: 0.2
            }
        }
    };

    const floatingIconVariants = {
        float: {
            y: [-20, 20, -20],
            rotate: [0, 360],
            transition: {
                y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                },
                rotate: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }
            }
        }
    };

    const pulseVariants = {
        pulse: {
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.4, 0.7],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const glowVariants = {
        glow: {
            boxShadow: [
                "0 0 20px rgba(251, 191, 36, 0.3)",
                "0 0 60px rgba(251, 191, 36, 0.5)",
                "0 0 20px rgba(251, 191, 36, 0.3)"
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Enhanced Animated Hero Section */}
            <UserHeader />
            <motion.div
                className="relative bg-gradient-to-r from-primary to-primary/80 py-20 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Animated Background Pattern */}
                <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{
                        backgroundImage: [
                            "radial-gradient(circle at 20% 50%, white 0%, transparent 50%)",
                            "radial-gradient(circle at 80% 50%, white 0%, transparent 50%)",
                            "radial-gradient(circle at 20% 50%, white 0%, transparent 50%)",
                        ],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Floating Icons */}
                <motion.div
                    className="absolute top-10 left-10 text-yellow-300 opacity-20"
                    variants={floatingIconVariants}
                    animate="float"
                >
                    <Sun size={60} />
                </motion.div>

                <motion.div
                    className="absolute top-20 right-20 text-yellow-200 opacity-20"
                    variants={floatingIconVariants}
                    animate="float"
                    style={{ animationDelay: "2s" }}
                >
                    <Sparkles size={40} />
                </motion.div>

                <motion.div
                    className="absolute bottom-10 left-1/4 text-yellow-300 opacity-20"
                    variants={floatingIconVariants}
                    animate="float"
                    style={{ animationDelay: "4s" }}
                >
                    <Zap size={50} />
                </motion.div>

                {/* Pulse Circles */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-300"
                    variants={pulseVariants}
                    animate="pulse"
                />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="text-center text-primary-foreground"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Animated Title */}
                        <motion.div
                            className="relative inline-block"
                            variants={titleVariants}
                            whileHover="hover"
                        >
                            <motion.h1
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 relative"
                                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
                            >
                                <motion.span
                                    className="inline-block"
                                    animate={{
                                        backgroundImage: [
                                            "linear-gradient(90deg, #ffffff 0%, #fbbf24 50%, #ffffff 100%)",
                                            "linear-gradient(90deg, #fbbf24 0%, #ffffff 50%, #fbbf24 100%)",
                                            "linear-gradient(90deg, #ffffff 0%, #fbbf24 50%, #ffffff 100%)",
                                        ],
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        color: "transparent",
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                >
                                    About
                                </motion.span>
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    whileHover={{
                                        scale: 1.1,
                                        rotate: [-1, 1, -1],
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    Zawa Solar
                                </motion.span>
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    animate={{
                                        y: [0, -5, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    Energy Solutions
                                </motion.span>
                            </motion.h1>

                            {/* Glowing underline */}
                            <motion.div
                                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent"
                                animate={{
                                    scaleX: [0, 1, 0],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>

                        {/* Animated Subtitle */}
                        <motion.div
                            variants={subtitleVariants}
                            className="relative"
                        >
                            <motion.p
                                className="text-xl md:text-2xl opacity-90 mt-6"
                                whileHover={{
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <motion.span
                                    className="inline-block"
                                    animate={{
                                        opacity: [0.7, 1, 0.7],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    ⚡
                                </motion.span>
                                {" "}
                                Powering a Sustainable Future
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    animate={{
                                        opacity: [0.7, 1, 0.7],
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    ☀️
                                </motion.span>
                            </motion.p>
                        </motion.div>

                        {/* Animated Stats Bar */}
                        <motion.div
                            className="flex justify-center gap-8 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            {[
                                { number: "500+", label: "Projects" },
                                { number: "10+", label: "Years" },
                                { number: "99%", label: "Satisfaction" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    whileHover={{
                                        scale: 1.1,
                                        transition: { type: "spring", stiffness: 300 }
                                    }}
                                >
                                    <motion.div
                                        className="text-2xl md:text-3xl font-bold text-yellow-300"
                                        animate={{
                                            textShadow: [
                                                "0 0 10px rgba(251, 191, 36, 0.5)",
                                                "0 0 20px rgba(251, 191, 36, 0.8)",
                                                "0 0 10px rgba(251, 191, 36, 0.5)"
                                            ]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: index * 0.2
                                        }}
                                    >
                                        {stat.number}
                                    </motion.div>
                                    <div className="text-sm opacity-80">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom Wave Animation */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0"
                    animate={{
                        d: [
                            "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                            "M0,160L48,144C96,128,192,96,288,96C384,96,480,128,576,144C672,160,768,160,864,144C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                            "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <svg viewBox="0 0 1440 320" className="w-full h-16 fill-background opacity-20">
                        <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </motion.div>
            </motion.div>

            {/* Mission Section */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                At Zawa Solar Energy Solutions, we are committed to accelerating
                                the world&apos;s transition to sustainable energy. We provide
                                innovative solar solutions that help businesses and homeowners
                                reduce their carbon footprint while saving on energy costs.
                            </p>
                        </div>
                        <div className="relative h-[400px] rounded-lg overflow-hidden border border-border">
                            <Image
                                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60"
                                alt="Solar Panels Installation"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-border/40">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4 text-foreground">Sustainability</h3>
                                <p className="text-muted-foreground">
                                    We are dedicated to promoting clean, renewable energy solutions
                                    that protect our environment for future generations.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/40">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4 text-foreground">Innovation</h3>
                                <p className="text-muted-foreground">
                                    We continuously strive to improve our technology and services
                                    to provide the most efficient solar solutions.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/40">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4 text-foreground">Customer Focus</h3>
                                <p className="text-muted-foreground">
                                    We prioritize our customers&apos; needs and ensure they receive the
                                    highest quality service and support.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Enhanced Team Section */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                        Our Expert Team
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, idx) => (
                            <motion.div
                                key={idx}
                                className="relative"
                                initial="rest"
                                whileHover="hover"
                                animate="rest"
                                variants={cardVariants}
                                onHoverStart={() => setHovered(idx)}
                                onHoverEnd={() => setHovered(null)}
                            >
                                <Card className="border-border/40 overflow-hidden h-full cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <motion.div variants={frontVariants} transition={{ duration: 0.25 }}>
                                            <div className="relative h-[150px] w-[150px] mx-auto mb-4 cursor-pointer">
                                                <Image
                                                    src={member.img}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover rounded-full border-2 border-border"
                                                    unoptimized
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                                            <p className="text-muted-foreground text-sm">{member.role}</p>
                                        </motion.div>

                                        {/* Hover View - Detailed Information (Framer Motion) */}
                                        <motion.div
                                            className={`absolute inset-0 p-6 bg-background flex flex-col justify-center ${hovered === idx ? 'pointer-events-auto z-20' : 'pointer-events-none z-10'}`}
                                            variants={overlayVariants}
                                            transition={{ duration: 0.28, ease: 'easeOut' }}
                                        >
                                            <div className="relative h-[80px] w-[80px] mx-auto mb-3">
                                                <Image
                                                    src={member.img}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover rounded-full border-2 border-primary"
                                                    unoptimized
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                                            <p className="text-primary text-sm font-medium mb-3">{member.role}</p>

                                            <div className="space-y-2 text-left text-xs">
                                                <div className="flex items-start gap-2">
                                                    <GraduationCap className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                                    <span className="text-muted-foreground">{member.education}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Briefcase className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                                    <span className="text-muted-foreground">{member.experience}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Award className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                                    <span className="text-muted-foreground">{member.achievements}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact CTA Section */}
            <div className="bg-primary py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6 text-primary-foreground">
                        Ready to Switch to Solar?
                    </h2>
                    <p className="text-xl mb-8 text-primary-foreground/90">
                        Contact us today for a free consultation
                    </p>
                    <Button
                        size="lg"
                        variant="secondary"
                        className="font-bold"
                        asChild
                    >
                        <Link href="/contact">Get Started</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default About;