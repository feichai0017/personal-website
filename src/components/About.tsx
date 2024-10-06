"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const skills = [
    "Java", "JavaScript", "GO", "React", "Node.js", "Spring Boot",
    "MongoDB", "PostgreSQL", "Docker", "AWS", "Blockchain"
]

export default function About() {
    return (
        <section id="about" className="min-h-screen flex items-center justify-center py-16 bg-morandi-bg">
            <Card className="w-full max-w-4xl bg-morandi-muted/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-morandi-text">About Me</CardTitle>
                    <CardDescription className="text-morandi-text/80">Get to know me better</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-8">
                        <motion.div
                            className="flex-shrink-0"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Image
                                src="/img/my.png"
                                alt="Guocheng Song"
                                width={200}
                                height={200}
                                className="rounded-full border-4 border-morandi-accent shadow-lg"
                            />
                        </motion.div>
                        <div className="flex-grow">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <p className="mb-4 text-morandi-text">
                                    I'm a passionate web developer with expertise in Java, JavaScript, and GO. My journey in programming started with a fascination for creating and problem-solving, which has only grown stronger over time.
                                </p>
                                <p className="mb-4 text-morandi-text">
                                    My areas of interest include building new Web Technologies and Products, as well as exploring the exciting world of Blockchain. I'm always eager to learn and apply cutting-edge technologies to create innovative solutions.
                                </p>
                                <p className="mb-6 text-morandi-text">
                                    When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through blog posts and community engagement.
                                </p>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-morandi-text">Skills & Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <motion.div
                                                key={skill}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                viewport={{ once: true }}
                                            >
                                                <Badge variant="secondary" className="bg-morandi-accent text-morandi-bg">
                                                    {skill}
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}