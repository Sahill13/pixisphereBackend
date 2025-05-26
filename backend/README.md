# Pixisphere Backend API

A role-based, modular backend system featuring secure authentication, multi-role user management, lead creation & distribution, vendor verification, portfolio management, and admin moderation APIs.

---

## Features

- JWT-based authentication with three user roles (client, partner, admin)
- OTP verification for user accounts
- Partner onboarding and admin verification workflow
- Client inquiry system with smart lead distribution
- Portfolio management for partners
- Comprehensive admin dashboard and moderation tools
- API rate limiting and logging middleware
- Swagger API documentation

---

## Technology Stack

- Node.js & Express.js
- MongoDB with Mongoose ORM
- JSON Web Tokens (JWT) for authentication
- Swagger for API documentation

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB instance (local or Atlas)
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/pixisphere-backend.git
cd pixisphere-backend
npm install
Set up environment variables
Create a .env file in the root directory with the following variables:

env
Copy
Edit
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
Start the server
Development mode with nodemon:

bash
Copy
Edit
npm run dev
Production mode:

bash
Copy
Edit
npm start
API Documentation
API documentation is available at /api-docs when the server is running.

Project Structure
bash
Copy
Edit
/backend
|-- /controllers      # Route controllers
|-- /routes           # API routes
|-- /models           # Database models
|-- /middlewares      # Express middlewares
|-- /services         # Business logic services
|-- /utils            # Utility functions
|-- /config           # Configuration files
|-- app.js            # Express app setup
|-- server.js         # Server entry point
API Testing with Postman
This repository includes a Postman collection for testing the API endpoints.

Import Instructions:

Download Postman

In Postman, click the "Import" button

Select the Pixisphere-API.postman_collection.json file from the /postman folder

Create an environment with a baseUrl variable pointing to your API (e.g., http://localhost:5000)

Run the API tests

Key API Endpoints
Authentication
POST /api/auth/signup - Register a new user

POST /api/auth/login - Login and get JWT token

POST /api/auth/verify-otp - Verify OTP code

GET /api/auth/me - Get current user profile

Partner
POST /api/partner/onboard - Submit partner information for verification

GET /api/partner/profile - Get partner profile

GET /api/partner/leads - Get assigned leads

Portfolio
POST /api/partner/portfolio - Add portfolio item

GET /api/partner/portfolio - Get all portfolio items

PUT /api/partner/portfolio/:id - Update portfolio item

Inquiry
POST /api/inquiry - Create a new inquiry

GET /api/inquiry - Get all client inquiries

Admin
GET /api/admin/stats - Get dashboard statistics

GET /api/admin/verifications - Get pending partner verifications

PUT /api/admin/verify/:id - Verify or reject partner

Role-Based Access
The system supports three user roles with different permissions:

Client: Can create inquiries, view responses from partners

Partner: Can create a profile, manage portfolio, respond to inquiries

Admin: Can verify partners, manage system settings, moderate content

Deployment
This API is configured for deployment on Vercel. It can also be deployed to any Node.js hosting platform like Heroku, AWS, or DigitalOcean.

Security Considerations
All routes except authentication endpoints are protected with JWT

Role-based middleware ensures proper access control

Passwords are hashed using bcrypt

Rate limiting prevents abuse

License
MIT

Acknowledgements
Express.js team

Mongoose ODM

JWT authentication

All open-source libraries used in this project
## 🧪 Postman API Testing

A Postman collection is available in the `/postman` folder for testing all API endpoints.

### Import Instructions:
1. Open Postman.
2. Click **Import**.
3. Select `Pixisphere-API.postman_collection.json` from the `/postman` directory.
4. Create an environment with a `baseUrl` variable set to your API URL (e.g., `http://localhost:5000`).
