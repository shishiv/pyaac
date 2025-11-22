# PyAAC Frontend

React + TypeScript frontend for PyAAC - a modern alternative to MyAAC for Open Tibia Servers.

## Features

- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety
- **Vite** - Lightning fast dev server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

## Requirements

- Node.js 18+ or npm/pnpm

## Installation

### Using npm

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Using pnpm (recommended)

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Development

The development server will start at `http://localhost:5173` by default.

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client and endpoints
│   ├── components/    # Reusable components
│   ├── pages/         # Page components (routes)
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React Context providers
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── public/
├── index.html
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Building for Production

```bash
# Build the app
npm run build

# The build output will be in the `dist` directory
# Serve it with any static file server
```

## License

GPL-3.0-or-later - Same as MyAAC PHP version
