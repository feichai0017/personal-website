export type ExperienceRegion = "anz" | "china" | "uk"

export type ExperienceEntry = {
    id: string
    title: string
    organization: string
    location: string
    period: string
    description: string
    achievements: string[]
    type: "education" | "work"
    skills: string[]
    region: ExperienceRegion
}

export type LocationNode = {
    id: string
    city: string
    country: string
    coordinates: [number, number]
    region: ExperienceRegion
    entries: ExperienceEntry[]
}

export const experiences: ExperienceEntry[] = [
    {
        id: "exp-01",
        title: "Machine Learning Systems Engineer",
        organization: "ByteDance AML",
        location: "Beijing, China",
        period: "2026 - Present",
        description: "Building AI infra for machine learning workloads, with work spanning runtime control paths, systems reliability, and performance-sensitive data movement.",
        achievements: [
            "worked on internal ML systems and AI infra surfaces used by large-scale training and serving workflows",
            "focused on control-plane clarity, observability, and stability for complex distributed workloads",
            "built systems at the boundary of storage, cache, orchestration, and model-facing infrastructure",
        ],
        type: "work",
        skills: ["AI Infra", "ML Systems", "Distributed Systems", "Kubernetes", "Storage", "Observability"],
        region: "china",
    },
    {
        id: "exp-02",
        title: "Research Assistant",
        organization: "UNSW",
        location: "Sydney, Australia",
        period: "Feb 2025 - Present",
        description: "Researching database optimization techniques with a focus on SQL query optimization and low-level performance behavior.",
        achievements: [
            "developed novel database indexing ideas",
            "improved query performance by 40% in targeted workloads",
            "published research work around data systems and optimization",
        ],
        type: "work",
        skills: ["Database Systems", "SQL Optimization", "Research", "Performance Tuning"],
        region: "anz",
    },
    {
        id: "exp-03",
        title: "Full Stack Developer",
        organization: "Datap.ai",
        location: "Sydney, Australia",
        period: "Jul 2024",
        description: "Built product-facing web systems with React, Node.js, and TypeScript while driving code quality and delivery improvements.",
        achievements: [
            "led a team of 5 developers",
            "reduced load time by 60%",
            "implemented CI/CD workflows and stronger delivery discipline",
        ],
        type: "work",
        skills: ["React", "Node.js", "TypeScript", "AWS"],
        region: "anz",
    },
    {
        id: "exp-04",
        title: "Master of Computer Science",
        organization: "University of Sydney",
        location: "Sydney, Australia",
        period: "Feb 2024",
        description: "Advanced study focused on software systems, databases, and distributed computing.",
        achievements: [
            "GPA: 4.0 / 4.0",
            "deep coursework in advanced database systems",
            "stronger academic grounding in distributed computing",
        ],
        type: "education",
        skills: ["Algorithms", "System Design", "Data Science", "Cloud Computing"],
        region: "anz",
    },
    {
        id: "exp-05",
        title: "AI Developer Engineer",
        organization: "Seetrum",
        location: "Shanghai, China",
        period: "Mar 2023 - Nov 2023",
        description: "Built full-stack web portals and applied ML systems for spectroscopy-chip products with frontend, backend, and model-inference integration.",
        achievements: [
            "trained CNN and Transformer models for spectral recognition",
            "automated retraining and deployment workflows to ARM edge devices",
            "achieved real-time classification under 150 ms latency",
        ],
        type: "work",
        skills: ["React", "TypeScript", "Python", "Transformer", "GitHub Actions", "Edge Computing"],
        region: "china",
    },
    {
        id: "exp-06",
        title: "Laboratory Assistant (Intern)",
        organization: "WuXi AppTec",
        location: "Shanghai, China",
        period: "Jun 2022 - Jan 2023",
        description: "Worked across AI-driven drug discovery pipelines, reaction datasets, and computational chemistry workflows.",
        achievements: [
            "built predictive chemistry pipelines on 100k+ curated reactions",
            "validated in-silico predictions with bench-scale experiments",
            "automated data capture and reporting for 30% faster turnaround",
        ],
        type: "work",
        skills: ["PyTorch Geometric", "QSAR", "Computational Chemistry", "Deep Learning"],
        region: "china",
    },
    {
        id: "exp-07",
        title: "Bachelor's in Chemistry",
        organization: "University College London",
        location: "London, UK",
        period: "Sep 2020",
        description: "Built a research-first foundation in chemistry with strong analytical and technical writing habits.",
        achievements: [
            "graduated with First Class Honours",
            "received a research project award",
            "published undergraduate thesis work",
        ],
        type: "education",
        skills: ["Research Methods", "Data Analysis", "Problem Solving", "Technical Writing"],
        region: "uk",
    },
]

export const regionAccent: Record<ExperienceRegion, string> = {
    anz: "#0a0a0a",
    china: "#0a0a0a",
    uk: "#0a0a0a",
}

export const locationNodes: LocationNode[] = [
    {
        id: "loc-beijing",
        city: "Beijing",
        country: "China",
        coordinates: [116.4074, 39.9042],
        region: "china",
        entries: experiences.filter((item) => item.location.includes("Beijing")),
    },
    {
        id: "loc-sydney",
        city: "Sydney",
        country: "Australia",
        coordinates: [151.2093, -33.8688],
        region: "anz",
        entries: experiences.filter((item) => item.location.includes("Sydney")),
    },
    {
        id: "loc-shanghai",
        city: "Shanghai",
        country: "China",
        coordinates: [121.4737, 31.2304],
        region: "china",
        entries: experiences.filter((item) => item.location.includes("Shanghai")),
    },
    {
        id: "loc-london",
        city: "London",
        country: "United Kingdom",
        coordinates: [-0.1276, 51.5072],
        region: "uk",
        entries: experiences.filter((item) => item.location.includes("London")),
    },
]

export const routeOrder = ["loc-london", "loc-shanghai", "loc-sydney", "loc-beijing"] as const

export const orderedLocations = routeOrder.map(
    (locationId) => locationNodes.find((item) => item.id === locationId) as LocationNode
)
