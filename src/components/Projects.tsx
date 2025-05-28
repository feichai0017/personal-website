"use client"

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Clock, CheckCircle, ExternalLink, Sparkles, Terminal, Layers, Zap, X, ArrowUpRight } from 'lucide-react';
import {
    SiReact, SiPython, SiDocker, SiKubernetes, SiMysql, SiRedis,
    SiNextdotjs, SiTailwindcss, SiTypescript, SiPostgresql, SiSupabase,
    SiApachekafka, SiPrometheus, SiGrafana, SiClerk, SiRust, SiSqlite
} from 'react-icons/si';
import { FaJava, FaAws, FaDatabase } from 'react-icons/fa';
import { TbBrandGolang, TbDatabase } from 'react-icons/tb';
import { ConvexIcon, EdgeStoreIcon } from "@/components/Icons";
import Image from 'next/image';

interface Project {
    title: string;
    description: string;
    status: "In Progress" | "In Production";
    date: string;
    techStack: string[];
    githubLink: string;
    backgroundImage: string;
    category: "database" | "web" | "system" | "ai";
    features?: string[];
}

type TechStackIcon = {
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
};

const techStackIcons: Record<string, TechStackIcon> = {
    'React': { icon: SiReact, color: '#61DAFB', bgColor: '#20232A' },
    'Java': { icon: FaJava, color: '#007396', bgColor: '#F8981D' },
    'Python': { icon: SiPython, color: '#3776AB', bgColor: '#FFD43B' },
    'Go': { icon: TbBrandGolang, color: '#00ADD8', bgColor: '#FFFFFF' },
    'MySQL': { icon: SiMysql, color: '#4479A1', bgColor: '#F7F7F7' },
    'Redis': { icon: SiRedis, color: '#DC382D', bgColor: '#FFFFFF' },
    'Docker': { icon: SiDocker, color: '#2496ED', bgColor: '#FFFFFF' },
    'Kubernetes': { icon: SiKubernetes, color: '#326CE5', bgColor: '#FFFFFF' },
    'AWS S3': { icon: FaAws, color: '#FF9900', bgColor: '#232F3E' },
    'TypeScript': { icon: SiTypescript, color: '#3178C6', bgColor: '#FFFFFF' },
    'Next.js': { icon: SiNextdotjs, color: '#000000', bgColor: '#FFFFFF' },
    'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4', bgColor: '#FFFFFF' },
    'PostgreSQL': { icon: SiPostgresql, color: '#4169E1', bgColor: '#FFFFFF' },
    'Kafka': { icon: SiApachekafka, color: '#231F20', bgColor: '#FFFFFF' },
    'Prometheus': { icon: SiPrometheus, color: '#E6522C', bgColor: '#FFFFFF' },
    'Grafana': { icon: SiGrafana, color: '#F46800', bgColor: '#FFFFFF' },
    'Convex': { icon: ConvexIcon, color: '#FFA500', bgColor: '#FFFFFF' },
    'Clerk': { icon: SiClerk, color: '#0000FF', bgColor: '#FFFFFF' },
    'EdgeStore': { icon: EdgeStoreIcon, color: '#800080', bgColor: '#FFFFFF' },
    'Supabase': { icon: SiSupabase, color: '#3ECF8E', bgColor: '#FFFFFF' },
    'LSM Tree': { icon: FaDatabase as React.ComponentType<any>, color: '#4A90E2', bgColor: '#FFFFFF' },
    'Lock-free': { icon: Zap as React.ComponentType<any>, color: '#FF6B6B', bgColor: '#FFFFFF' },
    'MVCC': { icon: Layers as React.ComponentType<any>, color: '#50C878', bgColor: '#FFFFFF' },
    'Raft': { icon: Terminal as React.ComponentType<any>, color: '#9B59B6', bgColor: '#FFFFFF' },
    'Rust': { icon: SiRust, color: '#B7410E', bgColor: '#FFFFFF' },
    'SQL': { icon: SiSqlite, color: '#003B57', bgColor: '#FFFFFF' },
    'Bitcask': { icon: TbDatabase as React.ComponentType<any>, color: '#FF8C00', bgColor: '#FFFFFF' },
    'Database': { icon: FaDatabase as React.ComponentType<any>, color: '#4A90E2', bgColor: '#FFFFFF' },
};

const categoryIcons = {
    database: FaDatabase,
    web: Layers,
    system: Terminal,
    ai: Sparkles
};

