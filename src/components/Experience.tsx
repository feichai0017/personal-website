"use client"

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    const { theme } = useTheme()
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

    return (
        <motion.div
            ref={ref}
            style={{ opacity, scale }}
            className={`mb-12 flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
        >
            <div className="w-5/12">
                <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-800'
                }`}>
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{experience.organization}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{experience.description}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="w-2/12 flex justify-center">
                <div className="relative">
                    <motion.div
                        className={`w-12 h-12 rounded-full ${experience.type === 'education' ? 'bg-blue-500' : 'bg-green-500'} flex items-center justify-center shadow-md z-10`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <Badge variant="secondary" className="text-xs font-semibold text-white">
                            {experience.type === 'education' ? 'Edu' : 'Work'}
                        </Badge>
                    </motion.div>
                </div>
            </div>
            <div className="w-5/12 flex justify-center">
                <motion.div
                    className={`px-4 py-2 rounded-full inline-block shadow-md ${
                        theme === 'dark'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <span className="text-sm font-semibold">{experience.period}</span>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default function Experience() {
    const { theme } = useTheme()

    return (
        <section id="experience" className="min-h-screen flex items-center justify-center py-24 px-4">
            <div className="w-full max-w-6xl">
                <h2 className={`text-4xl font-bold mb-16 text-center ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                    My Experience
                </h2>
                <div className="relative">
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>

                    {experiences.map((exp, index) => (
                        <ExperienceItem key={index} experience={exp} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}