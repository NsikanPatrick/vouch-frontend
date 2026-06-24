"use client"

import Image from 'next/image';
import { useState, useEffect } from "react";
import { useTheme } from "../../hooks/use-theme";
import { ListMinus, Sun, Moon } from 'lucide-react';
import { navLinks } from "../../constants";

const Navbar = () => {
    const [active, setActive] = useState("Home");
    const [collapsed, setCollapsed] = useState(false);

    // 1. Initialize effectiveTheme to a safe default fallback value for the server build pass
    const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light");

    const { header } = navLinks[0];
    const { logo } = header;
    const { theme, setTheme } = useTheme();

    const handleThemeToggle = () => {
        // Always toggle between light and dark, ignoring system
        setTheme(theme === "light" ? "dark" : "light");
    };

    // 2. Track theme changes and evaluate browser environment states safely on the client side
    useEffect(() => {
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            setEffectiveTheme(mediaQuery.matches ? "dark" : "light");

            // Optional structural listener to update the icon if the system scheme updates live
            const listener = (e: MediaQueryListEvent) => {
                setEffectiveTheme(e.matches ? "dark" : "light");
            };

            mediaQuery.addEventListener("change", listener);
            return () => mediaQuery.removeEventListener("change", listener);
        } else {
            setEffectiveTheme(theme as "light" | "dark");
        }
    }, [theme]);

    /* Lock background scrolling when mobile layout menu context is active - Deactivate vertical scrollbar */
    useEffect(() => {
        if (collapsed) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        // Clean up style mutation when the component unmounts to prevent state leaks
        return () => {
            document.body.style.overflow = "";
        };
    }, [collapsed]);

    return (
        <nav className="w-full flex py-6 justify-between items-center navbar relative z-50">
            <Image src={logo.src} alt={logo.alt} loading='eager' width={52} height={92} className="h-8 w-8" />

            {/* Desktop Navigation Link Cluster */}
            <ul className="list-none sm:flex hidden justify-end items-center flex-1">
                {header.primaryNav.map((navItem, index) => (
                    <li
                        key={navItem.label}
                        className={`font-poppins font-normal cursor-pointer text-[16px] transition-colors duration-200 ${active === navItem.label ? "text-secondary hover:text-primary font-medium" : "text-primary hover:text-secondary"
                            } ${index === header.primaryNav.length - 1 ? "mr-0" : "mr-10"}`}
                        onClick={() => setActive(navItem.label)}
                    >
                        <a href={`${navItem.href}`}>{navItem.label}</a>
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-x-3 flex-1 justify-end">

                <button
                    className="cursor-pointer size-10"
                    onClick={handleThemeToggle}
                >
                    {effectiveTheme === "light" ?
                        <Sun size={20} className="dark:hidden" />
                        : (
                            <Moon size={20} className="hidden dark:block" />
                        )}
                </button>
                {/* <button className="btn-ghost size-10">
                        <Bell size={20} />
                      </button>
                      <button className="size-10 overflow-hidden rounded-full">
                        <img src={ProfilePhoto} alt="Profile Image" className="size-full object-cover" />
                     </button> */}
            </div>

            {/* Mobile Navigation Viewport Trigger */}
            <div className="sm:hidden flex flex-1 justify-end items-center">
                <button onClick={() => setCollapsed(!collapsed)} className="cursor-pointer ml-auto p-2 relative z-50">
                    <ListMinus className={`${collapsed ? "rotate-0 text-primary dark:text-white" : "rotate-180 text-primary-hover dark:text-white"} transition-transform duration-400 w-6 h-6`} />
                </button>

                {/* Slide-in from left - absolute positioning, use of margins to adjust */}
                <div
                    className={`${collapsed ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                        } absolute top-full left-0 right-0 mt-[-7px] ml-[-15px] w-full min-h-[80vh] bg-popover text-popover-foreground backdrop-blur-md border border-border/40 shadow-xl rounded-br-2xl p-8 z-40 flex flex-col justify-start items-start transition-all duration-400 ease-in-out`}
                >
                    <ul className="list-none flex flex-col gap-6 w-full">
                        {header.primaryNav.map((navItem) => (
                            <li
                                key={navItem.label}
                                className={`font-poppins font-medium text-[18px] w-full border-b border-border/10 pb-3 transition-colors ${active === navItem.label
                                    ? "text-secondary hover:text-primary font-bold"
                                        : "text-primary hover:text-secondary"
                                    }`}
                                onClick={() => {
                                    setActive(navItem.label);
                                    setCollapsed(false);
                                }}
                            >
                                <a href={`${navItem.href}`} className="block w-full active:translate-x-1 transition-transform">
                                    {navItem.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
