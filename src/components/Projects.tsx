"use client"

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Clock, CheckCircle } from 'lucide-react';
import {
    SiReact, SiPython, SiDocker, SiKubernetes, SiMysql, SiRedis,
    SiNextdotjs, SiTailwindcss, SiTypescript, SiPostgresql,
    SiApachekafka, SiPrometheus, SiGrafana
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';
import { TbBrandGolang } from 'react-icons/tb';

// 定义 Project 接口
interface Project {
    title: string;
    description: string;
    status: "In Progress" | "In Production";
    date: string;
    techStack: string[];
    githubLink: string;
}

// 定义 techStackIcons 的类型
type TechStackIcon = {
    icon: React.ComponentType;
    color: string;
};

const techStackIcons: Record<string, TechStackIcon> = {
    'React': { icon: SiReact, color: '#61DAFB' },
    'Java': { icon: FaJava, color: '#007396' },
    'Python': { icon: SiPython, color: '#3776AB' },
    'Go': { icon: TbBrandGolang, color: '#00ADD8' },
    'MySQL': { icon: SiMysql, color: '#4479A1' },
    'Redis': { icon: SiRedis, color: '#DC382D' },
    'Docker': { icon: SiDocker, color: '#2496ED' },
    'Kubernetes': { icon: SiKubernetes, color: '#326CE5' },
    'AWS S3': { icon: FaAws, color: '#FF9900' },
    'TypeScript': { icon: SiTypescript, color: '#3178C6' },
    'Next.js': { icon: SiNextdotjs, color: '#000000' },
    'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
    'PostgreSQL': { icon: SiPostgresql, color: '#4169E1' },
    'Kafka': { icon: SiApachekafka, color: '#231F20' },
    'Prometheus': { icon: SiPrometheus, color: '#E6522C' },
    'Grafana': { icon: SiGrafana, color: '#F46800' },
};

const projects: Project[] = [
    {
        title: "Distributed File Storage System",
        description: "High-performance distributed file storage solution with public and private cloud support.",
        status: "In Progress",
        date: "2024.6 - present",
        techStack: ["Go", "MySQL", "Redis", "Docker", "Kubernetes", "AWS S3"],
        githubLink: "https://github.com/yourusername/distributed-file-storage",
    },
    {
        title: "Senior Financial Management Application",
        description: "Multi-agent financial system with AI-powered transaction analysis.",
        status: "In Production",
        date: "2024.7 - present",
        techStack: ["React", "Java", "Python", "MySQL", "Redis", "Docker"],
        githubLink: "https://github.com/yourusername/financial-management-app",
    },
    {
        title: "Personal Website",
        description: "My personal portfolio website showcasing projects and skills.",
        status: "In Production",
        date: "2024 - present",
        techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        githubLink: "https://github.com/yourusername/personal-website",
    },
    {
        title: "Notion-like Application",
        description: "A powerful and flexible application for document management and collaborative work.",
        status: "In Progress",
        date: "2024 - present",
        techStack: ["Go", "React", "TypeScript", "PostgreSQL", "Docker"],
        githubLink: "https://github.com/yourusername/notion-like-app",
    },
    {
        title: "Billion-scale Distributed IM System",
        description: "A high-performance, scalable instant messaging system for billions of users.",
        status: "In Progress",
        date: "2024 - present",
        techStack: ["Go", "Kafka", "Redis", "Kubernetes", "Prometheus", "Grafana"],
        githubLink: "https://github.com/yourusername/billion-scale-im",
    }
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const { theme } = useTheme();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity, scale }}
            className="mb-16"
        >
            <Card className={`w-[720px] h-[320px] mx-auto flex flex-col ${
                theme === 'dark'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-800'
            } transition-colors duration-300`}>
                <CardHeader className="flex-grow">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-2xl font-semibold">
                            {project.title}
                        </CardTitle>
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">
                            <Github size={24} />
                        </a>
                    </div>
                    <p className={`text-base mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{project.description}</p>
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
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{project.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => {
                            const { icon: IconComponent, color } = techStackIcons[tech] || {};
                            return (
                                <Badge
                                    key={tech}
                                    variant="outline"
                                    className={`${
                                        theme === 'dark'
                                            ? 'bg-gray-700 text-gray-300'
                                            : 'bg-gray-200 text-gray-700'
                                    } flex items-center gap-1 px-2 py-1 transition-colors duration-300`}
                                >
                                    {IconComponent && <IconComponent size={14} color={color} />}
                                    <span className="ml-1">{tech}</span>
                                </Badge>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const Projects: React.FC = () => {
    return (
        <section id="projects" className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-16 text-center">My Projects</h2>
                <div className="space-y-16">
                    {projects.map((project) => (
                        <ProjectCard key={project.title} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;