'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
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

  const projectsInView = useInView(projectsRef, { amount: 0.15, margin: '0px 0px -5% 0px' })
  const techStackInView = useInView(techStackRef, { amount: 0.15, margin: '0px 0px -5% 0px' })
  const experienceInView = useInView(experienceRef, { amount: 0.15, margin: '0px 0px -5% 0px' })
  const contactInView = useInView(contactRef, { amount: 0.2, margin: '0px 0px -10% 0px' })

  const [projectsVisible, setProjectsVisible] = useState(false)
  const [techStackVisible, setTechStackVisible] = useState(false)
  const [experienceVisible, setExperienceVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)

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
      <div ref={projectsRef}>{projectsVisible ? <Projects /> : <SectionSkeleton title="Projects" />}</div>
      <div ref={techStackRef}>{techStackVisible ? <TechStack /> : <SectionSkeleton title="Tech Stack" />}</div>
      <div ref={experienceRef}>{experienceVisible ? <Experience /> : <SectionSkeleton title="Experience" />}</div>
      <div ref={contactRef}>{contactVisible ? <ContactMe /> : <SectionSkeleton title="Contact" />}</div>
    </main>
  )
}
