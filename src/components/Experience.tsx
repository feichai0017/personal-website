"use client"

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useSpring } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { School, Briefcase, Building2, ArrowUpRight, MapPin, Clock } from 'lucide-react'
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps"
import { geoMercator } from "d3-geo"

// Interface and Data (experiencesData) remain the same as you provided
interface Experience {
    title: string;
    organization: string;
    location: string;
    period: string;
    description: string;
    achievements: string[];
    type: "education" | "work";
    skills: string[];
}

const experiencesData: Experience[] = [
    {
        title: "Research Assistant",
        organization: "UNSW",
        location: "Sydney, Australia",
        period: "Feb 2025 - Present",
        description: "Researching database optimization techniques, focusing on SQL query optimization and low-level performance enhancement.",
        achievements: ["Developed novel database indexing algorithms", "Improved query performance by 40%", "Published research papers in top conferences"],
        type: "work",
        skills: ["Database Systems", "SQL Optimization", "Research", "Performance Tuning"]
    },
    {
        title: "Master of Computer Science",
        organization: "University of Sydney",
        location: "Sydney, Australia",
        period: "Feb 2024", // Assuming this is completion date, for sorting by start, need to infer
        description: "Pursuing advanced studies in Computer Science, focusing on software development and data analysis.",
        achievements: ["GPA: 4.0/4.0", "Advanced Database Systems", "Distributed Computing"],
        type: "education",
        skills: ["Algorithms", "System Design", "Data Science", "Cloud Computing"]
    },
    {
        title: "Full Stack Developer",
        organization: "Datap.ai",
        location: "Sydney, Australia",
        period: "Jul 2024", // Assuming this is start date
        description: "Developing web applications using Vue, React, and Node.js. Implementing best practices for code quality and scalability.",
        achievements: ["Led team of 5 developers", "Reduced loading time by 60%", "Implemented CI/CD pipeline"],
        type: "work",
        skills: ["React", "Node.js", "TypeScript", "AWS"]
    },
    {
        title: "AI Developer Engineer",
        organization: "Seetrum",
        location: "Shanghai, China",
        period: "Mar 2023 - Nov 2023",
        description: "Built full-stack web portal for spectroscopy-chip products with React front-end and TypeScript backend exposing RESTful APIs.",
        achievements: [
            "Trained deep-learning models (CNN & Transformer) for spectral fingerprint recognition and chemical composition prediction, boosting accuracy by 20%",
            "Automated data pipeline and CI/CD (Python, SQL, GitHub Actions) for continual model retraining and deployment to ARM edge devices",
            "Integrated on-chip inference API with hardware team, achieving real-time classification under 150 ms latency"
        ],
        type: "work",
        skills: ["React", "TypeScript", "Python", "CNN", "Transformer", "GitHub Actions", "Edge Computing"]
    },
    {
        title: "Laboratory Assistant (Intern)",
        organization: "WuXi AppTec",
        location: "Shanghai, China",
        period: "Jun 2022 - Jan 2023",
        description: "Supported AI-driven drug discovery programmes, merging deep-learning QSAR models with high-throughput reaction data to accelerate candidate screening.",
        achievements: [
            "Built predictive computational chemistry pipelines for reaction yield and property forecasting, utilising PyTorch Geometric on 100k+ curated reactions",
            "Synthesised and purified novel organic intermediates, validating in-silico predictions through bench-scale experiments",
            "Automated data capture and lab reporting, boosting experimental turnaround by 30%"
        ],
        type: "work",
        skills: ["PyTorch Geometric", "QSAR Models", "Computational Chemistry", "Deep Learning", "Data Analysis", "Lab Automation"]
    },
    {
        title: "Bachelor's in Chemistry",
        organization: "University College London (UCL)",
        location: "London, UK",
        period: "Sep 2020",
        description: "Completed a comprehensive program in Chemistry, gaining strong foundations in chemical principles.",
        achievements: ["First Class Honours", "Research Project Award", "Published undergraduate thesis"],
        type: "education",
        skills: ["Research Methods", "Data Analysis", "Problem Solving", "Technical Writing"]
    }
];

