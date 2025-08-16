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