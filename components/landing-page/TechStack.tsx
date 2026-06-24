"use client"

import {technologies} from "../../constants"

const TechStack = () => {
    return (
        <section id="tech-stack" className="py-20 md:25 px-4 bg-slate-100 dark:bg-slate-800">
            <div className="container max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-3xl lg:text-[39px] font-bold text-primary">
                        Built with modern tools
                    </h2>
                    <p className="text-primary mt-2 text-sm md:text-base">
                        Vouch is powered by a carefully curated stack of open-source technologies.
                    </p>
                </div>

                {/* Tech Icons Grid */}
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                    {technologies.map((tech, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110 duration-200"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 shadow-sm">
                                {tech.icon}
                            </div>
                            <span className="text-xs font-medium text-primary">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TechStack