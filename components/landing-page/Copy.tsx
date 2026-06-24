"use client"
import { copyVariants } from "../../constants"
import Link from "next/link"

const Copy = () => {
    // Get only the first variant of the copy
    const variant = copyVariants[0] 

    return (
        <section id="copy" className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900">
            <div className="container max-w-5xl mx-auto text-center">
                {/* Tag / Title */}
                <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded-full mb-4">
                    {variant.title}
                </span>

                {/* Caption */}
                <h2 className="text-3xl md:text-3xl lg:text-[41px] font-bold text-slate-300 mb-6 leading-tight">
                    {variant.caption}
                </h2>

                {/* Paragraph */}
                <p className="text-md text-slate-400 leading-loose max-w-4xl mx-auto">
                    {variant.paragraph}
                </p>

                {/* CTA Button */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/signup"
                        className="px-8 py-3 bg-btn-primary hover:bg-btn-primary-hover hover:border border-slate-400 text-white font-semibold rounded-lg  transition-colors shadow-lg hover:shadow-xl"
                    >
                        Get Started Free
                    </Link>
                    <Link
                        href="https://github.com/NsikanPatrick/vouch"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 border border-slate-300 text-slate-300 hover:text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        View on GitHub →
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Copy