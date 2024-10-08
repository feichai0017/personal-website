"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, useMotionValue, useTransform, useScroll, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Globe, TrendingUp, Bitcoin, Wallet } from 'lucide-react'

interface Skill {
    name: string;
    icon: React.ReactNode | string;
    description: string;
    size: number;
    speed: number;
    clockwise: boolean;
    color: string;
}

const skills: Skill[] = [
    { name: "Me", icon: "/img/my.png", description: "Blockchain Enthusiast", size: 2.2, speed: 0, clockwise: false, color: "#E2C2B9" },
    { name: "Community", icon: <Users />, description: "Web3 Community Builder", size: 1.5, speed: 25, clockwise: true, color: "#6E56CF" },
    { name: "DeFi", icon: <Wallet />, description: "DeFi Protocol Developer", size: 1.3, speed: 30, clockwise: false, color: "#1AD1A5" },
    { name: "Web3", icon: <Globe />, description: "Decentralized App Developer", size: 1.4, speed: 35, clockwise: true, color: "#3B82F6" },
    { name: "Crypto", icon: <Bitcoin />, description: "Cryptocurrency Analyst", size: 1.4, speed: 27, clockwise: true, color: "#F59E0B" },
    { name: "Trading", icon: <TrendingUp />, description: "Algorithmic Trading Expert", size: 1.2, speed: 32, clockwise: false, color: "#EC4899" },
]

