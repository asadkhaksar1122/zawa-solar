// about.jsx - Updated with enhanced team section
"use client"
import React, { useState } from "react";
import Image from "next/image";
import { UserHeader } from "@/components/user/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Mail, ExternalLink, GraduationCap, Briefcase, Award } from "lucide-react";
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
        rest: { 
            scale: 1, 
            y: 0,
            rotateY: 0,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        },
        hover: { 
            scale: 1.08, 
            y: -12,
            rotateY: 5,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }
    };

    const frontVariants = {
        rest: { opacity: 1, scale: 1, filter: "blur(0px)" },
        hover: { opacity: 0, scale: 0.95, filter: "blur(2px)" }
    };

    const overlayVariants = {
        rest: { 
            opacity: 0, 
            y: 20, 
            scale: 0.9,
            background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)"
        },
        hover: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)"
        }
    };

    const imageVariants = {
        rest: { scale: 1, rotate: 0 },
        hover: { scale: 1.1, rotate: 2 }
    };

    const iconVariants = {
        rest: { scale: 1, rotate: 0 },
        hover: { scale: 1.2, rotate: 10 }
    };

    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <UserHeader />
            <div className="relative bg-gradient-to-r from-primary to-primary/80 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center text-primary-foreground">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            About Zawa Solar Energy Solutions
                        </h1>
                        <p className="text-xl opacity-90">Powering a Sustainable Future</p>
                    </div>
                </div>
            </div>

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
                                className="relative group perspective-1000"
                                initial="rest"
                                whileHover="hover"
                                animate="rest"
                                variants={cardVariants}
                                onHoverStart={() => setHovered(idx)}
                                onHoverEnd={() => setHovered(null)}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <Card className="border-border/40 overflow-hidden h-full cursor-pointer relative bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <CardContent className="p-6 text-center relative z-10">
                                        <motion.div 
                                            variants={frontVariants} 
                                            transition={{ duration: 0.35, ease: "easeInOut" }}
                                        >
                                            <motion.div 
                                                className="relative h-[150px] w-[150px] mx-auto mb-4 cursor-pointer"
                                                variants={imageVariants}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                <Image
                                                    src={member.img}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover rounded-full border-3 border-gradient-to-r from-primary/30 to-primary/60 shadow-lg"
                                                    unoptimized
                                                />
                                                <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                            </motion.div>
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                                            <p className="text-muted-foreground text-sm group-hover:text-primary/80 transition-colors duration-300">{member.role}</p>
                                        </motion.div>

                                        {/* Enhanced Hover View */}
                                        <motion.div
                                            className={`absolute inset-0 p-6 flex flex-col justify-center rounded-lg backdrop-blur-md ${hovered === idx ? 'pointer-events-auto z-20' : 'pointer-events-none z-10'}`}
                                            variants={overlayVariants}
                                            transition={{ duration: 0.4, ease: 'easeOut' }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-primary/10 rounded-lg" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-lg" />
                                            
                                            <div className="relative z-10">
                                                <motion.div 
                                                    className="relative h-[80px] w-[80px] mx-auto mb-3"
                                                    initial={{ scale: 0.8, rotate: -10 }}
                                                    animate={hovered === idx ? { scale: 1, rotate: 0 } : { scale: 0.8, rotate: -10 }}
                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                >
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 blur-lg" />
                                                    <Image
                                                        src={member.img}
                                                        alt={member.name}
                                                        fill
                                                        className="object-cover rounded-full border-2 border-primary shadow-xl"
                                                        unoptimized
                                                    />
                                                </motion.div>
                                                
                                                <motion.h3 
                                                    className="text-lg font-bold text-foreground mb-1"
                                                    initial={{ y: 10, opacity: 0 }}
                                                    animate={hovered === idx ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.15 }}
                                                >
                                                    {member.name}
                                                </motion.h3>
                                                
                                                <motion.p 
                                                    className="text-primary text-sm font-medium mb-4 bg-primary/10 px-3 py-1 rounded-full inline-block"
                                                    initial={{ y: 10, opacity: 0 }}
                                                    animate={hovered === idx ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.2 }}
                                                >
                                                    {member.role}
                                                </motion.p>

                                                <motion.div 
                                                    className="space-y-3 text-left text-xs"
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={hovered === idx ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.25 }}
                                                >
                                                    <motion.div 
                                                        className="flex items-start gap-3 p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-primary/10"
                                                        variants={iconVariants}
                                                    >
                                                        <GraduationCap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                        <span className="text-muted-foreground font-medium">{member.education}</span>
                                                    </motion.div>
                                                    <motion.div 
                                                        className="flex items-start gap-3 p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-primary/10"
                                                        variants={iconVariants}
                                                    >
                                                        <Briefcase className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                        <span className="text-muted-foreground font-medium">{member.experience}</span>
                                                    </motion.div>
                                                    <motion.div 
                                                        className="flex items-start gap-3 p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-primary/10"
                                                        variants={iconVariants}
                                                    >
                                                        <Award className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                        <span className="text-muted-foreground font-medium">{member.achievements}</span>
                                                    </motion.div>
                                                </motion.div>
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