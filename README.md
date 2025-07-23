This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🗂️ Project Plan

### 🔧 Setup
- ✅ Initialize project (Next.js + Tailwind CSS + TS)
- ✅ Firebase project setup and config file
- ✅ Connect to Firebase Realtime DB

### 🔁 Core Features
- ✅ Live queue creation (business/owner flow, not on landing)
- ✅ Join queue by 4-character code (landing page)
- 🔲 (Optional) Prompt for name after code entry (if desired)
- 🔲 Show error if code is invalid
- 🔲 No login/auth required for users

### 🧩 Components
- ✅ <LandingJoin /> (centered code input, join button, branding)
- 🔲 <Footer /> (Add your business, About, Privacy, Terms)
- 🔲 <QueueView /> (shows queue after joining, real-time updates)
- 🔲 (Optional) <NamePrompt /> (if you want to collect user names)

### 🎨 UI Polish
- 🔲 Match Google Lineup’s whitespace, centering, and color scheme
- 🔲 Responsive/mobile-first layout
- 🔲 Accessibility and keyboard navigation
- 🔲 Basic metadata and favicon

### 🚀 Deployment
- 🔲 Firebase Hosting or Vercel
- 🔲 Test in production

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