const experienceHighlights: Record<string, { label: string; value: string }[]> = {
    "Research Assistant": [
        { label: "Impact", value: "40% faster queries" },
        { label: "Focus", value: "SQL Optimizer" },
        { label: "Location", value: "Sydney" },
    ],
    "Master of Computer Science": [
        { label: "GPA", value: "4.0 / 4.0" },
        { label: "Tracks", value: "DB + Distributed" },
        { label: "City", value: "Sydney" },
    ],
    "Full Stack Developer": [
        { label: "Team", value: "Led 5 devs" },
        { label: "Result", value: "-60% load time" },
        { label: "Stack", value: "React + Node" },
    ],
    "AI Developer Engineer": [
        { label: "AI", value: "CNN + Transformer" },
        { label: "Latency", value: "<150 ms" },
        { label: "Ops", value: "CI/CD" },
    ],
    "Laboratory Assistant (Intern)": [
        { label: "Dataset", value: "100k+ reactions" },
        { label: "Output", value: "+30% throughput" },
        { label: "Domain", value: "Chemistry" },
    ],
    "Bachelor's in Chemistry": [
        { label: "Honour", value: "First Class" },
        { label: "Award", value: "Research Project" },
        { label: "City", value: "London" },
    ],
}

type RegionId = "anz" | "china" | "europe"

const regionMeta: Record<RegionId, { label: string; summary: string; accent: string; gradient: string }> = {
    anz: {
        label: "Australia & Oceania",
        summary: "Cloud & research roles shaping data systems across Sydney.",
        accent: "#7CC2FF",
        gradient: "from-sky-200/60 via-slate-100/40 to-transparent",
    },
    china: {
        label: "China & APAC Labs",
        summary: "AI + spectroscopy engineering rooted in Shanghai innovation hubs.",
        accent: "#F4B183",
        gradient: "from-amber-200/60 via-rose-100/30 to-transparent",
    },
    europe: {
        label: "United Kingdom",
        summary: "Foundational chemistry studies and academic accolades in London.",
        accent: "#C3B5FF",
        gradient: "from-indigo-200/50 via-purple-100/30 to-transparent",
    },
}

const regionOrder: RegionId[] = ["anz", "china", "europe"]

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
const noiseTexture = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E"
const mapConfig = {
    width: 980,
    height: 520,
    scale: 180,
    center: [0, 20] as [number, number],
}
// Helper function to parse dates
function getStartDate(periodString: string): Date {
    let dateStrToParse: string;

    if (periodString.includes(" - Present")) {
        dateStrToParse = periodString.split(" - Present")[0];
    } else if (periodString.includes(" - ")) {
        // Take the first part as the start date for a range
        dateStrToParse = periodString.split(" - ")[0];
    } else {
        // Single date entry
        dateStrToParse = periodString;
    }

    const parsedDate = Date.parse(dateStrToParse + " 1"); // Add "1" for day to help parser
    if (!isNaN(parsedDate)) {
        return new Date(parsedDate);
    }

    console.warn("Failed to parse date string:", dateStrToParse, "from period:", periodString);
    return new Date(0); // Fallback to epoch if parsing fails
}

// Adapted ExperienceItem for Timeline (reuses much of your original Item's style)
const ExperienceMiniMap: React.FC<{
    city: string;
    lat: number;
    lng: number;
    accent: string;
    variant?: "card" | "modal" | "overlay";
}> = ({ city, lat, lng, accent, variant = "card" }) => {
    const width = 220
    const height = variant === "modal" ? 170 : 140
    const isOverlay = variant === "overlay"
    const mapScale = isOverlay ? 120 : variant === "modal" ? 95 : 85

    return (
        <div
            className={`${isOverlay ? "absolute inset-0 pointer-events-none rounded-[inherit]" : "relative rounded-3xl border border-white/20 dark:border-white/10 shadow-inner"} overflow-hidden ${!isOverlay ? (variant === "modal" ? "h-40" : "h-32") : ""}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent" />
            <div className="absolute inset-0 opacity-25 mix-blend-screen" style={{ backgroundImage: `url(${noiseTexture})` }} />
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: mapScale, center: [lng, lat] }}
                width={width}
                height={height}
                style={{ width: "100%", height: "100%" }}
            >
                        <Geographies geography={geoUrl}>
                            {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
                                geographies.map((geo: { rsmKey: string }) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                fill="rgba(70, 65, 60, 0.3)"
                                stroke="rgba(15, 15, 15, 0.3)"
                                strokeWidth={0.2}
                            />
                        ))
                    }
                </Geographies>
                <Marker coordinates={[lng, lat]}>
                    <g>
                        <circle r={4.5} fill={accent} stroke="#fff" strokeWidth={1} />
                        <motion.circle
                            r={8}
                            stroke={`${accent}60`}
                            strokeWidth={1.2}
                            fill="transparent"
                            animate={{ opacity: [0.7, 0], r: [8, 16] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        />
                    </g>
                </Marker>
            </ComposableMap>
            {variant !== "overlay" && (
                <div className="absolute bottom-2 left-4 text-[11px] uppercase tracking-[0.3em] text-morandi-text/80 dark:text-morandi-light/70 flex items-center gap-2">
                    <span className="h-[1px] w-6 bg-morandi-text/40 dark:bg-morandi-light/40" />
                    <span>{city}</span>
                </div>
            )}
        </div>
    )
}

interface TimelineExperienceCardProps {
    experience: Experience;
    onSelect: (exp: Experience) => void;
    onHoverFocus: (title: string) => void;
}

const TimelineExperienceCard: React.FC<TimelineExperienceCardProps> = ({ experience, onSelect, onHoverFocus }) => {
    const { theme } = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    // Subtle floating animation for the card itself
    const floatingAnimation = {
        translateY: isHovered ? [0, -4, 0, -2, 0] : 0,
        transition: { duration: isHovered ? 0.8 : 0, ease: "easeInOut", repeat: isHovered ? Infinity : 0 }
    };

    const highlights = experienceHighlights[experience.title] || []
    const locationInfo = experienceLocations[experience.title]
    const regionAccent = locationInfo ? regionMeta[locationInfo.region].accent : '#A68B6F'
    const tiltX = (0.5 - mousePosition.y) * 8
    const tiltY = (mousePosition.x - 0.5) * 8

    return (
        <motion.div
            ref={cardRef}
            onMouseEnter={() => {
                setIsHovered(true)
                onHoverFocus(experience.title)
            }}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onSelect(experience)}
            onMouseMove={handleMouseMove}
            whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            whileTap={{ scale: 0.98 }}
            className="w-full cursor-pointer"
            style={{ perspective: '1000px' }} // For potential 3D effects on children
            animate={floatingAnimation}
        >
            <Card className={`relative overflow-hidden h-full shadow-lg hover:shadow-xl transition-all duration-300
                ${theme === 'dark'
                    ? 'bg-white/5 backdrop-blur-2xl'
                    : 'bg-white/90'
                }
                border ${isHovered ? 'border-morandi-accent/60' : 'border-morandi-accent/25'}`}
                style={{
                    transform: isHovered ? `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` : "rotateX(0deg) rotateY(0deg)",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.25s ease",
                }}
            >
                {/* Glossy Hover Effect */}
                <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        background: `radial-gradient(400px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${experience.type === "education" ? (theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)') : (theme === 'dark' ? 'rgba(166, 139, 111, 0.25)' : 'rgba(139, 115, 85, 0.2)')
                            }, transparent 60%)`,
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.2s ease-out'
                    }}
                />
                <CardContent className="p-5 md:p-6 relative z-0">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <motion.div
                                className={`p-2.5 rounded-lg transition-colors duration-300
                                    ${experience.type === 'education' ? 'bg-blue-500/10 dark:bg-blue-400/10' : 'bg-morandi-accent/10'}
                                    ${isHovered ? (experience.type === 'education' ? 'bg-blue-500/20 dark:bg-blue-400/20' : 'bg-morandi-accent/20') : ''}
                                `}
                                animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                {experience.type === 'education' ? (
                                    <School className={`w-6 h-6 transition-colors duration-300 ${isHovered ? 'text-blue-500 dark:text-blue-400' : 'text-blue-600 dark:text-blue-500'}`} />
                                ) : (
                                    <Briefcase className={`w-6 h-6 transition-colors duration-300 ${isHovered ? 'text-morandi-accent' : 'text-morandi-accent/80'}`} />
                                )}
                            </motion.div>
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold text-morandi-dark dark:text-morandi-dark leading-tight">
                                    {experience.title}
                                </h3>
                                <div className="flex items-center text-morandi-text/80 dark:text-morandi-dark/80 text-xs md:text-sm mt-0.5">
                                    <Building2 className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                                    {experience.organization}
                                </div>
                            </div>
                        </div>

                    </div>

                    {locationInfo && (
                        <div className="relative mb-5 mt-2 rounded-3xl border border-morandi-accent/20 dark:border-white/10 overflow-hidden">
                            <div className="relative h-32">
                                <ExperienceMiniMap
                                    city={locationInfo.city}
                                    lat={locationInfo.lat}
                                    lng={locationInfo.lng}
                                    accent={regionAccent}
                                    variant="overlay"
                                />
                                <div className="relative z-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between p-4 text-xs md:text-sm text-morandi-light/90 dark:text-white/90 uppercase tracking-[0.3em]">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span className="tracking-[0.2em]">{experience.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="tracking-[0.2em]">{experience.period}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {highlights.length > 0 && (
                        <motion.div
                            className="mt-4 flex flex-wrap gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
                        >
                            {highlights.map((highlight) => (
                                <motion.div
                                    key={`${experience.title}-${highlight.label}`}
                                    className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border"
                                    style={{
                                        background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                                        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <span className="text-morandi-text/60 uppercase tracking-[0.2em]">{highlight.label}</span>
                                    <span className="text-morandi-dark dark:text-morandi-dark">{highlight.value}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <p className="text-sm text-morandi-text dark:text-morandi-dark mb-4 leading-relaxed line-clamp-3">
                        {experience.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                        {experience.skills.slice(0, isHovered ? experience.skills.length : 3).map((skill) => (
                            <motion.div
                                key={skill}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, type: 'spring', stiffness: 200 }}
                            >
                                <Badge
                                    variant="outline"
                                    className={`text-xs border-morandi-accent/40 px-2.5 py-1
                                    ${theme === 'dark' ? 'bg-morandi-muted/20 hover:bg-morandi-muted/40' : 'bg-morandi-hover/30 hover:bg-morandi-hover/50'}
                                    `}
                                >
                                    {skill}
                                </Badge>
                            </motion.div>
                        ))}
                        {!isHovered && experience.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs border-morandi-accent/40 px-2.5 py-1">
                                +{experience.skills.length - 3}
                            </Badge>
                        )}
                    </div>
                    <motion.div
                        className="flex items-center justify-end gap-1 text-xs text-morandi-accent mt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <span>View details</span>
                        <ArrowUpRight size={14} />
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const experienceLocations: Record<string, { city: string; lat: number; lng: number; region: RegionId }> = {
    "Research Assistant": { city: "Sydney", lat: -33.8688, lng: 151.2093, region: "anz" },
    "Master of Computer Science": { city: "Sydney", lat: -33.8688, lng: 151.2093, region: "anz" },
    "Full Stack Developer": { city: "Sydney", lat: -33.8688, lng: 151.2093, region: "anz" },
    "AI Developer Engineer": { city: "Shanghai", lat: 31.2304, lng: 121.4737, region: "china" },
    "Laboratory Assistant (Intern)": { city: "Shanghai", lat: 31.2304, lng: 121.4737, region: "china" },
    "Bachelor's in Chemistry": { city: "London", lat: 51.5072, lng: -0.1276, region: "europe" },
}

// Timeline Item Component
interface TimelineNodeProps {
    experience: Experience;
    index: number;
    onSelect: (exp: Experience) => void;
    onHoverFocus: (title: string) => void;
    accent: string;
    onVisible: () => void;
}

const TimelineNode: React.FC<TimelineNodeProps> = ({ experience, index, onSelect, onHoverFocus, accent, onVisible }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.25 });
    const isLeft = index % 2 === 0;
    const { theme } = useTheme();
    const accentColor = accent || (experience.type === 'education' ? '#3B82F6' : '#A68B6F')
    const hasTriggered = useRef(false)

    useEffect(() => {
        if (isInView && !hasTriggered.current) {
            hasTriggered.current = true
            onVisible()
        }
    }, [isInView, onVisible])

    // 连接线动画
    const connectorVariants = {
        hidden: {
            width: 0,
            opacity: 0
        },
        visible: {
            width: "100%",
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeInOut",
                delay: 0.1  // 让连接线比主干线加载慢一点
            }
        }
    };

    // 节点动画
    const dotVariants = {
        hidden: {
            scale: 0,
            opacity: 0
        },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: 0.2  // 节点在连接线之后显示
            }
        }
    };

    // 内容动画
    const itemVariants = {
        hidden: {
            opacity: 0,
            x: isLeft ? -50 : 50,
            y: 20,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.3  // 内容最后显示
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            className="relative flex items-center min-h-[200px]"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {/* 移动端布局 */}
            <div className="md:hidden w-full flex flex-col items-center">
                <motion.div variants={dotVariants} className="mb-4">
                    <motion.div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: `${accentColor}20` }}
                        variants={dotVariants}
                        initial="hidden"
                        animate="visible"
                    />
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: accentColor }}
                    />
                </motion.div>
                <motion.div variants={itemVariants} className="w-full max-w-md">
                    <TimelineExperienceCard experience={experience} onSelect={onSelect} onHoverFocus={onHoverFocus} />
                </motion.div>
            </div>

            {/* 桌面端布局 */}
            <div className="hidden md:flex w-full items-center justify-center">
                {/* 左侧内容 */}
                <div className="w-[calc(50%-16px)] flex items-center justify-end">
                    {isLeft ? (
                        <motion.div variants={itemVariants} className="w-full max-w-md pr-8">
                            <TimelineExperienceCard experience={experience} onSelect={onSelect} onHoverFocus={onHoverFocus} />
                        </motion.div>
                    ) : <div />}
                </div>

                {/* 连接线和节点区域 */}
                <div className="w-[32px] relative flex items-center justify-center">
                    {/* 左侧连接线 */}
                    {isLeft && (
                        <motion.div
                            variants={connectorVariants}
                            className="absolute right-1/2 h-[2px] origin-left"
                            style={{
                                background: `linear-gradient(to left, ${accentColor}60, ${accentColor}10)`
                            }}
                        />
                    )}

                    {/* 节点 */}
                    <motion.div
                        variants={dotVariants}
                        className="relative flex items-center justify-center z-10"
                    >
                        {/* 发光效果 */}
                    <motion.div
                        className="absolute w-8 h-8 rounded-full"
                        style={{ backgroundColor: `${accentColor}20` }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        {/* 中心点 */}
                        <div
                            className="relative w-4 h-4 rounded-full shadow-lg"
                            style={{ backgroundColor: accentColor }}
                        />
                    </motion.div>

                    {/* 右侧连接线 */}
                    {!isLeft && (
                        <motion.div
                            variants={connectorVariants}
                            className="absolute left-1/2 h-[2px] origin-right"
                            style={{
                                background: `linear-gradient(to right, ${accentColor}60, ${accentColor}10)`
                            }}
                        />
                    )}
                </div>

                {/* 右侧内容 */}
                <div className="w-[calc(50%-16px)] flex items-center">
                    {!isLeft ? (
                        <motion.div variants={itemVariants} className="w-full max-w-md pl-8">
                            <TimelineExperienceCard experience={experience} onSelect={onSelect} onHoverFocus={onHoverFocus} />
                        </motion.div>
                    ) : <div />}
                </div>
            </div>
        </motion.div>
    );
};


// ExperienceDetail Modal remains the same as you provided earlier
const ExperienceDetail: React.FC<{ experience: Experience | null; onClose: () => void }> = ({ experience, onClose }) => {
    const { theme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    if (!experience) return null;
    const accent = experience.type === 'education' ? '#60A5FA' : '#A68B6F'
    const locationInfo = experienceLocations[experience.title]

    return (
        <AnimatePresence>
            {experience && (
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
                        className="relative w-full max-w-xl md:max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                        onMouseMove={handleMouseMove}
                    >
                        <Card className={`relative overflow-hidden shadow-2xl
                            ${theme === 'dark'
                                ? 'bg-white/10 backdrop-blur-2xl text-morandi-dark'
                                : 'bg-white text-morandi-dark'
                            } border ${theme === 'dark' ? 'border-white/15' : 'border-morandi-accent/35'}`}
                            style={{
                                backgroundImage: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${accent}15, transparent 55%)`,
                            }}
                        >
                            <motion.div
                                className="absolute inset-x-0 top-0 h-[2px]"
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                            />
                            <div
                                className="absolute inset-0 pointer-events-none opacity-25 mix-blend-soft-light"
                                style={{ backgroundImage: `url(${noiseTexture})` }}
                            />
                            <div className="absolute inset-0 pointer-events-none">
                                <motion.div
                                    className="absolute inset-0"
                                    animate={{
                                        background: `radial-gradient(900px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${theme === 'dark' ? 'rgba(166, 139, 111, 0.1)' : 'rgba(139, 115, 85, 0.08)'}, transparent 50%)`
                                    }}
                                    transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                                />
                            </div>

                            <CardContent className="p-6 md:p-8 relative max-h-[85vh] overflow-y-auto text-morandi-dark dark:text-morandi-dark">
                                <div className="flex items-start gap-4 mb-4 md:mb-6">
                                    <motion.div
                                        className={`p-3 md:p-4 rounded-xl ${experience.type === 'education'
                                            ? 'bg-blue-500/15 dark:bg-blue-400/15' // Differentiating Education type color
                                            : 'bg-morandi-accent/15'
                                            }`}
                                        initial={{ rotate: -90, scale: 0.5 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 180, delay: 0.1 }}
                                    >
                                        {experience.type === 'education' ? (
                                            <School className="w-7 h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-500" />
                                        ) : (
                                            <Briefcase className="w-7 h-7 md:w-8 md:h-8 text-morandi-accent" />
                                        )}
                                    </motion.div>
                                    <div>
                                        <motion.h2
                                            className="text-xl md:text-2xl font-bold text-morandi-dark dark:text-morandi-dark"
                                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                                        >
                                            {experience.title}
                                        </motion.h2>
                                        <motion.div className="text-sm md:text-base text-morandi-text/80 dark:text-morandi-dark/80 mt-0.5"
                                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                                        >
                                            <span className="font-medium">{experience.organization}</span> - {experience.location}
                                        </motion.div>
                                        <motion.div className="text-xs md:text-sm text-morandi-text/70 dark:text-morandi-dark/70"
                                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                                        >
                                            {experience.period}
                                        </motion.div>
                                        {locationInfo && (
                                            <div className="mt-4">
                                                <ExperienceMiniMap
                                                    city={locationInfo.city}
                                                    lat={locationInfo.lat}
                                                    lng={locationInfo.lng}
                                                    accent={regionMeta[locationInfo.region].accent}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {experienceHighlights[experience.title] && (
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {experienceHighlights[experience.title].map((highlight) => (
                                            <div
                                                key={`detail-${experience.title}-${highlight.label}`}
                                                className="px-4 py-2 rounded-2xl border text-sm font-medium"
                                                style={{
                                                    background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                                                    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                                                }}
                                            >
                                                <span className="text-morandi-text/60 dark:text-morandi-dark/60 uppercase tracking-[0.3em] text-[10px] block mb-1">
                                                    {highlight.label}
                                                </span>
                                                <span className="text-morandi-dark dark:text-morandi-dark text-base">
                                                    {highlight.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <motion.p className="text-sm md:text-base mb-4 md:mb-6 text-morandi-text dark:text-morandi-dark leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                >
                                    {experience.description}
                                </motion.p>

                                <motion.div className="mb-4 md:mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                    <h3 className="text-md md:text-lg font-semibold mb-2 text-morandi-dark dark:text-morandi-dark">
                                        Key Achievements:
                                    </h3>
                                    <ul className="space-y-1.5 list-disc list-inside pl-1 text-sm md:text-base">
                                        {experience.achievements.map((achievement, index) => (
                                            <motion.li key={index} className="text-morandi-text dark:text-morandi-dark"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.45 + index * 0.05 }}
                                            >
                                                {achievement}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                    <h3 className="text-md md:text-lg font-semibold mb-2 text-morandi-dark dark:text-morandi-dark">
                                        Skills & Technologies:
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {experience.skills.map((skill, index) => (
                                            <motion.div key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 + index * 0.05 }}>
                                                <Badge variant="outline" className="text-xs md:text-sm border-morandi-accent/40 bg-morandi-light/40 dark:bg-morandi-dark/40">
                                                    {skill}
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                                <button
                                    onClick={onClose}
                                    className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 rounded-full text-morandi-text/60 dark:text-morandi-dark/60 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                                    aria-label="Close details"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// Main Experience Section Component
export default function ExperienceTreeSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
    const [sortedExperiences, setSortedExperiences] = useState<Experience[]>([]);
    const [activeJourney, setActiveJourney] = useState<string>(experiencesData[0].title);
    const [lineSegments, setLineSegments] = useState(0);
    const { theme } = useTheme();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"] // Animate based on section visibility
    });
    const timelineProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
    const totalNodes = sortedExperiences.length || 1
    const lineProgressSpring = useSpring(0, { stiffness: 500, damping: 40 })
    const handleNodeVisible = useCallback(() => {
        setLineSegments(prev => Math.min(prev + 1, totalNodes))
    }, [totalNodes])
    const projection = useMemo(() => geoMercator()
        .scale(mapConfig.scale)
        .center(mapConfig.center)
        .translate([mapConfig.width / 2, mapConfig.height / 2]), []);

    useEffect(() => {
        const newSortedExperiences = [...experiencesData].sort((a, b) => {
            const dateA = getStartDate(a.period);
            const dateB = getStartDate(b.period);
            return dateB.getTime() - dateA.getTime(); // For descending order (most recent first)
        });
        setSortedExperiences(newSortedExperiences);
        if (newSortedExperiences.length > 0) {
            setActiveJourney(newSortedExperiences[0].title);
        }
    }, []);

    useEffect(() => {
        lineProgressSpring.set(lineSegments / totalNodes)
    }, [lineSegments, totalNodes, lineProgressSpring])

    useEffect(() => {
        setLineSegments(0)
        lineProgressSpring.set(0)
    }, [totalNodes, lineProgressSpring])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedExperience) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedExperience]);

    const regionTimeline = useMemo(() => {
        const bucket: Record<RegionId, Experience[]> = {
            anz: [],
            china: [],
            europe: [],
        }
        sortedExperiences.forEach(exp => {
            const location = experienceLocations[exp.title]
            const region = location?.region ?? "anz"
            bucket[region].push(exp)
        })
        return regionOrder
            .map(id => ({
                id,
                meta: regionMeta[id],
                experiences: bucket[id].sort((a, b) => getStartDate(b.period).getTime() - getStartDate(a.period).getTime()),
            }))
            .filter(group => group.experiences.length > 0)
    }, [sortedExperiences])

    const journeyMarkers = sortedExperiences
        .map((exp) => {
            const loc = experienceLocations[exp.title];
            if (!loc) return null;
            return {
                title: exp.title,
                city: loc.city,
                coordinates: [loc.lng, loc.lat] as [number, number],
            };
        })
        .filter((point): point is { title: string; city: string; coordinates: [number, number] } => point !== null);

    const activeLocation = experienceLocations[activeJourney];
    const projectedPoints = useMemo(() => {
        return journeyMarkers
            .map(marker => {
                const projected = projection(marker.coordinates)
                if (!projected) return null
                return { ...marker, point: projected as [number, number] }
            })
            .filter((marker): marker is { title: string; city: string; coordinates: [number, number]; point: [number, number] } => marker !== null)
    }, [journeyMarkers, projection])

    const mapPathD = useMemo(() => {
        if (projectedPoints.length < 2) return null
        return projectedPoints.reduce((path, item, index) => {
            const [x, y] = item.point
            return index === 0 ? `M ${x} ${y}` : `${path} L ${x} ${y}`
        }, "")
    }, [projectedPoints])

    const activeProjectedPoint = useMemo(() => {
        const match = projectedPoints.find(point => point.title === activeJourney)
        return match?.point ?? null
    }, [projectedPoints, activeJourney])

    let globalTimelineIndex = 0

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="relative min-h-screen py-20 md:py-32 px-4 overflow-hidden bg-morandi-bg dark:bg-[#03040a] transition-colors duration-500"
        >
            {/* 背景装饰 */}
            <motion.div className="absolute inset-0 -z-10 opacity-30">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full ${i % 2 === 0
                            ? 'bg-morandi-accent/5 dark:bg-morandi-accent/10'
                            : 'bg-blue-500/5 dark:bg-blue-400/10'
                            }`}
                        style={{
                            width: Math.random() * 300 + 100,
                            height: Math.random() * 300 + 100,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            filter: 'blur(50px)'
                        }}
                        animate={{
                            x: [0, Math.random() * 50 - 25, 0],
                            y: [0, Math.random() * 50 - 25, 0],
                            scale: [1, 1.1 + Math.random() * 0.2, 1]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </motion.div>

            <motion.div
                className="hidden md:block absolute inset-0 -z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/80 via-transparent to-[#1f2937]/80 dark:from-[#05060a]/90 dark:via-transparent dark:to-[#111827]/90" />
                <div className="absolute inset-0">
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{ scale: mapConfig.scale, center: mapConfig.center }}
                        width={mapConfig.width}
                        height={mapConfig.height}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
                                geographies.map((geo: { rsmKey: string }) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={theme === 'dark' ? "rgba(255,255,255,0.08)" : "rgba(30,30,30,0.08)"}
                                        stroke={theme === 'dark' ? "rgba(255,255,255,0.18)" : "rgba(30,30,30,0.15)"}
                                        strokeWidth={0.6}
                                    />
                                ))
                            }
                        </Geographies>
                        {journeyMarkers.map((marker, idx) => {
                            const next = journeyMarkers[idx + 1]
                            if (!next) return null
                            return (
                                <Line
                                    key={`map-line-${marker.title}`}
                                    from={marker.coordinates}
                                    to={next.coordinates}
                                    stroke="rgba(166,139,111,0.35)"
                                    strokeWidth={1.2}
                                    strokeLinecap="round"
                                    strokeDasharray="6 8"
                                />
                            )
                        })}
                        {journeyMarkers.map((marker) => {
                            const isActive = marker.title === activeJourney
                            return (
                                <Marker key={`map-marker-${marker.title}`} coordinates={marker.coordinates}>
                                    <g>
                                        <circle
                                            r={isActive ? 6 : 4}
                                            fill={isActive ? "#A68B6F" : "rgba(255,255,255,0.45)"}
                                            stroke="#ffffff"
                                            strokeWidth={1}
                                        />
                                        {isActive && (
                                            <>
                                                <rect x={-22} y={-30} width={44} height={16} rx={8} fill="rgba(255,255,255,0.9)" />
                                                <text className="fill-gray-900 text-[10px]" textAnchor="middle" y={-18}>
                                                    {marker.city}
                                                </text>
                                            </>
                                        )}
                                    </g>
                                </Marker>
                            )
                        })}
                    </ComposableMap>
                </div>
                <motion.svg
                    viewBox={`0 0 ${mapConfig.width} ${mapConfig.height}`}
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient id="journey-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(96,165,250,0.4)" />
                            <stop offset="50%" stopColor="rgba(166,139,111,0.7)" />
                            <stop offset="100%" stopColor="rgba(243, 195, 160, 0.6)" />
                        </linearGradient>
                    </defs>
                    {mapPathD && (
                        <motion.path
                            d={mapPathD}
                            stroke="url(#journey-glow)"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            fill="none"
                            pathLength={1}
                            initial={{ pathLength: 0 }}
                            strokeDasharray="1"
                            style={{ pathLength: timelineProgress }}
                        />
                    )}
                    {activeProjectedPoint && (
                        <>
                            <motion.circle
                                cx={activeProjectedPoint[0]}
                                cy={activeProjectedPoint[1]}
                                r={6}
                                fill="#F8E7CF"
                                stroke="#A68B6F"
                                strokeWidth={1}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.circle
                                cx={activeProjectedPoint[0]}
                                cy={activeProjectedPoint[1]}
                                r={10}
                                stroke="rgba(248, 231, 207, 0.8)"
                                fill="transparent"
                                animate={{ opacity: [0.7, 0], scale: [1, 1.6] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            />
                        </>
                    )}
                </motion.svg>
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-morandi-dark dark:text-morandi-light">
                        My Journey
                    </h2>
                    <p className="text-lg md:text-xl text-morandi-text dark:text-morandi-light/80">
                        Tracing the path of my professional and academic growth
                    </p>
                    {activeLocation && (
                        <div className="hidden md:block text-xs uppercase tracking-[0.4em] text-morandi-text/60 dark:text-morandi-dark/60 mt-6">
                            Currently exploring · {activeLocation.city}
                        </div>
                    )}
                </motion.div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* 中央时间线 */}
                    <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-[6px] -translate-x-1/2">
                        <div className="absolute inset-0 bg-white/20 dark:bg-white/5 rounded-full blur-sm" />
                        <motion.div className="absolute inset-0 rounded-full overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-morandi-accent/40 to-transparent"
                                style={{ originY: 0, scaleY: lineProgressSpring }}
                            />
                            <motion.div
                                className="absolute inset-0 opacity-70"
                                animate={{ backgroundPosition: ["0% 0%", "0% 200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                style={{
                                    backgroundImage: 'linear-gradient(180deg, transparent 0%, rgba(166,139,111,0.4) 50%, transparent 100%)',
                                    backgroundSize: '100% 200%',
                                    originY: 0,
                                    scaleY: lineProgressSpring,
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* 时间线内容 */}
                    <div className="space-y-24 md:space-y-32">
                        {regionTimeline.map(region => (
                            <div key={region.id} className="relative">
                                <div className="flex flex-col items-center mb-10">
                                    <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.4em] text-morandi-text/70 dark:text-morandi-light/70 bg-gradient-to-r ${region.meta.gradient}`}>
                                        <span>{region.meta.label}</span>
                                    </div>
                                    <p className="mt-3 text-center text-sm md:text-base text-morandi-text/80 dark:text-morandi-light/70 max-w-2xl">
                                        {region.meta.summary}
                                    </p>
                                </div>
                                <div className="space-y-16 md:space-y-28">
                                    {region.experiences.map(exp => {
                                        const node = (
                                            <TimelineNode
                                                key={`${region.id}-${exp.title}-${globalTimelineIndex}`}
                                                experience={exp}
                                                index={globalTimelineIndex}
                                                accent={region.meta.accent}
                                                onSelect={setSelectedExperience}
                                                onHoverFocus={setActiveJourney}
                                                onVisible={handleNodeVisible}
                                            />
                                        )
                                        globalTimelineIndex += 1
                                        return node
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ExperienceDetail
                experience={selectedExperience}
                onClose={() => setSelectedExperience(null)}
            />
        </section>
    )
}
