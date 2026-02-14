# CollegeTracker

CollegeTracker is a comprehensive mobile application designed to help prospective students navigate the admission process into higher education institutions. Built with React Native and Expo, it provides a social platform for sharing experiences, asking questions, and tracking college-related information.

## 🚀 Features

- **User Authentication**: Secure sign-up and sign-in using Appwrite Authentication.
- **Social Feed**: Explore posts from other students and colleges.
- **Content Creation**: Share your journey by creating text-based posts or uploading videos.
- **Engagement**: Like and comment on posts, and reply to existing comments to keep the conversation going.
- **Bookmarking**: Save featured schools or interesting posts to your bookmarks for quick access later.
- **Profile Management**: Customize your profile and view your previous activities.
- **Trending & Search**: Discover popular content and search for specific colleges or topics.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Backend**: [Appwrite](https://appwrite.io/) (Auth, Database, Storage)
- **State Management**: React Context API
- **Animations**: React Native Animatable

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd CollegeTracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Appwrite**:
   - Create a project on [Appwrite Cloud](https://cloud.appwrite.io/) or your self-hosted instance.
   - Set up a Database and the following Collections:
     - Users
     - Posts
     - Colleges
     - Comments
     - Replies
     - Videos
     - Images
   - Update the configuration in `lib/appwrite.js` with your specific IDs:
     ```javascript
     export const appwriteConfig = {
         endpoint: "https://cloud.appwrite.io/v1",
         platform: "com.company.worm",
         projectId: "YOUR_PROJECT_ID",
         databaseId: "YOUR_DATABASE_ID",
         userCollectionId: "YOUR_USER_COLLECTION_ID",
         // ... fill in the rest of the IDs
     }
     ```

4. **Start the development server**:
   ```bash
   npx expo start
   ```

5. **Run the app**:
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS).
   - Alternatively, press `a` for Android emulator, `i` for iOS simulator, or `w` for web.

## 🔧 Recent Fixes

- **Appwrite Logic**: Improved the like/unlike system to handle array modifications correctly instead of overwriting.
- **Syntax Errors**: Fixed missing variable declarations (`const`) in several service functions.
- **Functionality**: Renamed and fixed the signature of the featured schools search function.
- **API Handling**: Corrected the return values for Appwrite database update calls.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
