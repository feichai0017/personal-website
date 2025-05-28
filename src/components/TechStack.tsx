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
                        stiffness: 100,
                        damping: 15,
                    },
                },
                hidden: {
                    opacity: 0,
                    scale: 0.9,
                    y: 20
                },
            }}
            onHoverStart={() => setHoveredTech(tech.name)}
            onHoverEnd={() => setHoveredTech(null)}
            onClick={() => setSelectedTech(tech)}
            className="cursor-pointer"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
        >
            <Card className={`relative overflow-hidden h-full backdrop-blur-sm
                ${theme === 'dark'
                    ? 'bg-gradient-to-br from-morandi-dark/60 to-morandi-muted/40'
                    : 'bg-gradient-to-br from-morandi-light/60 to-morandi-hover/30'
                }
                border-morandi-accent/20 
                ${isHovered ? 'shadow-lg' : 'shadow-md'}
                transition-all duration-300`}
            >
                {/* 背景装饰 */}
                <motion.div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
                    animate={{
                        scale: isHovered ? 1.2 : 1,
                        rotate: isHovered ? 180 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <tech.Icon size={128} color={tech.color} />
                </motion.div>

                <div className="relative z-10 p-6 flex flex-col items-center text-center">
                    <motion.div
                        className={`p-4 rounded-xl mb-4 ${theme === 'dark' ? 'bg-morandi-accent/10' : 'bg-morandi-hover/20'
                            }`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        <tech.Icon size={48} color={tech.color} />
                    </motion.div>

                    <h3 className="text-lg font-semibold mb-2 text-morandi-dark dark:text-morandi-light">
                        {tech.name}
                    </h3>

                    <p className="text-sm text-morandi-text/70 dark:text-morandi-light/70">
                        {tech.description}
                    </p>

                    {/* 悬停时显示的光效 */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{
                            opacity: isHovered ? 0.2 : 0,
                        }}
                        style={{
                            background: `radial-gradient(circle at center, ${tech.color}40, transparent 70%)`,
                        }}
                    />
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
            {/* 背景动画 */}
            <div className="absolute inset-0 -z-10">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 200 + 50,
                            height: Math.random() * 200 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `radial-gradient(circle, ${i % 2 === 0
                                ? 'rgba(139, 115, 85, 0.05)'
                                : 'rgba(200, 184, 161, 0.05)'
                                }, transparent)`,
                        }}
                        animate={{
                            x: [0, Math.random() * 30 - 15, 0],
                            y: [0, Math.random() * 30 - 15, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-morandi-dark dark:text-morandi-light">
                        My Tech Stack
                    </h2>
                    <p className="text-lg text-morandi-text dark:text-morandi-light/80 max-w-2xl mx-auto">
                        Technologies I use to bring ideas to life
                    </p>
                </motion.div>

                {/* 分类过滤器 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    <Badge
                        variant={selectedCategory === null ? "default" : "outline"}
                        className={`px-4 py-2 cursor-pointer transition-all ${selectedCategory === null
                            ? 'bg-morandi-accent text-white'
                            : 'border-morandi-accent/30 hover:bg-morandi-accent/10'
                            }`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        <Sparkles size={16} className="mr-2" />
                        All
                    </Badge>
                    {Object.entries(categoryNames).map(([key, name]) => {
                        const Icon = categoryIcons[key as keyof typeof categoryIcons];
                        return (
                            <Badge
                                key={key}
                                variant={selectedCategory === key ? "default" : "outline"}
                                className={`px-4 py-2 cursor-pointer transition-all ${selectedCategory === key
                                    ? 'bg-morandi-accent text-white'
                                    : 'border-morandi-accent/30 hover:bg-morandi-accent/10'
                                    }`}
                                onClick={() => setSelectedCategory(key)}
                            >
                                <Icon size={16} className="mr-2" />
                                {name}
                            </Badge>
                        );
                    })}
                </motion.div>

                {/* 技术栈网格 */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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

                {/* 统计信息 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {[
                        { label: "Languages", count: techStack.filter(t => t.category === "language").length, icon: Code2 },
                        { label: "Frameworks", count: techStack.filter(t => t.category === "framework").length, icon: Layers },
                        { label: "Databases", count: techStack.filter(t => t.category === "database").length, icon: Database },
                        { label: "Tools", count: techStack.filter(t => t.category === "tool").length, icon: Terminal },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Card className={`text-center p-6 backdrop-blur-sm
                                ${theme === 'dark'
                                    ? 'bg-morandi-muted/30'
                                    : 'bg-morandi-hover/20'
                                }
                                border-morandi-accent/20`}
                            >
                                <stat.icon size={32} className="mx-auto mb-3 text-morandi-accent" />
                                <h3 className="text-2xl font-bold text-morandi-dark dark:text-morandi-light">
                                    {stat.count}
                                </h3>
                                <p className="text-sm text-morandi-text/70 dark:text-morandi-light/70">
                                    {stat.label}
                                </p>
                            </Card>
                        </motion.div>
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