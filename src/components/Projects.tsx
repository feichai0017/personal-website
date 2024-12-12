"use client"

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useAnimation, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Clock, CheckCircle, ExternalLink, Hexagon } from 'lucide-react';
import {
    SiReact, SiPython, SiDocker, SiKubernetes, SiMysql, SiRedis,
    SiNextdotjs, SiTailwindcss, SiTypescript, SiPostgresql, SiSupabase,
    SiApachekafka, SiPrometheus, SiGrafana, SiClerk
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';
import { TbBrandGolang } from 'react-icons/tb';
import { ConvexIcon, EdgeStoreIcon } from "@/components/Icons";

interface Project {
    title: string;
    description: string;
    status: "In Progress" | "In Production";
    date: string;
    techStack: string[];
    githubLink: string;
    backgroundImage: string;
}

type TechStackIcon = {
    icon: React.ComponentType<{ size?: number }>;
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
};

const projects: Project[] = [
    {
        title: "Distributed File Storage System",
        description: "High-performance distributed file storage solution with public and private cloud support.",
        status: "In Progress",
        date: "2024.6 - present",
        techStack: ["Go", "MySQL", "Redis", "Docker", "Kubernetes", "AWS S3"],
        githubLink: "https://github.com/feichai0017/NoRAG_distributed-filestorage",
        backgroundImage: "/projects/distributed-file-system.png?height=400&width=600",
    },
    {
        title: "Senior Financial Management Application",
        description: "Multi-agent financial system with AI-powered transaction analysis.",
        status: "In Production",
        date: "2024.7 - 2024.11",
        techStack: ["React", "Java", "Python", "MySQL", "Redis", "Docker"],
        githubLink: "https://github.com/CSUYSD/Anti-Scam-Financial-Management-Assistant",
        backgroundImage: "/projects/fin-care.png?height=400&width=600",
    },
    {
        title: "Personal Website",
        description: "My personal portfolio website showcasing projects and skills.",
        status: "In Production",
        date: "2024.9 - 2024.9",
        techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        githubLink: "https://github.com/feichai0017/personal-website",
        backgroundImage: "/projects/portfolio.png?height=400&width=600",
    },
    {
        title: "Notion-like Application",
        description: "A powerful and flexible application for document management and collaborative work.",
        status: "In Production",
        date: "2024.10 - 2024.11",
        techStack: ["Clerk", "Next.js", "TypeScript", "Tailwind CSS", "Convex", "EdgeStore"],
        githubLink: "https://github.com/feichai0017/NoteLab",
        backgroundImage: "/projects/notion-like.png?height=400&width=600",
    },
    {
        title: "Billion-scale Distributed IM System",
        description: "A high-performance, scalable instant messaging system for billions of users.",
        status: "In Progress",
        date: "2024 - present",
        techStack: ["Go", "Kafka", "Redis", "Kubernetes", "Prometheus", "Grafana"],
        githubLink: "https://github.com/feichai0017/plato_distributed-IM-system",
        backgroundImage: "/projects/IM-system.png?height=400&width=600",
    }
];

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
    const { theme } = useTheme();
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
    const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -100 : 100, 0]);
    const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [index % 2 === 0 ? 45 : -45, 0, index % 2 === 0 ? -45 : 45]);

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const springX = useSpring(x, springConfig);
    const springScale = useSpring(scale, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    return (
        <motion.div
            ref={ref}
            style={{
                opacity,
                scale: springScale,
                x: springX,
                rotateY: springRotateY,
                perspective: 1000,
            }}
            className="mb-16"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <Card className={`w-full md:w-[720px] h-auto md:h-[320px] mx-auto flex flex-col
                bg-morandi-muted bg-opacity-60 backdrop-blur-lg
                border border-morandi-accent border-opacity-40 shadow-xl
                transition-all duration-300 hover:shadow-lg hover:shadow-morandi-accent/50
                overflow-hidden relative`}>
                <motion.div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: `url(${project.backgroundImage})`,
                        filter: isHovered ? 'blur(0px)' : 'blur(10px)',
                        opacity: isHovered ? 1 : 0.7,
                    }}
                    animate={{ scale: isHovered ? 1.05 : 1, filter: isHovered ? 'blur(0px)' : 'blur(10px)', opacity: isHovered ? 1 : 0.7 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute inset-0 bg-black z-1"
                    style={{
                        opacity: isHovered ? 0.6 : 0,
                    }}
                    animate={{
                        opacity: isHovered ? 0.6 : 0,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <div className="relative z-20 flex flex-col h-full">
                    <CardHeader className="flex-grow">
                        <div className="flex justify-between items-start">
                            <CardTitle className={`text-xl md:text-2xl font-bold transition-all duration-300 ${isHovered ? 'text-white drop-shadow-lg' : 'text-morandi-text'}`}>
                                {project.title}
                            </CardTitle>
                            <motion.a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`transition-all duration-300 ${isHovered ? 'text-white' : 'text-morandi-accent'} hover:text-morandi-text`}
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            >
                                <Github size={24} className={isHovered ? 'drop-shadow-lg' : ''} />
                            </motion.a>
                        </div>
                        <p className={`text-sm md:text-base mt-4 transition-all duration-300 ${isHovered ? 'text-white drop-shadow-lg' : 'text-morandi-text'}`}>
                            {project.description}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                            <Badge
                                variant="secondary"
                                className={`${
                                    project.status === "In Progress"
                                        ? "bg-yellow-200 text-yellow-800"
                                        : "bg-green-200 text-green-800"
                                } flex items-center gap-1 px-2 py-1`}
                            >
                                {project.status === "In Progress" ? <Clock size={14} /> : <CheckCircle size={14} />}
                                {project.status}
                            </Badge>
                            <span className="text-xs md:text-sm text-morandi-text">{project.date}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => {
                                const { icon: IconComponent, color, bgColor } = techStackIcons[tech] || {};
                                return (
                                    <motion.div
                                        key={tech}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <Badge
                                            variant="outline"
                                            className="flex items-center gap-1 px-2 py-1 transition-all duration-300"
                                            style={{
                                                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : bgColor,
                                                color: theme === 'dark' ? 'white' : color,
                                                borderColor: color,
                                                boxShadow: `0 0 10px ${color}`,
                                            }}
                                        >
                                            {IconComponent && <IconComponent size={14} />}
                                            <span className="ml-1 text-xs md:text-sm">{tech}</span>
                                        </Badge>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </div>
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 right-4"
                        >
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-morandi-accent hover:text-morandi-text transition-colors"
                            >
                                <span>View on GitHub</span>
                                <ExternalLink size={16} />
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
};

const Projects: React.FC = () => {
    const controls = useAnimation();
    const ref = useRef(null);

    useEffect(() => {
        controls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        });
    }, [controls]);

    return (
        <section id="projects" className="min-h-screen py-16 px-4 relative bg-morandi-bg"  ref={ref}>
            <div className="absolute inset-0 z-0">
                <ParticleBackground />
                <BlockchainBackground />
            </div>
            <div className="relative z-10 min-h-screen container mx-auto">
                <motion.h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-morandi-text">
                    My Projects
                </motion.h2>
                <div className="space-y-16">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.title} project={project} index={index}/>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {theme} = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: { x: number; y: number; radius: number; dx: number; dy: number; color: string }[] = [];
        const colors = ['#6E56CF', '#1AD1A5', '#3B82F6', '#F59E0B', '#EC4899'];

        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = theme === 'dark' ? particle.color : `${particle.color}80`;
                ctx.fill();

                particle.x += particle.dx;
                particle.y += particle.dy;

                if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
            });
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [theme]);

    return <canvas ref={canvasRef} className="absolute inset-0" />;
};

const BlockchainBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, index) => (
                <motion.div
                    key={index}
                    className="absolute"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        opacity: 0.1,
                    }}
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <Hexagon size={Math.random() * 30 + 20} />
                </motion.div>
            ))}
        </div>
    );
};

export default Projects;