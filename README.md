# VOUCH

Vouch Client is the decoupled, production-ready frontend interface for the Vouch Engine — an infrastructure-grade authentication, identity, and asset management utility.

Built using Next.js 16, TypeScript, and Tailwind CSS, this system acts as a highly scalable client-side interface optimized for serverless orchestration. It features strict token lifecycle synchronization, global context insulation, and a high-throughput administrative command center with built-in analytics telemetry.

https://vouch-utility.vercel.app

---

## 🚀 Key Features

### 🔐 Authentication & User Experience
* **Multi-Channel Login:** Password-based login, Google OAuth2, and Passwordless Magic OTP authentication.
* **Secure Session Management:** JWT token storage with automatic refresh rotation.
* **Email Verification Flow:** Account verification with beautiful email templates.
* **Password Recovery:** Complete forgot/reset password flow with secure token validation.
* **Responsive Design:** Mobile-first, accessible UI built with shadcn/ui components.

### 👤 User Dashboard
* **Profile Management:** Update personal information and profile picture with Cloudinary integration.
* **Password Change:** Secure password update with validation and session revocation.
* **Role-Based Access:** Dynamic UI based on user roles (User vs Admin).
* **Real-time Status:** Account verification and status indicators.

### 🛡️ Admin Panel
* **User Management:** View, search, and manage all registered users.
* **Role Management:** Promote/demote users between Admin and User roles.
* **Status Management:** Activate, suspend, or deactivate user accounts.
* **User Details:** Comprehensive user profiles with member since and last login tracking.
* **Account Deletion:** Secure user account removal with cascade cleanup.

### 📧 Email Analytics Dashboard
* **Email Statistics:** Real-time metrics including delivery, open, and click rates.
* **Email Logs:** Complete transaction history with pagination and detailed views.
* **Date Range Filtering:** Analyze email performance over custom time periods.
* **Visual Analytics:** Summary cards and breakdown tables for actionable insights.

### 🎨 Modern UI/UX
* **shadcn/ui Components:** Beautiful, accessible, and customizable component library.
* **Responsive Layout:** Optimized for desktop, tablet, and mobile devices.
* **Loading States:** Smooth transitions with skeleton loaders and spinners.
* **Form Validation:** Real-time validation with user-friendly error messages.
---

## 🛠️ Tech Stack & Architecture