const projects: Project[] = [
    {
        title: "QuillSQL",
        description: "A Lightweight Relational SQL Database in Rust, implementing Bitcask storage model with MVCC concurrency control.",
        status: "In Production",
        date: "Feb 2025 - Apr 2025",
        techStack: ["Rust", "SQL", "Database", "Bitcask", "MVCC"],
        githubLink: "https://github.com/feichai0017/QuillSQL",
        backgroundImage: "/projects/quillsql-logo.png",
        category: "database",
        features: ["ACID compliance", "Query optimization", "Multi-version concurrency control", "Efficient storage engine"]
    },
    {
        title: "NoKV",
        description: "High-performance key-value storage engine implementing LSM tree and lock-free skiplist with MVCC support.",
        status: "In Production",
        date: "2024.6 - 2024.9",
        techStack: ["Go", "LSM Tree", "Lock-free", "MVCC", "Raft"],
        githubLink: "https://github.com/feichai0017/NoKV",
        backgroundImage: "/projects/nokv-logo.svg",
        category: "database",
        features: ["Lock-free data structures", "Distributed consensus", "Crash recovery", "High throughput"]
    },
    {
        title: "Financial AI",
        description: "Multi-agent financial system with AI-powered transaction analysis and anti-fraud detection.",
        status: "In Production",
        date: "2024.7 - 2024.11",
        techStack: ["React", "Java", "Python", "MySQL", "Redis", "Docker"],
        githubLink: "https://github.com/CSUYSD/Anti-Scam-Financial-Management-Assistant",
        backgroundImage: "/projects/fin-care.png",
        category: "ai",
        features: ["Real-time fraud detection", "Multi-agent system", "Transaction analysis", "User behavior profiling"]
    },
    {
        title: "Personal Website",
        description: "Modern portfolio website with smooth animations and responsive design.",
        status: "In Production",
        date: "2024.9 - 2024.9",
        techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        githubLink: "https://github.com/feichai0017/personal-website",
        backgroundImage: "/projects/portfolio.png",
        category: "web",
        features: ["Responsive design", "Dark mode", "Smooth animations", "SEO optimized"]
    },
    {
        title: "Notion-like Application",
        description: "A powerful and flexible application for document management and collaborative work.",
        status: "In Production",
        date: "2024.10 - 2024.11",
        techStack: ["Clerk", "Next.js", "TypeScript", "Tailwind CSS", "Convex", "EdgeStore"],
        githubLink: "https://github.com/feichai0017/NoteLab",
        backgroundImage: "/projects/notion-like.png",
        category: "web",
        features: ["Real-time collaboration", "Rich text editor", "File management", "User authentication"]
    },
    {
        title: "Billion-scale Distributed IM System",
        description: "High-performance instant messaging system designed for billions of concurrent users.",
        status: "In Progress",
        date: "2024 - present",
        techStack: ["Go", "Kafka", "Redis", "Kubernetes", "Prometheus", "Grafana"],
        githubLink: "https://github.com/feichai0017/plato_distributed-IM-system",
        backgroundImage: "/projects/IM-system.png",
        category: "system",
        features: ["Horizontal scaling", "Message queuing", "Load balancing", "Real-time monitoring"]
    }
];

