"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Briefcase, Award, Sparkles, Mail, Linkedin } from "lucide-react";
import { motion } from 'framer-motion';

interface TeamMember {
    name: string;
    role: string;
    img: string;
    email: string;
    linkedin: string;
    education: string;
    experience: string;
    achievements: string;
}

interface TeamSectionProps {
    teamMembers?: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ teamMembers }) => {
    const defaultTeamMembers: TeamMember[] = [
        {
            name: "Wahid Amin",
            role: "CEO",
            img: "/wahid.png",
            email: "john.smith@zawasolar.com",
            linkedin: "https://linkedin.com/in/johnsmith",
            education: "Masters in Renewable Energy",
            experience: "10+ years in renewable energy",
            achievements: "Led 500+ solar installations"
        },
        {
            name: "Umair Khan",
            role: "Senior Manager",
            img: "/umair.png",
            email: "sarah.johnson@zawasolar.com",
            linkedin: "https://linkedin.com/in/sarahjohnson",
            education: "B.Tech in Civil Engineering",
            experience: "12+ years in solar technology",
            achievements: "30+ patents in solar innovation"
        },
        {
            name: "Sohaib Hassan",
            role: "Lead Engineer",
            img: "/sohaibhassan.jpg",
            email: "michael.chen@zawasolar.com",
            linkedin: "https://linkedin.com/in/michaelchen",
            education: "Diploma in Electrical Engineering",
            experience: "1+ years in system design",
            achievements: "Certified Solar Professional (CSP)"
        },
        {
            name: "Asad Khan",
            role: "Technical Manager",
            img: "/asadimg.jpg",
            email: "emily.brown@zawasolar.com",
            linkedin: "https://linkedin.com/in/emilybrown",
            education: "Software Engineer",
            experience: "1+ years of experience",
            achievements: "99% customer satisfaction rate"
        },
    ];

    const members = teamMembers || defaultTeamMembers;
    const [hovered, setHovered] = useState<number | null>(null);

    const cardVariants = {
        rest: {
            scale: 1,
            y: 0,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        hover: {
            scale: 1.05,
            y: -6,
            boxShadow: "0 20px 25px rgba(0, 0, 0, 0.15)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    const frontVariants = {
        rest: { opacity: 1, rotateY: 0 },
        hover: {
            opacity: 0,
            rotateY: 90,
            transition: {
                duration: 0.25,
                ease: "easeInOut"
            }
        }
    };

    const overlayVariants = {
        rest: {
            opacity: 0,
            y: 8,
            rotateY: -90,
        },
        hover: {
            opacity: 1,
            y: 0,
            rotateY: 0,
            transition: {
                duration: 0.28,
                ease: "easeOut",
                delay: 0.1
            }
        }
    };

    const imageVariants = {
        rest: {
            scale: 1,
            rotate: 0,
        },
        hover: {
            scale: 1.1,
            rotate: [0, -5, 5, 0],
            transition: {
                scale: {
                    duration: 0.3,
                    ease: "easeOut"
                },
                rotate: {
                    duration: 0.5,
                    ease: "easeInOut"
                }
            }
        }
    };

    const glowVariants = {
        rest: {
            opacity: 0,
        },
        hover: {
            opacity: [0, 1, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const sparkleVariants = {
        rest: {
            opacity: 0,
            scale: 0,
        },
        hover: {
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 180, 360],
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                repeatDelay: 0.5
            }
        }
    };

    const teamContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.15
            }
        }
    };

    const teamCardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    };

    return (
        <div className="py-16 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="container mx-auto px-4">
                <motion.h2
                    className="text-3xl font-bold text-center mb-12 text-foreground"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Our Expert Team
                </motion.h2>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={teamContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {members.map((member, idx) => (
                        <motion.div
                            key={idx}
                            className="relative"
                            variants={teamCardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <motion.div
                                variants={cardVariants}
                                className="relative will-change-transform"
                                initial="rest"
                                animate="rest"
                                whileHover="hover"
                                style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                                onHoverStart={() => setHovered(idx)}
                                onHoverEnd={() => setHovered(null)}
                            >
                                {/* Glow Effect Behind Card */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-xl"
                                    variants={glowVariants}
                                />

                                {/* Sparkle Effects */}
                                <motion.div
                                    className="absolute -top-2 -right-2 text-yellow-400 z-30"
                                    variants={sparkleVariants}
                                >
                                    <Sparkles size={20} />
                                </motion.div>
                                <motion.div
                                    className="absolute -bottom-2 -left-2 text-yellow-400 z-30"
                                    variants={sparkleVariants}
                                    style={{ animationDelay: "0.5s" }}
                                >
                                    <Sparkles size={16} />
                                </motion.div>

                                <Card className="rounded-xl border border-border/50 overflow-hidden h-full cursor-pointer relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md">
                                    <CardContent className="p-6 text-center">
                                        {/* Front View */}
                                        <motion.div variants={frontVariants} transition={{ duration: 0.25 }} style={{ backfaceVisibility: 'hidden' }}>
                                            <motion.div
                                                className="relative h-[150px] w-[150px] mx-auto mb-4 cursor-pointer rounded-full ring-2 ring-border/50 hover:ring-primary/60 transition-colors duration-300"
                                                variants={imageVariants}
                                            >
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full"
                                                    animate={hovered === idx ? {
                                                        scale: [1, 1.2, 1],
                                                        opacity: [0.5, 0.8, 0.5],
                                                    } : {}}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                                <Image
                                                    src={member.img}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover rounded-full border-2 border-border relative z-10"
                                                    unoptimized
                                                />
                                            </motion.div>
                                            <motion.h3
                                                className="text-lg font-bold text-foreground"
                                                animate={hovered === idx ? {
                                                    color: ["hsl(var(--foreground))", "hsl(var(--primary))", "hsl(var(--foreground))"],
                                                } : {}}
                                                transition={{
                                                    duration: 1,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                {member.name}
                                            </motion.h3>
                                            <p className="text-muted-foreground text-sm">{member.role}</p>
                                        </motion.div>

                                        {/* Hover View */}
                                        <motion.div
                                            className={`absolute inset-0 p-6 bg-background/98 backdrop-blur-sm flex flex-col justify-center ${hovered === idx ? 'pointer-events-auto z-20' : 'pointer-events-none z-10'}`}
                                            variants={overlayVariants}
                                            transition={{ duration: 0.28, ease: 'easeOut' }}
                                            style={{ backfaceVisibility: 'hidden' }}
                                        >
                                            <motion.div
                                                className="relative h-[80px] w-[80px] mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-primary/40"
                                                animate={hovered === idx ? {
                                                    rotate: [0, 360],
                                                } : {}}
                                                transition={{
                                                    duration: 1,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <Image
                                                    src={member.img}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover rounded-full border-2 border-primary"
                                                    unoptimized
                                                />
                                            </motion.div>
                                            <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                                            <p className="text-primary text-sm font-medium mb-3">{member.role}</p>

                                            <motion.div
                                                className="space-y-2 text-left text-xs"
                                                initial={{ opacity: 0 }}
                                                animate={hovered === idx ? { opacity: 1 } : { opacity: 0 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                <motion.div
                                                    className="flex items-start gap-2"
                                                    initial={{ x: -20 }}
                                                    animate={hovered === idx ? { x: 0 } : { x: -20 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <GraduationCap className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                                    <span className="text-muted-foreground">{member.education}</span>
                                                </motion.div>
                                                <motion.div
                                                    className="flex items-start gap-2"
                                                    initial={{ x: -20 }}
                                                    animate={hovered === idx ? { x: 0 } : { x: -20 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <Briefcase className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                                    <span className="text-muted-foreground">{member.experience}</span>
                                                </motion.div>
                                                <motion.div
                                                    className="flex items-start gap-2"
                                                    initial={{ x: -20 }}
                                                    animate={hovered === idx ? { x: 0 } : { x: -20 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    <Award className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                                    <span className="text-muted-foreground">{member.achievements}</span>
                                                </motion.div>
                                            </motion.div>
                                            <div className="mt-4 flex items-center justify-center gap-3">
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                    aria-label={`Email ${member.name}`}
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </a>
                                                <a
                                                    href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                    aria-label={`${member.name} on LinkedIn`}
                                                >
                                                    <Linkedin className="h-4 w-4" />
                                                </a>
                                            </div>
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default TeamSection;