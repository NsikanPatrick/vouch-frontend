export const navLinks = [
    {
        "header": {
            "logo": {
                "src": "/logo.svg",
                "alt": "Vouch Logo",
                "link": "/"
            },
            "primaryNav": [
                { "label": "Home", "href": "/" },
                { "label": "Features", "href": "/#features" },
                { "label": "Pricing", "href": "/#pricing" },
                { "label": "Docs", "href": "/docs" },
                { "label": "Blog", "href": "/blog" }
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