"use client"

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
    SiPython, SiGo, SiJavascript, SiTypescript,
    SiSpring, SiExpress, SiGin,
    SiHtml5, SiCss3, SiReact, SiBootstrap,
    SiMysql, SiPostgresql, SiMongodb, SiRedis, SiElasticsearch,
    SiGit, SiLinux, SiDocker, SiGradle, SiRabbitmq, SiKubernetes
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';

const techStack = [
    { name: "Java", icon: FaJava, color: "#007396" },
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "Go", icon: SiGo, color: "#00ADD8" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "Spring", icon: SiSpring, color: "#6DB33F" },
    { name: "Express", icon: SiExpress, color: "#000000" },
    { name: "Gin", icon: SiGin, color: "#00ADD8" },
    { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
    { name: "CSS3", icon: SiCss3, color: "#1572B6" },
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "Redis", icon: SiRedis, color: "#DC382D" },
    { name: "ElasticSearch", icon: SiElasticsearch, color: "#005571" },
    { name: "Git", icon: SiGit, color: "#F05032" },
    { name: "Linux", icon: SiLinux, color: "#FCC624" },
    { name: "AWS", icon: FaAws, color: "#232F3E" },
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "Gradle", icon: SiGradle, color: "#02303A" },
    { name: "Maven", icon: SiGradle, color: "#C71A36" },
    { name: "RabbitMQ", icon: SiRabbitmq, color: "#FF6600" },
    { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
];

const TechStack = () => {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, threshold: 0.5 });
    const { theme } = useTheme();

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const containerVariants = {
        visible: {
            transition: {
                staggerChildren: 0.1,
            },
        },
        hidden: {
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
    };

    const itemVariants = {
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            x: Math.cos(i * (2 * Math.PI / techStack.length)) * 250,
            y: Math.sin(i * (2 * Math.PI / techStack.length)) * 250,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
            },
        }),
        hidden: { opacity: 0, scale: 0, x: 0, y: 0 },
    };

    return (
        <section id="techstack" ref={ref} className="py-32 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4">
                <h2 className={`text-4xl font-bold mb-16 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    My Tech Stack
                </h2>
                <motion.div
                    className="relative w-[600px] h-[600px] mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                >
                    {techStack.map((tech, index) => (
                        <motion.div
                            key={tech.name}
                            custom={index}
                            variants={itemVariants}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center justify-center"
                            >
                                <tech.icon size={48} color={tech.color} />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TechStack;