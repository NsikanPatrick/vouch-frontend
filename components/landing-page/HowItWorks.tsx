// "use client"
import { steps } from "../../constants"


const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-20 md:py-25 px-4 bg-slate-100 dark:bg-slate-900">
            <div className="container max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-sm font-semibold text-slate-200 bg-btn-primary hover:bg-btn-primary-hover hover:cursor-pointer px-3 py-2 rounded-full">
                        How It Works
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mt-8 mb-4">
                        Get started in minutes
                    </h2>
                    <p className="text-lg text-secondary">
                        Three simple steps to add enterprise-grade authentication to your app.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 -translate-y-1/2 bg-blue-300 z-0" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center">
                            {/* Step Number */}
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-bold">
                                {index + 1}
                            </div>

                            {/* Icon */}
                            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-300 shadow-md">
                                {step.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-primary mb-2">
                                {step.title}
                            </h3>
                            <p className="text-primary leading-relaxed max-w-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks