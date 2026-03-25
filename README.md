# Chennai-Scraps Frontend

React + Vite + Tailwind CSS frontend for the Chennai-Scraps electronics resale platform.

## Features

- Mobile-first design (like Selsmart)
- Category browsing
- Dynamic form handling
- Shopping cart management
- OTP-based phone authentication
- Order booking and tracking

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios for API calls
- React Router for navigation

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint:
Create a `.env.local` file:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

- `src/` - Source code
  - `components/` - Reusable React components
  - `pages/` - Page components
  - `services/` - API services
  - `hooks/` - Custom React hooks
  - `contexts/` - React contexts
  - `styles/` - Global styles
- `public/` - Static assets

## Pages

- `/` - Home page with category listing
- `/category/:slug` - Category detail with form
- `/cart` - Shopping cart
- `/auth` - OTP authentication
- `/checkout` - Order checkout and pickup details
- `/orders` - Order history and tracking

## API Integration

The frontend communicates with the Django REST API at:
- Base URL: `http://localhost:8000/api`

Key endpoints:
- `/auth/send-otp/` - Send OTP
- `/auth/verify-otp/` - Verify OTP and login
- `/catalog/categories/` - List categories
- `/orders/` - Order management

## Development

Run dev server with hot reload:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Deployment

Deploy to Vercel:
```bash
npm i -g vercel
vercel
```
