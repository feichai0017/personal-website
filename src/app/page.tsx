'use client'

import { ReactNode, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

import Home from '@/components/Home'
import About from '@/components/About'
import Projects from '@/components/Projects'
import TechStack from '@/components/TechStack'
import Experience from '@/components/Experience'
import ContactMe from '@/components/ContactMe'

function SectionReveal({
  children,
}: {
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-6% 0px -12% 0px' })

  return (
    <motion.div
      ref={ref}
      className="section-stage relative"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Page() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f5f1] text-[#0a0a0a]">
      <Home />
      <SectionReveal>
        <About />
      </SectionReveal>
      <SectionReveal>
        <Projects />
      </SectionReveal>
      <SectionReveal>
        <TechStack />
      </SectionReveal>
      <SectionReveal>
        <Experience />
      </SectionReveal>
      <SectionReveal>
        <ContactMe />
      </SectionReveal>
    </main>
  )
}
