"use client"

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { School, Briefcase } from 'lucide-react'

const experiences = [
    {
        title: "Master of Computer Science",
        organization: "University of Sydney",
        period: "Feb 2024",
        description: "Pursuing advanced studies in Computer Science, focusing on software development and data analysis.",
        type: "education"
    },
    {
        title: "Full Stack Developer",
        organization: "Datap.ai",
        period: "Jul 2024",
        description: "Developing web applications using Vue, React, and Node.js. Implementing best practices for code quality and scalability.",
        type: "work"
    },
    {
        title: "Data Analyst",
        organization: "Seetrum",
        period: "Oct 2023",
        description: "Analyzed market trends and product data. Prepared data-driven reports for marketing strategies.",
        type: "work"
    },
    {
        title: "Laboratory Assistant",
        organization: "WuXi AppTec",
        period: "Jul 2023",
        description: "Conducted organic chemistry experiments and data analysis for research projects.",
        type: "work"
    },
    {
        title: "Bachelor's in Chemistry",
        organization: "University College London (UCL)",
        period: "Sep 2020",
        description: "Completed a comprehensive program in Chemistry, gaining strong foundations in chemical principles.",
        type: "education"
    }
]

const ExperienceItem = ({ experience, index }) => {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    })
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8])
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.95])
    const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, 20])
    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }

    const springOpacity = useSpring(opacity, springConfig)
    const springScale = useSpring(scale, springConfig)
    const springY = useSpring(y, springConfig)

    return (
        <motion.div
            ref={ref}
            style={{ opacity: springOpacity, scale: springScale, y: springY }}
            className={`mb-16 flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
            <div className="w-full md:w-5/12 mb-4 md:mb-0">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-morandi-light to-morandi-hover dark:from-morandi-dark dark:to-morandi-text">
                    <CardContent className="p-6 backdrop-blur-sm bg-white/30 dark:bg-black/30 rounded-lg transition-all duration-500">
                        <h3 className="text-xl font-semibold mb-2 text-morandi-dark dark:text-morandi-light transition-colors duration-500">{experience.title}</h3>
                        <p className="text-sm mb-2 text-morandi-text dark:text-morandi-accent transition-colors duration-500">{experience.organization}</p>
                        <p className="text-sm text-morandi-text dark:text-morandi-light transition-colors duration-500">{experience.description}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="w-full md:w-2/12 flex justify-center my-4 md:my-0">
                <div className="relative">
                    <motion.div
                        className={`w-16 h-16 rounded-full ${
                            experience.type === 'education' ? 'bg-gradient-to-br from-morandi-accent to-morandi-text' : 'bg-gradient-to-br from-morandi-text to-morandi-accent'
                        } flex items-center justify-center shadow-md z-10 transition-all duration-500`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                        {experience.type === 'education' ? (
                            <School className="w-8 h-8 text-white transition-all duration-500" />
                        ) : (
                            <Briefcase className="w-8 h-8 text-white transition-all duration-500" />
                        )}
                    </motion.div>
                </div>
            </div>
            <div className="w-full md:w-5/12 flex justify-center">
                <motion.div
                    className="px-4 py-2 rounded-full inline-block shadow-md bg-gradient-to-r from-morandi-light to-morandi-hover dark:from-morandi-dark dark:to-morandi-text transition-all duration-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                >
                    <span className="text-sm font-semibold text-morandi-dark dark:text-morandi-light transition-colors duration-500">{experience.period}</span>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default function Experience() {
    const ref = useRef(null)
    const [timelineStart, setTimelineStart] = useState(0)
    const [timelineEnd, setTimelineEnd] = useState(0)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const scaleProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    useEffect(() => {
        const updateTimelinePositions = () => {
            if (ref.current) {
                const { top: sectionTop } = ref.current.getBoundingClientRect()
                const icons = ref.current.querySelectorAll('.rounded-full')
                if (icons.length > 0) {
                    const firstIcon = icons[0]
                    const lastIcon = icons[icons.length - 1]
                    const { top: firstIconTop } = firstIcon.getBoundingClientRect()
                    const { bottom: lastIconBottom } = lastIcon.getBoundingClientRect()
                    setTimelineStart(firstIconTop - sectionTop)
                    setTimelineEnd(lastIconBottom - sectionTop)
                }
            }
        }

        updateTimelinePositions()
        window.addEventListener('resize', updateTimelinePositions)
        return () => window.removeEventListener('resize', updateTimelinePositions)
    }, [])

    return (
        <section id="experience" ref={ref} className="min-h-screen flex items-center justify-center py-24 px-4 overflow-hidden bg-gradient-to-br from-morandi-light to-morandi-hover dark:from-morandi-dark dark:to-morandi-text transition-all duration-500">
            <div className="w-full max-w-6xl">
                <motion.h2
                    className="text-3xl md:text-4xl font-bold mb-16 text-center text-morandi-dark dark:text-morandi-light transition-colors duration-500"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    My Experience
                </motion.h2>
                <div className="relative">
                    <motion.div
                        className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-morandi-accent via-morandi-text to-morandi-hover dark:from-morandi-text dark:via-morandi-accent dark:to-morandi-light transition-all duration-500"
                        style={{
                            scaleY: scaleProgress,
                            originY: 0,
                            height: `${timelineEnd - timelineStart}px`,
                            top: `${timelineStart}px`
                        }}
                    />

                    {experiences.map((exp, index) => (
                        <ExperienceItem key={index} experience={exp} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}