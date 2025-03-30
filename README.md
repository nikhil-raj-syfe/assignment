# Health Survey Application

A full-stack web application for collecting health and financial survey data. Built with Next.js, Express, and MongoDB.

## Features

- Multi-step survey form with progress tracking
- Demographic, health, and financial information collection
- Responsive design with modern UI
- Backend API with MongoDB storage
- Survey response viewing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Project Structure

```
/
├── backend/           # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.ts
│   └── package.json
│
└── survey-app/        # Next.js frontend
    ├── src/
    │   ├── app/
    │   └── components/
    └── package.json
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd health-survey-app
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/survey-app
```

4. Install frontend dependencies:
```bash
cd ../survey-app
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd survey-app
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `POST /api/survey/submit` - Submit a new survey response
- `GET /api/survey/responses` - Get all survey responses
- `GET /api/survey/responses/:id` - Get a specific survey response

## Technologies Used

- Frontend:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React Hooks

- Backend:
  - Express.js
  - MongoDB with Mongoose
  - TypeScript
  - Node.js

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 

cd backend && rm -rf dist/ && rm -rf node_modules/ && npm install