import { env } from "@/common/utils/envConfig";
import { type App, cert, initializeApp } from "firebase-admin/app";
import { type Firestore, getFirestore } from "firebase-admin/firestore";

/**
 * Firebase app and Firestore singleton instances
 */
class FirebaseService {
  private static instance: FirebaseService;
  private app: App;
  private firestoreDb: Firestore;

  private constructor() {
    try {
      // Initialize Firebase app with environment variables
      this.app = initializeApp({
        credential: env.FIREBASE_SERVICE_ACCOUNT_KEY ? cert(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_KEY)) : undefined,
        projectId: env.FIREBASE_PROJECT_ID,
        databaseURL: env.FIREBASE_DATABASE_URL,
        storageBucket: env.FIREBASE_STORAGE_BUCKET,
      });

      // Initialize Firestore
      this.firestoreDb = getFirestore(this.app);

      // Set Firestore settings if needed
      this.firestoreDb.settings({
        ignoreUndefinedProperties: true,
      });

      console.log("Firebase initialized successfully");
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      throw new Error("Failed to initialize Firebase");
    }
  }

  /**
   * Get the Firebase service instance (singleton pattern)
   */
  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  /**
   * Get the Firebase app instance
   */
  public getApp(): App {
    return this.app;
  }

  /**
   * Get the Firestore database instance
   */
  public getFirestore(): Firestore {
    return this.firestoreDb;
  }
}

// Export the Firebase app and Firestore instances
export const firebaseApp = FirebaseService.getInstance().getApp();
export const firestore = FirebaseService.getInstance().getFirestore();
