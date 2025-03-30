# Health Survey Application

A comprehensive health survey application built with React, TypeScript, and Node.js. This application allows users to submit health surveys and administrators to view and manage survey responses.

## Features

- User Authentication (Login/Signup)
- Role-based access (Admin/User)
- Multi-step survey form with validation
- Survey response management
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
# Install frontend dependencies
cd survey-app
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
   - Create `.env.local` in the frontend directory (survey-app)
   - Create `.env` in the backend directory

4. Start the development servers:

```bash
# Start frontend (from survey-app directory)
npm start

# Start backend (from backend directory)
npm run dev
```

The frontend will run on [http://localhost:3000](http://localhost:3000) and the backend on [http://localhost:5000](http://localhost:5000).

## Project Structure

```
survey-app/          # Frontend React application
├── src/
│   ├── components/  # React components
│   ├── contexts/    # React contexts
│   ├── pages/       # Page components
│   └── utils/       # Utility functions
└── public/          # Static files

backend/             # Backend Node.js application
├── src/
│   ├── controllers/ # Route controllers
│   ├── db/         # Database configuration
│   ├── middleware/ # Express middleware
│   └── routes/     # API routes
```

## Available Scripts

Frontend (survey-app):
```bash
npm start    # Start development server
npm build    # Build for production
npm test     # Run tests
```

Backend:
```bash
npm run dev   # Start development server
npm run build # Build for production
npm start     # Start production server
```

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - React Router
  - Tailwind CSS
  - JS-Cookie

- Backend:
  - Node.js
  - Express
  - PostgreSQL
  - JSON Web Tokens

## License

ISC
