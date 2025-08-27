# AtheraCare - Development Environment

This is the development environment setup for AtheraCare, a senior health and family connection app built with React Native, Expo, and Firebase.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd AtheraCare
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Test on your device:**
   - Open Expo Go on your phone
   - Scan the QR code from the terminal
   - The test app will load and you can verify all functionality

## 📱 Testing the Development Environment

The current app is a **test environment** that verifies all installed packages and functionality:

### What's Being Tested:
- ✅ **React Navigation** - Navigation between screens
- ✅ **React Native Paper** - UI components and theming
- ✅ **Safe Area Context** - Proper screen boundaries
- ✅ **Expo Sensors** - Pedometer functionality
- ✅ **Expo Notifications** - Local notifications
- ✅ **Expo Image Picker** - Camera and photo library access
- ✅ **Date-fns** - Date formatting utilities
- ✅ **TypeScript** - Type checking and IntelliSense

### Test Features:
1. **Navigation Test** - Verifies React Navigation is working
2. **UI Components Test** - Tests React Native Paper buttons and cards
3. **Pedometer Test** - Checks step counting functionality
4. **Notifications Test** - Tests permission requests and local notifications
5. **Image Picker Test** - Tests camera roll access
6. **Date-fns Test** - Tests date formatting
7. **Environment Status** - Overall system check

## 📦 Installed Dependencies

### Core Dependencies:
- `expo` - Expo SDK 53
- `react` - React 19
- `react-native` - React Native 0.79.6
- `typescript` - TypeScript support

### Navigation:
- `@react-navigation/native` - Core navigation library
- `@react-navigation/native-stack` - Stack navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native screen components

### UI & State Management:
- `react-native-paper` - Material Design components
- `zustand` - State management
- `react-hook-form` - Form handling
- `zod` - Schema validation

### Expo Modules:
- `expo-notifications` - Local and push notifications
- `expo-sensors` - Device sensors (pedometer)
- `expo-constants` - App constants
- `expo-image-picker` - Camera and photo library
- `expo-status-bar` - Status bar management

### Utilities:
- `firebase` - Firebase SDK
- `date-fns` - Date manipulation

## 🔧 Configuration

### app.json
The app is configured with:
- Proper permissions for notifications, camera, and activity recognition
- Health data access permissions for iOS
- Android permissions for sensors and storage
- Expo plugins for notifications and image picker

### TypeScript
- Full TypeScript support with strict type checking
- Proper type definitions for all dependencies

## 🧪 Testing Checklist

Before proceeding with the main app development, verify:

- [ ] App loads without errors
- [ ] Navigation works smoothly
- [ ] UI components render correctly
- [ ] Pedometer shows step count (if available on device)
- [ ] Notification permissions can be requested
- [ ] Test notifications can be sent
- [ ] Image picker can access photo library
- [ ] Date formatting works correctly
- [ ] All TypeScript types are valid

## 🚨 Troubleshooting

### Common Issues:

1. **Metro bundler issues:**
   ```bash
   npx expo start --clear
   ```

2. **Dependency conflicts:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Expo Go connection issues:**
   - Ensure phone and computer are on same network
   - Try switching between tunnel, LAN, and localhost modes

4. **Permission issues:**
   - Grant permissions when prompted
   - Check device settings for app permissions

## 📋 Next Steps

Once the test environment is verified working:

1. **Firebase Setup** - Configure Firebase project and add credentials
2. **App Structure** - Create the main app navigation and screens
3. **Authentication** - Implement Firebase Auth
4. **Database** - Set up Firestore collections and security rules
5. **Features** - Build senior and family role features

## 🛠 Development Commands

```bash
# Start development server
npm start

# Start on Android
npm run android

# Start on iOS (requires macOS)
npm run ios

# Start on web
npm run web

# Clear cache and restart
npx expo start --clear
```

## 📱 Device Testing

### Physical Device (Recommended):
- Install Expo Go from App Store/Google Play
- Scan QR code from terminal
- Test all features including sensors and notifications

### Simulator/Emulator:
- iOS Simulator (macOS only)
- Android Emulator
- Some features like pedometer may not work in simulators

## 🔒 Security Notes

- Firebase configuration will be added via environment variables
- No sensitive data is currently in the codebase
- Permissions are properly configured for production use

---

**Status**: ✅ Development environment ready for testing
**Next**: Verify all functionality works, then proceed with main app development
