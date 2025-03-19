# HealthCard Platform Deployment Guide

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── auth.ts
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
└── shared/
    └── schema.ts
```

## Prerequisites
1. Node.js v20 or later
2. NPM v10 or later
3. A Razorpay account with API keys

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Session Configuration
SESSION_SECRET=your_session_secret
```

## Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd healthcare-benefits-platform
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The application will be available at `http://localhost:5000`

## Key Features
- User authentication (login/register)
- Health card listings and comparisons
- Healthcare partner network
- Razorpay payment integration
- Responsive design

## Database
The application currently uses in-memory storage. For production, you should implement a proper database solution like PostgreSQL.

## Deployment Platforms
You can deploy this application on:
1. Heroku
2. DigitalOcean
3. AWS
4. Any Node.js hosting platform

Make sure to:
1. Set all required environment variables
2. Configure the production database if needed
3. Set up proper SSL/TLS for secure connections
4. Configure proper session storage for production

## Security Considerations
1. Always use HTTPS in production
2. Keep Razorpay keys secure
3. Set proper CSP headers
4. Implement rate limiting for API endpoints
5. Regular security updates for dependencies
