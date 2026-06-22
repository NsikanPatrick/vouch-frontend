'use client'
import Image from "next/image"
import { signup } from "../../assets/img"

const Hero = () => {
    return (
        // bg-gradient-to-br from-slate-50 to-slate-100
        <section
            id="home"
            className="relative flex flex-col md:flex-row h-screen w-full overflow-hidden bg-popover"
        >
            {/* Left Section: Text */}
            <div className="flex-1 flex flex-col justify-center items-start mt-[-100px] px-8 md:px-12 lg:px-16 space-y-4 z-10">
                <h1 className=" text-3xl md:text-5xl lg:text-5xl font-bold text-primary leading-tight">
                    Welcome to <span className="text-secondary">Vouch</span>
                </h1>
                <p className="text-lg md:text-xl text-primary max-w-lg">
                    Secure authentication made simple. Sign up, log in, and manage your account with ease.
                </p>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-primary hover:cursor-pointer transition-colors">
                        Get Started
                    </button>
                    <button className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900 transition-colors">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Right Section: Image Wrapper */}
            <div className="relative hidden md:block md:h-full md:flex-1 bg-blue-50 dark:bg-blue-950">
                <Image
                    src={signup}
                    alt="signup image"
                    fill
                    className="object-cover md:object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={90}
                    priority
                />
            </div>
        </section>
    )
}

export default Hero;