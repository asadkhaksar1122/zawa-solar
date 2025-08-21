"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Briefcase, Award, Sparkles, Star, Zap } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
    name: string;
    role: string;
    img: string;
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
            education: "Masters in Renewable Energy",
            experience: "10+ years in renewable energy",
            achievements: "Led 500+ solar installations"
        },
        {
            name: "Umair Khan",
            role: "Senior Manager",
            img: "/umair.png",
            education: "B.Tech in Civil Engineering",
            experience: "12+ years in solar technology",
            achievements: "30+ patents in solar innovation"
        },
        {
            name: "Sohaib Hassan",
            role: "Lead Engineer",
            img: "/sohaibhassan.jpg",
            education: "Diploma in Electrical Engineering",
            experience: "1+ years in system design",
            achievements: "Certified Solar Professional (CSP)"
        },
        {
            name: "Asad Khan",
            role: "Technical Manager",
            img: "/asadimg.jpg",
            education: "Software Engineer",
            experience: "1+ years of experience",
            achievements: "99% customer satisfaction rate"
        },
    ];

    const members = teamMembers || defaultTeamMembers;
    const [hovered, setHovered] = useState<number | null>(null);
    const [touched, setTouched] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleInteractionStart = (idx: number) => {
        if (isMobile) {
            setTouched(touched === idx ? null : idx);
        } else {
            setHovered(idx);
        }
    };

    const handleInteractionEnd = () => {
        if (!isMobile) {
            setHovered(null);
        }
    };

    const isActive = (idx: number) => {
        return isMobile ? touched === idx : hovered === idx;
    };

    const cardVariants = {
        rest: {
            scale: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
            transition: {
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 20
            }
        },
        hover: {
            scale: 1.08,
            y: -15,
            rotateX: -8,
            rotateY: 8,
            boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.4)",
            transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    };

    const imageContainerVariants = {
        rest: {
            scale: 1,
            rotate: 0,
        },
        hover: {
            scale: 1.15,
            rotate: [0, -3, 3, -2, 2, 0],
            filter: "brightness(1.1) saturate(1.2)",
            transition: {
                scale: {
                    duration: 0.3,
                    ease: "easeOut"
                },
                rotate: {
                    duration: 0.8,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                },
                filter: {
                    duration: 0.3
                }
            }
        }
    };

    const pulseRingVariants = {
        rest: {
            scale: 1,
            opacity: 0,
        },
        hover: {
            scale: [1, 1.8, 2.2],
            opacity: [0, 0.6, 0],
            transition: {
                duration: 1.2,
                repeat: Infinity,
                ease: "easeOut"
            }
        }
    };

    const shimmerVariants = {
        rest: {
            backgroundPosition: "-200% center",
        },
        hover: {
            backgroundPosition: "200% center",
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const floatingIconVariants = {
        rest: {
            y: 0,
            opacity: 0,
            scale: 0,
        },
        hover: {
            y: [-20, -25, -20],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
            }
        }
    };

    const infoItemVariants = {
        hidden: {
            x: -30,
            opacity: 0,
            scale: 0.8,
            rotateX: -90,
        },
        visible: (i: number) => ({
            x: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        })
    };

    const nameGlowVariants = {
        rest: {
            textShadow: "0 0 0px rgba(var(--primary-rgb), 0)",
        },
        hover: {
            textShadow: [
                "0 0 30px rgba(59, 130, 246, 0.8)",
                "0 0 60px rgba(147, 51, 234, 0.6)",
                "0 0 30px rgba(59, 130, 246, 0.8)",
            ],
            scale: [1, 1.02, 1],
            transition: {
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const teamContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.15
            }
        }
    };

    const teamCardVariants = {
        hidden: {
            opacity: 0,
            y: 60,
            scale: 0.8,
            rotateX: -30,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 100,
                duration: 0.8
            }
        }
    };

    const titleVariants = {
        hidden: {
            opacity: 0,
            y: -30,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="py-16 relative overflow-hidden">
            {/* Animated Background Gradients */}
            <motion.div
                className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-r from-primary/30 to-purple-500/20 blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-l from-primary/20 to-blue-500/20 blur-3xl"
                animate={{
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-12"
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent"
                        animate={{
                            backgroundPosition: ["0%", "100%", "0%"],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            backgroundSize: "200% auto",
                        }}
                    >
                        Our Expert Team
                    </motion.h2>
                    <motion.p
                        className="text-muted-foreground mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Meet the brilliant minds behind our success
                    </motion.p>
                </motion.div>

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
                                animate={isActive(idx) ? "hover" : "rest"}
                                whileHover={!isMobile ? "hover" : undefined}
                                whileTap={isMobile ? { scale: 0.98 } : undefined}
                                style={{
                                    perspective: 1000,
                                    transformStyle: 'preserve-3d',
                                }}
                                onHoverStart={() => !isMobile && setHovered(idx)}
                                onHoverEnd={() => !isMobile && setHovered(null)}
                                onTouchStart={() => isMobile && handleInteractionStart(idx)}
                                onClick={() => isMobile && handleInteractionStart(idx)}
                            >
                                {/* Floating Icons */}
                                <AnimatePresence>
                                    {isActive(idx) && (
                                        <>
                                            <motion.div
                                                className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 z-30"
                                                variants={floatingIconVariants}
                                                initial="rest"
                                                animate="hover"
                                                exit="rest"
                                            >
                                                <Star size={28} fill="currentColor" className="drop-shadow-lg" />
                                            </motion.div>
                                            <motion.div
                                                className="absolute -top-6 left-1/4 text-primary z-30"
                                                variants={floatingIconVariants}
                                                initial="rest"
                                                animate="hover"
                                                exit="rest"
                                                style={{ animationDelay: "0.3s" }}
                                            >
                                                <Sparkles size={22} className="drop-shadow-lg" />
                                            </motion.div>
                                            <motion.div
                                                className="absolute -top-6 right-1/4 text-purple-500 z-30"
                                                variants={floatingIconVariants}
                                                initial="rest"
                                                animate="hover"
                                                exit="rest"
                                                style={{ animationDelay: "0.6s" }}
                                            >
                                                <Zap size={22} fill="currentColor" className="drop-shadow-lg" />
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>

                                <Card className="rounded-2xl border border-border/50 overflow-visible h-full cursor-pointer relative bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-primary/30">
                                    {/* Shimmer Effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
                                        variants={shimmerVariants}
                                        initial="rest"
                                        animate={isActive(idx) ? "hover" : "rest"}
                                        style={{
                                            background: "linear-gradient(105deg, transparent 30%, rgba(59, 130, 246, 0.3) 50%, rgba(147, 51, 234, 0.3) 70%, transparent 90%)",
                                            backgroundSize: "200% 100%",
                                            opacity: isActive(idx) ? 1 : 0,
                                        }}
                                    />

                                    {/* Glow Effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                                        animate={isActive(idx) ? {
                                            boxShadow: [
                                                "0 0 0px rgba(59, 130, 246, 0)",
                                                "0 0 30px rgba(59, 130, 246, 0.4)",
                                                "0 0 60px rgba(147, 51, 234, 0.3)",
                                                "0 0 30px rgba(59, 130, 246, 0.4)",
                                            ]
                                        } : {
                                            boxShadow: "0 0 0px rgba(59, 130, 246, 0)"
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: isActive(idx) ? Infinity : 0,
                                            ease: "easeInOut"
                                        }}
                                    />

                                    <CardContent className="p-6 text-center relative">
                                        <motion.div
                                            className="relative h-[150px] w-[150px] mx-auto mb-4"
                                            variants={imageContainerVariants}
                                        >
                                            {/* Pulse Rings */}
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-2 border-primary/40"
                                                variants={pulseRingVariants}
                                            />
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-2 border-primary/30"
                                                variants={pulseRingVariants}
                                                style={{ animationDelay: "0.5s" }}
                                            />

                                            {/* Gradient Border */}
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-purple-500 to-primary p-[2px]"
                                                animate={isActive(idx) ? {
                                                    rotate: 360,
                                                    scale: [1, 1.05, 1]
                                                } : {
                                                    rotate: 0
                                                }}
                                                transition={{
                                                    rotate: {
                                                        duration: 3,
                                                        repeat: isActive(idx) ? Infinity : 0,
                                                        ease: "linear"
                                                    },
                                                    scale: {
                                                        duration: 1.5,
                                                        repeat: isActive(idx) ? Infinity : 0,
                                                        ease: "easeInOut"
                                                    }
                                                }}
                                            >
                                                <div className="h-full w-full rounded-full bg-background" />
                                            </motion.div>

                                            <Image
                                                src={member.img}
                                                alt={member.name}
                                                fill
                                                className="object-cover rounded-full border-2 border-background relative z-10"
                                                unoptimized
                                            />
                                        </motion.div>

                                        <motion.h3
                                            className="text-xl font-bold text-foreground mb-1"
                                            variants={nameGlowVariants}
                                        >
                                            {member.name}
                                        </motion.h3>
                                        <motion.p
                                            className="text-primary font-medium text-sm mb-4"
                                            animate={isActive(idx) ? {
                                                scale: [1, 1.08, 1],
                                                color: ["rgb(59, 130, 246)", "rgb(147, 51, 234)", "rgb(59, 130, 246)"]
                                            } : {}}
                                            transition={{
                                                duration: 1.5,
                                                repeat: isActive(idx) ? Infinity : 0,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            {member.role}
                                        </motion.p>

                                        <AnimatePresence>
                                            {isActive(idx) && (
                                                <motion.div
                                                    className="space-y-3 text-left text-sm"
                                                    initial={{ opacity: 0, height: 0, y: 20 }}
                                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: 20 }}
                                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                                >
                                                    <motion.div
                                                        className="flex items-start gap-2 group"
                                                        custom={0}
                                                        variants={infoItemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="hidden"
                                                    >
                                                        <GraduationCap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{member.education}</span>
                                                    </motion.div>
                                                    <motion.div
                                                        className="flex items-start gap-2 group"
                                                        custom={1}
                                                        variants={infoItemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="hidden"
                                                    >
                                                        <Briefcase className="h-4 w-4 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{member.experience}</span>
                                                    </motion.div>
                                                    <motion.div
                                                        className="flex items-start gap-2 group"
                                                        custom={2}
                                                        variants={infoItemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="hidden"
                                                    >
                                                        <Award className="h-4 w-4 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{member.achievements}</span>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style jsx>{`
            @keyframes spin-slow {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
            .animate-spin-slow {
                animation: spin-slow 8s linear infinite;
            }
        `}</style>
        </div>
    );
};

export default TeamSection;