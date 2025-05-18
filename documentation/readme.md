# ComsiConnect: A Social Media Web Application for COMSATS University

## Project Overview

ComsiConnect is a social media web application designed specifically for the COMSATS university community. It provides a platform for students, faculty, and staff to connect, share content, interact in a dedicated online environment, and communicate anonymously through a confession feature while maintaining personal profiles.

## Technical Stack

### Frontend

- **Framework**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Animation**: Framer Motion
- **Icons**: React Icons
- **HTTP Client**: Fetch API
- **Date Formatting**: Day.js
- **Routing**: React Router
- **Deployment**: Vercel

### Backend

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js with sessions
- **Password Encryption**: bcrypt.js
- **File Upload**: Multer
- **Environment Variables**: dotenv
- **Deployment**: Render

## System Architecture

The application follows a client-server architecture:

1. **Client**: React single-page application (SPA) that handles UI rendering and client-side routing
2. **Server**: Express.js RESTful API that manages data operations and authentication
3. **Database**: MongoDB for storing user data, posts, and confessions

### Directory Structure

```
┌── cilent/
│   ├── src/
│   │   ├── api/         # API service methods
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main application component
│   │   └── main.jsx     # Entry point
│   ├── public/          # Static assets
│   └── package.json     # Dependencies
└── server/
    ├── routes/          # API routes
    ├── models/          # Data models
    ├── middleware/      # Express middleware
    ├── config/          # Configuration files
    ├── auth/            # Authentication logic
    ├── public/          # Public assets (including uploads)
    ├── app.js           # Server entry point
    └── package.json     # Dependencies

```

## Development Process

### Planning Phase

The development began with identifying the key requirements for a university-specific social media platform, including features such as:

- User profiles
- Content posting and sharing
- Communication channels
- University-specific features
- Anonymous confession capability

### Implementation

### Backend Development

The backend was built using Express.js, creating a RESTful API to handle various functionalities:

- User authentication and authorization with Passport.js
- Data storage and retrieval with MongoDB
- Content management for posts and confessions
- User interactions including likes, reposts, and saves
- File uploads for images using Multer

### Frontend Development

The React-based frontend was designed to provide an intuitive and responsive user interface:

- Component-based architecture for reusability
- Responsive design using Tailwind CSS
- State management using React hooks and context
- User-friendly forms and navigational elements
- Animation and transitions using Framer Motion

## Feature Implementation

### 1. User Authentication System

**Implementation**:

- Created user model with username, password (hashed), profile information
- Implemented Passport.js local authentication strategy
- Set up session-based authentication with persistent sessions
- Created login and signup pages with form validation
- Implemented protected routes in both frontend and backend

**Challenges Faced**:

- **CORS Issues**: Initially encountered CORS errors when making cross-domain requests.
    - **Solution**: Configured CORS middleware with proper origin, credentials, and methods.
- **Session Persistence**: Sessions weren't persisting between page refreshes.
    - **Solution**: Fixed by properly configuring express-session with secure cookies and proper settings.
- **API Response Format Issues**: Encountered "response.json is not a function" error.
    - **Solution**: Updated API handling to check content type before trying to parse JSON.

### 2. News Feed Implementation

**Implementation**:

- Created a post model with content, images, and interaction tracking
- Implemented UI for post creation with image uploads
- Built post card components for displaying posts with interactions
- Added like, repost, and save functionality
- Implemented image modal for viewing post images

**Challenges Faced**:

- **Image Upload**: Multiple image uploads were failing.
    - **Solution**: Properly configured multer middleware for multiple file handling and FormData in frontend.
- **UI State Management**: Post interaction state (likes, reposts) wasn't updating immediately.
    - **Solution**: Implemented optimistic UI updates with proper state management.
- **Loading States**: Users had no feedback during data loading.
    - **Solution**: Added loading spinners and proper UI states for loading, error, and success.

### 3. Anonymous Confessions Feature

**Implementation**:

- Created a confession model with anonymous identifiers
- Built a system to generate and manage anonymous IDs
- Implemented confession creation with content and image uploads
- Created interaction system for anonymous content

**Challenges Faced**:

- **Anonymous Identity Management**: Needed to maintain anonymity while preventing abuse.
    - **Solution**: Generated persistent anonymous IDs linked to user accounts but not publicly connected.
- **Deletion of Confessions**: Backend was returning 500 errors when deleting confessions.
    - **Solution**: Fixed array manipulation in deletion route by properly handling ObjectId comparisons.

### 4. User Profile System

**Implementation**:

- Created profile pages with user information display
- Built post management for user's own content
- Implemented grid and list views for posts
- Added edit and delete functionality for user's posts
- Integrated profile editing capabilities

**Challenges Faced**:

- **Component Structure**: Initial monolithic components were hard to maintain.
    - **Solution**: Refactored code into smaller, reusable components for better organization.
- **Consistent UI**: Maintaining consistent card sizes and layouts.
    - **Solution**: Implemented fixed-height containers with proper overflow handling.
- **Edit/Delete Functionality**: Need to maintain state across edit operations.
    - **Solution**: Implemented modal system with proper state persistence.

### 5. Image Handling

**Implementation**:

- Set up server-side storage for uploaded images
- Implemented image preview before uploading
- Created image grid layouts for post display
- Built image modal with zoom and download capabilities

**Challenges Faced**:

- **Performance Issues**: Large images were affecting performance.
    - **Solution**: Implemented lazy loading and proper image sizing.
- **Image Modal**: Needed an interactive way to view full-size images.
    - **Solution**: Created a modal component with animation and download functionality.

## Authentication Flow

1. **Registration**:
    - User submits signup form with personal details
    - Frontend validates the input
    - Backend checks for existing username
    - Password is hashed and stored
    - User record is created in database
2. **Login**:
    - User provides credentials
    - Backend authenticates via Passport.js
    - Session is created with user info
    - Frontend redirects to feed
3. **Session Management**:
    - Sessions are stored in MongoDB
    - Client receives a session cookie
    - Protected routes check authentication status
    - Unauthorized access redirects to login
4. **Logout**:
    - Session is destroyed on server
    - Cookie is cleared
    - User is redirected to login page

## API Endpoints

### Authentication

- `POST /auth/signup`: Register a new user
- `POST /auth/login`: Authenticate user
- `GET /auth/logout`: End user session

### Posts

- `GET /api/posts`: Get all public posts
- `POST /api/posts`: Create a new post
- `PUT /api/posts/:id`: Update a post
- `DELETE /api/posts/:id`: Delete a post
- `POST /api/posts/:id/interaction`: Like, repost, or save a post

### User

- `GET /api/user`: Get current user profile
- `GET /api/user/posts`: Get current user posts
- `PUT /api/user`: Update user profile

### Confessions

- `GET /api/confessions`: Get all confessions
- `GET /api/confessions/anonymous-id`: Get user's anonymous ID
- `POST /api/confessions`: Create a new confession
- `DELETE /api/confessions/my-posts/:postId`: Delete user's confession
- `POST /api/confessions/:id/interaction`: Interact with a confession

## Frontend Components

### Core Components

- **Navbar**: Navigation header with links and user info
- **PostCard**: Reusable component for displaying posts
- **CreatePost**: Form for creating new posts
- **ImageModal**: Modal for displaying full-size images
- **ProtectedRoute**: Route wrapper that enforces authentication

### Pages

- **Home**: Landing page for the application
- **Login/Signup**: Authentication pages
- **Feed**: Main content stream showing all posts
- **Profile**: User profile page with their posts
- **Confessions**: Anonymous confession board
- **EditProfile**: Form for updating user profile

## Deployment Challenges and Solutions

### Backend Deployment (Render)

### Challenges:

1. **Environment Variable Configuration**: Ensuring secure storage of sensitive information like database credentials and API keys.
2. **Database Connection Issues**: Establishing reliable connections between the deployed backend and the database.
3. **CORS Configuration**: Setting up proper Cross-Origin Resource Sharing to allow the frontend to communicate with the backend.

### Solutions:

1. Implemented proper environment variable management using Render's environment configuration.
2. Modified database connection strings to accommodate production environment.
3. Established appropriate CORS policies to ensure secure communication between frontend and backend.

### Frontend Deployment (Vercel)

### Challenges:

