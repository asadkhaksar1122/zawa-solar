"use client"
import React from "react";
import { motion } from 'framer-motion';
import { Sun, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
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

    return (
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
    );
};

export default HeroSection;