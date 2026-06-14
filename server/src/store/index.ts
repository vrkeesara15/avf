import { config } from "../config";
import { MemoryStore } from "./MemoryStore";
import { FirestoreStore } from "./FirestoreStore";
import type { Store } from "./Store";

let instance: Store | null = null;

/** Lazily create the configured store (Firestore in prod, memory otherwise). */
export function getStore(): Store {
  if (!instance) {
    instance =
      config.dataStore === "firestore" ? new FirestoreStore() : new MemoryStore();
  }
  return instance;
}

/** Override the store (used by tests to inject a fresh MemoryStore). */
export function setStore(store: Store): void {
  instance = store;
}

export type { Store } from "./Store";
