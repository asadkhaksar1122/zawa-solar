"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Briefcase, Award, Sparkles, Star, Zap } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useGetTeamMembersQuery } from "@/lib/redux/api/teamMemberApi";

// Types
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

// --- Skeleton Loader ---
const SkeletonCard = () => (
    <div className="animate-pulse">
        <Card className="rounded-2xl border border-border/50 h-full bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl shadow-xl">
            <CardContent className="p-6 text-center">
                <div className="h-[150px] w-[150px] mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-3/4 mx-auto rounded bg-gray-200 dark:bg-gray-800 mb-2" />
                <div className="h-3 w-1/2 mx-auto rounded bg-gray-200 dark:bg-gray-800 mb-6" />
                <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
            </CardContent>
        </Card>
    </div>
);

// --- Error State ---
const ErrorCard = () => (
    <Card className="rounded-2xl border border-red-500/50 bg-red-50 dark:bg-red-900/20 shadow-xl text-center p-6">
        <p className="text-red-600 dark:text-red-400 font-semibold mb-2">⚠️ Oops!</p>
        <p className="text-sm text-muted-foreground">
            Failed to load team members. Please try again later.
        </p>
    </Card>
);

const TeamSection: React.FC<TeamSectionProps> = ({ teamMembers }) => {
    const { data, isLoading, error } = useGetTeamMembersQuery();

    const defaultTeamMembers: TeamMember[] = [ /* your original fallback data */];

    const members: TeamMember[] =
        data && Array.isArray(data) && data.length > 0 ? data : (teamMembers || defaultTeamMembers);

    const [hovered, setHovered] = useState<number | null>(null);
    const [touched, setTouched] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024 || "ontouchstart" in window);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleInteractionStart = (idx: number) => {
        if (isMobile) setTouched(touched === idx ? null : idx);
        else setHovered(idx);
    };

    const handleInteractionEnd = () => {
        if (!isMobile) setHovered(null);
    };

    const isActive = (idx: number) => (isMobile ? touched === idx : hovered === idx);

    // ✅ All your original animation variants restored
    const cardVariants = {
        rest: {
            scale: 1, y: 0, rotateX: 0, rotateY: 0,
            boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
            transition: { duration: 0.6, type: "spring", stiffness: 200, damping: 20 }
        },
        hover: {
            scale: 1.08, y: -15, rotateX: -8, rotateY: 8,
            boxShadow: "0 40px 80px -20px rgba(0, 0, 0, 0.4)",
            transition: { duration: 0.3, type: "spring", stiffness: 400, damping: 25 }
        }
    };
    const imageContainerVariants = {
        rest: { scale: 1, rotate: 0 },
        hover: {
            scale: 1.15, rotate: [0, -3, 3, -2, 2, 0],
            filter: "brightness(1.1) saturate(1.2)",
            transition: {
                scale: { duration: 0.3, ease: "easeOut" },
                rotate: { duration: 0.8, ease: "easeInOut", times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
                filter: { duration: 0.3 }
            }
        }
    };
    const pulseRingVariants = { rest: { scale: 1, opacity: 0 }, hover: { scale: [1, 1.8, 2.2], opacity: [0, .6, 0], transition: { duration: 1.2, repeat: Infinity, ease: "easeOut" } } };
    const shimmerVariants = { rest: { backgroundPosition: "-200% center" }, hover: { backgroundPosition: "200% center", transition: { duration: 1.5, repeat: Infinity, ease: "linear" } } };
    const floatingIconVariants = { rest: { y: 0, opacity: 0, scale: 0 }, hover: { y: [-20, -25, -20], opacity: [0, 1, 0], scale: [0, 1, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut", times: [0, .5, 1] } } };
    const infoItemVariants = { hidden: { x: -30, opacity: 0, scale: .8, rotateX: -90 }, visible: (i: number) => ({ x: 0, opacity: 1, scale: 1, rotateX: 0, transition: { delay: i * 0.1, duration: .5, type: "spring", stiffness: 100, damping: 12 } }) };
    const nameGlowVariants = { rest: { textShadow: "0 0 0px rgba(var(--primary-rgb), 0)" }, hover: { textShadow: ["0 0 30px rgba(59, 130, 246, 0.8)", "0 0 60px rgba(147, 51, 234, 0.6)", "0 0 30px rgba(59, 130, 246, 0.8)"], scale: [1, 1.02, 1], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } } };
    const teamContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.15 } } };
    const teamCardVariants = { hidden: { opacity: 0, y: 60, scale: 0.8, rotateX: -30 }, visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: "spring", damping: 15, stiffness: 100, duration: 0.8 } } };
    const titleVariants = { hidden: { opacity: 0, y: -30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, type: "spring", stiffness: 100 } } };

    return (
        <div className="py-16 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div className="text-center mb-12" variants={titleVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <motion.h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                        Our Expert Team
                    </motion.h2>
                    <motion.p className="text-muted-foreground mt-2">Meet the brilliant minds behind our success</motion.p>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : error ? (
                    <div className="flex justify-center"><ErrorCard /></div>
                ) : (
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={teamContainerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {members.map((member, idx) => (
                            <motion.div key={idx} className="relative" variants={teamCardVariants}
                                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                                <motion.div variants={cardVariants} className="relative will-change-transform"
                                    initial="rest" animate={isActive(idx) ? "hover" : "rest"}
                                    whileHover={!isMobile ? "hover" : undefined}
                                    whileTap={isMobile ? { scale: 0.98 } : undefined}
                                    style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                                    onHoverStart={() => !isMobile && setHovered(idx)}
                                    onHoverEnd={() => !isMobile && setHovered(null)}
                                    onTouchStart={() => isMobile && handleInteractionStart(idx)}
                                    onClick={() => isMobile && handleInteractionStart(idx)}>

                                    {/* ✨ Floating Icons */}
                                    <AnimatePresence>
                                        {isActive(idx) && (
                                            <>
                                                <motion.div className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 z-30"
                                                    variants={floatingIconVariants} initial="rest" animate="hover" exit="rest">
                                                    <Star size={28} fill="currentColor" className="drop-shadow-lg" />
                                                </motion.div>
                                                <motion.div className="absolute -top-6 left-1/4 text-primary z-30"
                                                    variants={floatingIconVariants} initial="rest" animate="hover" exit="rest"
                                                    style={{ animationDelay: "0.3s" }}>
                                                    <Sparkles size={22} className="drop-shadow-lg" />
                                                </motion.div>
                                                <motion.div className="absolute -top-6 right-1/4 text-purple-500 z-30"
                                                    variants={floatingIconVariants} initial="rest" animate="hover" exit="rest"
                                                    style={{ animationDelay: "0.6s" }}>
                                                    <Zap size={22} fill="currentColor" className="drop-shadow-lg" />
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>

                                    <Card className="rounded-2xl border border-border/50 overflow-visible h-full cursor-pointer relative bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-primary/30">
                                        {/* shimmer overlay */}
                                        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-20"
                                            variants={shimmerVariants} initial="rest" animate={isActive(idx) ? "hover" : "rest"}
                                            style={{
                                                background: "linear-gradient(105deg, transparent 30%, rgba(59, 130, 246, 0.3) 50%, rgba(147, 51, 234, 0.3) 70%, transparent 90%)",
                                                backgroundSize: "200% 100%", opacity: isActive(idx) ? 1 : 0
                                            }} />

                                        <CardContent className="p-6 text-center relative">
                                            <motion.div className="relative h-[150px] w-[150px] mx-auto mb-4" variants={imageContainerVariants}>
                                                <motion.div className="absolute inset-0 rounded-full border-2 border-primary/40" variants={pulseRingVariants} />
                                                <motion.div className="absolute inset-0 rounded-full border-2 border-primary/30" variants={pulseRingVariants} style={{ animationDelay: "0.5s" }} />
                                                <Image src={member.img} alt={member.name} fill className="object-cover rounded-full border-2 border-background relative z-10" unoptimized />
                                            </motion.div>

                                            <motion.h3 className="text-xl font-bold text-foreground mb-1" variants={nameGlowVariants}>
                                                {member.name}
                                            </motion.h3>
                                            <motion.p className="text-primary font-medium text-sm mb-4">
                                                {member.role}
                                            </motion.p>

                                            {/* 🚀 Info appears only when active */}
                                            <AnimatePresence>
                                                {isActive(idx) && (
                                                    <motion.div className="space-y-3 text-left text-sm"
                                                        initial={{ opacity: 0, height: 0, y: 20 }}
                                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                                        exit={{ opacity: 0, height: 0, y: 20 }}
                                                        transition={{ duration: 0.4, ease: "easeOut" }}>
                                                        <motion.div className="flex items-start gap-2 group" custom={0}
                                                            variants={infoItemVariants} initial="hidden" animate="visible" exit="hidden">
                                                            <GraduationCap className="h-4 w-4 text-primary mt-0.5" />
                                                            <span className="text-muted-foreground">{member.education}</span>
                                                        </motion.div>
                                                        <motion.div className="flex items-start gap-2 group" custom={1}
                                                            variants={infoItemVariants} initial="hidden" animate="visible" exit="hidden">
                                                            <Briefcase className="h-4 w-4 text-primary mt-0.5" />
                                                            <span className="text-muted-foreground">{member.experience}</span>
                                                        </motion.div>
                                                        <motion.div className="flex items-start gap-2 group" custom={2}
                                                            variants={infoItemVariants} initial="hidden" animate="visible" exit="hidden">
                                                            <Award className="h-4 w-4 text-primary mt-0.5" />
                                                            <span className="text-muted-foreground">{member.achievements}</span>
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
                )}
            </div>
        </div>
    );
};

export default TeamSection;