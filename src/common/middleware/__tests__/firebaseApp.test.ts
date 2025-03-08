import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the firebase-admin modules
vi.mock("firebase-admin/app", () => {
  const mockApp = {
    name: "mock-firebase-app",
    // Add other app methods as needed
  };

  return {
    initializeApp: vi.fn().mockReturnValue(mockApp),
    cert: vi.fn((serviceAccount) => ({ credential: serviceAccount })),
    getApps: vi.fn().mockReturnValue([]),
  };
});

vi.mock("firebase-admin/firestore", () => {
  const mockFirestore = {
    collection: vi.fn((name) => ({
      doc: vi.fn(),
      add: vi.fn(),
      get: vi.fn(),
      name,
    })),
    settings: vi.fn(),
  };

  return {
    getFirestore: vi.fn().mockReturnValue(mockFirestore),
  };
});

// Mock the environment configuration
vi.mock("@/common/utils/envConfig", () => {
  return {
    env: {
      FIREBASE_PROJECT_ID: "mock-project-id",
      FIREBASE_DATABASE_URL: "https://mock-project.firebaseio.com",
      FIREBASE_STORAGE_BUCKET: "mock-project.appspot.com",
      FIREBASE_SERVICE_ACCOUNT_KEY: JSON.stringify({
        type: "service_account",
        project_id: "mock-project-id",
        // Add other service account fields as needed
      }),
    },
  };
});

describe("FirebaseApp Middleware", () => {
  beforeEach(() => {
    // Clear cache between tests to reset singleton
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize firebase app with correct config", async () => {
    // Import the firebase modules to get the mocked functions
    const { initializeApp, cert } = await import("firebase-admin/app");
    const { getFirestore } = await import("firebase-admin/firestore");

    // Import our firebase service (this should initialize the app)
    const { firebaseApp, firestore } = await import("../firebaseApp");

    // Check that firebase was initialized with correct config
    expect(initializeApp).toHaveBeenCalledOnce();
    expect(initializeApp).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: "mock-project-id",
        databaseURL: "https://mock-project.firebaseio.com",
        storageBucket: "mock-project.appspot.com",
      }),
    );

    // Check that Firestore was initialized
    expect(getFirestore).toHaveBeenCalledOnce();

    // Check exports are defined
    expect(firebaseApp).toBeDefined();
    expect(firestore).toBeDefined();
  });

  it("should return the same instance when imported multiple times (singleton pattern)", async () => {
    // First import
    const firstImport = await import("../firebaseApp");

    // Second import should reuse the same instance
    const secondImport = await import("../firebaseApp");

    // The app and firestore instances should be the same objects
    expect(firstImport.firebaseApp).toBe(secondImport.firebaseApp);
    expect(firstImport.firestore).toBe(secondImport.firestore);

    // Check that firebase was only initialized once
    const { initializeApp } = await import("firebase-admin/app");
    expect(initializeApp).toHaveBeenCalledOnce();
  });

  it("should handle missing service account key", async () => {
    // Update the mock to have an empty service account key
    vi.mock("@/common/utils/envConfig", () => {
      return {
        env: {
          FIREBASE_PROJECT_ID: "mock-project-id",
          FIREBASE_DATABASE_URL: "https://mock-project.firebaseio.com",
          FIREBASE_STORAGE_BUCKET: "mock-project.appspot.com",
          FIREBASE_SERVICE_ACCOUNT_KEY: "", // Empty service account
        },
      };
    });

    // Reset modules to ensure our new mock is used
    vi.resetModules();

    const { initializeApp } = await import("firebase-admin/app");
    const { firebaseApp } = await import("../firebaseApp");

    // Check that firebase was still initialized (with undefined credential)
    expect(initializeApp).toHaveBeenCalledWith(
      expect.objectContaining({
        credential: undefined, // This should be undefined now
        projectId: "mock-project-id",
      }),
    );

    // App should still be defined
    expect(firebaseApp).toBeDefined();
  });

  it("should throw an error if initialization fails", async () => {
    // Make initializeApp throw an error
    const { initializeApp } = await import("firebase-admin/app");
    vi.mocked(initializeApp).mockImplementationOnce(() => {
      throw new Error("Firebase initialization failed");
    });

    // Reset modules to ensure our mock error is triggered
    vi.resetModules();

    // Import should now throw an error
    await expect(import("../firebaseApp")).rejects.toThrow("Failed to initialize Firebase");
  });
});
