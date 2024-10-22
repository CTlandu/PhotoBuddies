const admin = require("firebase-admin");
const serviceAccount = require("./photobuddies-e7541-firebase-adminsdk-s3m6s-a0a49f0e94.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://photobuddies-e7541.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin, db };
