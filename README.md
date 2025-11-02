# SmartChef - Full Stack Recipe Finder and Meal Planner

A complete full-stack application for recipe discovery, meal planning, and cooking management.


## Project Structure

```
msd-project2/
├── client/          # React frontend
├── backend/         # Node.js/Express backend
└── package.json     # Root package.json for managing both
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

### Running the Application

#### Development Mode (Recommended)
Run both frontend and backend simultaneously:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:5173

#### Individual Services

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:client
```

### Production Build

```bash
npm run build
npm start
```

## Features

- 🔐 User Authentication (Login/Register)
- 📧 Password Reset with OTP
- 🍳 Recipe Discovery and Management
- 📅 Meal Planning
- ⭐ Favorites System
- 🛒 Shopping List Generation
- 🤖 AI Recipe Generator (Coming Soon)

## API Testing

Open browser console and use:
```javascript
// Test API connection
testAPI.testConnection()

// Test login
testAPI.testLogin("email@example.com", "password")

// Test forgot password
testAPI.testForgotPassword("email@example.com")

// Run comprehensive tests
testSmartChef.runTests()
```

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartchef
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google Custom Search API (Optional - for recipe images)
GOOGLE_SEARCH_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

### Setting Up Google Images for Recipes

To enable Google Images for your recipes:

1. **Get Google API Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project and enable "Custom Search API"
   - Create an API key
   - Set up a [Custom Search Engine](https://programmablesearchengine.google.com/)
   - Get your Search Engine ID

2. **Update `.env` file** with your credentials:
   ```env
   GOOGLE_SEARCH_API_KEY=your_api_key
   GOOGLE_SEARCH_ENGINE_ID=your_engine_id
   ```

3. **Update your recipes**:
   ```bash
   cd backend
   node update-recipe-images.js
   ```

For detailed instructions, see [README-GOOGLE-IMAGES.md](README-GOOGLE-IMAGES.md)

## Troubleshooting

### Port Already in Use
If you get "EADDRINUSE" error:
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change port in backend/server.js
```

### CORS Issues
The backend is configured to accept requests from:
- http://localhost:5173 (default frontend)
- http://localhost:5174
- http://localhost:5175
- http://localhost:3000

### Database Connection
Make sure MongoDB is running:
```bash
# Start MongoDB (if installed locally)
mongod
```

## Development Notes

- Frontend uses Vite for fast development
- Backend uses Express with MongoDB
- Authentication uses JWT tokens
- Password reset uses OTP via email
- All API endpoints are prefixed with `/api`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
