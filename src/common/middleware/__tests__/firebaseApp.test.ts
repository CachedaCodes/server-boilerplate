import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn().mockReturnValue("app"),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn().mockReturnValue("firestore"),
  collection: vi.fn().mockReturnValue("collection"),
  getDocs: vi.fn(),
  doc: vi.fn().mockReturnValue("doc"),
  getDoc: vi.fn(),
  setDoc: vi.fn().mockReturnValue("setDoc"),
  query: vi.fn(),
}));

describe("Firebase App", () => {
  let FirebaseService: any;

  describe("FirebaseService", () => {
    beforeAll(async () => {
      vi.clearAllMocks();

      const firebaseAppModule = await import("../firebaseApp");
      FirebaseService = firebaseAppModule.FirebaseService;
    });

    it("should initialize Firebase app and Firestore successfully", () => {
      expect(initializeApp).toHaveBeenCalled();
      expect(getFirestore).toHaveBeenCalled();
    });

    it("should return the same instance of FirebaseService", () => {
      const instance1 = FirebaseService.getInstance();
      const instance2 = FirebaseService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("FirestoreCollection", () => {
    const collectionName = "testCollection";
    let firestoreCollection: any;

    beforeAll(async () => {
      vi.clearAllMocks();

      const firebaseAppModule = await import("../firebaseApp");
      FirebaseService = firebaseAppModule.FirebaseService;
      firestoreCollection = new firebaseAppModule.FirestoreCollection(collectionName);
    });

    it("should create a Firestore collection reference", () => {
      expect(collection).toHaveBeenCalledWith("firestore", collectionName);
    });

    it("should query the collection", async () => {
      await firestoreCollection.queryCollection();
      expect(getDocs).toHaveBeenCalled();
    });

    it("should get all documents from the collection", async () => {
      await firestoreCollection.getAllDocs();
      expect(getDocs).toHaveBeenCalledWith("collection");
    });

    it("should get a document by ID", async () => {
      const docId = "testDocId";
      await firestoreCollection.getDoc(docId);
      expect(doc).toHaveBeenCalledWith("collection", docId);
      expect(getDoc).toHaveBeenCalledWith("doc");
    });

    it("should set a document by ID", async () => {
      const docId = "testDocId";
      const data = { key: "value" };
      await firestoreCollection.setDoc(docId, data);
      expect(doc).toHaveBeenCalledWith("collection", docId);
      expect(setDoc).toHaveBeenCalledWith(expect.anything(), data);
    });
  });
});
