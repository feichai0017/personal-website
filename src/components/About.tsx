"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import { motion, useTransform, AnimatePresence, useSpring } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Terminal, Database, Cpu, Layout, Layers } from 'lucide-react'
import { useTheme } from 'next-themes'
import { createSeededRandom } from "@/lib/seeded-random"

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
        radius: 580,
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
        radius: 620,
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
        radius: 640,
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
        radius: 580,
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
        radius: 610,
        speed: -0.3
    }
];

const SkillOrbit: React.FC<{
    skill: Skill;
    isActive: boolean;
    onHover: () => void;
    onHoverEnd: () => void;
    isPaused: boolean;
    containerSize: { width: number; height: number };
}> = ({ skill, isActive, onHover, onHoverEnd, isPaused, containerSize }) => {
    const { theme } = useTheme();
    const [currentAngle, setCurrentAngle] = useState(skill.angle);
    const round3 = (value: number) => Math.round(value * 1000) / 1000;

    useEffect(() => {
        if (isPaused) return;
        let frameId: number;
        let lastTime = performance.now();
        const targetInterval = 1000 / 30; // ~30fps to reduce re-render pressure

        const animate = (time: number) => {
            if (time - lastTime >= targetInterval) {
                setCurrentAngle(prev => {
                    const nextValue = (prev + skill.speed) % 360;
                    return nextValue < 0 ? nextValue + 360 : nextValue;
                });
                lastTime = time;
            }
            frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [isPaused, skill.speed]);

    const angle = (currentAngle * Math.PI) / 180;
    const x = round3(Math.cos(angle) * skill.radius);
    const y = round3(Math.sin(angle) * skill.radius * 0.4);
    const scale = round3((y + skill.radius * 0.4) / (skill.radius * 0.8));
    const zIndex = Math.round(scale * 50) + 5;

    const tagWidth = 120;
    const tagHeight = 40;
    const margin = 20;

    const absoluteX = containerSize.width / 2 + x;
    const absoluteY = containerSize.height / 2 + y;

    const isOutOfBounds =
        absoluteX - tagWidth / 2 < margin ||
        absoluteX + tagWidth / 2 > containerSize.width - margin ||
        absoluteY - tagHeight / 2 < margin ||
        absoluteY + tagHeight / 2 > containerSize.height - margin;

    return (
        <motion.div
            className="absolute pointer-events-auto"
            style={{
                left: '50%',
                top: '50%',
                x: x,
                y: y,
                zIndex: isActive ? 80 : zIndex,
                opacity: isOutOfBounds ? 0 : 1,
            }}
            animate={{
                scale: 0.8 + scale * 0.4,
                opacity: isOutOfBounds ? 0 : (0.7 + scale * 0.3),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <motion.div
                className={`relative cursor-pointer group`}
                onMouseEnter={onHover}
                onMouseLeave={onHoverEnd}
                whileHover={{ scale: 1.25 }}
                animate={{
                    y: isActive ? -10 : 0,
                }}
            >
                {/* 增强的光环效果 */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(from 0deg, ${skill.color}40, transparent, ${skill.color}40)`,
                        filter: 'blur(20px)',
                    }}
                    animate={{
                        scale: isActive ? 2 : 1.2,
                        rotate: 360,
                        opacity: isActive ? 0.8 : 0.4,
                    }}
                    transition={{
                        scale: { type: "spring", stiffness: 200, damping: 15 },
                        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 0.3 }
                    }}
                />

                {/* 脉冲光环 */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                        borderColor: skill.color,
                        opacity: isActive ? 0.6 : 0,
                    }}
                    animate={{
                        scale: isActive ? [1, 1.8, 1] : 1,
                        opacity: isActive ? [0.6, 0, 0.6] : 0,
                    }}
                    transition={{
                        duration: 2,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeOut"
                    }}
                />

                <motion.div
                    className={`relative px-4 py-2 rounded-full flex items-center gap-2
                        ${theme === 'dark'
                            ? 'bg-morandi-dark/90 border-morandi-accent/30'
                            : 'bg-morandi-light/90 border-morandi-accent/30'
                        }
                        border backdrop-blur-xl`}
                    style={{
                        boxShadow: isActive
                            ? `0 8px 32px ${skill.color}50, 0 0 20px ${skill.color}30`
                            : `0 4px 16px ${skill.color}30`,
                        borderColor: isActive ? `${skill.color}60` : undefined,
                    }}
                    animate={{
                        y: isActive ? [0, -2, 0] : 0,
                    }}
                    transition={{
                        duration: 2,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeInOut"
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
            </motion.div>
        </motion.div>
    );
};


export default function About() {
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
    const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const cardRef = useRef<HTMLDivElement>(null);
    const [cardHover, setCardHover] = useState(false);

    const mouseX = useSpring(0, { stiffness: 120, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 120, damping: 20 });
    const scaleSpring = useSpring(1, { stiffness: 180, damping: 20 });

    const cardRotateX = useTransform(mouseY, [-1, 1], [-12, 12]);
    const cardRotateY = useTransform(mouseX, [-1, 1], [12, -12]);
    const cardFloatY = useTransform(mouseY, [-1, 1], [-15, 15]);

    const glareX = useTransform(mouseX, [-1, 1], [100, -100]);
    const glareY = useTransform(mouseY, [-1, 1], [100, -100]);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setContainerSize({ width: rect.width, height: rect.height });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const handleSkillHover = (skillName: string) => {
        setActiveSkill(skills.find(s => s.name === skillName) || null);
    };

    const handleSkillHoverEnd = (skillName: string) => {
        setActiveSkill(current => (current?.name === skillName ? null : current));
    };

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

    const cardBaseColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(245, 245, 240, 0.85)';
    const cardBorderColor = theme === 'dark' ? 'rgba(166, 139, 111, 0.2)' : 'rgba(139, 115, 85, 0.3)';
    const activeCardBorderColor = activeSkill ? `${activeSkill.color}B3` : (theme === 'dark' ? 'rgba(199, 179, 151, 0.5)' : 'rgba(169, 135, 105, 0.6)');

    return (
        <section
            id="about"
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center bg-morandi-bg dark:bg-[#03040a] overflow-hidden px-4 py-10 md:py-20 transition-colors duration-500"
        >
            {/* 增强的背景效果 */}
            <div className="absolute inset-0 -z-20">
                {/* 主背景渐变 */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: activeSkill
                            ? `radial-gradient(circle at 50% 50%, ${activeSkill.color}08 0%, transparent 70%)`
                            : 'radial-gradient(circle at 50% 50%, rgba(166, 139, 111, 0.03) 0%, transparent 70%)'
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* 动态光环 */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: 400 + i * 200,
                            height: 400 + i * 200,
                            left: '50%', top: '50%', x: '-50%', y: '-50%',
                            border: '1px solid',
                            borderColor: activeSkill
                                ? `${activeSkill.color}15`
                                : theme === 'dark' ? 'rgba(166, 139, 111, 0.05)' : 'rgba(139, 115, 85, 0.03)',
                        }}
                        animate={{
                            rotate: i % 2 === 0 ? 360 : -360,
                            scale: activeSkill ? [1, 1.05, 1] : 1
                        }}
                        transition={{
                            rotate: { duration: 60 + i * 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />
                ))}

                {/* 星尘效果 */}
                {useMemo(() => {
                    const rand = createSeededRandom(42);
                    return Array.from({ length: 8 }, (_, i) => ({
                        key: `star-${i}`,
                        left: 20 + rand() * 60,
                        top: 20 + rand() * 60,
                        duration: 2 + rand() * 3,
                        delay: i * 0.5,
                    }));
                }, []).map(({ key, left, top, duration, delay }) => (
                    <motion.div
                        key={key}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            background: activeSkill ? activeSkill.color : '#A68B6F',
                            left: `${left}%`,
                            top: `${top}%`,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration,
                            repeat: Infinity,
                            delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-20"
            >
                <motion.h2
                    className="text-4xl md:text-5xl font-bold mb-4 text-morandi-dark dark:text-morandi-light relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="relative">
                        About Me
                        {/* 动态下划线 */}
                        <motion.div
                            className="absolute -bottom-2 left-1/2 h-0.5 rounded-full"
                            style={{
                                background: activeSkill
                                    ? `linear-gradient(90deg, transparent, ${activeSkill.color}, transparent)`
                                    : 'linear-gradient(90deg, transparent, #A68B6F, transparent)',
                            }}
                            initial={{ width: 0, x: '-50%' }}
                            animate={{
                                width: activeSkill ? '120%' : '80%',
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                width: { duration: 0.6, ease: "easeOut" },
                                opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                        />
                    </span>
                </motion.h2>
                <motion.p
                    className="text-lg text-morandi-text dark:text-morandi-light/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <motion.span
                        animate={{
                            color: activeSkill ? activeSkill.color : undefined
                        }}
                        transition={{ duration: 0.4 }}
                    >
                        Hover over the skills
                    </motion.span>
                    {" to explore my expertise"}
                </motion.p>
            </motion.div>

            {/* Main Interaction Area */}
            <div
                className="relative flex items-center justify-center"
                style={{
                    width: '100%',
                    maxWidth: '2000px',
                    height: '1100px',
                    transformStyle: 'preserve-3d',
                    perspective: '2000px',
                }}
            >

                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div
                        className="relative"
                        style={{
                            width: '1px',
                            height: '1px',
                            transformStyle: 'preserve-3d',
                            transform: 'rotateX(15deg) rotateY(0deg)',
                        }}
                    >
                        {skills.map((skill) => (
                            <SkillOrbit
                                key={skill.name}
                                skill={skill}
                                isActive={activeSkill?.name === skill.name}
                                onHover={() => handleSkillHover(skill.name)}
                                onHoverEnd={() => handleSkillHoverEnd(skill.name)}
                                isPaused={activeSkill?.name === skill.name}
                                containerSize={containerSize}
                            />
                        ))}
                    </div>
                </div>

                {/* Central Card Wrapper */}
                <motion.div
                    ref={cardRef}
                    className="relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                        transformStyle: 'preserve-3d',
                        rotateX: cardRotateX,
                        rotateY: cardRotateY,
                        translateY: cardFloatY,
                        scale: scaleSpring,
                        zIndex: 100,
                    }}
                    onMouseMove={handleCardMouseMove}
                    onMouseEnter={() => handleCardHover(true)}
                    onMouseLeave={() => handleCardHover(false)}
                    whileTap={{ scale: activeSkill ? 1.02 : 0.98 }}
                >
                    <Card
                        className="relative w-[380px] md:w-[400px] rounded-3xl overflow-hidden border transition-all duration-500 ease-out"
                        style={{
                            background: cardBaseColor,
                            borderColor: cardHover ? activeCardBorderColor : cardBorderColor,
                            backdropFilter: 'blur(32px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                            transform: 'translateZ(80px)',
                            boxShadow: cardHover
                                ? `0 20px 60px -12px rgba(0,0,0,0.25), 
                                   0 0 40px -8px ${activeSkill?.color || '#A68B6F'}60,
                                   0 0 80px -20px ${activeSkill?.color || '#A68B6F'}30,
                                   inset 0 1px 0 rgba(255,255,255,${theme === 'dark' ? 0.1 : 0.2}),
                                   inset 0 0 80px ${theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.4)'}`
                                : `0 8px 32px -12px rgba(0,0,0,0.15),
                                   0 0 20px -8px ${activeSkill?.color || '#A68B6F'}20,
                                   inset 0 1px 0 rgba(255,255,255,${theme === 'dark' ? 0.05 : 0.15}),
                                   inset 0 0 60px ${theme === 'dark' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.3)'}`,
                        }}
                    >
                        {/* 动态边框光效 */}
                        <motion.div
                            className="absolute inset-0 rounded-3xl pointer-events-none"
                            style={{
                                background: `conic-gradient(from 0deg, ${activeSkill?.color || '#A68B6F'}60, transparent, ${activeSkill?.color || '#A68B6F'}60)`,
                                padding: '2px',
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                maskComposite: 'xor',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                opacity: activeSkill && cardHover ? 0.8 : 0,
                            }}
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />

                        {/* 增强的背景光效 */}
                        <motion.div
                            className="absolute inset-0 z-0 rounded-3xl"
                            style={{
                                background: `radial-gradient(circle at ${50 + glareX.get() * 30}% ${50 + glareY.get() * 30}%, ${activeSkill?.color || '#A68B6F'}15 0%, transparent 70%)`,
                                opacity: cardHover ? 1 : 0.3,
                                filter: 'blur(40px)',
                            }}
                            animate={{
                                scale: cardHover ? 1.5 : 1.2,
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />

                        <motion.div
                            className="relative z-10"
                            style={{
                                x: useTransform(mouseX, v => v * (activeSkill ? -7 : -4)),
                                y: useTransform(mouseY, v => v * (activeSkill ? -7 : -4)),
                            }}
                        >
                            <CardContent className="p-6 md:p-8">
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
                                                        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
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
