"use client"

import React, { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const skills = [
    "Java", "JavaScript", "GO", "React", "Node.js", "Spring Boot",
    "MongoDB", "PostgreSQL", "Docker", "AWS", "Blockchain"
]

export default function About() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, amount: 0.3 })
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50])

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
    const scaleSpring = useSpring(scale, springConfig)
    const ySpring = useSpring(y, springConfig)

    return (
        <section ref={ref} id="about" className="min-h-screen flex items-center justify-center py-16 bg-morandi-bg">
            <motion.div
                style={{ opacity, scale: scaleSpring, y: ySpring }}
                className="w-full max-w-4xl px-4"
            >
                <Card className="bg-morandi-muted/50 backdrop-blur-md border-none shadow-xl overflow-hidden">
                    <CardContent className="p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col md:flex-row gap-8 items-center md:items-start"
                        >
                            <motion.div
                                className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    src="/img/my.png"
                                    alt="Guocheng Song"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full border-4 border-morandi-accent shadow-lg"
                                />
                            </motion.div>
                            <div className="flex-grow space-y-6">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-3xl font-bold text-morandi-text mb-4"
                                >
                                    About Me
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="text-morandi-text/80 leading-relaxed"
                                >
                                    I&apos;m a passionate web developer with expertise in Java, JavaScript, and GO. My journey in programming started with a fascination for creating and problem-solving, which has only grown stronger over time.
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    className="text-morandi-text/80 leading-relaxed"
                                >
                                    My areas of interest include building new Web Technologies and Products, as well as exploring the exciting world of Blockchain. I&apos;m always eager to learn and apply cutting-edge technologies to create innovative solutions.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                    <h3 className="text-xl font-semibold mb-3 text-morandi-text">Skills & Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <motion.div
                                                key={skill}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-morandi-accent/20 text-morandi-text hover:bg-morandi-accent/40 transition-all duration-300 cursor-pointer"
                                                    style={{
                                                        transformOrigin: 'center',
                                                    }}
                                                    whileHover={{
                                                        scale: 1.1,
                                                        rotate: Math.random() * 10 - 5,
                                                    }}
                                                >
                                                    {skill}
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </section>
    )
}