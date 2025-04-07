import type { getDoc } from "firebase/firestore";

export type FirestoreDoc = Awaited<ReturnType<typeof getDoc>>;
