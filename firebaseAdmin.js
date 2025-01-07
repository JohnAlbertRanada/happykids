import admin from 'firebase-admin';

// Check if the admin SDK is already initialized
if (!admin.apps.length) {
  const serviceAccount = JSON.parse('./serviceAccountKey.json'); // Or import your serviceAccountKey.json
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;