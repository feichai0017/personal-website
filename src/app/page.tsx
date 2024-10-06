import Home from '@/components/Home'
import About from '@/components/About'
import Projects from '@/components/Projects'
import TechStack from '@/components/TechStack'
import Experience from '@/components/Experience'
import ContactMe from "@/components/ContactMe";

export default function Page() {
    return (
        <main className="min-h-screen bg-morandi-bg text-morandi-text">
            <Home />
            <About />
            <Projects />
            <TechStack />
            <Experience />
            <ContactMe />
        </main>
    )
}