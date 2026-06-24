"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import GitHubIcon from "../icons/GithubIcon"
import {stats} from "../../constants"


const CTA = () => {
    return (
        <section id="cta" className="py-20 md:py-25 px-4 bg-gradient-to-br from-blue-900 to-indigo-950 dark:bg-[#1F2F55]">
            <div className="container max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-3xl lg:text-[41px] font-bold text-slate-100 mb-4">
                        Start building with Vouch today
                    </h2>
                    <p className="text-md text-blue-100 max-w-3xl mx-auto">
                        Authentication that scales with you. Open source, MIT licensed, and ready for production.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center text-white">
                            <div className="flex justify-center mb-1 text-blue-200">
                                {stat.icon}
                            </div>
                            <p className="text-sm font-medium">{stat.label}</p>
                            <p className="text-xs text-blue-200/100">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
                    >
                        Get Started Free
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="https://github.com/NsikanPatrick/vouch"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <GitHubIcon className="h-4 w-4" />
                        GitHub
                    </Link>
                </div>

                <p className="text-sm text-blue-200/80 text-center mt-6">
                    No credit card required. Fully open source.
                </p>
            </div>
        </section>
    )
}

export default CTA