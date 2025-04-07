import { logger } from "@/common/middleware/customLogger";
import { env } from "@/common/utils/envConfig";
import { type FirebaseApp, initializeApp } from "firebase/app";
import {
  type CollectionReference,
  type Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
} from "firebase/firestore";
import type { FirestoreDoc } from "../types/firebase";
import type { DropFirst } from "../types/utils";

/**
 * Firebase app and Firestore singleton instances
 */
export class FirebaseService {
  private static instance: FirebaseService;
  private firebaseApp: FirebaseApp;
  private firestoreDb: Firestore;

  private constructor() {
    try {
      // Initialize Firebase app with environment variables
      this.firebaseApp = initializeApp({
        apiKey: env.FIREBASE_API_KEY,
        authDomain: env.FIREBASE_AUTH_DOMAIN,
        projectId: env.FIREBASE_PROJECT_ID,
        storageBucket: env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
        appId: env.FIREBASE_APP_ID,
      });

      // Initialize Firestore
      this.firestoreDb = getFirestore(this.firebaseApp);

      logger.info("Firebase initialized successfully");
    } catch (error) {
      logger.error("Error initializing Firebase:", error);
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
  public getApp(): FirebaseApp {
    return this.firebaseApp;
  }

  /**
   * Get the Firestore database instance
   */
  public getFirestore(): Firestore {
    return this.firestoreDb;
  }
}

/**
 * Firestore collection class
 */
export class FirestoreCollection {
  private collection: CollectionReference;

  constructor(collectionName: string) {
    const firestore = FirebaseService.getInstance().getFirestore();
    this.collection = collection(firestore, collectionName);
  }

  /**
   * Query the firstore collection
   *
   * @param queryParameters The query parameters
   * @returns The docs from the query
   */
  public queryCollection(...queryParameters: DropFirst<Parameters<typeof query>>): ReturnType<typeof getDocs> {
    const queryRef = query(this.collection, ...queryParameters);

    return getDocs(queryRef);
  }

  /**
   * Get all documents from the collection
   *
   * @returns A promise that resolves with an array of documents
   */
  public getAllDocs(): ReturnType<typeof getDocs> {
    return getDocs(this.collection);
  }

  /**
   * Get a document by its ID
   *
   * @param docId The document ID
   * @returns A promise that resolves with the document
   */
  public getDoc(docId: string): ReturnType<typeof getDoc> {
    const docRef = doc(this.collection, docId);

    return getDoc(docRef);
  }

  /**
   * Set a document by its ID
   *
   * @param docId The document ID
   * @param data The document data
   * @returns A promise that resolves with the document
   */
  public setDoc(docId: string, data: FirestoreDoc): ReturnType<typeof setDoc> {
    const docRef = doc(this.collection, docId);

    return setDoc(docRef, data);
  }
}

export const firebaseApp = FirebaseService.getInstance().getApp();
export const firestoreDb = FirebaseService.getInstance().getFirestore();
