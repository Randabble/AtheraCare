# Firestore Indexes Required for Activity Tracking

## Composite Indexes

### dailyActivities Collection
Create a composite index on the `dailyActivities` collection with the following fields:

1. **Index 1:**
   - Collection: `dailyActivities`
   - Fields:
     - `userId` (Ascending)
     - `date` (Ascending)
   - Query scope: Collection

2. **Index 2:**
   - Collection: `dailyActivities`
   - Fields:
     - `userId` (Ascending)
     - `date` (Descending)
   - Query scope: Collection

## Single Field Indexes

### medications Collection
- `userId` (Ascending)
- `createdAt` (Descending)

### hydrationLogs Collection
- `userId` (Ascending)
- `date` (Descending)

## How to Create Indexes

1. Go to your Firebase Console
2. Navigate to Firestore Database
3. Click on the "Indexes" tab
4. Click "Create Index"
5. Add the indexes listed above

## Security Rules

Make sure your Firestore security rules allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /dailyActivities/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /medications/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /hydrationLogs/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
