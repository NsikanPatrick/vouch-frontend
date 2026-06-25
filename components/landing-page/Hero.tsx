'use client'
import Image from "next/image";
import Link from "next/link";
import { signup } from "../../assets/img";

const Hero = () => {
    return (
        // bg-gradient-to-br from-slate-50 to-slate-100
        <section
            id="home"
            className="relative flex flex-col md:flex-row h-[550px] md:h-screen w-full overflow-hidden bg-popover"
        >
            {/* Left Section: Text */}
            <div className="flex-1 flex flex-col justify-center items-center md:items-start md:mt-[-100px] px-8 md:px-12 lg:px-16 space-y-4 z-10">
                <h1 className=" text-3xl md:text-5xl lg:text-5xl font-bold text-primary leading-tight">
                    Welcome to <span className="text-secondary">Vouch</span>
                </h1>
                {/* Secure authentication made simple. Sign up, log in, and manage your account with ease.<br />  */}
                <p className="text-md leading-loose text-primary text-center md:text-justify max-w-2lg">
                    
                    Vouch provides enterprise-grade authentication without the enterprise complexity. JWT tokens with refresh rotation, account lockout protection, role-based access control, and transactional email tracking—all built with NestJS and TypeScript. Stop reinventing the authentication wheel and start shipping features that matter.
                </p>
                <div className="flex gap-4 mt-6">
                    <Link href="/signup" className="px-6 py-3 bg-btn-primary text-white rounded-lg hover:bg-btn-primary-hover dark:hover:border border-slate-300 hover:cursor-pointer transition-colors">
                        Get Started
                    </Link>
                    <Link href="#" className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900 transition-colors">
                        Learn More
                    </Link>
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