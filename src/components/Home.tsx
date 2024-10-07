"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { FaLinkedin, FaGithub, FaDownload } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import ParticlesBackground from './ParticlesBackground'

const titles = ["Full Stack Developer", "Software Engineer", "DevOps Engineer"]

const Home = () => {
    const { theme } = useTheme()
    const [currentTitleIndex, setCurrentTitleIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % titles.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95, transition: { duration: 0.2 } },
    }

    const iconVariants = {
        hover: { rotate: 360, transition: { duration: 0.5 } },
    }

    return (
        <section id="home" className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-4">
            <ParticlesBackground />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10"
            >
                <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-4 text-morandi-dark dark:text-morandi-light"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Guocheng Song
                </motion.h1>
                <div className="h-12 mb-6">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={currentTitleIndex}
                            className="text-2xl md:text-3xl text-morandi-text dark:text-morandi-accent"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {titles[currentTitleIndex]}
                        </motion.h2>
                    </AnimatePresence>
                </div>
                <motion.p
                    className="text-lg md:text-xl mb-8 max-w-2xl text-morandi-text dark:text-morandi-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    Passionate about creating elegant solutions to complex problems.
                    Experienced in building scalable web applications and microservices.
                </motion.p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap justify-center gap-4 mb-8 z-10"
            >
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button variant="outline" size="lg" className="flex items-center gap-2 bg-morandi-light dark:bg-morandi-dark">
                        <a href="/Resume.pdf" download className="flex items-center gap-2">
                            <motion.div variants={iconVariants} whileHover="hover">
                                <FaDownload />
                            </motion.div>
                            Download Resume
                        </a>
                    </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button size="lg" className="flex items-center gap-2 bg-morandi-accent text-white">
                        <a href="https://www.linkedin.com/in/guocheng-song-728580318/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <motion.div variants={iconVariants} whileHover="hover">
                                <FaLinkedin />
                            </motion.div>
                            LinkedIn
                        </a>
                    </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button size="lg" className="flex items-center gap-2 bg-morandi-secondary text-white">
                        <a href="https://github.com/feichai0017" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <motion.div variants={iconVariants} whileHover="hover">
                                <FaGithub />
                            </motion.div>
                            GitHub
                        </a>
                    </Button>
                </motion.div>
            </motion.div>

            {/* Background shapes with more dynamic effects */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0, x: -100 }}
                    animate={{ opacity: 0.2, scale: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`absolute top-20 left-20 w-32 md:w-64 h-32 md:h-64 rounded-full ${
                        theme === 'dark' ? 'bg-morandi-accent' : 'bg-morandi-secondary'
                    }`}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0, x: 100 }}
                    animate={{ opacity: 0.2, scale: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className={`absolute bottom-20 right-20 w-48 md:w-96 h-48 md:h-96 rounded-full ${
                        theme === 'dark' ? 'bg-morandi-secondary' : 'bg-morandi-accent'
                    }`}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 100 }}
                    animate={{ opacity: 0.15, scale: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 md:w-72 h-36 md:h-72 rounded-full ${
                        theme === 'dark' ? 'bg-morandi-primary' : 'bg-morandi-primary'
                    }`}
                />
            </div>

            {/* Floating elements */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-morandi-accent"
                animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-6 h-6 rounded-full bg-morandi-secondary"
                animate={{
                    y: [0, 15, 0],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </section>
    )
}

export default Home