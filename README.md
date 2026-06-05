# MyJob — Frontend

A modern job portal frontend built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI. Connects candidates with employers through job listings, applications, and membership-gated features.

## Tech Stack

- **Framework**: Next.js 14 (App Router), TypeScript, Tailwind CSS v4
- **UI**: Shadcn UI, Lucide Icons
- **Auth**: Supabase Auth
- **Forms**: React Hook Form + Zod
- **Payments**: Stripe (membership)

## Prerequisites

- Node.js 18+
- npm or pnpm
- A running instance of the [MyJob Backend](../softdev_be)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd CSIT314_Project_FE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in the values in `.env` — see `.env.example` for descriptions.

## Running

**Development**
```bash
npm run dev
```
App runs at [http://localhost:3000](http://localhost:3000)

**Production build**
```bash
npm run build
npm start
```


