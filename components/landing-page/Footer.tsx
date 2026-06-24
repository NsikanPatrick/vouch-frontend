"use client"

import Link from "next/link"
import { navLinks } from "@/constants"
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";

const Footer = () => {
    const footerData = navLinks[0].footer

    return (
        <footer className="bg-slate-900 text-white">
            <div className="container max-w-6xl mx-auto px-4 py-16">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand / About */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-white">
                            Vouch
                        </Link>
                        <p className="text-sm text-slate-400 mt-3 max-w-xs">
                            Production-ready authentication engine for modern web apps.
                        </p>
                        <div className="flex gap-4 mt-4">
                            {footerData.social.map((social, index) => {
                                const Icon = social.label === "GitHub"
                                    ? FaGithub
                                    : social.label === "Twitter/X"
                                        ? FaXTwitter
                                        : FaLinkedin
                                return (
                                    <Link
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-400 hover:text-white transition-colors"
                                        aria-label={social.label}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                            Product
                        </h3>
                        <ul className="space-y-2">
                            {footerData.product.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                            Support
                        </h3>
                        <ul className="space-y-2">
                            {footerData.support.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                            Company
                        </h3>
                        <ul className="space-y-2">
                            {footerData.company.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Legal Links */}
                    <div className="flex flex-wrap gap-4 text-xs">
                        {footerData.legal.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Copyright */}
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} Vouch. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer