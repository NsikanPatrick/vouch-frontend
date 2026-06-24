"use client"
import {Shield, Mail, Users, FileText} from "lucide-react"
import { features } from "../../constants"
// import Link from "next/link"

const Features = () => {
    return (
        <section id="features" className="flex flex-col py-20 px-20 bg-popover">
            <div className="featuresCopy max-w-2xl mb-5">
                <h1 className=" text-3xl font-bold text-primary leading-tight mb-5">
                    Everything you need. Nothing you don't.
                </h1>
                <p className="text-md leading-loose text-primary text-center md:text-justify max-w-2lg">
                    Vouch is built with product minimalism and engineering rigor—delivering complete authentication without feature bloat or unnecessary complexity.
                </p>
            </div>

            <div className="features flex flex-col gap-8 md:flex-row items-center justify-center mt-10">
                {features.map((feature,index) => (
                    <div key={index} className="flex flex-col items-center justify-center md:items-start">
                        <div className="p-5 rounded-full items-center inline-block bg-[#102554] text-slate-200 dark:text-[#102554] dark:bg-slate-300 transition-colors hover:bg-slate-300 hover:text-[#102554] dark:hover:bg-slate-400">
                            {feature.icon}
                        </div>
                        <h1 className="text-lg font-bold pt-5 pb-3">{feature.title}</h1>
                        <p className="text-center md:text-justify">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Features;