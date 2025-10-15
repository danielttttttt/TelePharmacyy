# Tele-Pharmacy Application

## Overview
Tele-Pharmacy is a modern healthcare application that connects patients with pharmacies for medication ordering and delivery.

## Features
- User authentication with Firebase Authentication
- Pharmacy search with real-time location data
- Medication ordering and tracking
- Tele-consultation with healthcare professionals
- Multi-language support (English and Amharic)

## Firebase Integration
This application uses Firebase for:
- User authentication (Email/Password, Email Verification, Password Reset)
- User profile management with Firestore
- Real-time data synchronization

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase project with Authentication and Firestore enabled

## Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase environment variables
4. Start the development server: `npm run dev`

## Firebase Setup
1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Email/Password authentication
3. Create a Firestore database
4. Copy the Firebase configuration values to your `.env.local` file

## Authentication Flows
- Registration with email verification
- Login with email and password
- Password reset
- Profile management
- Account deletion

## Development
- React with Vite
- Tailwind CSS for styling
- Firebase SDK for backend services
- React Router for navigation

## Testing
- Manual testing of all authentication flows
- Unit tests for utility functions
- Integration tests for Firebase services

## Deployment
- Build the application: `npm run build`
- Deploy to any static hosting service
- Configure Firebase for production environment