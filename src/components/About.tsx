"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, useAnimation, useMotionValue, useTransform, useScroll, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Globe, Gamepad2, PenTool, Plane, TrendingUp, Chrome, Cpu } from 'lucide-react'

interface Skill {
    name: string;
    icon: React.ReactNode;
    description: string;
    size: number;
    speed: number;
    clockwise: boolean;
    color: string;
}

const skills: Skill[] = [
    { name: "Writer", icon: <Users />, description: "Writing blog", size: 1.5, speed: 40, clockwise: true, color: "#FF6B6B" },
    { name: "Chrome", icon: <Chrome />, description: "UI/UX designer", size: 1.3, speed: 45, clockwise: false, color: "#4285F4" },
    { name: "Web", icon: <Globe />, description: "Web Developer", size: 1.4, speed: 50, clockwise: true, color: "#61DAFB" },
    { name: "Game", icon: <Gamepad2 />, description: "Game Developer", size: 1.3, speed: 55, clockwise: false, color: "#FFD700" },
    { name: "Critic", icon: <PenTool />, description: "Game Critic", size: 1.2, speed: 60, clockwise: true, color: "#FF9A8B" },
    { name: "Edge", icon: <Cpu />, description: "Edge Extension Developer", size: 1.6, speed: 35, clockwise: false, color: "#0078D7" },
    { name: "Trader", icon: <TrendingUp />, description: "Trader", size: 1.4, speed: 42, clockwise: true, color: "#50C878" },
]

export default function About() {
    const [activeSkill, setActiveSkill] = useState<Skill>(skills[0])
    const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)
    const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLElement>(null)
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

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect()
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

    useEffect(() => {
        const currentCard = cardRef.current
        if (currentCard) {
            currentCard.addEventListener("mousemove", handleMouseMove)
            currentCard.addEventListener("mouseleave", handleMouseLeave)
            return () => {
                currentCard.removeEventListener("mousemove", handleMouseMove)
                currentCard.removeEventListener("mouseleave", handleMouseLeave)
            }
        }
    }, [handleMouseMove, handleMouseLeave])

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
        "I'm a passionate developer with expertise in various technologies.",
        "My journey in programming started with a fascination for creating and problem-solving, which has only grown stronger over time.",
        "I'm always eager to learn and apply cutting-edge technologies to create innovative solutions."
    ]

    return (
        <section id="about" className="min-h-screen flex items-center justify-center bg-morandi-bg overflow-hidden" ref={containerRef}>
            <motion.div
                className="relative w-[800px] h-[800px] flex items-center justify-center"
                style={{ scale, opacity }}
            >
                {/* Orbital paths */}
                {[...Array(8)].map((_, index) => (
                    <motion.div
                        key={`orbit-${index}`}
                        className="absolute rounded-full"
                        style={{
                            width: `${500 + index * 80}px`,
                            height: `${500 + index * 80}px`,
                            border: `2px solid rgba(var(--morandi-accent-rgb), ${0.1 - index * 0.01})`,
                            boxShadow: `0 0 10px rgba(var(--morandi-accent-rgb), ${0.05 - index * 0.005})`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                    />
                ))}

                {/* Central card */}
                <motion.div
                    ref={cardRef}
                    className="w-[400px] perspective-1000 z-10"
                    style={{
                        rotateX,
                        rotateY,
                        transition: "all 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s"
                    }}
                    whileHover={{ scale: 1.05 }}
                >
                    <Card className="bg-morandi-muted/80 backdrop-blur-md border-none shadow-xl overflow-hidden">
                        <CardContent className="p-8">
                            <motion.div className="flex flex-col items-center">
                                <motion.h1
                                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-morandi-accent to-morandi-primary mb-4"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    Guocheng Song
                                </motion.h1>
                                <p className="text-lg text-morandi-text/80 mb-6">Eric</p>
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
                                            className="text-xl font-semibold text-morandi-text mb-2"
                                            initial={{ scale: 1 }}
                                            animate={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {hoveredSkill ? hoveredSkill.name : activeSkill.name}
                                        </motion.h3>
                                        <motion.p
                                            className="text-morandi-text/80"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                        >
                                            {hoveredSkill ? hoveredSkill.description : activeSkill.description}
                                        </motion.p>
                                    </motion.div>
                                </AnimatePresence>
                                <div className="text-morandi-text/80 leading-relaxed text-center">
                                    {paragraphs.map((paragraph, index) => (
                                        <motion.p
                                            key={index}
                                            initial={{ opacity: 1, scale: 1, z: 0 }}
                                            animate={{
                                                opacity: hoveredParagraph === null || hoveredParagraph === index ? 1 : 0.5,
                                                scale: hoveredParagraph === index ? 1.05 : 1,
                                                z: hoveredParagraph === index ? 20 : 0,
                                            }}
                                            transition={{ duration: 0.2 }}
                                            onMouseEnter={() => setHoveredParagraph(index)}
                                            onMouseLeave={() => setHoveredParagraph(null)}
                                            className="mb-2 transition-all duration-300"
                                            style={{
                                                transformStyle: "preserve-3d",
                                            }}
                                        >
                                            {paragraph}
                                        </motion.p>
                                    ))}
                                </div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Orbiting skill icons */}
                {skills.map((skill, index) => (
                    <motion.div
                        key={skill.name}
                        className="absolute"
                        style={{
                            width: `${500 + index * 80}px`,
                            height: `${500 + index * 80}px`,
                        }}
                        animate={{
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
                                top: '50%',
                                left: '100%',
                                transform: 'translate(-50%, -50%)',
                            }}
                            whileHover={{ scale: 1.2 }}
                        >
                            <motion.div
                                className={`flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${activeSkill.name === skill.name ? 'ring-4 ring-morandi-accent' : ''}`}
                                style={{
                                    width: `${64 * skill.size}px`,
                                    height: `${64 * skill.size}px`,
                                    backgroundColor: skill.color,
                                    color: '#FFFFFF',
                                }}
                                whileHover={{
                                    backgroundColor: '#FFFFFF',
                                    color: skill.color,
                                    boxShadow: `0 0 20px ${skill.color}`,
                                    scale: 1.1,
                                }}
                                onHoverStart={() => handleHover(skill)}
                                onHoverEnd={handleHoverEnd}
                                onClick={() => handleClick(skill)}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 10
                                }}
                            >
                                {React.cloneElement(skill.icon as React.ReactElement, { size: 32 * skill.size })}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                ))}

                {/* Orbiting avatar */}
                <motion.div
                    className="absolute"
                    style={{
                        width: '1000px',
                        height: '1000px',
                    }}
                    animate={{
                        rotate: 360
                    }}
                    transition={{
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '100%',
                            transform: 'translate(-50%, -50%)',
                        }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <Image
                            src="/img/my.png"
                            alt="Guocheng Song"
                            width={100}
                            height={100}
                            className="rounded-full border-4 border-morandi-accent shadow-lg"
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}