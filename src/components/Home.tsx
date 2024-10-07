"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { FaLinkedin, FaGithub, FaDownload} from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import ParticlesBackground from './ParticlesBackground'

const Home = () => {
    const { theme} = useTheme()

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95, transition: { duration: 0.2 } },
    }

    const iconVariants = {
        hover: { rotate: 360, transition: { duration: 0.5 } },
    }

    return (
        <section id="home" className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
            <ParticlesBackground />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10"
            >
                <motion.h1
                    className="text-5xl font-bold mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Guocheng Song
                </motion.h1>
                <motion.h2
                    className="text-3xl mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    Full Stack Developer
                </motion.h2>
                <motion.p
                    className="text-xl mb-8 max-w-2xl"
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
                className="flex gap-4 mb-8 z-10"
            >
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button variant="outline" size="lg" className="flex items-center gap-2">
                        <a href="/Resume.pdf" download className="flex items-center gap-2">
                            <motion.div variants={iconVariants} whileHover="hover">
                                <FaDownload />
                            </motion.div>
                            Download Resume
                        </a>
                    </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button size="lg" className="flex items-center gap-2">
                        <a href="www.linkedin.com/in/guocheng-song-728580318" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <motion.div variants={iconVariants} whileHover="hover">
                                <FaLinkedin />
                            </motion.div>
                            LinkedIn
                        </a>
                    </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button size="lg" className="flex items-center gap-2">
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
                    className={`absolute top-20 left-20 w-64 h-64 rounded-full ${
                        theme === 'dark' ? 'bg-morandi-accent' : 'bg-morandi-secondary'
                    }`}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0, x: 100 }}
                    animate={{ opacity: 0.2, scale: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className={`absolute bottom-20 right-20 w-96 h-96 rounded-full ${
                        theme === 'dark' ? 'bg-morandi-secondary' : 'bg-morandi-accent'
                    }`}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 100 }}
                    animate={{ opacity: 0.15, scale: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full ${
                        theme === 'dark' ? 'bg-morandi-primary' : 'bg-morandi-primary'
                    }`}
                />
            </div>
        </section>
    )
}

export default Home