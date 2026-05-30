# HRD EventHub — UI

> Next.js frontend for the HRD EventHub platform, covering authentication, event management, community updates, feedback, and user/group experiences.

## Tech Stack

- **Next.js** 16+ (App Router)
- **React** 19+
- **TypeScript**
- **Tailwind CSS** — styling
- **Fetch** — API communication
- **Zustand** — state management for auth flows
- **NextAuth.js** — authentication
- **Radix UI / shadcn** — UI primitives
- **Framer Motion** — animations
- **Zod** — runtime validation

## Prerequisites

- [Node.js 21+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/14th-Gen-Basic-Course-Final-Project/HRD-EventHub-UI.git
cd HRD-EventHub-UI
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

Create a local env file and fill in your values:

```bash
touch .env.local
```

Example:

```bash
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will start at `http://localhost:3000`.

### 5. Verify

Open [http://localhost:3000](http://localhost:3000) in your browser. Make sure the backend API is running for full functionality.

## Available Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Create optimized production build        |
| `npm run start` | Start production server                  |
| `npm run lint`  | Run ESLint                               |

## Connecting to the API

The UI expects the API to be running at the URL specified in `NEXT_PUBLIC_API_BASE_URL`. Make sure to:

1. Start the API server first (see your backend README).
2. Ensure CORS allows `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

For deployment, set all environment variables on your hosting platform (Vercel, Docker, etc.) and ensure `NEXT_PUBLIC_API_BASE_URL` points to your production API.