export default function About() {
    const [activeSkill, setActiveSkill] = useState<Skill>(skills[0])
    const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)
    const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null)
    const [isAvatarHovered, setIsAvatarHovered] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const rotateX = useTransform(y, [-300, 300], [15, -15])
    const rotateY = useTransform(x, [-300, 300], [-15, 15])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (rect) {
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            x.set(e.clientX - centerX)
            y.set(e.clientY - centerY)
        }
    }, [x, y])

    const handleMouseLeave = useCallback(() => {
        x.set(0)
        y.set(0)
    }, [x, y])

    const handleHover = (skill: Skill) => {
        setHoveredSkill(skill)
    }

    const handleHoverEnd = () => {
        setHoveredSkill(null)
    }

    const handleClick = (skill: Skill) => {
        setActiveSkill(skill)
    }

    const paragraphs = [
        "I'm a passionate blockchain developer with expertise in various Web3 technologies.",
        "My journey in the crypto space started with a fascination for decentralized systems and innovative problem-solving.",
        "I'm always eager to learn and apply cutting-edge blockchain technologies to create innovative decentralized solutions."
    ]

    useEffect(() => {
        const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles: { x: number; y: number; size: number; speedX: number; speedY: number; color: string }[] = [];
        const colors = ['#6E56CF', '#1AD1A5', '#3B82F6', '#F59E0B', '#EC4899'];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        const drawParticles = () => {
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            for (const particle of particles) {
                ctx!.beginPath();
                ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx!.fillStyle = particle.color;
                ctx!.fill();

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            }
            animationFrameId = requestAnimationFrame(drawParticles);
        };

        drawParticles();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <section id="about" className="min-h-screen relative flex items-center justify-center bg-morandi-bg overflow-hidden px-4 md:px-8 lg:px-16" ref={containerRef}>
            <canvas id="particle-canvas" className="absolute inset-0 z-0 opacity-30"></canvas>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 z-10">
                {/* Card */}
                <motion.div
                    className="w-full max-w-[500px] perspective-1000"
                    style={{ scale, opacity }}
                >
                    <motion.div
                        ref={cardRef}
                        style={{
                            rotateX,
                            rotateY,
                            transition: "all 0.8s cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s"
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Card className="bg-morandi-muted bg-opacity-60 backdrop-blur-lg border border-morandi-accent border-opacity-40 shadow-xl overflow-hidden">
                            <CardContent className="p-6 md:p-8">
                                <motion.div className="flex flex-col items-center">
                                    <motion.h1
                                        className="text-3xl md:text-4xl font-bold text-morandi-text mb-4"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        whileHover={{
                                            scale: 1.1,
                                            color: "var(--morandi-accent)",
                                            textShadow: "0 0 8px rgba(var(--morandi-accent-rgb), 0.5)",
                                            transition: { type: "spring", stiffness: 400, damping: 8 }
                                        }}
                                    >
                                        About Me
                                    </motion.h1>
                                    <motion.p
                                        className="text-base md:text-lg text-morandi-text mb-6"
                                        whileHover={{
                                            scale: 1.2,
                                            color: "var(--morandi-accent)",
                                            textShadow: "0 0 8px rgba(var(--morandi-accent-rgb), 0.5)",
                                            transition: { type: "spring", stiffness: 400, damping: 8 }
                                        }}
                                    >
                                        Eric | Blockchain Developer
                                    </motion.p>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={hoveredSkill ? hoveredSkill.name : activeSkill.name}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-center mb-6"
                                        >
                                            <motion.h3
                                                className="text-lg md:text-xl font-semibold mb-2"
                                                initial={{ scale: 1 }}
                                                animate={{ scale: 1.1 }}
                                                whileHover={{
                                                    scale: 1.3,
                                                    textShadow: "0 0 8px rgba(var(--morandi-accent-rgb), 0.5)",
                                                    transition: { type: "spring", stiffness: 400, damping: 8 }
                                                }}
                                                style={{ color: hoveredSkill ? hoveredSkill.color : activeSkill.color }}
                                            >
                                                {hoveredSkill ? hoveredSkill.name : activeSkill.name}
                                            </motion.h3>
                                            <motion.p
                                                className="text-morandi-text text-sm md:text-base"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                whileHover={{
                                                    scale: 1.1,
                                                    textShadow: "0 0 8px rgba(var(--morandi-accent-rgb), 0.5)",
                                                    transition: { type: "spring", stiffness: 400, damping: 8 }
                                                }}
                                            >
                                                {hoveredSkill ? hoveredSkill.description : activeSkill.description}
                                            </motion.p>
                                        </motion.div>
                                    </AnimatePresence>
                                    <div className="text-morandi-text text-sm md:text-base leading-relaxed text-center">
                                        {paragraphs.map((paragraph, index) => (
                                            <motion.p
                                                key={index}
                                                initial={{ opacity: 1, scale: 1, z: 0 }}
                                                animate={{
                                                    opacity: hoveredParagraph === null || hoveredParagraph === index ? 1 : 0.3,
                                                    scale: hoveredParagraph === index ? 1.1 : 1,
                                                    z: hoveredParagraph === index ? 50 : 0,
                                                }}
                                                whileHover={{
                                                    scale: 1.2,
                                                    color: "var(--morandi-accent)",
                                                    textShadow: "0 0 8px rgba(var(--morandi-accent-rgb), 0.5)",
                                                    transition: { type: "spring", stiffness: 400, damping: 8 }
                                                }}
                                                onMouseEnter={() => setHoveredParagraph(index)}
                                                onMouseLeave={() => setHoveredParagraph(null)}
                                                className="mb-2 transition-all duration-300"
                                                style={{ transformStyle: "preserve-3d" }}
                                            >
                                                {paragraph}
                                            </motion.p>
                                        ))}
                                    </div>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Orbiting icons */}
                <motion.div
                    className="relative w-full md:w-[600px] h-[300px] md:h-[600px] flex items-center justify-center"
                    style={{ scale, opacity }}
                >
                    {skills.map((skill) => (
                        <motion.div
                            key={skill.name}
                            className="absolute"
                            style={{
                                width: skill.name === "Me" ? '40%' : '100%',
                                height: skill.name === "Me" ? '40%' : '100%',
                            }}
                            animate={skill.name === "Me" ? {} : {
                                rotate: skill.clockwise ? 360 : -360
                            }}
                            transition={{
                                duration: skill.speed,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    top: skill.name === "Me" ? '50%' : '0%',
                                    left: skill.name === "Me" ? '50%' : '100%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                                whileHover={{
                                    scale: 1.2,
                                    transition: { type: "spring", stiffness: 400, damping: 8 }
                                }}
                            >
                                <motion.div
                                    className={`flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${activeSkill.name === skill.name ? 'ring-4 ring-morandi-accent' : ''}`}
                                    style={{
                                        width: `${48 * skill.size}px`,
                                        height: `${48 * skill.size}px`,
                                        backgroundColor: skill.name === "Me" ? 'transparent' : 'rgba(var(--morandi-muted-rgb), 0.6)',
                                        backdropFilter: 'blur(5px)',
                                        border: skill.name === "Me" ? 'none' : '1px solid rgba(var(--morandi-accent-rgb), 0.3)',
                                        color: skill.color,
                                        overflow: 'hidden',
                                    }}

                                    whileHover={{
                                        backgroundColor: skill.name === "Me" ?   'transparent' : 'rgba(var(--morandi-muted-rgb), 0.8)',
                                        boxShadow: `0 0 20px ${skill.color}`,
                                        scale: 1.1,
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onHoverStart={() => {
                                        handleHover(skill)
                                        if (skill.name === "Me") setIsAvatarHovered(true)
                                    }}
                                    onHoverEnd={() => {
                                        handleHoverEnd()
                                        if (skill.name === "Me") setIsAvatarHovered(false)
                                    }}
                                    onClick={() => handleClick(skill)}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 10
                                    }}
                                >
                                    {skill.name === "Me" ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={skill.icon as string}
                                                alt={skill.name}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-full"
                                            />
                                            <motion.div
                                                className="absolute inset-0 rounded-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: isAvatarHovered ? 1 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{
                                                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                                                }}
                                            />
                                            <motion.div
                                                className="absolute -inset-1 rounded-full"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{
                                                    opacity: [0, 1, 0],
                                                    scale: [0.8, 1.2, 0.8],
                                                    transition: {
                                                        repeat: Infinity,
                                                        duration: 2,
                                                        ease: "easeInOut",
                                                    }
                                                }}
                                                style={{
                                                    border: '2px solid rgba(var(--morandi-accent-rgb), 0.5)',
                                                    boxShadow: '0 0 10px rgba(var(--morandi-accent-rgb), 0.3)',
                                                }}
                                            />
                                            <motion.div
                                                className="absolute -inset-2 rounded-full"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{
                                                    opacity: [0, 1, 0],
                                                    scale: [0.8, 1.2, 0.8],
                                                    transition: {
                                                        repeat: Infinity,
                                                        duration: 2,
                                                        delay: 0.5,
                                                        ease: "easeInOut",
                                                    }
                                                }}
                                                style={{
                                                    border: '2px solid rgba(var(--morandi-accent-rgb), 0.3)',
                                                    boxShadow: '0 0 15px rgba(var(--morandi-accent-rgb), 0.2)',
                                                }}
                                            />
                                            <motion.div
                                                className="absolute inset-0 rounded-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: isAvatarHovered ? 1 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{
                                                    background: 'radial-gradient(circle, rgba(var(--morandi-accent-rgb), 0.3) 0%, rgba(var(--morandi-accent-rgb), 0) 70%)',
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        React.cloneElement(skill.icon as React.ReactElement, {
                                            size: 24 * skill.size,
                                            className: "transition-all duration-300"
                                        })
                                    )}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}