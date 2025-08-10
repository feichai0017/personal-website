"use client"

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Sparkles, Layers, Database, Globe, Terminal } from 'lucide-react';
import {
    SiPython, SiGo, SiJavascript, SiTypescript,
    SiGin,
    SiHtml5, SiCss3, SiReact,
    SiMysql, SiPostgresql, SiMongodb, SiRedis, SiElasticsearch,
    SiGit, SiLinux, SiDocker, SiRabbitmq, SiKubernetes,
    SiApachekafka, SiRust, SiC, SiCplusplus, SiNextdotjs
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { TbServer } from 'react-icons/tb';

interface Tech {
    name: string;
    Icon: React.ComponentType<any>;
    color: string;
    category: "language" | "framework" | "frontend" | "database" | "tool";
    description: string;
}

const techStack: Tech[] = [
    // Languages
    { name: "Rust", Icon: SiRust, color: "#CE4A00", category: "language", description: "Systems programming & safety" },
    { name: "C", Icon: SiC, color: "#00599C", category: "language", description: "Low-level system programming" },
    { name: "C++", Icon: SiCplusplus, color: "#00599C", category: "language", description: "High-performance computing" },
    { name: "Python", Icon: SiPython, color: "#3776AB", category: "language", description: "Data science & automation" },
    { name: "Go", Icon: SiGo, color: "#00ADD8", category: "language", description: "High-performance systems" },
    { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E", category: "language", description: "Dynamic web development" },
    { name: "TypeScript", Icon: SiTypescript, color: "#3178C6", category: "language", description: "Type-safe JavaScript" },

    // Frameworks
    { name: "Next.js", Icon: SiNextdotjs, color: "#000000", category: "framework", description: "React framework for production" },
    { name: "Gin", Icon: SiGin, color: "#00ADD8", category: "framework", description: "Go web framework" },

    // Frontend
    { name: "HTML5", Icon: SiHtml5, color: "#E34F26", category: "frontend", description: "Web structure" },
    { name: "CSS3", Icon: SiCss3, color: "#1572B6", category: "frontend", description: "Web styling" },
    { name: "React", Icon: SiReact, color: "#61DAFB", category: "frontend", description: "UI development" },

    // Databases
    { name: "MySQL", Icon: SiMysql, color: "#4479A1", category: "database", description: "Relational database" },
    { name: "PostgreSQL", Icon: SiPostgresql, color: "#336791", category: "database", description: "Advanced SQL database" },
    { name: "MongoDB", Icon: SiMongodb, color: "#47A248", category: "database", description: "NoSQL database" },
    { name: "Redis", Icon: SiRedis, color: "#DC382D", category: "database", description: "In-memory cache" },
    { name: "ElasticSearch", Icon: SiElasticsearch, color: "#005571", category: "database", description: "Search engine" },
    { name: "etcd", Icon: TbServer, color: "#419EDA", category: "database", description: "Distributed key-value store" },

    // Tools & Infrastructure
    { name: "Git", Icon: SiGit, color: "#F05032", category: "tool", description: "Version control" },
    { name: "Linux", Icon: SiLinux, color: "#FCC624", category: "tool", description: "Operating system" },
    { name: "AWS", Icon: FaAws, color: "#232F3E", category: "tool", description: "Cloud platform" },
    { name: "Docker", Icon: SiDocker, color: "#2496ED", category: "tool", description: "Containerization" },
    { name: "Kafka", Icon: SiApachekafka, color: "#231F20", category: "tool", description: "Message broker" },
    { name: "RabbitMQ", Icon: SiRabbitmq, color: "#FF6600", category: "tool", description: "Message queue" },
    { name: "Kubernetes", Icon: SiKubernetes, color: "#326CE5", category: "tool", description: "Container orchestration" },
];

const categoryIcons = {
    language: Code2,
    framework: Layers,
    frontend: Globe,
    database: Database,
    tool: Terminal
};

const categoryNames = {
    language: "Languages",
    framework: "Frameworks",
    frontend: "Frontend",
    database: "Databases",
    tool: "Tools & DevOps"
};

// TechCard component
interface TechCardProps {
    tech: Tech;
    index: number;
    theme?: string;
    hoveredTech: string | null;
    setHoveredTech: (name: string | null) => void;
    setSelectedTech: (tech: Tech) => void;
}

const TechCard: React.FC<TechCardProps> = React.memo(({
    tech,
    theme,
    hoveredTech,
    setHoveredTech,
    setSelectedTech
}) => {
    const isHovered = hoveredTech === tech.name;

    return (
        <motion.div
            variants={{
                visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                    },
                },
                hidden: {
                    opacity: 0,
                    scale: 0.8,
                    y: 30
                },
            }}
            onHoverStart={() => setHoveredTech(tech.name)}
            onHoverEnd={() => setHoveredTech(null)}
            onClick={() => setSelectedTech(tech)}
            className="cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Card className={`relative overflow-hidden h-full border-0
                ${theme === 'dark'
                    ? 'bg-white/[0.02]'
                    : 'bg-white/80'
                }
                backdrop-blur-xl
                transition-all duration-500 ease-out`}
                style={{
                    borderRadius: '16px'
                }}
            >
                {/* 极简设计内容 */}
                <div className="relative z-10 p-6 flex flex-col items-center text-center h-full">
                    {/* 悬停阴影效果 */}
                    <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{
                            boxShadow: isHovered
                                ? `0 20px 40px -15px ${tech.color}20`
                                : '0 4px 20px -8px rgba(0,0,0,0.05)'
                        }}
                        transition={{ duration: 0.4 }}
                    />

                    {/* 图标区域 */}
                    <motion.div
                        className="relative mb-4"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        <motion.div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{
                                background: `${tech.color}08`,
                                border: `1px solid ${tech.color}15`
                            }}
                            animate={{
                                rotate: isHovered ? [0, 5, -5, 0] : 0
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            <tech.Icon size={32} color={tech.color} />
                        </motion.div>

                        {/* 脉动效果 */}
                        <motion.div
                            className="absolute inset-0 rounded-2xl"
                            style={{
                                border: `2px solid ${tech.color}30`,
                                opacity: 0.5
                            }}
                            animate={{
                                scale: isHovered ? [1, 1.2, 1] : 1,
                                opacity: isHovered ? [0.5, 0, 0.5] : 0
                            }}
                            transition={{
                                duration: 2,
                                repeat: isHovered ? Infinity : 0,
                                ease: "easeOut"
                            }}
                        />
                    </motion.div>

                    <div className="flex-1 flex flex-col justify-center">
                        <motion.h3
                            className="text-lg font-semibold mb-2 text-morandi-dark dark:text-morandi-light"
                            animate={{
                                color: isHovered ? tech.color : undefined
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {tech.name}
                        </motion.h3>

                        <motion.p
                            className="text-sm text-morandi-text/70 dark:text-morandi-light/70 leading-relaxed"
                            animate={{
                                opacity: isHovered ? 1 : 0.8
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {tech.description}
                        </motion.p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}, (prevProps, nextProps) => {
    // 自定义比较函数，只在必要时重新渲染
    return prevProps.tech.name === nextProps.tech.name &&
        prevProps.theme === nextProps.theme &&
        (prevProps.hoveredTech === prevProps.tech.name) === (nextProps.hoveredTech === nextProps.tech.name);
});

TechCard.displayName = 'TechCard';

const TechStack = () => {
    const { theme } = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.1 });
    const [hoveredTech, setHoveredTech] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTech, setSelectedTech] = useState<Tech | null>(null);

    const filteredTech = selectedCategory
        ? techStack.filter(tech => tech.category === selectedCategory)
        : techStack;

    const containerVariants = {
        visible: {
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            },
        },
        hidden: {}
    };

    return (
        <section id="techstack" ref={ref} className="relative py-20 px-4 min-h-screen overflow-hidden bg-morandi-bg dark:bg-morandi-dark transition-colors duration-500">
            {/* 极简背景 */}
            <div className="absolute inset-0 -z-10 opacity-30">
                <div className="absolute inset-0"
                    style={{
                        background: theme === 'dark'
                            ? 'radial-gradient(circle at 30% 70%, rgba(166, 139, 111, 0.02) 0%, transparent 60%)'
                            : 'radial-gradient(circle at 30% 70%, rgba(139, 115, 85, 0.01) 0%, transparent 60%)'
                    }}
                />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-morandi-dark dark:text-morandi-light">
                        My Tech Stack
                    </h2>
                    <p className="text-lg text-morandi-text dark:text-morandi-light/80 max-w-2xl mx-auto">
                        Technologies I use to bring ideas to life
                    </p>
                </motion.div>

                {/* 极简分类过滤器 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 mb-12"
                >
                    <motion.button
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === null
                            ? 'bg-morandi-accent text-white'
                            : 'text-morandi-text/70 dark:text-morandi-light/70 hover:text-morandi-dark dark:hover:text-morandi-light'
                            }`}
                        onClick={() => setSelectedCategory(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        All ({techStack.length})
                    </motion.button>
                    {Object.entries(categoryNames).map(([key, name]) => {
                        const count = techStack.filter(t => t.category === key).length;
                        return (
                            <motion.button
                                key={key}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === key
                                    ? 'bg-morandi-accent text-white'
                                    : 'text-morandi-text/70 dark:text-morandi-light/70 hover:text-morandi-dark dark:hover:text-morandi-light'
                                    }`}
                                onClick={() => setSelectedCategory(key)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {name} ({count})
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* 极简技术栈网格 */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    {filteredTech.map((tech, index) => (
                        <TechCard
                            key={tech.name}
                            tech={tech}
                            index={index}
                            theme={theme}
                            hoveredTech={hoveredTech}
                            setHoveredTech={setHoveredTech}
                            setSelectedTech={setSelectedTech}
                        />
                    ))}
                </motion.div>


            </div>

            {/* 技术详情弹窗 */}
            <AnimatePresence>
                {selectedTech && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedTech(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 20 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Card className={`p-8 text-center backdrop-blur-md
                                ${theme === 'dark'
                                    ? 'bg-morandi-dark/90'
                                    : 'bg-morandi-light/90'
                                }
                                border-morandi-accent/30`}
                            >
                                <motion.div
                                    className={`inline-flex p-6 rounded-2xl mb-6 ${theme === 'dark' ? 'bg-morandi-accent/20' : 'bg-morandi-hover/30'
                                        }`}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    <selectedTech.Icon size={80} color={selectedTech.color} />
                                </motion.div>

                                <h3 className="text-3xl font-bold mb-2 text-morandi-dark dark:text-morandi-light">
                                    {selectedTech.name}
                                </h3>

                                <Badge className="mb-4 bg-morandi-accent/20 text-morandi-accent border-morandi-accent/30">
                                    {categoryNames[selectedTech.category]}
                                </Badge>

                                <p className="text-lg text-morandi-text dark:text-morandi-light/80">
                                    {selectedTech.description}
                                </p>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default TechStack;