# Firestore Indexes for Activity Tracking

The activity tracking system requires the following Firestore indexes to function properly:

## Required Indexes

### 1. Daily Activities Collection
**Collection:** `dailyActivities`

**Index 1:**
- Fields:
  - `userId` (Ascending)
  - `date` (Ascending)
- Query: `where('userId', '==', userId) && where('date', '>=', startDate) && where('date', '<=', endDate)`

**Index 2:**
- Fields:
  - `userId` (Ascending)
  - `date` (Descending)
- Query: `where('userId', '==', userId) && orderBy('date', 'desc')`

### 2. Medications Collection
**Collection:** `medications`

**Index:**
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)
- Query: `where('userId', '==', userId) && orderBy('createdAt', 'desc')`

### 3. Hydration Logs Collection
**Collection:** `hydrationLogs`

**Index:**
- Fields:
  - `userId` (Ascending)
  - `date` (Descending)
- Query: `where('userId', '==', userId) && orderBy('date', 'desc')`

## How to Create Indexes

1. Go to the Firebase Console
2. Navigate to Firestore Database
3. Click on the "Indexes" tab
4. Click "Add Index"
5. Create each index as specified above

## Automatic Index Creation

Firebase will automatically suggest creating indexes when you run queries that require them. You can click on the link in the error message to create the index directly.

## Index Status

- **Building**: Index is being created (may take a few minutes)
- **Enabled**: Index is ready to use
- **Error**: Index creation failed (check the error message)

## Performance Notes

- Indexes improve query performance but increase storage costs
- Composite indexes are required for queries with multiple `where` clauses and `orderBy`
- Single-field indexes are created automatically by Firestore

## Testing Indexes

After creating indexes, test your queries to ensure they work properly:

1. Run the activity tracking queries
2. Check the Firebase Console for any remaining index errors
3. Verify that data is being retrieved correctly

## Troubleshooting

If you encounter index-related errors:

1. Check that all required indexes are created
2. Wait for indexes to finish building (check status in Firebase Console)
3. Verify that your query matches the index structure exactly
4. Check the Firebase Console logs for detailed error messages
