# AtheraCare - Senior Health & Family Connection App

AtheraCare is an accessibility-first mobile application designed specifically for seniors to manage their health and stay connected with family members. Built with React Native and Expo, it features large touch targets, high contrast design, and voice-ready functionality.

## 🎯 Features

### Core Health Management

- **Medication Reminders**: Track morning and evening medications with easy confirmation
- **Hydration Tracker**: Log water intake with visual progress indicators
- **Daily Intentions**: Set and track daily wellness goals
- **Health History**: View medication and hydration logs

### Family Connection

- **Family Member Management**: Store and manage family contact information
- **Quick Messaging**: Send text messages and voice notes to family
- **Health Sharing**: Share health updates and daily activities
- **Emergency Contacts**: Quick access to emergency contact information

### Accessibility Features

- **Large Touch Targets**: Minimum 44px buttons for easy interaction
- **High Contrast Design**: Optimized color schemes for visibility
- **Adjustable Font Sizes**: 18-24pt font size options
- **Voice Commands**: Control app functions with voice input
- **Simple Navigation**: Maximum 3 navigation levels

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/atheracare.git
   cd atheracare
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your Supabase credentials:

   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## 🏗️ Project Structure

```
atheracare/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Welcome screen
│   ├── onboarding.tsx     # Setup screen
│   └── (tabs)/            # Tab navigation
│       ├── _layout.tsx    # Tab layout
│       ├── index.tsx      # Home dashboard
│       ├── health.tsx     # Health management
│       ├── family.tsx     # Family connection
│       └── settings.tsx   # App settings
├── src/
│   ├── constants/         # Theme and styling constants
│   ├── services/          # Supabase and API services
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, and static files
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Design System

### Color Palette

- **Primary**: Deep Blue (#1E3A8A) - Main brand color
- **Secondary**: Green (#059669) - Success and health indicators
- **Background**: White (#FFFFFF) - Clean, accessible backgrounds
- **Text**: Dark Gray (#0F172A) - High contrast text
- **Surface**: Light Gray (#F1F5F9) - Card and component backgrounds

### Typography

- **Base Font Size**: 18pt (minimum accessible size)
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Line Heights**: Tight (1.2), Normal (1.4), Relaxed (1.6)

### Spacing & Layout

- **Touch Targets**: Minimum 44px for accessibility
- **Card Padding**: 24px for comfortable spacing
- **Section Spacing**: 32px between major sections
- **Border Radius**: 8px-24px for modern, friendly appearance

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm test` - Run test suite

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **React Native**: Best practices for mobile development

### Key Dependencies

- **React Native**: 0.72.6
- **Expo**: 49.0.15
- **Expo Router**: File-based routing
- **Supabase**: Backend and database
- **React Native Paper**: Material Design components
- **Vector Icons**: Icon library

## 📱 App Store Deployment

### iOS App Store

1. **Build for production**

   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit to App Store**
   ```bash
   eas submit --platform ios
   ```

### Google Play Store

1. **Build for production**

   ```bash
   eas build --platform android --profile production
   ```

2. **Submit to Play Store**
   ```bash
   eas submit --platform android
   ```

### EAS Configuration

Create `eas.json` for build profiles:

```json
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## 🗄️ Database Schema

### Core Tables

- **users**: User profiles and preferences
- **medications**: Medication information and schedules
- **medication_logs**: Daily medication tracking
- **hydration_logs**: Water intake records
- **family_members**: Family contact information
- **messages**: Communication history

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations in `supabase/migrations/`
3. Set up Row Level Security (RLS) policies
4. Configure authentication providers

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### E2E Testing

```bash
npm run test:e2e
```

### Accessibility Testing

- Test with screen readers
- Verify touch target sizes
- Check color contrast ratios
- Test voice command functionality

## 📊 Analytics & Monitoring

### Performance Monitoring

- **Expo Application Services**: Built-in performance monitoring
- **Sentry**: Error tracking and performance monitoring
- **Firebase Analytics**: User behavior insights

### Health Metrics

- Medication adherence rates
- Hydration goal completion
- Family communication frequency
- App usage patterns

## 🔒 Security & Privacy

### Data Protection

- **Encryption**: All data encrypted in transit and at rest
- **Authentication**: Secure user authentication with Supabase Auth
- **Privacy Controls**: User-configurable data sharing preferences
- **HIPAA Compliance**: Healthcare data protection measures

### Security Features

- Secure API endpoints
- Input validation and sanitization
- Rate limiting and abuse prevention
- Regular security audits

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review Guidelines

- Follow TypeScript best practices
- Ensure accessibility compliance
- Add appropriate tests
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)

### Community

- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://github.com/react-native-community)

### Contact

- **Email**: support@atheracare.com
- **Website**: https://atheracare.com
- **Support Hours**: Monday-Friday, 9 AM - 6 PM EST

## 🙏 Acknowledgments

- **Expo Team**: For the amazing development platform
- **React Native Community**: For the robust mobile framework
- **Supabase**: For the powerful backend infrastructure
- **Accessibility Advocates**: For guidance on inclusive design

---

**Built with ❤️ for seniors and their families**
