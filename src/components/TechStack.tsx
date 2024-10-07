"use client"

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
    SiPython, SiGo, SiJavascript, SiTypescript,
    SiSpring, SiExpress, SiGin,
    SiHtml5, SiCss3, SiReact, SiBootstrap,
    SiMysql, SiPostgresql, SiMongodb, SiRedis, SiElasticsearch,
    SiGit, SiLinux, SiDocker, SiGradle, SiRabbitmq, SiKubernetes,
    SiApachekafka
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';

const techStack = [
    { name: "Java", Icon: FaJava, color: "#007396" },
    { name: "Python", Icon: SiPython, color: "#3776AB" },
    { name: "Go", Icon: SiGo, color: "#00ADD8" },
    { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
    { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
    { name: "Spring", Icon: SiSpring, color: "#6DB33F" },
    { name: "Express", Icon: SiExpress, color: "#000000" },
    { name: "Gin", Icon: SiGin, color: "#00ADD8" },
    { name: "HTML5", Icon: SiHtml5, color: "#E34F26" },
    { name: "CSS3", Icon: SiCss3, color: "#1572B6" },
    { name: "React", Icon: SiReact, color: "#61DAFB" },
    { name: "Bootstrap", Icon: SiBootstrap, color: "#7952B3" },
    { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
    { name: "PostgreSQL", Icon: SiPostgresql, color: "#336791" },
    { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
    { name: "Redis", Icon: SiRedis, color: "#DC382D" },
    { name: "ElasticSearch", Icon: SiElasticsearch, color: "#005571" },
    { name: "Git", Icon: SiGit, color: "#F05032" },
    { name: "Linux", Icon: SiLinux, color: "#FCC624" },
    { name: "AWS", Icon: FaAws, color: "#232F3E" },
    { name: "Docker", Icon: SiDocker, color: "#2496ED" },
    { name: "Gradle", Icon: SiGradle, color: "#02303A" },
    { name: "Kafka", Icon: SiApachekafka, color: "#231F20" },
    { name: "RabbitMQ", Icon: SiRabbitmq, color: "#FF6600" },
    { name: "Kubernetes", Icon: SiKubernetes, color: "#326CE5" },
];

const TechStack = () => {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, threshold: 0.1 });
    const [hoveredTech, setHoveredTech] = useState(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    useEffect(() => {
        const updateSize = () => {
            if (ref.current) {
                const { width, height } = ref.current.getBoundingClientRect();
                setContainerSize({ width, height });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const containerVariants = {
        visible: {
            transition: {
                staggerChildren: 0.05,
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
        visible: (i: number) => {
            const angle = (i / techStack.length) * 2 * Math.PI;
            const minRadius = Math.min(containerSize.width, containerSize.height) * 0.15;
            const maxRadius = Math.min(containerSize.width, containerSize.height) * 0.35;
            const radius = minRadius + Math.random() * (maxRadius - minRadius);
            const randomOffset = (Math.random() - 0.5) * 60; // Increased random offset

            // Adjust positioning for mobile
            const isMobile = containerSize.width < 640; // Assuming 640px as mobile breakpoint
            const mobileColumns = 3;
            const mobileRows = Math.ceil(techStack.length / mobileColumns);
            const mobileX = isMobile ? ((i % mobileColumns) - 1) * (containerSize.width / mobileColumns) : Math.cos(angle) * radius + randomOffset;
            const mobileY = isMobile ? (Math.floor(i / mobileColumns) - mobileRows / 2) * (containerSize.height / mobileRows) : Math.sin(angle) * radius + randomOffset;

            return {
                opacity: 1,
                scale: 1,
                x: mobileX,
                y: mobileY,
                transition: {
                    type: "spring",
                    stiffness: 60,
                    damping: 20,
                    duration: 1,
                },
            };
        },
        hidden: { opacity: 0, scale: 0, x: 0, y: 0 },
    };


    return (
        <section id="techstack" ref={ref} className="py-16 md:py-32 min-h-screen flex items-center justify-center px-4 overflow-hidden">
            <div className="container mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-center text-gray-800 dark:text-gray-800">
                    My Tech Stack
                </h2>
                <motion.div
                    className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                >
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" />
                    {techStack.map((tech, index) => (
                        <motion.div
                            key={tech.name}
                            custom={index}
                            variants={itemVariants}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            onHoverStart={() => setHoveredTech(tech.name)}
                            onHoverEnd={() => setHoveredTech(null)}
                        >
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-col items-center justify-center"
                            >
                                <tech.Icon
                                    size={32}
                                    className="sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] transition-all duration-300"
                                    color={tech.color}
                                />
                                <motion.span
                                    className="mt-2 text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-600"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: hoveredTech === tech.name ? 1 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {tech.name}
                                </motion.span>
                            </motion.div>
                            <motion.div
                                className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <svg width="100%" height="100%" className="absolute top-0 left-0">
                                    <motion.line
                                        x1="50%"
                                        y1="50%"
                                        x2="50%"
                                        y2="50%"
                                        stroke="rgb(156, 163, 175)" // Gray color
                                        strokeWidth="1"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1, delay: index * 0.05 }}
                                    />
                                </svg>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TechStack;