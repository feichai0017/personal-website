import Navbar from "@/components/Navbar"
import SmoothScroll from "@/components/SmoothScroll"

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
    return (
        <SmoothScroll>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-grow">{children}</div>
            </div>
        </SmoothScroll>
    )
}
