import ExperienceInteractive from "@/components/ExperienceInteractive"
import RevealHeadline from "@/components/RevealHeadline"

export default function Experience() {
    return (
        <section id="experience" className="showcase-section px-4 py-20 text-[#0a0a0a]">
            <div className="mx-auto w-full max-w-[1800px] px-2 md:px-4 lg:px-6">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-black/36">
                            /05 Experience
                        </div>
                        <RevealHeadline
                            as="h2"
                            lines={[
                                "Four cities.",
                                { text: "One systems through-line.", className: "text-black/48" },
                            ]}
                            className="mt-6 max-w-5xl text-5xl font-medium leading-[0.9] tracking-[-0.06em] text-black md:text-7xl"
                        />
                    </div>

                    <p className="max-w-md text-sm leading-7 text-black/58">
                        Education, work, research, and AI infra routed through London, Shanghai, Sydney, and now
                        Beijing. Select a city to trace the route and inspect the work behind it.
                    </p>
                </div>

                <ExperienceInteractive />
            </div>
        </section>
    )
}
