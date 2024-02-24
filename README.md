# MemoriesKeeper

Welcome to the MemoriesKeeper mobile app repository! This app helps users
capture and organize their memories, featuring functionalities such as posting,
commenting, liking after registration, login.

## Technologies Used

- React Native
- Expo
- Firebase
- Redux Toolkit
- React Navigation

## Installation

Before you start, ensure you have Node.js and npm (or yarn) installed on your
system, as well as Expo CLI and a code editor like Visual Studio Code.

### Steps:

1. Clone the repository:

   ```
   git clone <repository_url>
   ```

2. Navigate to the project directory:

   ```
   cd memories-keeper
   ```

3. Install dependencies:

   ```bash
   npm install or yarn install
   ```

4. Set up Firebase:

   - Follow the Firebase documentation to set up Firebase for your project.

## Running the Project

To run the project locally, follow these steps:

1. Start the Expo development server:

   ```bash
   npm start or yarn start
   ```

2. Open the Expo Go app on your mobile device.

3. Scan the QR code displayed in the terminal or Expo DevTools with your
   device's camera.

4. Wait for the app to load on your device.

## Screens and Navigation

### Public Screens: Login and Registration

- Users have access to the Login and Registration screens upon opening the app.
- Users can sign up using the Registration screen with Firebase authentication.
- Users can sign in using the Login screen with Firebase authentication.

![Login](/src/assets/LogRegScreen.gif)![Registration](/src/assets/Login.gif)![Login](/src/assets/RegisterScreen.gif)

### Private Screens:

Once logged in, users have access to the following private screens:

#### Posts (Default) Screen:

- Displays memories (photos) of all users and Post Screen. From Posts Screen
  user can go to Comments screen or Map Screen
  ![Image 1](/src/assets/DefaultScreen.png)

  ##### Comments Screen

  - Displays all comments of post, and give possibility to add new comment
    ![Image 1](/src/assets/CommetntsScreen.gif)

  ##### Map Screen

  - Displays map with place where photo was taken
  - ![Image 1](/src/assets/MapScreen.gif)

#### Create new post Screen:

- Create new post: Allows users to create new posts.
  ![Image 1](/src/assets/CreatePostScreen.gif)

#### Profile Screen:

- Profile: Allows users to update profile avatar and gives access to all user
  posts.

![Image 1](/src/assets/ProfileScreen.png)
