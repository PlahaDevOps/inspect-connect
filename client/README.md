# Inspect Connect Client

## Setup Instructions

### 1. Node.js Version Requirement
This project requires Node.js version 20 or higher. If you're using Node.js 18, please upgrade:

```bash
# Using nvm (Node Version Manager)
nvm install 20
nvm use 20

# Or download from https://nodejs.org/
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5002
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

## Features

- **Authentication System:**
  - Login/Signup with email/password
  - Phone number verification with OTP
  - Forgot/Reset password functionality
  - Role-based registration (Client/Inspector)

- **State Management:**
  - Redux Toolkit with async thunks
  - Centralized API client with interceptors
  - Token-based authentication
  - Toast notifications

- **UI Components:**
  - Material-UI components
  - Responsive design
  - Form validation with Formik + Yup
  - Phone input with country codes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── pages/           # Page components
├── shared/          # Shared components and utilities
│   ├── components/  # Reusable UI components
│   ├── interfaces/  # TypeScript interfaces
│   ├── routes/      # Routing configuration
│   └── theme/       # Material-UI theme
├── store/           # Redux store configuration
│   ├── actions/     # Redux actions
│   ├── slices/      # Redux slices
│   └── selectors/   # Redux selectors
└── utils/           # Utility functions
    ├── common/      # Common utilities
    └── validations/ # Form validation schemas
```

## Dependencies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Material-UI** - UI components
- **React Router** - Navigation
- **Formik + Yup** - Form handling
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
