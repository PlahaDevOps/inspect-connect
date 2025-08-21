# Inspect Connect Server

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5002
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/inspect_connect

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@inspectconnect.com

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Upload Configuration (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Encryption Key (for email encryption)
ENCRYPTION_KEY=your-32-character-encryption-key
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. API Documentation
Access Swagger documentation at: `http://localhost:5002/api-docs`

## Features

- User authentication with JWT
- Phone/Email OTP verification
- File upload with Cloudinary
- SMS notifications with Twilio
- Email notifications with SendGrid
- Role-based access control
- Activity logging
- API documentation with Swagger

## API Endpoints

### Public Routes
- `POST /api/v1/signUp` - User registration
- `POST /api/v1/signIn` - User login
- `POST /api/v1/forgotPassword` - Forgot password
- `POST /api/v1/resetPassword` - Reset password
- `POST /api/v1/fileUpload` - File upload

### Protected Routes
- `POST /api/v1/verifyOtp` - Verify OTP
- `POST /api/v1/resendOtp` - Resend OTP
- `POST /api/v1/logout` - User logout
- `POST /api/v1/activityLog` - Create activity log
