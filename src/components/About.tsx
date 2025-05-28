"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, useTransform, AnimatePresence, useSpring } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Terminal, Database, Cpu, Layout, Layers } from 'lucide-react'
import { useTheme } from 'next-themes'

interface Skill {
    name: string;
    label: string;
    icon: React.ReactNode;
    description: string;
    details: string[];
    color: string;
    angle: number;
    radius: number;
    speed: number;
}

const skills: Skill[] = [
    {
        name: "Backend Developer",
        label: "Backend",
        icon: <Code size={20} />,
        description: "Building robust server-side applications",
        details: [
            "Go, Java, Python Development",
            "Microservices Architecture",
            "RESTful & GraphQL APIs",
            "High-Performance Systems",
            "Distributed Computing"
        ],
        color: "#6E56CF",
        angle: 0,
        radius: 540,
        speed: 0.3
    },
    {
        name: "DevOps Engineer",
        label: "DevOps",
        icon: <Terminal size={20} />,
        description: "Infrastructure & Deployment Expert",
        details: [
            "Docker & Kubernetes",
            "CI/CD Pipelines",
            "AWS & Cloud Services",
            "Infrastructure as Code",
            "Monitoring & Logging"
        ],
        color: "#1AD1A5",
        angle: 60,
        radius: 700,
        speed: -0.4
    },
    {
        name: "Database Architect",
        label: "Database",
        icon: <Database size={20} />,
        description: "Data Storage & Optimization",
        details: [
            "SQL & NoSQL Design",
            "Query Optimization",
            "Data Modeling",
            "Performance Tuning",
            "Distributed Databases"
        ],
        color: "#3B82F6",
        angle: 120,
        radius: 600,
        speed: 0.35
    },
    {
        name: "System Designer",
        label: "System",
        icon: <Cpu size={20} />,
        description: "Scalable System Architecture",
        details: [
            "System Design Patterns",
            "Load Balancing",
            "Caching Strategies",
            "Fault Tolerance",
            "Performance Optimization"
        ],
        color: "#F59E0B",
        angle: 180,
        radius: 680,
        speed: -0.25
    },
    {
        name: "Frontend Developer",
        label: "Frontend",
        icon: <Layout size={20} />,
        description: "Creating Beautiful User Interfaces",
        details: [
            "React & Next.js",
            "TypeScript",
            "Responsive Design",
            "Modern CSS",
            "User Experience"
        ],
        color: "#EC4899",
        angle: 240,
        radius: 540,
        speed: 0.45
    },
    {
        name: "Full Stack Engineer",
        label: "Full Stack",
        icon: <Layers size={20} />,
        description: "End-to-End Development",
        details: [
            "Complete Web Applications",
            "API Integration",
            "Database to UI",
            "Performance Optimization",
            "Best Practices"
        ],
        color: "#8B5CF6",
        angle: 300,
        radius: 620,
        speed: -0.3
    }
];

