import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Check if the admin SDK is already initialized
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(path.resolve('./serviceAccountKey.json'), 'utf-8')
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;