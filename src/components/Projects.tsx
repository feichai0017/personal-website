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

    // 3D倾斜效果
    const rotateX = isHovered ? (mousePosition.y - 0.5) * 10 : 0;
    const rotateY = isHovered ? (mousePosition.x - 0.5) * -10 : 0;
    const translateZ = isHovered ? 50 : 0;

    const floatingAnimation = {
        y: [0, -8, 0],
        transition: {
            duration: 3 + index * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1
        }
    };

    // 根据类别定义颜色
    const categoryColors = {
        database: { primary: '#7899AB', secondary: '#A3B8C8', accent: '#E6ECF0' },  // 莫兰迪蓝
        web: { primary: '#A68B9F', secondary: '#C5AEC0', accent: '#F0E8EF' },      // 莫兰迪紫
        system: { primary: '#8FA68E', secondary: '#B3C5B2', accent: '#E8F0E8' },   // 莫兰迪绿
        ai: { primary: '#C5A572', secondary: '#D9C2A0', accent: '#F5EFE6' }        // 莫兰迪橙
    };

    const colors = categoryColors[project.category] || categoryColors.web;

    return (
        <motion.div
            ref={ref}
            className="relative group cursor-pointer"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.5, delay: index * 0.08, type: "spring", stiffness: 120 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            onClick={() => onSelect(project)}
            style={{
                perspective: "1200px",
                transformStyle: "preserve-3d"
            }}
        >
            <motion.div
                className="relative h-[420px]"
                animate={floatingAnimation}
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                    transformStyle: "preserve-3d",
                    transition: "transform 0.2s ease-out"
                }}
            >
                {/* 卡片主体 - 独特的形状 */}
                <Card className="relative h-full overflow-hidden"
                    style={{
                        borderRadius: '24px 24px 24px 80px', // 不对称圆角
                        background: theme === 'dark'
                            ? `linear-gradient(135deg, rgba(30, 30, 40, 0.95) 0%, rgba(40, 40, 50, 0.9) 100%)`
                            : `linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 250, 0.95) 100%)`,
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                        boxShadow: isHovered
                            ? `0 20px 40px -10px ${colors.primary}20, 0 15px 30px -15px rgba(0, 0, 0, 0.3)`
                            : '0 10px 25px -10px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {/* 背景装饰 */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* 背景图片 */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                scale: isHovered ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <Image
                                src={project.backgroundImage}
                                alt={project.title}
                                fill
                                className="object-cover"
                                style={{
                                    opacity: 0.08,
                                    filter: isHovered ? 'blur(0px) brightness(1.1)' : 'blur(2px) brightness(1)'
                                }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>

                        {/* 彩色渐变叠加 */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                opacity: isHovered ? 0.15 : 0.08
                            }}
                            style={{
                                background: `radial-gradient(circle at 70% 30%, ${colors.primary}20, transparent 50%)`
                            }}
                        />

                        {/* 动态光波效果 */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                background: isHovered
                                    ? `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${colors.secondary}15, transparent 40%)`
                                    : `radial-gradient(circle at 50% 50%, transparent, transparent)`
                            }}
                            transition={{ duration: 0.2 }}
                        />

                        {/* 右下角装饰圆 */}
                        <motion.div
                            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full"
                            animate={{
                                scale: isHovered ? 1.2 : 1,
                                opacity: isHovered ? 0.15 : 0.08
                            }}
                            transition={{ duration: 0.4 }}
                            style={{
                                background: colors.primary,
                                filter: 'blur(40px)'
                            }}
                        />
                    </div>

                    <div className="relative z-10 p-6 h-full flex flex-col">
                        {/* 头部 */}
                        <div className="flex justify-between items-start mb-6">
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                {/* 图标容器 - 六边形设计 */}
                                <div
                                    className="relative p-3"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
                                        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <motion.div
                                        animate={{
                                            rotate: isHovered ? 360 : 0
                                        }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                    >
                                        <CategoryIcon size={24} style={{ color: colors.primary }} />
                                    </motion.div>
                                </div>

                                {/* 脉冲效果 */}
                                <motion.div
                                    className="absolute inset-0"
                                    animate={{
                                        scale: isHovered ? [1, 1.4, 1] : 1,
                                        opacity: isHovered ? [0.5, 0, 0.5] : 0
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{
                                        background: colors.primary,
                                        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                                        filter: 'blur(8px)'
                                    }}
                                />
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: isHovered ? -2 : 0
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <Badge
                                    className={`px-3 py-1 text-xs font-medium ${project.status === "In Progress"
                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                        } border-0`}
                                >
                                    {project.status === "In Progress" ? (
                                        <motion.div className="flex items-center gap-1">
                                            <Clock size={12} className="animate-pulse" />
                                            {project.status}
                                        </motion.div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <CheckCircle size={12} />
                                            {project.status}
                                        </div>
                                    )}
                                </Badge>
                            </motion.div>
                        </div>

                        {/* 内容 */}
                        <div className="flex-1">
                            <motion.h3
                                className="text-2xl font-bold mb-3 text-morandi-dark dark:text-morandi-light"
                                animate={{
                                    x: isHovered ? 4 : 0
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {project.title}
                            </motion.h3>

                            <motion.p
                                className="text-morandi-text dark:text-morandi-light/80 mb-4 line-clamp-3 text-sm leading-relaxed"
                            >
                                {project.description}
                            </motion.p>

                            <p className="text-xs text-morandi-text/60 dark:text-morandi-light/60 mb-6">
                                {project.date}
                            </p>
                        </div>

                        {/* 技术栈 - 优雅的标签设计 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.techStack.slice(0, 4).map((tech, i) => {
                                const { icon: IconComponent, color } = techStackIcons[tech] || {};
                                return (
                                    <motion.div
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            delay: isHovered ? i * 0.05 : 0,
                                            type: "spring",
                                            stiffness: 300
                                        }}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                    >
                                        <div
                                            className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
                                            style={{
                                                background: theme === 'dark'
                                                    ? `linear-gradient(135deg, ${color}15, ${color}10)`
                                                    : `linear-gradient(135deg, ${color}10, ${color}05)`,
                                                border: `1px solid ${color}20`,
                                                color: theme === 'dark' ? color : color
                                            }}
                                        >
                                            {IconComponent && <IconComponent size={12} />}
                                            <span>{tech}</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            {project.techStack.length > 4 && (
                                <div className="px-3 py-1.5 rounded-full text-xs font-medium"
                                    style={{
                                        background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                                    }}
                                >
                                    +{project.techStack.length - 4}
                                </div>
                            )}
                        </div>

                        {/* 底部操作区 - 流畅的悬停效果 */}
                        <motion.div
                            className="relative h-10 flex items-center justify-between overflow-hidden"
                            animate={{
                                x: isHovered ? 0 : -10,
                                opacity: isHovered ? 1 : 0.6
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div
                                className="flex items-center gap-2 text-sm font-medium"
                                style={{ color: colors.primary }}
                            >
                                <span>Explore Project</span>
                                <motion.div
                                    animate={{
                                        x: isHovered ? [0, 4, 0] : 0
                                    }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    <ArrowUpRight size={16} />
                                </motion.div>
                            </div>

                            {/* 滑动指示器 */}
                            <motion.div
                                className="absolute bottom-0 left-0 h-0.5"
                                animate={{
                                    width: isHovered ? '100%' : '0%'
                                }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                style={{
                                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
                                }}
                            />
                        </motion.div>
                    </div>
                </Card>

                {/* 悬浮光晕效果 */}
                <motion.div
                    className="absolute -inset-1 rounded-[24px_24px_24px_80px] opacity-0 pointer-events-none"
                    animate={{
                        opacity: isHovered ? 0.5 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                        filter: 'blur(20px)',
                        zIndex: -1
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

// 详情弹窗组件
const ProjectDetail: React.FC<{ project: Project | null; onClose: () => void }> = ({ project, onClose }) => {
    const { theme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isClosing, setIsClosing] = useState(false);

    if (!project) return null;

    const CategoryIcon = categoryIcons[project.category];

    // 根据类别定义颜色
    const categoryColors = {
        database: { primary: '#7899AB', secondary: '#A3B8C8', accent: '#E6ECF0' },  // 莫兰迪蓝
        web: { primary: '#A68B9F', secondary: '#C5AEC0', accent: '#F0E8EF' },      // 莫兰迪紫
        system: { primary: '#8FA68E', secondary: '#B3C5B2', accent: '#E8F0E8' },   // 莫兰迪绿
        ai: { primary: '#C5A572', secondary: '#D9C2A0', accent: '#F5EFE6' }        // 莫兰迪橙
    };

    const colors = categoryColors[project.category] || categoryColors.web;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300);
    };

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isClosing ? 0 : 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                    style={{
                        background: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 50, opacity: 0, rotateX: -15 }}
                        animate={{
                            scale: isClosing ? 0.8 : 1,
                            y: isClosing ? 50 : 0,
                            opacity: isClosing ? 0 : 1,
                            rotateX: isClosing ? 15 : 0
                        }}
                        exit={{ scale: 0.8, y: 50, opacity: 0, rotateX: 15 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        onMouseMove={handleMouseMove}
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1200px',
                            borderRadius: '32px'
                        }}
                    >
                        {/* 彩色边框光效 */}
                        <motion.div
                            className="absolute -inset-[2px] rounded-[32px] opacity-60"
                            animate={{
                                background: [
                                    `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                    `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                                    `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                                ]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        <Card className="relative h-full overflow-y-auto rounded-[32px]"
                            style={{
                                background: theme === 'dark'
                                    ? 'linear-gradient(135deg, rgba(20, 20, 30, 0.98) 0%, rgba(30, 30, 40, 0.95) 100%)'
                                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.95) 100%)',
                                backdropFilter: 'blur(30px)',
                                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
                            }}
                        >
                            {/* 头部背景区域 */}
                            <div className="relative h-80 overflow-hidden">
                                {/* 背景图片 */}
                                <motion.div
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={project.backgroundImage}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        style={{
                                            opacity: 0.2,
                                            filter: 'blur(0px) brightness(1.2)'
                                        }}
                                        sizes="(max-width: 1200px) 100vw, 1280px"
                                    />
                                </motion.div>

                                {/* 渐变遮罩 */}
                                <div className="absolute inset-0"
                                    style={{
                                        background: `linear-gradient(135deg, 
                                            ${colors.primary}30 0%, 
                                            ${colors.secondary}20 50%, 
                                            ${theme === 'dark' ? 'rgba(20, 20, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'} 100%)`
                                    }}
                                />

                                {/* 动态光效 */}
                                <motion.div
                                    className="absolute inset-0 opacity-30"
                                    animate={{
                                        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                                            ${colors.primary}40, transparent 50%)`
                                    }}
                                    transition={{ type: 'tween', duration: 0.3 }}
                                />

                                {/* 浮动几何装饰 */}
                                <motion.div
                                    className="absolute top-10 right-10 w-32 h-32"
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                                        clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                                        filter: 'blur(1px)'
                                    }}
                                />

                                {/* 关闭按钮 */}
                                <motion.button
                                    className="absolute top-6 right-6 p-3 rounded-full backdrop-blur-md"
                                    onClick={handleClose}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                        border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <X size={24} className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
                                </motion.button>
                            </div>

                            <div className="p-10">
                                {/* 头部信息 - 重新设计 */}
                                <div className="flex items-start justify-between mb-10">
                                    <div className="flex items-center gap-6">
                                        {/* 悬浮图标 */}
                                        <motion.div
                                            className="relative"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                        >
                                            <motion.div
                                                className="relative p-5"
                                                animate={{
                                                    y: [0, -5, 0]
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
                                                    borderRadius: '20px',
                                                    border: `2px solid ${colors.primary}20`,
                                                    boxShadow: `0 8px 32px ${colors.primary}20`
                                                }}
                                            >
                                                <CategoryIcon size={36} style={{ color: colors.primary }} />

                                                {/* 环形动画 */}
                                                <motion.div
                                                    className="absolute inset-0 rounded-2xl"
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
                                        </motion.div>

                                        <div>
                                            <motion.h2
                                                className="text-4xl font-bold mb-2"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                                style={{
                                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text'
                                                }}
                                            >
                                                {project.title}
                                            </motion.h2>
                                            <motion.p
                                                className="text-morandi-text/60 dark:text-morandi-light/60 text-lg"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                {project.date}
                                            </motion.p>
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                    >
                                        <Badge
                                            className={`px-5 py-2 text-sm font-medium backdrop-blur-md ${project.status === "In Progress"
                                                ? "bg-amber-100/10 text-amber-600 dark:text-amber-400 border border-amber-200/20"
                                                : "bg-emerald-100/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20"
                                                }`}
                                        >
                                            {project.status === "In Progress" ? (
                                                <Clock size={16} className="mr-2 animate-pulse inline" />
                                            ) : (
                                                <CheckCircle size={16} className="mr-2 inline" />
                                            )}
                                            {project.status}
                                        </Badge>
                                    </motion.div>
                                </div>

                                {/* 描述卡片 */}
                                <motion.div
                                    className="mb-10 p-6 rounded-2xl"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    style={{
                                        background: theme === 'dark'
                                            ? 'rgba(255, 255, 255, 0.03)'
                                            : 'rgba(0, 0, 0, 0.02)',
                                        border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
                                    }}
                                >
                                    <p className="text-xl text-morandi-text dark:text-morandi-light/90 leading-relaxed">
                                        {project.description}
                                    </p>
                                </motion.div>

                                {/* 特性网格 - 卡片式设计 */}
                                {project.features && (
                                    <motion.div
                                        className="mb-10"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <h3 className="text-2xl font-semibold mb-6 text-morandi-dark dark:text-morandi-light">
                                            Key Features
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {project.features.map((feature, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    transition={{ delay: 0.8 + index * 0.1 }}
                                                    whileHover={{
                                                        scale: 1.02,
                                                        boxShadow: `0 8px 32px ${colors.primary}15`
                                                    }}
                                                    className="relative p-5 rounded-2xl backdrop-blur-md overflow-hidden cursor-pointer"
                                                    style={{
                                                        background: theme === 'dark'
                                                            ? `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)`
                                                            : `linear-gradient(135deg, ${colors.primary}03, ${colors.secondary}03)`,
                                                        border: `1px solid ${colors.primary}15`
                                                    }}
                                                >
                                                    {/* 悬浮光效 */}
                                                    <motion.div
                                                        className="absolute inset-0 opacity-0"
                                                        whileHover={{ opacity: 1 }}
                                                        style={{
                                                            background: `radial-gradient(circle at 50% 50%, ${colors.primary}10, transparent 70%)`
                                                        }}
                                                    />

                                                    <div className="relative flex items-center gap-3">
                                                        <motion.div
                                                            className="w-2 h-2 rounded-full"
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
                                                        <span className="text-morandi-text dark:text-morandi-light/85 font-medium">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* 技术栈展示 - 增强版 */}
                                <motion.div
                                    className="mb-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <h3 className="text-2xl font-semibold mb-6 text-morandi-dark dark:text-morandi-light">
                                        Technology Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.techStack.map((tech, index) => {
                                            const { icon: IconComponent, color } = techStackIcons[tech] || {};
                                            return (
                                                <motion.div
                                                    key={tech}
                                                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                    transition={{
                                                        delay: 1 + index * 0.05,
                                                        type: "spring",
                                                        stiffness: 200
                                                    }}
                                                    whileHover={{
                                                        scale: 1.1,
                                                        y: -5,
                                                        rotate: 5
                                                    }}
                                                    className="relative"
                                                >
                                                    <div
                                                        className="px-5 py-3 rounded-2xl backdrop-blur-md flex items-center gap-2 cursor-pointer"
                                                        style={{
                                                            background: theme === 'dark'
                                                                ? `linear-gradient(135deg, ${color}15, ${color}10)`
                                                                : `linear-gradient(135deg, ${color}10, ${color}05)`,
                                                            border: `1px solid ${color}30`,
                                                            boxShadow: `0 4px 12px ${color}10`
                                                        }}
                                                    >
                                                        {IconComponent && (
                                                            <motion.div
                                                                animate={{
                                                                    rotate: [0, 360]
                                                                }}
                                                                transition={{
                                                                    duration: 20,
                                                                    repeat: Infinity,
                                                                    ease: "linear"
                                                                }}
                                                            >
                                                                <IconComponent
                                                                    size={20}
                                                                    style={{ color }}
                                                                />
                                                            </motion.div>
                                                        )}
                                                        <span className="text-base font-medium" style={{ color }}>
                                                            {tech}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* GitHub链接 - 悬浮按钮 */}
                                <motion.a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-medium text-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: `0 12px 32px ${colors.primary}30`
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        color: 'white',
                                        border: 'none',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {/* 悬浮光效 */}
                                    <motion.div
                                        className="absolute inset-0"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.6 }}
                                        style={{
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                                        }}
                                    />

                                    <Github size={24} />
                                    <span className="relative">View Source Code</span>
                                    <ExternalLink size={18} />
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

            {/* 增强背景效果 */}
            <motion.div
                className="absolute inset-0 -z-10"
                style={{ y: backgroundY }}
            >
                {/* 主渐变背景 */}
                <div className="absolute inset-0"
                    style={{
                        background: theme === 'dark'
                            ? 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)'
                            : 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)'
                    }}
                />

                {/* 动态网格 */}
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(${theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'} 1px, transparent 1px)`,
                        backgroundSize: '80px 80px',
                        animation: 'gradient-shift 20s ease infinite'
                    }}
                />

                {/* 浮动元素 */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            width: `${20 + i * 10}px`,
                            height: `${20 + i * 10}px`,
                            left: `${Math.random() * 100}%`,
                            bottom: '-100px',
                            background: theme === 'dark'
                                ? 'rgba(166, 139, 111, 0.08)'
                                : 'rgba(139, 115, 85, 0.05)',
                            borderRadius: i % 2 === 0 ? '50%' : '0',
                            transform: i % 2 === 0 ? 'none' : 'rotate(45deg)',
                            animation: `float-up ${20 + i * 5}s linear infinite`,
                            animationDelay: `${i * 4}s`,
                            backdropFilter: 'blur(2px)'
                        }}
                    />
                ))}
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <motion.h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-morandi-dark dark:text-morandi-light"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        My Projects
                    </motion.h2>
                    <motion.p
                        className="text-lg md:text-xl text-morandi-text dark:text-morandi-light/80 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Exploring creativity through code, building solutions that make a difference
                    </motion.p>

                    {/* 分类指示器 - 莫兰迪色系 */}
                    <motion.div
                        className="flex justify-center gap-6 mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        {Object.entries(categoryIcons).map(([category, Icon], index) => {
                            const count = projects.filter(p => p.category === category).length;

                            return (
                                <motion.div
                                    key={category}
                                    className="relative group cursor-pointer"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <motion.div
                                        className="relative p-4 rounded-2xl backdrop-blur-md"
                                        style={{
                                            background: theme === 'dark'
                                                ? 'rgba(255, 255, 255, 0.05)'
                                                : 'rgba(0, 0, 0, 0.03)',
                                            border: `1px solid ${theme === 'dark'
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'rgba(0, 0, 0, 0.08)'}`,
                                            transition: 'all 0.3s ease'
                                        }}
                                        whileHover={{
                                            backgroundColor: theme === 'dark'
                                                ? 'rgba(166, 139, 111, 0.1)'
                                                : 'rgba(139, 115, 85, 0.08)'
                                        }}
                                    >
                                        <Icon
                                            size={24}
                                            className="text-morandi-accent"
                                        />
                                        <motion.div
                                            className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold bg-morandi-accent text-white"
                                        >
                                            {count}
                                        </motion.div>

                                        {/* 标签提示 */}
                                        <motion.div
                                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                                            initial={{ opacity: 0, y: -10 }}
                                            whileHover={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <span className="text-xs font-medium text-morandi-text/60 dark:text-morandi-light/60">
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </span>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
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