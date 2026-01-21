# Low Seven Monorepo

This is a Turborepo monorepo containing a [Next.js](https://nextjs.org) application.

## Structure

```
low-seven/
├── apps/
│   ├── api/          # Hono API with Drizzle ORM and Better Auth
│   └── web/          # Next.js application
├── packages/         # Shared packages
├── turbo.json        # Turborepo configuration
└── package.json      # Root package.json with workspaces
```

## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `apps/web/app/page.tsx`. The page auto-updates as you edit the file.

## Available Scripts

- `bun dev` - Start development server for all apps
- `bun build` - Build all apps and packages
- `bun start` - Start production server for all apps
- `bun lint` - Lint all apps and packages
- `bun clean` - Clean build artifacts

### Database Scripts (API)

- `bun db:up` - Start PostgreSQL database with Docker
- `bun db:stop` - Stop the database
- `bun db:generate:migration` - Generate database migrations
- `bun db:migrate` - Run database migrations
- `bun db:studio` - Open Drizzle Studio for database management

## What's Inside?

This Turborepo includes the following:

### Apps and Packages

- `web`: A Next.js application with shadcn/ui components
- `api`: A Hono API server with Drizzle ORM, PostgreSQL, and Better Auth

### Tools

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Turborepo](https://turbo.build/repo) for monorepo management

## Adding New Packages

To add a new shared package:

1. Create a new directory in `packages/`
2. Add a `package.json` with a unique name
3. The package will be automatically picked up by Turborepo

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Turborepo Documentation](https://turbo.build/repo/docs) - learn about Turborepo
- [shadcn/ui](https://ui.shadcn.com/) - beautifully designed components

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
