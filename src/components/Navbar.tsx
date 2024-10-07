"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from 'next-themes'
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { useActiveSection } from "@/hooks/useActiveSection"
import { Menu, X, ExternalLink } from 'lucide-react'

const navItems = [
    { title: "Home", href: "home" },
    { title: "About", href: "about" },
    { title: "Projects", href: "projects" },
    { title: "Tech Stack", href: "techstack" },
    { title: "Experience", href: "experience" },
    { title: "Contact Me", href: "contact" },
]

const blogLink = "https://ericsgc-blog.netlify.app/"

export default function Navbar() {
    const { theme } = useTheme()
    const activeSection = useActiveSection(navItems.map(item => item.href))
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    const menuVariants = {
        open: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        closed: {
            opacity: 0,
            y: "-100%",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    }

    const linkVariants = {
        hover: {
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        },
        tap: { scale: 0.95 }
    }

    const renderNavItem = (item, isMobile = false) => (
        <motion.li key={item.title} variants={linkVariants} whileHover="hover" whileTap="tap">
            <a
                href={`#${item.href}`}
                className={cn(
                    "px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 block",
                    activeSection === item.href
                        ? "bg-morandi-accent text-morandi-text"
                        : "text-morandi-text hover:bg-morandi-hover",
                    isMobile && "text-base py-3"
                )}
                onClick={(e) => {
                    e.preventDefault()
                    document.querySelector(`#${item.href}`)?.scrollIntoView({ behavior: 'smooth' })
                    if (isMobile) setIsMenuOpen(false)
                }}
            >
                {item.title}
            </a>
        </motion.li>
    )

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className={cn(
                "relative flex justify-between items-center rounded-full shadow-lg px-6 py-3 max-w-4xl mx-auto",
                theme === 'dark' ? 'bg-morandi-dark' : 'bg-morandi-light'
            )}>
                <nav className="flex-grow flex items-center justify-between md:justify-center">
                    <ul className="hidden md:flex items-center justify-center space-x-2">
                        {navItems.map(item => renderNavItem(item))}
                        <motion.li variants={linkVariants} whileHover="hover" whileTap="tap">
                            <a
                                href={blogLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 inline-flex items-center",
                                    "text-morandi-text hover:bg-morandi-hover"
                                )}
                            >
                                Blog
                                <ExternalLink size={14} className="ml-1" />
                            </a>
                        </motion.li>
                    </ul>
                    <div className="md:hidden flex items-center space-x-4">
                        <ModeToggle />
                        <motion.button
                            onClick={toggleMenu}
                            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-morandi-accent"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>
                </nav>
                <div className="hidden md:block">
                    <ModeToggle />
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="absolute top-full left-4 right-4 mt-2 md:hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <ul className={cn(
                            "rounded-2xl shadow-lg py-2",
                            theme === 'dark' ? 'bg-morandi-dark/95' : 'bg-morandi-muted/95',
                            "backdrop-blur-md"
                        )}>
                            {navItems.map(item => renderNavItem(item, true))}
                            <motion.li
                                variants={linkVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <a
                                    href={blogLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "px-6 py-3 block text-base font-medium transition-colors duration-200 flex items-center",
                                        "text-morandi-text hover:bg-morandi-hover"
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Blog
                                    <ExternalLink size={18} className="ml-2" />
                                </a>
                            </motion.li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}