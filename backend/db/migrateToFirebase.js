const { MongoClient } = require("mongodb");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

// 加载环境变量
dotenv.config();

// 初始化 Firebase
const serviceAccount = require("../photobuddies-e7541-firebase-adminsdk-s3m6s-a0a49f0e94.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

function convertToFirestoreDocument(doc) {
  const result = {};
  for (const [key, value] of Object.entries(doc)) {
    if (value && typeof value === "object") {
      if (value instanceof Date) {
        result[key] = admin.firestore.Timestamp.fromDate(value);
      } else if (value._bsontype === "ObjectID") {
        result[key] = value.toString();
      } else {
        result[key] = convertToFirestoreDocument(value);
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}

async function migrateData() {
  const mongoUri =
    "mongodb+srv://ctlandu:admin123@mernapp.hj5mpxa.mongodb.net/authDB?retryWrites=true&w=majority&appName=MERNapp";
  if (!mongoUri) {
    console.error(
      "MongoDB URI is not set. Please check your environment variables."
    );
    return;
  }

  const mongoClient = new MongoClient(mongoUri);

  try {
    await mongoClient.connect();
    const mongoDb = mongoClient.db();
    const usersCollection = mongoDb.collection("users");

    const users = await usersCollection.find().toArray();

    for (const user of users) {
      const { _id, ...userData } = user;
      const firestoreData = convertToFirestoreDocument(userData);
      await db.collection("users").doc(user.id).set(firestoreData);
      console.log(`Migrated user: ${user.id}`);
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoClient.close();
  }
}

migrateData();