const SkillOrbit: React.FC<{
    skill: Skill;
    isActive: boolean;
    onHover: () => void;
    onHoverEnd: () => void;
    currentAngle: number;
}> = ({ skill, isActive, onHover, onHoverEnd, currentAngle }) => {
    const { theme } = useTheme();
    const angle = (currentAngle * Math.PI) / 180;
    const x = Math.cos(angle) * skill.radius;
    const y = Math.sin(angle) * skill.radius * 0.8;
    const scale = (y + skill.radius * 0.8) / (skill.radius * 1.6); // Adjusted scale calculation for y-axis compression
    const zIndex = Math.round(scale * 100) + 5; // Ensure orbits are generally above flat backgrounds but below active card

    return (
        <motion.div
            className="absolute pointer-events-auto" // Ensure individual orbits are interactive
            style={{
                left: '50%',
                top: '50%',
                x: x,
                y: y,
                zIndex: isActive ? 150 : zIndex, // Active orbit item slightly more prominent
            }}
            animate={{
                scale: 0.8 + scale * 0.4,
                opacity: 0.7 + scale * 0.3,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <motion.div
                className={`relative cursor-pointer group`}
                onMouseEnter={onHover}
                onMouseLeave={onHoverEnd}
                whileHover={{ scale: 1.25 }} // Slightly more pronounced hover for orbit items
                animate={{
                    y: isActive ? -10 : 0, // Lift active orbit item more
                }}
            >
                <motion.div
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{
                        background: skill.color,
                        opacity: isActive ? 0.7 : 0.35,
                    }}
                    animate={{
                        scale: isActive ? 1.6 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                />
                <motion.div
                    className={`relative px-4 py-2 rounded-full flex items-center gap-2
                        ${theme === 'dark'
                            ? 'bg-morandi-dark/85 border-morandi-accent/40' // Slightly more opaque
                            : 'bg-morandi-light/85 border-morandi-accent/40'
                        }
                        border backdrop-blur-lg`} // Slightly stronger blur
                    style={{
                        boxShadow: isActive
                            ? `0 0 35px ${skill.color}90`
                            : `0 0 20px ${skill.color}50`,
                    }}
                >
                    <div style={{ color: skill.color }}>
                        {skill.icon}
                    </div>
                    <span className={`font-medium text-sm whitespace-nowrap
                        ${theme === 'dark'
                            ? 'text-morandi-light'
                            : 'text-morandi-dark'
                        }`}
                    >
                        {skill.label}
                    </span>
                </motion.div>
                {/* Connection line logic can be complex with 3D tilts. 
                    For simplicity with the tilted orbit plane, ensure the SVG correctly maps coordinates.
                    The previous SVG logic for lines might need significant adjustment if the orbit plane itself is tilted.
                    For now, I'll keep the existing logic, but it might not look perfect with the new orbit plane tilt.
                */}
                {isActive && (
                    <svg
                        className="absolute left-1/2 top-1/2 pointer-events-none"
                        style={{
                            width: Math.max(100, Math.abs(x) * 2 + 50), // Ensure SVG is large enough
                            height: Math.max(100, Math.abs(y) * 2 + 50),
                            transform: 'translate(-50%, -50%)', // Center SVG on the item
                        }}
                    // viewBox might need dynamic adjustment based on x, y relative to the center of the orbit system.
                    >
                        <motion.line
                            x1="50%" // Center of the SVG (which is centered on the item)
                            y1="50%"
                            // Target point needs to be the projection of the main card's center onto the orbit item's plane
                            // This is a simplified line to the item's original position relative to SVG center
                            // For a true line to the screen center, calculations would be more complex
                            x2={x > 0 ? "0%" : "100%"} // This draws line from item towards global center
                            y2={y > 0 ? "0%" : "100%"} // (assuming item is away from center)
                            stroke={skill.color}
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.5 }}
                            transition={{ duration: 0.5 }}
                        />
                    </svg>
                )}
            </motion.div>
        </motion.div>
    );
};


export default function About() {
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
    const [angles, setAngles] = useState<Record<string, number>>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const { theme } = useTheme();
    const cardRef = useRef<HTMLDivElement>(null);
    const [cardHover, setCardHover] = useState(false);

    const mouseX = useSpring(0, { stiffness: 120, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 120, damping: 20 });
    const scaleSpring = useSpring(1, { stiffness: 180, damping: 20 });

    const cardRotateX = useTransform(mouseY, [-1, 1], [-12, 12]); // Reduced max rotation
    const cardRotateY = useTransform(mouseX, [-1, 1], [12, -12]); // Reduced max rotation
    const cardFloatY = useTransform(mouseY, [-1, 1], [-15, 15]); // Reduced float

    const glareX = useTransform(mouseX, [-1, 1], [100, -100]);
    const glareY = useTransform(mouseY, [-1, 1], [100, -100]);

    useEffect(() => {
        const initialAngles: Record<string, number> = {};
        skills.forEach(skill => {
            initialAngles[skill.name] = skill.angle;
        });
        setAngles(initialAngles);
    }, []);

    const animateOrbit = useCallback(() => {
        setAngles(prevAngles => {
            const newAngles = { ...prevAngles };
            skills.forEach(skill => {
                newAngles[skill.name] = (newAngles[skill.name] + skill.speed) % 360;
            });
            return newAngles;
        });
        requestRef.current = requestAnimationFrame(animateOrbit);
    }, []);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animateOrbit);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [animateOrbit]);

    const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const relativeX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const relativeY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        mouseX.set(relativeX);
        mouseY.set(relativeY);
    };

    const handleCardHover = (hovering: boolean) => {
        setCardHover(hovering);
        scaleSpring.set(hovering ? 1.08 : 1);
        if (!hovering) {
            mouseX.set(0);
            mouseY.set(0);
        }
    };

    useEffect(() => {
        // No explicit reset needed here now as springs naturally return to 0 when mouseX/Y are set to 0
    }, [cardHover]);


    const defaultInfo = {
        title: "Eric",
        subtitle: "Full Stack Engineer",
        description: [
            "I'm a passionate software engineer specializing in backend development and DevOps.",
            "My journey in tech started with backend systems and has grown to encompass full stack development.",
            "I'm always eager to learn and apply cutting-edge technologies to build scalable solutions."
        ]
    };

    const currentInfo = activeSkill ? {
        title: activeSkill.name,
        subtitle: activeSkill.description,
        description: activeSkill.details
    } : defaultInfo;

    const cardBaseColor = theme === 'dark' ? 'rgba(30, 30, 40, 0.65)' : 'rgba(245, 245, 240, 0.65)'; // Slightly more opaque for better separation
    const cardBorderColor = theme === 'dark' ? 'rgba(166, 139, 111, 0.15)' : 'rgba(139, 115, 85, 0.25)'; // Slightly softer border
    const activeCardBorderColor = activeSkill ? `${activeSkill.color}B3` : (theme === 'dark' ? 'rgba(199, 179, 151, 0.4)' : 'rgba(169, 135, 105, 0.5)');


    return (
        <section
            id="about"
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center bg-morandi-bg dark:bg-morandi-dark overflow-hidden px-4 py-10 md:py-20" // Adjusted padding
        >
            {/* Background effects - made even more subtle */}
            <div className="absolute inset-0 -z-20"> {/* Pushed further back */}
                <div className="absolute inset-0 bg-gradient-to-br from-morandi-accent/3 via-transparent to-morandi-hover/3" />
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: 300 + i * 150, // Spaced out more
                            height: 300 + i * 150,
                            left: '50%', top: '50%', x: '-50%', y: '-50%',
                            border: '1px solid',
                            borderColor: theme === 'dark' ? 'rgba(166, 139, 111, 0.02)' : 'rgba(139, 115, 85, 0.02)', // Even fainter
                            opacity: 0.5, // Reduced opacity
                        }}
                        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                        transition={{ duration: 120 + i * 30, repeat: Infinity, ease: "linear" }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-20" // Adjusted margin
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-morandi-dark dark:text-morandi-light">
                    About Me
                </h2>
                <p className="text-lg text-morandi-text dark:text-morandi-light/80">
                    Hover over the skills to explore my expertise
                </p>
            </motion.div>

            {/* Main Interaction Area with explicit 3D context */}
            <div
                className="relative flex items-center justify-center"
                style={{
                    width: '100%',
                    maxWidth: '1400px', // Max width for the interaction area
                    height: 'calc(min(80vh, 900px))', // Responsive height
                    transformStyle: 'preserve-3d', // Key for better 3D layering
                    perspective: '2000px', // Perspective for the whole interaction area
                }}
            >
                {/* Orbit system container */}
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none" // 전체 컨테이너는 포인터 이벤트 무시
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div
                        className="relative"
                        style={{
                            width: '1px', // Center point for orbit system, actual size determined by radius
                            height: '1px',
                            transformStyle: 'preserve-3d',
                            transform: 'rotateX(25deg) rotateY(0deg) translateZ(-100px)', // Tilt the entire orbit plane and push back
                        }}
                    >
                        {skills.map((skill) => (
                            <SkillOrbit
                                key={skill.name}
                                skill={skill}
                                isActive={activeSkill?.name === skill.name}
                                // MODIFIED: Removed !cardHover condition
                                onHover={() => setActiveSkill(skill)}
                                onHoverEnd={() => setActiveSkill(null)}
                                currentAngle={angles[skill.name] || skill.angle}
                            />
                        ))}
                    </div>
                </div>

                {/* Central Card Wrapper */}
                <motion.div
                    ref={cardRef}
                    className="relative" // zIndex managed by style prop
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                        transformStyle: 'preserve-3d',
                        // perspective: '1200px', // Perspective now on parent
                        rotateX: cardRotateX,
                        rotateY: cardRotateY,
                        translateY: cardFloatY,
                        scale: scaleSpring,
                        zIndex: cardHover || activeSkill ? 100 : 20, // Card is prominent if hovered or skill active
                        boxShadow: cardHover
                            ? `0 ${15 + Math.abs(cardFloatY.get())}px 60px -10px ${activeSkill?.color || '#A68B6F'}66, 0 0 30px -5px ${activeSkill?.color || '#A68B6F'}44`
                            : `0 6px 28px -8px rgba(0,0,0,0.2)`,
                    }}
                    onMouseMove={handleCardMouseMove}
                    onMouseEnter={() => handleCardHover(true)}
                    onMouseLeave={() => handleCardHover(false)}
                    whileTap={{ scale: activeSkill ? 1.02 : 0.98 }}
                >
                    <Card
                        className="relative w-[350px] md:w-[360px] rounded-3xl overflow-hidden border transition-all duration-300 ease-out"
                        style={{
                            background: cardBaseColor,
                            borderColor: cardHover ? activeCardBorderColor : cardBorderColor,
                            backdropFilter: 'blur(24px) saturate(160%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                            transform: 'translateZ(80px)', // Bring card forward
                            boxShadow: `inset 0 0 70px ${theme === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)'}`,
                        }}
                    >
                        <motion.div
                            className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
                            style={{
                                background: `radial-gradient(circle at ${50 + glareX.get() / 2.5}% ${50 + glareY.get() / 2.5}%, ${activeSkill?.color || (theme === 'dark' ? '#FFFFFF' : '#000000')}1A, transparent 55%)`,
                                opacity: cardHover ? 0.9 : 0,
                                transition: 'opacity 0.3s',
                                mixBlendMode: theme === 'dark' ? 'overlay' : 'hard-light', // Different blend for light theme
                            }}
                        />
                        <motion.div
                            className="absolute inset-0 z-0 opacity-25" // Softer aurora
                            style={{
                                backgroundImage: `radial-gradient(circle at center, ${activeSkill?.color || '#A68B6F'}22 0%, transparent 65%)`,
                                scale: cardHover ? 1.6 : 1.3,
                                x: useTransform(mouseX, [-1, 1], [-15, 15]),
                                y: useTransform(mouseY, [-1, 1], [-15, 15]),
                                transition: 'scale 0.5s ease-out',
                                filter: 'blur(35px)', // More blur
                            }}
                        />
                        <motion.div
                            className="relative z-10"
                            style={{
                                x: useTransform(mouseX, v => v * (activeSkill ? -7 : -4)),
                                y: useTransform(mouseY, v => v * (activeSkill ? -7 : -4)),
                            }}
                        >
                            <CardContent className="p-6 md:p-8"> {/* Responsive padding */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentInfo.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                        className="text-center"
                                    >
                                        <motion.div
                                            className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 md:mb-8 relative"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {activeSkill ? (
                                                <motion.div
                                                    className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                                                    style={{
                                                        border: `3px solid ${activeSkill.color}A6`,
                                                        boxShadow: `0 0 20px -4px ${activeSkill.color}88, inset 0 0 12px ${activeSkill.color}44`,
                                                    }}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.1, type: 'spring', stiffness: 150, damping: 15 }}
                                                >
                                                    <motion.div
                                                        className="absolute inset-0 z-0"
                                                        style={{
                                                            backgroundImage: `radial-gradient(circle, ${activeSkill.color}22 15%, transparent 60%)`,
                                                            scale: 1.4,
                                                            opacity: 0.6,
                                                        }}
                                                        animate={cardHover || activeSkill ? { scale: [1.4, 1.7, 1.4], opacity: [0.6, 0.9, 0.6] } : {}}
                                                        transition={cardHover || activeSkill ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
                                                    />
                                                    <div style={{ color: activeSkill.color, transform: 'scale(2)', zIndex: 1 }}>
                                                        {React.cloneElement(activeSkill.icon as React.ReactElement, { size: (activeSkill.icon as React.ReactElement).props.size || 20 })}
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <>
                                                    <Image
                                                        src="/img/my.png" alt="Eric" fill
                                                        className="rounded-full object-cover"
                                                        style={{ boxShadow: `0 0 18px -4px ${theme === 'dark' ? 'rgba(166,139,111,0.4)' : 'rgba(100,80,60,0.3)'}` }}
                                                    />
                                                    <motion.div
                                                        className="absolute inset-0 rounded-full"
                                                        animate={{
                                                            boxShadow: [
                                                                `0 0 0 0px ${theme === 'dark' ? 'rgba(166,139,111,0.25)' : 'rgba(139,115,85,0.25)'}`,
                                                                `0 0 0 12px ${theme === 'dark' ? 'rgba(166,139,111,0)' : 'rgba(139,115,85,0)'}`,
                                                                `0 0 0 0px ${theme === 'dark' ? 'rgba(166,139,111,0)' : 'rgba(139,115,85,0)'}`,
                                                            ]
                                                        }}
                                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                                    />
                                                </>
                                            )}
                                        </motion.div>

                                        <h3 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-morandi-dark dark:text-morandi-light">
                                            {currentInfo.title}
                                        </h3>
                                        <p className="text-morandi-text/75 dark:text-morandi-light/75 mb-5 md:mb-6 text-sm md:text-base">
                                            {currentInfo.subtitle}
                                        </p>
                                        <div className="space-y-2.5 md:space-y-3 text-left">
                                            {currentInfo.description.map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -15 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.15 + index * 0.07, ease: [0.4, 0, 0.2, 1] }}
                                                    className="flex items-center gap-2.5 md:gap-3"
                                                >
                                                    <div
                                                        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0" // Added flex-shrink-0
                                                        style={{
                                                            backgroundColor: activeSkill?.color || (theme === 'dark' ? '#A68B6F' : '#8B7355'),
                                                            boxShadow: `0 0 4px ${(activeSkill?.color || (theme === 'dark' ? '#A68B6F' : '#8B7355'))}70`
                                                        }}
                                                    />
                                                    <p className="text-xs md:text-sm text-morandi-text dark:text-morandi-light/80">
                                                        {item}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </CardContent>
                        </motion.div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}