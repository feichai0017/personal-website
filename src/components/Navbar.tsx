"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useTheme } from 'next-themes'
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { useActiveSection } from "@/hooks/useActiveSection"

const navItems = [
    { title: "Home", href: "home" },
    { title: "About", href: "about" },
    { title: "Projects", href: "projects" },
    { title: "Tech Stack", href: "techstack" },
    { title: "Experience", href: "experience" },
    { title: "Contact Me", href: "contact" },
    { title: "Blog", href: "https://ericsgc-blog.netlify.app/" },
]

export default function Navbar() {
    const { theme } = useTheme()
    const activeSection = useActiveSection(navItems.map(item => item.href))

    return (
        <div className="fixed top-4 left-0 right-0 flex justify-center z-50">
            <motion.div
                className={`bg-opacity-80 backdrop-blur-sm rounded-full shadow-lg px-1 py-1 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
            >
                <nav className="relative">
                    <ul className="flex items-center">
                        {navItems.map((item) => (
                            <li key={item.title}>
                                <a
                                    href={`#${item.href}`}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 block",
                                        activeSection === item.href
                                            ? "text-blue-500"
                                            : theme === 'dark' ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        document.querySelector(`#${item.href}`)?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                >
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </motion.div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <ModeToggle />
            </div>
        </div>
    )
}