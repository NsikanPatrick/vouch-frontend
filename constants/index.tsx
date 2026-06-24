import {Shield, Mail, Users, FileText, UserPlus, MailCheck, Rocket, Code} from "lucide-react"
import {
    SiNestjs,
    SiNextdotjs,
    SiTypescript,
    SiPostgresql,
    SiTypeorm,
    SiCloudinary,
    SiTailwindcss,
    SiVercel,
} from "react-icons/si"

export const navLinks = [
    {
        "header": {
            "logo": {
                "src": "/logo.svg",
                "alt": "Vouch Logo",
                "link": "/"
            },
            "primaryNav": [
                { "label": "Home", "href": "/#home" },
                { "label": "Features", "href": "/#features" },
                { "label": "How It Works", "href": "/#how-it-works" },
                { "label": "Tech Stack", "href": "/#tech-stack" },
                { "label": "Docs", "href": "/docs" },
                // { "label": "Blog", "href": "/blog" }
            ],
            "authActions": {
                "login": { "label": "Login", "href": "/login" },
                "signup": { "label": "Sign Up", "href": "/signup" }
            },
            "userMenu": {
                "dashboard": { "label": "Dashboard", "href": "/dashboard" },
                "profile": { "label": "Profile", "href": "/profile" },
                "admin": { "label": "Admin Panel", "href": "/admin", "role": "admin" },
                "logout": { "label": "Logout", "action": "logout" }
            }
        },
        "footer": {
            "product": [
                { "label": "Features", "href": "/#features" },
                { "label": "Pricing", "href": "/#pricing" },
                { "label": "Changelog", "href": "/changelog" },
                { "label": "Roadmap", "href": "/roadmap" }
            ],
            "support": [
                { "label": "Documentation", "href": "/docs" },
                { "label": "API Reference", "href": "/api-docs" },
                { "label": "Status", "href": "/status" }
            ],
            "company": [
                { "label": "About", "href": "/about" },
                { "label": "Blog", "href": "/blog" },
                { "label": "Careers", "href": "/careers" }
            ],
            "legal": [
                { "label": "Privacy Policy", "href": "/privacy" },
                { "label": "Terms of Service", "href": "/terms" },
                { "label": "Cookie Policy", "href": "/cookies" }
            ],
            "social": [
                { "label": "GitHub", "href": "https://github.com/NsikanPatrick/vouch" },
                { "label": "Twitter/X", "href": "https://twitter.com" },
                { "label": "LinkedIn", "href": "https://linkedin.com" }
            ]
        }
    }
]

export const copyVariants = [
    {
        id: "variant-1",
        title: "Speed to Market",
        caption: "Ship authentication today. Not next week.",
        paragraph: "Vouch eliminates the complexity of building auth from scratch. With pre-built flows for registration, login, email verification, password reset, OTP, and Google OAuth, plus a clean, modular codebase, you can integrate a complete authentication system in hours instead of weeks. Open-source and production-ready."
    },
    {
        id: "variant-2",
        title: "Developer Experience",
        caption: "Decoupled architecture. Seamless integration.",
        paragraph: "Stop fighting token rotation pipelines and brittle session validation structures. Vouch isolates your security layer behind an interceptor-armed class bridge, offering strongly typed end-to-end user state hydration for TypeScript frontends right out of the box."
    },
    {
        id: "variant-3",
        title: "Operational Excellence",
        caption: "Production-ready security blueprints.",
        paragraph: "Designed with product minimalism and engineering rigor. Vouch protects your user registries with single-use token rotation models and comprehensive transactional mail telemetry, giving you full observability into system health without feature bloat."
    }
]

export const features = [
    {
        icon: <Shield />,
        title: "Secure Authentication",
        description: "Enterprise-grade security with JWT, refresh tokens, and account lockout protection."
    },
    {
        icon: <Mail />,
        title: "Passwordless Login",
        description: "OTP-based magic link authentication for a seamless user experience."
    },
    {
        icon: <Users />,
        title: "Social Login",
        description: "One-click sign-in with Google OAuth 2.0 integration."
    },
    {
        icon: <FileText />,
        title: "Profile Management",
        description: "Full user profile management with Cloudinary image uploads."
    }
]

export const steps = [
    {
        icon: <UserPlus className="h-8 w-8 text-blue-600" />,
        title: "Sign Up",
        description: "Create your account with email and password, or use Google OAuth for one-click registration."
    },
    {
        icon: <MailCheck className="h-8 w-8 text-blue-600" />,
        title: "Verify Your Email",
        description: "Receive a verification link or OTP code to confirm your identity and activate your account."
    },
    {
        icon: <Rocket className="h-8 w-8 text-blue-600" />,
        title: "Start Building",
        description: "Integrate Vouch's auth flows into your app and focus on what matters—your product."
    }
]

export const stats = [
    { icon: <Users className="h-5 w-5" />, label: "Open Source", value: "MIT" },
    { icon: <Code className="h-5 w-5" />, label: "Built With", value: "NestJS" },
    { icon: <Shield className="h-5 w-5" />, label: "Security", value: "Enterprise" },
]

export const technologies = [
    { icon: <SiNestjs className="h-8 w-8 text-red-600" />, name: "NestJS" },
    { icon: <SiNextdotjs className="h-8 w-8 text-black dark:text-white" />, name: "Next.js" },
    { icon: <SiTypescript className="h-8 w-8 text-blue-600" />, name: "TypeScript" },
    { icon: <SiPostgresql className="h-8 w-8 text-blue-800" />, name: "PostgreSQL" },
    { icon: <SiTypeorm className="h-8 w-8 text-orange-600" />, name: "TypeORM" },
    { icon: <SiCloudinary className="h-8 w-8 text-blue-500" />, name: "Cloudinary" },
    { icon: <SiTailwindcss className="h-8 w-8 text-teal-500" />, name: "Tailwind CSS" },
    { icon: <SiVercel className="h-8 w-8 text-black dark:text-white" />, name: "Vercel" },
]