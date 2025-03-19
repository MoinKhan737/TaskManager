# Setup Instructions for Full Stack Task Manager App

## Prerequisites
Before setting up the project, ensure you have the following installed:
- Node.js and npm
- MongoDB (local or cloud)
- Expo CLI

## Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/moinkhan737/TaskManagerBackend.git
   cd task-manager-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the following environment variables:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

## Frontend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/moinkhan737/TaskManager.git
   cd task-manager-frontend 
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Update the API base URL in the frontend code to match your backend deployment.
4. Start the Expo development server:
   ```sh
   npx expo start
   ```


## Usage
1. Sign up or log in.
2. Create, edit, and manage tasks.
3. Logout securely.