1. **Build Configuration**: Creating optimal build settings for production.
2. **API Endpoint Management**: Handling different API endpoints for development and production environments.
3. **Asset Optimization**: Ensuring efficient loading of images and other assets.

### Solutions:

1. Utilized Vercel's build configuration options to optimize the deployment process.
2. Implemented environment-specific API endpoint configuration using environment variables.
3. Applied asset optimization techniques to improve loading times and performance.

## Lessons Learned & Best Practices

### Code Organization

- **Component Separation**: Breaking monolithic components into smaller, focused ones
- **State Management**: Keeping state logic in parent components, UI in children
- **API Abstraction**: Centralizing API calls in service files

### Error Handling

- **Comprehensive Error Catching**: Adding try-catch blocks to all async operations
- **User Feedback**: Displaying helpful error messages to users
- **Graceful Degradation**: Ensuring the app functions even when parts fail

### Security Considerations

- **Authentication**: Proper session management and protected routes
- **Data Validation**: Validating inputs on both client and server
- **CSRF Protection**: Implementing proper CSRF protection for forms

### Performance Optimizations

- **Image Handling**: Optimizing image loading and display
- **Loading States**: Providing feedback during data operations
- **Conditional Rendering**: Only rendering components when data is available

## User Guide

### Getting Started

1. **Creating an Account**:
    - Visit the ComsiConnect website
    - Click "Sign Up" and enter your COMSATS email address
    - Fill in your profile details and set a password
    - Verify your email address through the confirmation link
2. **Setting Up Your Profile**:
    - Add a profile picture
    - Complete your bio section with information about your department, interests, and role
    - Set your privacy preferences

### Core Features

1. **News Feed**:
    - View posts from connections and groups
    - Like, comment, and share content
    - Filter content by categories or popularity
    - Create new posts with text and images
2. **Connecting with Others**:
    - Search for classmates, faculty, or staff by name or department
    - Send connection requests
    - View suggested connections based on your department or interests
3. **Content Sharing**:
    - Create text posts, share images, or upload documents
    - Tag relevant topics or individuals
    - Control who can see your posts (public, connections only, or specific groups)
4. **Anonymous Confessions**:
    - Share thoughts and experiences anonymously
    - Interact with confessions without revealing your identity
    - Maintain a consistent anonymous ID across your confessions
    - Delete your own confessions if needed
5. **Groups and Communities**:
    - Join existing groups based on courses, departments, or interests
    - Create new groups for specific purposes
    - Share content exclusively within groups
6. **Events and Announcements**:
    - View upcoming university events
    - Create event invitations
    - Receive notifications about important announcements
7. **Messaging**:
    - Send private messages to connections
    - Create group chats for project teams or study groups
    - Share files and links in conversations

### Tips for Optimal Use

- Keep your profile information up-to-date
- Join groups relevant to your courses and interests
- Check notifications regularly for important updates
- Use appropriate tags when posting to reach the right audience
- Maintain professional communication standards
- Report any inappropriate content using the reporting feature

## Deployment Considerations

For production deployment, consider:

1. **Environment Configuration**:
    - Set up proper environment variables
    - Configure production database connection
    - Set secure cookie settings
2. **Security Hardening**:
    - Enable HTTPS
    - Set proper CSP headers
    - Configure rate limiting
    - Enable CSRF protection
3. **Performance**:
    - Implement server-side caching
    - Configure proper database indexes
    - Enable compression for assets
4. **Monitoring**:
    - Set up error logging
    - Implement performance monitoring
    - Configure alerts for critical issues

## Future Enhancements

The ComsiConnect platform is designed for continuous improvement, with planned features including:

- Enhanced mobile application
- Integration with university systems for course information
- Advanced event management tools
- Expanded content moderation capabilities
- Video Uploading
- Better Ui
- Additional customization options for user profiles
- Real-time notifications system
- Enhanced analytics for user engagement
- Integration with academic calendars

## Conclusion

ComsiConnect represents a dedicated effort to create a specialized social media platform for the COMSATS university community. By focusing on the specific needs of students, faculty, and staff, the application aims to enhance communication, collaboration, and community building within the university environment. The combination of traditional social media features with university-specific functionality and anonymous confession capabilities provides a comprehensive digital experience tailored to academic life.