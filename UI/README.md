# 🦅 Ferroscope UI

Ferroscope UI is a high-performance, enterprise-grade monitoring dashboard built for the Ferroscope system. It provides real-time insights into system health, node status, and resource utilization with a stunning, dark-first premium aesthetic.


base url will be like NEXT_PUBLIC_API_URL=""

## ✨ Key Features

- **Real-time Monitoring**: Live tracking of CPU, RAM, and Disk usage using interactive charts.
- **Node Management**: Detailed views for individual nodes within the cluster.
- **Security**: Secure authentication flow with protected dashboard access.
- **Modern UI**: Built with a "wow" factor using dark mode, smooth transitions, and glassmorphism.
- **Responsive Design**: Fully optimized for various screen sizes.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [AutoAnimate](https://auto-animate.formkit.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: Radix UI primitives for accessibility.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ferroscope/UI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file with the following:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### Development

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

Build and start the application:
```bash
npm run build
npm run start
```

## 📁 Project Structure

- `src/app`: Application routes and layout (Next.js App Router).
- `src/components`: UI components organized by feature (dashboard, login, nodes).
- `src/lib`: Utility functions and shared logic.
- `src/types`: TypeScript definitions for API responses and component props.
- `public`: Static assets like icons and images.

## 🔐 Authentication

Ferroscope UI includes a built-in authentication system. Ensure the backend API is running to handle login requests and session management.

---

Built with ❤️ by the Ferroscope Team.
