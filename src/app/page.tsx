'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Home from '@/components/Home'
import About from '@/components/About'

const SectionSkeleton = ({ title }: { title: string }) => (
  <section className="py-24 flex items-center justify-center">
    <div className="flex flex-col items-center text-center text-xs uppercase tracking-[0.4em] text-morandi-text/60 dark:text-morandi-light/50">
      <span className="mb-3 h-1 w-20 animate-pulse rounded-full bg-morandi-muted dark:bg-morandi-hover/40" />
      <span className="font-medium">Loading {title}</span>
    </div>
  </section>
)

const Projects = dynamic(() => import('@/components/Projects'), {
    loading: () => <SectionSkeleton title="Projects" />,
    ssr: false,
})

const TechStack = dynamic(() => import('@/components/TechStack'), {
    loading: () => <SectionSkeleton title="Tech Stack" />,
    ssr: false,
})

const Experience = dynamic(() => import('@/components/Experience'), {
    loading: () => <SectionSkeleton title="Experience" />,
    ssr: false,
})

const ContactMe = dynamic(() => import('@/components/ContactMe'), {
    loading: () => <SectionSkeleton title="Contact" />,
    ssr: false,
})

export default function Page() {
  const projectsRef = useRef<HTMLDivElement | null>(null)
  const techStackRef = useRef<HTMLDivElement | null>(null)
  const experienceRef = useRef<HTMLDivElement | null>(null)
  const contactRef = useRef<HTMLDivElement | null>(null)

  const projectsInView = useInView(projectsRef, { amount: 0.1, margin: '35% 0px 15% 0px', once: true })
  const techStackInView = useInView(techStackRef, { amount: 0.1, margin: '35% 0px 15% 0px', once: true })
  const experienceInView = useInView(experienceRef, { amount: 0.1, margin: '35% 0px 15% 0px', once: true })
  const contactInView = useInView(contactRef, { amount: 0.15, margin: '45% 0px 20% 0px', once: true })

  const [projectsVisible, setProjectsVisible] = useState(false)
  const [techStackVisible, setTechStackVisible] = useState(false)
  const [experienceVisible, setExperienceVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace('#', '')
    switch (hash) {
      case 'projects':
        setProjectsVisible(true)
        break
      case 'techstack':
        setTechStackVisible(true)
        break
      case 'experience':
        setExperienceVisible(true)
        break
      case 'contact':
        setContactVisible(true)
        break
      default:
        break
    }
    const handleHashChange = () => {
      const nextHash = window.location.hash.replace('#', '')
      if (nextHash === 'projects') setProjectsVisible(true)
      if (nextHash === 'techstack') setTechStackVisible(true)
      if (nextHash === 'experience') setExperienceVisible(true)
      if (nextHash === 'contact') setContactVisible(true)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (projectsInView) setProjectsVisible(true)
  }, [projectsInView])

  useEffect(() => {
    if (techStackInView) setTechStackVisible(true)
  }, [techStackInView])

  useEffect(() => {
    if (experienceInView) setExperienceVisible(true)
  }, [experienceInView])

  useEffect(() => {
    if (contactInView) setContactVisible(true)
  }, [contactInView])

  return (
    <main className="min-h-screen bg-morandi-bg dark:bg-[#03040a] text-morandi-text dark:text-morandi-light transition-colors duration-500">
      <Home />
      <About />
      <motion.div
        id="projects"
        ref={projectsRef}
        initial={{ opacity: 0, y: 24 }}
        animate={projectsVisible ? { opacity: 1, y: 0 } : { opacity: 0.8 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {projectsVisible ? <Projects /> : <SectionSkeleton title="Projects" />}
      </motion.div>
      <motion.div
        id="techstack"
        ref={techStackRef}
        initial={{ opacity: 0, y: 24 }}
        animate={techStackVisible ? { opacity: 1, y: 0 } : { opacity: 0.8 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {techStackVisible ? <TechStack /> : <SectionSkeleton title="Tech Stack" />}
      </motion.div>
      <motion.div
        id="experience"
        ref={experienceRef}
        initial={{ opacity: 0, y: 24 }}
        animate={experienceVisible ? { opacity: 1, y: 0 } : { opacity: 0.8 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {experienceVisible ? <Experience /> : <SectionSkeleton title="Experience" />}
      </motion.div>
      <motion.div
        id="contact"
        ref={contactRef}
        initial={{ opacity: 0, y: 24 }}
        animate={contactVisible ? { opacity: 1, y: 0 } : { opacity: 0.8 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {contactVisible ? <ContactMe /> : <SectionSkeleton title="Contact" />}
      </motion.div>
    </main>
  )
}