* **Language:** ![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=flat&logo=typescript&logoColor=white)
* **Framework:** ![NextJS](https://img.shields.io/badge/Next.js-16.x-000000?style=flat&logo=next.js&logoColor=white ) 
* **Styling:** ![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white) *(PostgreSQL/Neon Ready)*
* **UI Components:** ![Shadcn](https://img.shields.io/badge/shadcn/ui-Latest-000000?style=flat&logo=shadcnui&logoColor=white) 
* **Icons:** ![Lucid React](https://img.shields.io/badge/Lucide-React-F56565?style=flat&logo=lucide&logoColor=white)
* **Authentication:** Custom Auth Context with JWT management.
* **API Client:** Custom fetch wrapper with error handling.
* **Testing:** ![Jest](https://img.shields.io/badge/Jest-Testing-C21325?style=flat&logo=jest&logoColor=white) *(Jest, Supertest, Test Coverage)*

---

## 📂 Project Directory Structure

The frontend repository is structured around Next.js Route Groups and decoupled architectural boundaries to segregate access scopes cleanly:


### 📂 Directory Descriptions

| Directory | Purpose |
|-----------|---------|
| `app/(auth)/` | Public authentication pages (login, signup, password reset) |
| `app/(dashboard)/` | Protected pages requiring authentication |
| `app/auth/` | OAuth and social authentication handlers |
| `app/otp/` | Passwordless OTP authentication flow |
| `components/ui/` | Reusable UI primitives from shadcn/ui |
| `components/page/` | Page-specific components like `ProtectedRoute` |
| `components/admin/` | Admin panel components for user management and email analytics |
| `contexts/` | React context providers (auth, theme, etc.) |
| `lib/` | Utility functions, API client, and helpers |
| `public/` | Static assets served directly by Next.js |
| `styles/` | Global CSS and Tailwind configuration |

---

## 📑 Application Route Architecture

### Public Routes (No Authentication Required)
| Route | Access Scope & Description |
| :--- | :--- |
| `/login` | Traditional credential authentication or unified Google OAuth2 handshake |
| `/signup` | Multi-channel profile creation and initialization |
| `/forgot-password` | Requests a single-use account recovery payload vector |
| `/reset-password` | Commits password mutation strings using a verified token |
| `/verify-email` | Evaluates email verification tokens to update account status variables |
| `/otp/request` | Triggers a secure, short-lived 6-digit numeric Magic OTP dispatch |
| `/otp/verify` | Evaluates OTP payload values to instantly provision active sessions |
| `/auth/oauth-redirect` | Decoupled Google OAuth callback intercept and token rotation handler |

### Protected Routes (User Authentication Required)
| Route | Access Scope & Description |
| :--- | :--- |
| `/dashboard` | Core workspace layout mapping standard profile overview attributes |
| `/profile` | Exposes identity fields and handle multipart media storage streaming |
| `/change-password` | Mutates security credentials safely within active authenticated sessions |

### Administrative Routes (Admin Role Required)
| Route | Access Scope & Description |
| :--- | :--- |
| `/admin` | Restrictive control panel orchestrating tenant index matrices |
| `/admin/email-logs` | Granular transactional data ledger showing outbound email state history |
| `/admin/email-stats` | High-throughput analytics engine compiling system open and delivery rates |

---



---

## 🗺️ Project Roadmap

### Phase 1: Core Features (Completed)
* [ ] User authentication (password, Google, OTP)
* [ ] Profile management
* [ ] Password recovery
* [ ] Admin panel
* [ ] Email analytics

### Phase 2: Session & Identity Hardening (In Progress)
* [ ] Two-Factor Authentication (2FA via TOTP / Google Authenticator)
* [ ] Secondary Social Authentication Providers (GitHub, Apple)
* [ ] Global Session Tracking Dashboard & Device Fingerprinting
* [ ] IP Geolocation Activity Auditing Logs
* [ ] Activity logging viewer
* [ ] Advanced search and filters

### Phase 3: Webhook Web Grid & Custom Integrations
* [ ] User impersonation for support.
* [ ] Bulk user actions.
* [ ] Export functionality.
* [ ] Advanced analytics visualizations.

---

## ⚙️ Local Installation & Setup

1. ### Clone the Repository:
   ```bash
   git clone https://github.com/NsikanPatrick/vouch-frontend.git
   cd vouch-frontend

2. ### Install dependencies:
    ```bash
    npm install

3. ### Configure Environment Variables:
    Create a .env file in the root directory and configure your credentials:

    #### Backend API URL 
    NEXT_PUBLIC_API_URL=http://localhost:1000/api/v1

4. ### Run Development Server:
    npm run dev
    Your application will be available at http://localhost:3000

5. ### Build for Production:
    npm run build
    npm start

## 🚀 Deployment
### Deploy to Vercel

    The easiest way to deploy the frontend is using Vercel:

    1. Push your code to GitHub

    2. Import the project in Vercel

    3. Add environment variables:

        NEXT_PUBLIC_API_URL: Your backend API URL

    4. Deploy: Vercel will automatically build and deploy

## Manual Deployment

### Build the application
npm run build

### Export static files (optional)
npm run export

### Deploy the `out` folder to your hosting provider

---

## 🔗 API Integration Bridge

The frontend application communicates with the decoupled Vouch backend using an abstracted, strongly typed class-based API client instance.

### typescript
import { apiClient } from '@/lib/api-client';

// Example: Session Generation / Authentication Login
const response = await apiClient.login({ email, password });

// Example: Authenticated Context Profile Hydration
const user = await apiClient.getProfile(accessToken);

// Example: Restricted Administrative Operations
const users = await apiClient.getAllUsers(page, limit);
await apiClient.updateUserStatus(userId, 'active');

### ⚙️ Core API Client Characteristics
* **Type-Safe Requests:** Full compile-time TypeScript contract validation mapping incoming and outgoing server payloads.
* **Consistent Error Handling:** Automated parsing and normalization of backend exception messages before they reach the UI layers.
* **Authentication Header Injection:** Automatic extraction and insertion of Bearer tokens into outgoing network frames.
* **Request/Response Telemetry:** Integrated console logging hooks for request-response state auditing during development.

---

## 🔐 Available Methods
// Authentication
apiClient.register(data: RegisterData): Promise<AuthResponse>
apiClient.login(data: LoginData): Promise<AuthResponse>
apiClient.refreshToken(refreshToken: string): Promise<{ accessToken: string }>
apiClient.logout(refreshToken: string): Promise<{ message: string }>

// User Profile
apiClient.getProfile(accessToken: string): Promise<User>
apiClient.updateProfile(userId: string, data: UpdateProfileData): Promise<User>

// Admin Operations
apiClient.getAllUsers(page: number, limit: number): Promise<PaginatedUsers>
apiClient.updateUserStatus(userId: string, status: string): Promise<{ message: string }>
apiClient.updateUserRole(userId: string, role: string): Promise<{ message: string }>
apiClient.deleteUser(userId: string): Promise<{ message: string }>
apiClient.createAdmin(data: RegisterData): Promise<AuthResponse>

// Email Analytics
apiClient.getEmailStats(url: string): Promise<EmailStats>
apiClient.getEmailLogs(page: number, limit: number): Promise<EmailLogs>

---
## 🎨 UI Components

The application leverages **shadcn/ui** to provide consistent, accessible, and unstyled structural primitives that map to our unified design tokens:

| Component | Practical Engineering Scope within Vouch |
| :--- | :--- |
| **Button** | Controls transactional request dispatches, authentication triggers, and form commits. |
| **Card** | Encapsulates administrative modular dashboards, login frames, and statistical indices. |
| **Input** | Handles raw user string entry bound directly to structural validation and sanitation pipelines. |
| **Dialog** | Structural modal overlays managing destructive actions like definitive profile eviction tasks. |
| **Table** | Handles large-dataset paginated rendering matrices inside tenant control sections. |
| **Badge** | Visual indicator tags identifying account properties and status constraints (`Active` \| `Locked`). |
| **Avatar** | Display container utilizing custom `onError` callbacks for graceful asset degradation. |
| **Tabs** | Segregates dashboard viewports cleanly without triggering unnecessary browser routing overhead. |

### ⚙️ Custom Components
* **ProtectedRoute:** Wraps authenticated pages with session validation.
* **EmailLogsTable:** Paginated email transaction history.
* **EmailStatsDashboard:** Analytics with date range filtering.
---

## 🔒 Security Features
* **JWT Token Management:** Secure storage with automatic refresh.
* **Protected Routes:** Server and client-side authentication guards.
* **Input Validation:** Client-side validation before API calls.
* **Password Strength:** Real-time password validation with indicators.
* **CORS Support:** Secure cross-origin requests.
* **Session Management:** Automatic logout on token expiration.
* **XSS Protection:** Next.js built-in security features.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

    ✅Fork the repository

    ✅Create your feature branch (git checkout -b feature/AmazingFeature)

    ✅Commit your changes (git commit -m 'Add some AmazingFeature')

    ✅Ensure all tests pass (npm run test)

    ✅Push to the branch (git push origin feature/AmazingFeature)

    ✅Open a Pull Request

## Development Guidelines

    ✅ Write tests for new features

    ✅ Maintain or improve test coverage

    ✅ Follow existing code style and patterns

    ✅ Use TypeScript for all new code

    ✅ Update documentation as needed

## 📝 **License**
  This project is MIT licensed.

## 🙏 Acknowledgments

A massive thank you to the incredible tools, frameworks, and platforms that power this ecosystem:

| Platform / Tool | Ecosystem Role |  |
| :--- | :--- | :--- |
| **[NextJS](https://nextjs.org)** | The production ready React framework. | ![NextJS](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white) |
| **[Shadcn UI](https://ui.shadcn.com)** | Modern beautiful and accessible UI components. | ![Shadcn](https://img.shields.io/badge/shadcn/ui-000000?style=flat-square&logo=shadcnui&logoColor=white) |
| **[Tailwind CSS](https://tailwindcss.com)** | Utility-first CSS framework. | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| **[Lucid Icons](https://lucid.dev)** | Modern React icon library. | ![Lucid Icons](https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white) |
**[Vercel](https://vercel.com)** | ReactJs friendly deployment platform. | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) |

## 📞 **Support**

    📧 Email: support@vouch.com

    🐛 Issues: GitHub Issues

    📚 Documentation: https://docs.vouch.com (Coming soon)

---

<div align="center">

Built with 🖤 by Nsikan Patrick Adaowo

Managed under strict Product Engineering and Systems Design principles.

Report Bug · Request Feature
</div> 