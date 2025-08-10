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
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

    const CategoryIcon = categoryIcons[project.category];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    // 参考Experience的浮动动画
    const floatingAnimation = {
        translateY: isHovered ? [0, -6, 0, -3, 0] : [0, -2, 0],
        transition: {
            duration: isHovered ? 1.2 : 4 + index * 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse" as const
        }
    };

    // 现代化配色方案
    const categoryColors = {
        database: {
            primary: '#4F8A9D',
            secondary: '#7BA8B8',
            bg: 'rgba(79, 138, 157, 0.08)',
            glow: 'rgba(79, 138, 157, 0.2)'
        },
        web: {
            primary: '#A47284',
            secondary: '#C294A6',
            bg: 'rgba(164, 114, 132, 0.08)',
            glow: 'rgba(164, 114, 132, 0.2)'
        },
        system: {
            primary: '#7A9B7E',
            secondary: '#9BB89F',
            bg: 'rgba(122, 155, 126, 0.08)',
            glow: 'rgba(122, 155, 126, 0.2)'
        },
        ai: {
            primary: '#B8956A',
            secondary: '#D4B88A',
            bg: 'rgba(184, 149, 106, 0.08)',
            glow: 'rgba(184, 149, 106, 0.2)'
        }
    };

    const colors = categoryColors[project.category] || categoryColors.web;

    return (
        <motion.div
            ref={ref}
            className="relative group cursor-pointer"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onSelect(project)}
            whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            whileTap={{ scale: 0.98 }}
            style={{ perspective: '1000px' }}
        >
            <motion.div
                ref={cardRef}
                className="relative h-[420px]"
                animate={floatingAnimation}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* 现代化卡片设计 */}
                <Card className={`relative h-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500
                    ${theme === 'dark'
                        ? 'bg-gradient-to-br from-morandi-dark/90 via-morandi-muted/70 to-morandi-dark/95'
                        : 'bg-gradient-to-br from-morandi-light/95 via-morandi-hover/60 to-morandi-light/90'
                    }
                    border ${isHovered ? 'border-morandi-accent/50' : 'border-morandi-accent/20'}`}
                    style={{
                        borderRadius: '24px',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    {/* 动态光晕效果 - 参考Experience */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                            background: `radial-gradient(500px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${colors.glow}, transparent 60%)`,
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease-out'
                        }}
                    />

                    {/* 背景装饰 */}
                    <div className="absolute inset-0 overflow-hidden rounded-[24px]">
                        {/* 背景图片 */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                scale: isHovered ? 1.1 : 1,
                                rotate: isHovered ? 1 : 0
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <Image
                                src={project.backgroundImage}
                                alt={project.title}
                                fill
                                className="object-cover"
                                style={{
                                    opacity: isHovered ? 0.2 : 0.12,
                                    filter: 'blur(0.5px) brightness(1.1)'
                                }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>

                        {/* 渐变叠加 */}
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(135deg, ${colors.bg} 0%, transparent 50%, ${colors.bg} 100%)`,
                                opacity: isHovered ? 0.8 : 0.6
                            }}
                            animate={{
                                opacity: isHovered ? 0.8 : 0.6
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <div className="relative z-20 p-8 h-full flex flex-col">
                        {/* 头部区域 */}
                        <div className="flex justify-between items-start mb-6">
                            <motion.div
                                className="flex items-center gap-4"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 200 }}
                            >
                                {/* 动态图标容器 - 参考Experience */}
                                <motion.div
                                    className={`p-3 rounded-xl transition-all duration-300
                                        ${isHovered ? 'bg-morandi-accent/20 shadow-lg' : 'bg-morandi-accent/10'}
                                    `}
                                    animate={{
                                        rotate: isHovered ? [0, 12, -8, 0] : 0,
                                        scale: isHovered ? 1.1 : 1
                                    }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    style={{
                                        border: `1px solid ${colors.primary}30`
                                    }}
                                >
                                    <CategoryIcon
                                        size={24}
                                        style={{
                                            color: isHovered ? colors.primary : colors.secondary,
                                            transition: 'color 0.3s ease'
                                        }}
                                    />
                                </motion.div>

                                <div>
                                    <motion.h3
                                        className="text-xl md:text-2xl font-bold text-morandi-dark dark:text-morandi-light leading-tight"
                                        animate={{
                                            color: isHovered ? colors.primary : undefined
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {project.title}
                                    </motion.h3>
                                    <div className="flex items-center text-morandi-text/70 dark:text-morandi-light/70 text-sm mt-1">
                                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                        {project.date}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 300 }}
                            >
                                <motion.div
                                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-md ${project.status === "In Progress"
                                        ? "bg-amber-100/20 text-amber-600 dark:text-amber-400 border border-amber-200/30"
                                        : "bg-emerald-100/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/30"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {project.status === "In Progress" ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Clock size={12} />
                                        </motion.div>
                                    ) : (
                                        <CheckCircle size={12} />
                                    )}
                                    {project.status}
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* 描述内容 */}
                        <motion.div className="flex-1 mb-6">
                            <motion.p
                                className="text-sm text-morandi-text dark:text-morandi-light/85 leading-relaxed line-clamp-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                {project.description}
                            </motion.p>
                        </motion.div>

                        {/* 技术栈标签 */}
                        <motion.div
                            className="flex flex-wrap gap-2 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                        >
                            {project.techStack.slice(0, isHovered ? project.techStack.length : 4).map((tech, i) => {
                                const { icon: IconComponent } = techStackIcons[tech] || {};
                                return (
                                    <motion.div
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.6 + i * 0.05,
                                            type: 'spring',
                                            stiffness: 200
                                        }}
                                    >
                                        <motion.div
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border
                                                ${theme === 'dark'
                                                    ? 'bg-morandi-muted/30 border-morandi-accent/30 hover:bg-morandi-muted/50'
                                                    : 'bg-morandi-hover/40 border-morandi-accent/20 hover:bg-morandi-hover/60'
                                                }
                                            `}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            {IconComponent && <IconComponent size={12} />}
                                            <span>{tech}</span>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                            {!isHovered && project.techStack.length > 4 && (
                                <motion.div
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border
                                        ${theme === 'dark'
                                            ? 'bg-morandi-muted/30 border-morandi-accent/30'
                                            : 'bg-morandi-hover/40 border-morandi-accent/20'
                                        }
                                    `}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    +{project.techStack.length - 4}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* 底部操作区 */}
                        <motion.div
                            className="flex items-center justify-between"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0.8 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <motion.div
                                className="flex items-center gap-2 text-sm font-medium text-morandi-accent"
                                whileHover={{ x: 6 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <span>Explore Project</span>
                                <ArrowUpRight size={16} />
                            </motion.div>

                            <motion.div
                                className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
                                style={{
                                    background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                    border: `1px solid ${colors.primary}30`
                                }}
                                whileHover={{ scale: 1.15, rotate: 15 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <ExternalLink size={14} style={{ color: colors.primary }} />
                            </motion.div>
                        </motion.div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};

// 详情弹窗组件 - 参考Experience设计
const ProjectDetail: React.FC<{ project: Project | null; onClose: () => void }> = ({ project, onClose }) => {
    const { theme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

    if (!project) return null;

    const CategoryIcon = categoryIcons[project.category];

    // 现代化配色方案 - 与ProjectCard保持一致
    const categoryColors = {
        database: {
            primary: '#4F8A9D',
            secondary: '#7BA8B8',
            bg: 'rgba(79, 138, 157, 0.08)',
            glow: 'rgba(79, 138, 157, 0.2)'
        },
        web: {
            primary: '#A47284',
            secondary: '#C294A6',
            bg: 'rgba(164, 114, 132, 0.08)',
            glow: 'rgba(164, 114, 132, 0.2)'
        },
        system: {
            primary: '#7A9B7E',
            secondary: '#9BB89F',
            bg: 'rgba(122, 155, 126, 0.08)',
            glow: 'rgba(122, 155, 126, 0.2)'
        },
        ai: {
            primary: '#B8956A',
            secondary: '#D4B88A',
            bg: 'rgba(184, 149, 106, 0.08)',
            glow: 'rgba(184, 149, 106, 0.2)'
        }
    };

    const colors = categoryColors[project.category] || categoryColors.web;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.85, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.85, y: 30, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 25 }}
                        className="relative w-full max-w-xl md:max-w-3xl lg:max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                        onMouseMove={handleMouseMove}
                    >
                        <Card className={`relative overflow-hidden shadow-2xl
                            ${theme === 'dark'
                                ? 'bg-gradient-to-br from-morandi-dark/95 via-morandi-muted/85 to-morandi-dark/95'
                                : 'bg-gradient-to-br from-morandi-light/95 via-morandi-hover/60 to-morandi-light/95'
                            } border border-morandi-accent/30`}
                            style={{
                                borderRadius: '28px',
                                backdropFilter: 'blur(30px)'
                            }}
                        >
                            {/* 动态光晕效果 - 参考Experience */}
                            <div className="absolute inset-0 pointer-events-none">
                                <motion.div
                                    className="absolute inset-0"
                                    animate={{
                                        background: `radial-gradient(800px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${colors.glow}, transparent 50%)`
                                    }}
                                    transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                                    style={{ opacity: 0.6 }}
                                />
                            </div>

                            <div className="relative max-h-[85vh] overflow-y-auto">
                                {/* 头部区域 */}
                                <div className="p-8 md:p-10">
                                    <div className="flex items-start gap-6 mb-8">
                                        {/* 动态图标 - 参考Experience设计 */}
                                        <motion.div
                                            className={`p-4 md:p-5 rounded-xl transition-all duration-300
                                                ${theme === 'dark' ? 'bg-morandi-accent/15' : 'bg-morandi-accent/10'}
                                            `}
                                            initial={{ rotate: -90, scale: 0.5 }}
                                            animate={{ rotate: 0, scale: 1 }}
                                            transition={{ type: "spring", stiffness: 180, delay: 0.1 }}
                                            style={{
                                                border: `2px solid ${colors.primary}30`,
                                                boxShadow: `0 8px 32px ${colors.primary}15`
                                            }}
                                        >
                                            <CategoryIcon
                                                size={32}
                                                style={{ color: colors.primary }}
                                            />

                                            {/* 环形脉动效果 */}
                                            <motion.div
                                                className="absolute inset-0 rounded-xl"
                                                style={{
                                                    border: `2px solid ${colors.primary}`,
                                                    opacity: 0.3
                                                }}
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [0.3, 0, 0.3]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeOut"
                                                }}
                                            />
                                        </motion.div>

                                        <div className="flex-1">
                                            <motion.h2
                                                className="text-3xl md:text-4xl font-bold text-morandi-dark dark:text-morandi-light mb-2"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                {project.title}
                                            </motion.h2>
                                            <motion.div
                                                className="text-morandi-text/80 dark:text-morandi-light/80 text-lg mb-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.25 }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-5 h-5" />
                                                    {project.date}
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.3, type: "spring" }}
                                            >
                                                <div
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md ${project.status === "In Progress"
                                                        ? "bg-amber-100/20 text-amber-600 dark:text-amber-400 border border-amber-200/30"
                                                        : "bg-emerald-100/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/30"
                                                        }`}
                                                >
                                                    {project.status === "In Progress" ? (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                        >
                                                            <Clock size={14} />
                                                        </motion.div>
                                                    ) : (
                                                        <CheckCircle size={14} />
                                                    )}
                                                    {project.status}
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* 关闭按钮 */}
                                        <motion.button
                                            className="p-2 rounded-full backdrop-blur-md transition-all duration-300"
                                            onClick={onClose}
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{
                                                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                                                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                                            }}
                                        >
                                            <X size={20} className="text-morandi-text dark:text-morandi-light" />
                                        </motion.button>
                                    </div>

                                    {/* 项目描述 */}
                                    <motion.div
                                        className="mb-8 p-6 rounded-2xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        style={{
                                            background: theme === 'dark'
                                                ? 'rgba(255, 255, 255, 0.03)'
                                                : 'rgba(0, 0, 0, 0.02)',
                                            border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                                        }}
                                    >
                                        <p className="text-lg text-morandi-text dark:text-morandi-light/90 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </motion.div>

                                    {/* 主要特性 */}
                                    {project.features && (
                                        <motion.div
                                            className="mb-8"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <h3 className="text-xl font-semibold mb-4 text-morandi-dark dark:text-morandi-light">
                                                Key Features
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {project.features.map((feature, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.6 + index * 0.05 }}
                                                        className="flex items-center gap-3 p-4 rounded-xl"
                                                        style={{
                                                            background: theme === 'dark'
                                                                ? `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}03)`
                                                                : `linear-gradient(135deg, ${colors.primary}03, ${colors.secondary}02)`,
                                                            border: `1px solid ${colors.primary}10`
                                                        }}
                                                    >
                                                        <motion.div
                                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: colors.primary }}
                                                            animate={{
                                                                scale: [1, 1.2, 1],
                                                                opacity: [0.8, 1, 0.8]
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                delay: index * 0.2
                                                            }}
                                                        />
                                                        <span className="text-morandi-text dark:text-morandi-light/85">
                                                            {feature}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* 技术栈 */}
                                    <motion.div
                                        className="mb-8"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <h3 className="text-xl font-semibold mb-4 text-morandi-dark dark:text-morandi-light">
                                            Tech Stack
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {project.techStack.map((tech, index) => {
                                                const { icon: IconComponent, color } = techStackIcons[tech] || {};
                                                return (
                                                    <motion.div
                                                        key={tech}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{
                                                            delay: 0.8 + index * 0.03,
                                                            type: "spring",
                                                            stiffness: 200
                                                        }}
                                                    >
                                                        <motion.div
                                                            className="px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 cursor-pointer"
                                                            whileHover={{ scale: 1.05, y: -2 }}
                                                            transition={{ type: "spring", stiffness: 400 }}
                                                            style={{
                                                                background: theme === 'dark'
                                                                    ? `linear-gradient(135deg, ${color}15, ${color}08)`
                                                                    : `linear-gradient(135deg, ${color}08, ${color}04)`,
                                                                border: `1px solid ${color}30`,
                                                                boxShadow: `0 2px 8px ${color}10`
                                                            }}
                                                        >
                                                            {IconComponent && <IconComponent size={16} style={{ color }} />}
                                                            <span className="text-sm font-medium" style={{ color }}>
                                                                {tech}
                                                            </span>
                                                        </motion.div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>

                                    {/* GitHub链接 */}
                                    <motion.a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-base backdrop-blur-md transition-all duration-300"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9 }}
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: `0 8px 24px ${colors.primary}20`
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                            color: 'white',
                                            border: 'none'
                                        }}
                                    >
                                        <Github size={20} />
                                        <span>View Source Code</span>
                                        <ExternalLink size={16} />
                                    </motion.a>
                                </div>
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
    const { theme } = useTheme();

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
            {/* CSS动画定义 */}
            <style jsx>{`
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes float-up {
                    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }
            `}</style>

            {/* 现代化动态背景 */}
            <motion.div
                className="absolute inset-0 -z-10 opacity-40"
                style={{ y: backgroundY }}
            >
                {/* 主背景渐变 */}
                <div className="absolute inset-0"
                    style={{
                        background: theme === 'dark'
                            ? 'radial-gradient(circle at 30% 20%, rgba(79, 138, 157, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(164, 114, 132, 0.06) 0%, transparent 50%), radial-gradient(circle at 40% 70%, rgba(122, 155, 126, 0.05) 0%, transparent 50%)'
                            : 'radial-gradient(circle at 30% 20%, rgba(79, 138, 157, 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(164, 114, 132, 0.03) 0%, transparent 50%), radial-gradient(circle at 40% 70%, rgba(122, 155, 126, 0.025) 0%, transparent 50%)'
                    }}
                />

                {/* 浮动装饰元素 */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full opacity-20"
                        style={{
                            width: Math.random() * 200 + 100,
                            height: Math.random() * 200 + 100,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: i % 3 === 0
                                ? 'linear-gradient(135deg, rgba(79, 138, 157, 0.1), rgba(79, 138, 157, 0.05))'
                                : i % 3 === 1
                                    ? 'linear-gradient(135deg, rgba(164, 114, 132, 0.08), rgba(164, 114, 132, 0.04))'
                                    : 'linear-gradient(135deg, rgba(122, 155, 126, 0.06), rgba(122, 155, 126, 0.03))',
                            filter: 'blur(40px)'
                        }}
                        animate={{
                            x: [0, Math.random() * 100 - 50, 0],
                            y: [0, Math.random() * 100 - 50, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 2
                        }}
                    />
                ))}

                {/* 发光粒子效果 */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: ['#4F8A9D', '#A47284', '#7A9B7E', '#B8956A'][i % 4],
                            boxShadow: `0 0 10px ${['#4F8A9D', '#A47284', '#7A9B7E', '#B8956A'][i % 4]}40`
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            x: [0, Math.random() * 200 - 100],
                            y: [0, Math.random() * 200 - 100]
                        }}
                        transition={{
                            duration: 8 + Math.random() * 4,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: i * 0.8
                        }}
                    />
                ))}
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-morandi-dark dark:text-morandi-light">
                        My Projects
                    </h2>
                    <p className="text-lg md:text-xl text-morandi-text dark:text-morandi-light/80 max-w-3xl mx-auto">
                        Exploring creativity through code, building solutions that make a difference
                    </p>
                </motion.div>

                {/* 项目网格 - 响应式布局 */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.title}
                            project={project}
                            index={index}
                            onSelect={setSelectedProject}
                        />
                    ))}
                </motion.div>

                {/* 底部装饰 */}
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 text-sm text-morandi-text/50 dark:text-morandi-light/50"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Sparkles size={16} />
                        <span>More projects coming soon</span>
                    </motion.div>
                </motion.div>
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