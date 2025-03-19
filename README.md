# HealthCard Platform

A comprehensive healthcare benefits platform that enables users to explore, apply, and manage health cards with integrated Razorpay payment solutions.

![HealthCard Platform](https://github.com/your-username/healthcard-platform/raw/main/screenshots/home.png)

## Features

- 🏥 **Health Card Management**
  - Browse available health cards
  - Compare benefits across different tiers
  - Apply for health cards with secure payments
  - Track application status

- 🤝 **Healthcare Partner Network**
  - View partner hospitals and clinics
  - Access detailed information about available services
  - Find healthcare providers by location

- 💳 **Secure Payments**
  - Integrated Razorpay payment gateway
  - Secure transaction processing
  - Real-time payment status updates

- 👤 **User Management**
  - User registration and authentication
  - Profile management
  - View applied cards and status

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Payment Integration**: Razorpay
- **Authentication**: Passport.js
- **Database**: In-memory storage (can be extended to PostgreSQL)

## Getting Started

### Prerequisites

- Node.js v20 or later
- NPM v10 or later
- Razorpay account with API keys

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/healthcard-platform.git
cd healthcard-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
SESSION_SECRET=your_session_secret
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
├── server/
│   ├── auth.ts
│   ├── routes.ts
│   └── storage.ts
└── shared/
    └── schema.ts
```

## Usage

1. Register a new account or login with existing credentials
2. Browse available health cards
3. Compare benefits between different cards
4. Click "Apply Now" on your chosen card
5. Complete the payment process through Razorpay
6. Track your application status

## API Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/health-cards` - Get all health cards
- `GET /api/partners` - Get healthcare partners
- `POST /api/create-payment` - Initialize Razorpay payment
- `POST /api/verify-payment` - Verify payment and process application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Razorpay](https://razorpay.com/) for payment integration
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [TanStack Query](https://tanstack.com/query/latest) for powerful data synchronization