const ProjectCard: React.FC<{ project: Project; index: number; onSelect: (project: Project) => void }> = ({ project, index, onSelect }) => {
    const { theme } = useTheme();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

    const CategoryIcon = categoryIcons[project.category];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    const floatingAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 3 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
        }
    };

    return (
        <motion.div
            ref={ref}
            className="relative group cursor-pointer"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            onClick={() => onSelect(project)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
        >
            <motion.div
                className="relative h-[420px]"
                animate={floatingAnimation}
            >
                <Card className={`h-full overflow-hidden backdrop-blur-sm
                    ${theme === 'dark'
                        ? 'bg-gradient-to-br from-morandi-dark/80 via-morandi-muted/60 to-morandi-dark/80'
                        : 'bg-gradient-to-br from-morandi-light/80 via-morandi-hover/40 to-morandi-light/80'
                    }
                    border-morandi-accent/20 shadow-lg hover:shadow-2xl
                    transition-all duration-500`}
                >
                    {/* 背景图片 */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                scale: isHovered ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src={project.backgroundImage}
                                alt={project.title}
                                fill
                                className="object-cover opacity-20"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>

                        {/* 渐变遮罩 */}
                        <div className={`absolute inset-0 bg-gradient-to-t 
                            ${theme === 'dark'
                                ? 'from-morandi-dark via-morandi-dark/80 to-transparent'
                                : 'from-morandi-light via-morandi-light/80 to-transparent'
                            }`}
                        />

                        {/* 动态光效 */}
                        <motion.div
                            className="absolute inset-0 opacity-0"
                            animate={{
                                opacity: isHovered ? 0.4 : 0,
                                background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${theme === 'dark' ? 'rgba(166, 139, 111, 0.3)' : 'rgba(139, 115, 85, 0.2)'
                                    }, transparent 40%)`
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <div className="relative z-10 p-6 h-full flex flex-col">
                        {/* 头部 */}
                        <div className="flex justify-between items-start mb-6">
                            <motion.div
                                className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-morandi-accent/20' : 'bg-morandi-hover/30'
                                    } backdrop-blur-md`}
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <CategoryIcon size={24} className="text-morandi-accent" />
                            </motion.div>

                            <Badge
                                variant="secondary"
                                className={`backdrop-blur-md ${project.status === "In Progress"
                                    ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
                                    : "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
                                    } border`}
                            >
                                {project.status === "In Progress" ? (
                                    <Clock size={14} className="mr-1 animate-pulse" />
                                ) : (
                                    <CheckCircle size={14} className="mr-1" />
                                )}
                                {project.status}
                            </Badge>
                        </div>

                        {/* 内容 */}
                        <div className="flex-1">
                            <motion.h3
                                className="text-2xl md:text-3xl font-bold mb-3 text-morandi-dark dark:text-morandi-light"
                                animate={{
                                    opacity: isHovered ? 1 : 0.9,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {project.title}
                            </motion.h3>

                            <motion.p
                                className="text-morandi-text dark:text-morandi-light/80 mb-4 line-clamp-3"
                                animate={{
                                    opacity: isHovered ? 1 : 0.8,
                                }}
                            >
                                {project.description}
                            </motion.p>

                            <p className="text-sm text-morandi-text/60 dark:text-morandi-light/60 mb-6">
                                {project.date}
                            </p>
                        </div>

                        {/* 技术栈 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <AnimatePresence>
                                {project.techStack.slice(0, 4).map((tech, i) => {
                                    const { icon: IconComponent, color } = techStackIcons[tech] || {};
                                    return (
                                        <motion.div
                                            key={tech}
                                            initial={{ opacity: 0, scale: 0, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0, y: -20 }}
                                            transition={{
                                                delay: isHovered ? i * 0.05 : 0,
                                                type: "spring",
                                                stiffness: 300
                                            }}
                                            whileHover={{ y: -3, scale: 1.1 }}
                                        >
                                            <Badge
                                                variant="outline"
                                                className="backdrop-blur-md border-morandi-accent/30 bg-morandi-light/30 dark:bg-morandi-dark/30"
                                                style={{ borderColor: `${color}50` }}
                                            >
                                                {IconComponent && <IconComponent size={14} className="mr-1" style={{ color }} />}
                                                {tech}
                                            </Badge>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            {project.techStack.length > 4 && (
                                <Badge variant="outline" className="border-morandi-accent/30 backdrop-blur-md">
                                    +{project.techStack.length - 4}
                                </Badge>
                            )}
                        </div>

                        {/* 查看详情提示 */}
                        <motion.div
                            className="flex items-center justify-center gap-2 text-sm text-morandi-accent"
                            animate={{
                                opacity: isHovered ? [0.5, 1, 0.5] : 0.3,
                                x: isHovered ? [0, 5, 0] : 0
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span>Click to view details</span>
                            <ArrowUpRight size={16} />
                        </motion.div>
                    </div>
                </Card>
            </motion.div>

            {/* 悬浮装饰效果 */}
            <motion.div
                className="absolute -inset-0.5 rounded-2xl opacity-0"
                animate={{
                    opacity: isHovered ? 1 : 0,
                    background: `linear-gradient(45deg, ${theme === 'dark'
                        ? 'rgba(166, 139, 111, 0.3)'
                        : 'rgba(139, 115, 85, 0.2)'
                        }, transparent, ${theme === 'dark'
                            ? 'rgba(200, 184, 161, 0.3)'
                            : 'rgba(232, 232, 232, 0.4)'
                        })`,
                }}
                transition={{ duration: 0.3 }}
                style={{
                    filter: 'blur(20px)',
                    zIndex: -1
                }}
            />
        </motion.div>
    );
};

// 详情弹窗组件
const ProjectDetail: React.FC<{ project: Project | null; onClose: () => void }> = ({ project, onClose }) => {
    const { theme } = useTheme();

    if (!project) return null;

    const CategoryIcon = categoryIcons[project.category];

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Card className={`relative h-full overflow-y-auto
                            ${theme === 'dark'
                                ? 'bg-gradient-to-br from-morandi-dark via-morandi-muted to-morandi-dark'
                                : 'bg-gradient-to-br from-morandi-light via-morandi-hover/30 to-morandi-light'
                            } border-morandi-accent/30`}
                        >
                            {/* 背景图片 */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={project.backgroundImage}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1200px) 100vw, 896px"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t 
                                    ${theme === 'dark'
                                        ? 'from-morandi-dark to-transparent'
                                        : 'from-morandi-light to-transparent'
                                    }`}
                                />

                                {/* 关闭按钮 */}
                                <motion.button
                                    className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md
                                        ${theme === 'dark'
                                            ? 'bg-morandi-dark/50 hover:bg-morandi-dark/70'
                                            : 'bg-morandi-light/50 hover:bg-morandi-light/70'
                                        } transition-colors`}
                                    onClick={onClose}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={24} />
                                </motion.button>
                            </div>

                            <div className="p-8">
                                {/* 头部信息 */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-morandi-accent/20' : 'bg-morandi-hover/30'
                                                }`}
                                            initial={{ rotate: -180, scale: 0 }}
                                            animate={{ rotate: 0, scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                        >
                                            <CategoryIcon size={32} className="text-morandi-accent" />
                                        </motion.div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-morandi-dark dark:text-morandi-light">
                                                {project.title}
                                            </h2>
                                            <p className="text-morandi-text/60 dark:text-morandi-light/60">
                                                {project.date}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={`${project.status === "In Progress"
                                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                            : "bg-green-500/20 text-green-600 dark:text-green-400"
                                            }`}
                                    >
                                        {project.status === "In Progress" ? (
                                            <Clock size={16} className="mr-2 animate-pulse" />
                                        ) : (
                                            <CheckCircle size={16} className="mr-2" />
                                        )}
                                        {project.status}
                                    </Badge>
                                </div>

                                {/* 描述 */}
                                <p className="text-lg text-morandi-text dark:text-morandi-light/90 mb-8">
                                    {project.description}
                                </p>

                                {/* 特性列表 */}
                                {project.features && (
                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold mb-4 text-morandi-dark dark:text-morandi-light">
                                            Key Features
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {project.features.map((feature, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className={`flex items-center gap-2 p-3 rounded-lg
                                                        ${theme === 'dark'
                                                            ? 'bg-morandi-muted/30'
                                                            : 'bg-morandi-hover/20'
                                                        }`}
                                                >
                                                    <Sparkles size={16} className="text-morandi-accent" />
                                                    <span className="text-morandi-text dark:text-morandi-light/80">
                                                        {feature}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 技术栈 */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4 text-morandi-dark dark:text-morandi-light">
                                        Technology Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.techStack.map((tech, index) => {
                                            const { icon: IconComponent, color } = techStackIcons[tech] || {};
                                            return (
                                                <motion.div
                                                    key={tech}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{
                                                        delay: index * 0.05,
                                                        type: "spring",
                                                        stiffness: 300
                                                    }}
                                                    whileHover={{ scale: 1.1, y: -3 }}
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        className="px-4 py-2 border-morandi-accent/30"
                                                        style={{ borderColor: `${color}50` }}
                                                    >
                                                        {IconComponent && (
                                                            <IconComponent
                                                                size={18}
                                                                className="mr-2"
                                                                style={{ color }}
                                                            />
                                                        )}
                                                        {tech}
                                                    </Badge>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* GitHub链接 */}
                                <motion.a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl font-medium
                                        ${theme === 'dark'
                                            ? 'bg-morandi-accent/20 hover:bg-morandi-accent/30 text-morandi-light'
                                            : 'bg-morandi-hover/40 hover:bg-morandi-hover/60 text-morandi-dark'
                                        } transition-all duration-300`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Github size={20} />
                                    <span>View on GitHub</span>
                                    <ExternalLink size={16} />
                                </motion.a>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Projects: React.FC = () => {
    const ref = useRef(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);

    // 防止body滚动当模态框打开时
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedProject]);

    return (
        <section
            id="projects"
            ref={ref}
            className="relative min-h-screen py-20 px-4 overflow-hidden bg-morandi-bg dark:bg-morandi-dark transition-colors duration-500"
        >
            {/* 动态背景 */}
            <motion.div
                className="absolute inset-0 -z-10"
                style={{ y: backgroundY }}
            >
                {/* 浮动圆形 */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 300 + 100,
                            height: Math.random() * 300 + 100,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `radial-gradient(circle, ${i % 2 === 0
                                ? 'rgba(139, 115, 85, 0.08)'
                                : 'rgba(200, 184, 161, 0.08)'
                                }, transparent)`,
                        }}
                        animate={{
                            x: [0, Math.random() * 50 - 25, 0],
                            y: [0, Math.random() * 50 - 25, 0],
                        }}
                        transition={{
                            duration: 20 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-morandi-dark dark:text-morandi-light">
                        My Projects
                    </h2>
                    <p className="text-lg text-morandi-text dark:text-morandi-light/80 max-w-2xl mx-auto">
                        Exploring creativity through code, one project at a time
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.title}
                            project={project}
                            index={index}
                            onSelect={setSelectedProject}
                        />
                    ))}
                </div>
            </div>

            {/* 详情弹窗 */}
            <ProjectDetail
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
};

export default Projects;