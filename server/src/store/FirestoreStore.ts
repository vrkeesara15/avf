import { randomUUID } from "node:crypto";
import {
  initializeApp,
  applicationDefault,
  getApps,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { config } from "../config";
import type { CollectionName } from "../types";
import type { QueryOp, Store, WithId } from "./Store";

/**
 * Firestore-backed store for production (GCP Cloud Run + Firestore).
 * Uses Application Default Credentials on Cloud Run, or the Firestore
 * emulator locally when FIRESTORE_EMULATOR_HOST is set.
 */
export class FirestoreStore implements Store {
  private db: Firestore;

  constructor() {
    if (getApps().length === 0) {
      initializeApp({
        projectId: config.gcp.projectId,
        // ADC works on Cloud Run; emulator ignores credentials.
        credential: config.gcp.firestoreEmulator
          ? undefined
          : applicationDefault(),
      });
    }
    this.db = getFirestore();
  }

  private col(collection: CollectionName) {
    return this.db.collection(collection);
  }

  async list<T extends WithId>(
    collection: CollectionName,
    opts?: { orderBy?: keyof T; direction?: "asc" | "desc" }
  ): Promise<T[]> {
    let q: FirebaseFirestore.Query = this.col(collection);
    if (opts?.orderBy) {
      q = q.orderBy(String(opts.orderBy), opts.direction ?? "asc");
    }
    const snap = await q.get();
    return snap.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as T[];
  }

  async get<T extends WithId>(
    collection: CollectionName,
    id: string
  ): Promise<T | null> {
    const doc = await this.col(collection).doc(id).get();
    return doc.exists ? ({ ...(doc.data() as object), id: doc.id } as T) : null;
  }

  async create<T extends WithId>(
    collection: CollectionName,
    data: Omit<T, "id"> & { id?: string }
  ): Promise<T> {
    const id = data.id ?? randomUUID();
    const { id: _omit, ...rest } = data as { id?: string } & Record<
      string,
      unknown
    >;
    await this.col(collection).doc(id).set(rest);
    return { ...(rest as object), id } as T;
  }

  async update<T extends WithId>(
    collection: CollectionName,
    id: string,
    patch: Partial<T>
  ): Promise<T | null> {
    const ref = this.col(collection).doc(id);
    const existing = await ref.get();
    if (!existing.exists) return null;
    const { id: _omit, ...rest } = patch as { id?: string } & Record<
      string,
      unknown
    >;
    await ref.set(rest, { merge: true });
    const updated = await ref.get();
    return { ...(updated.data() as object), id } as T;
  }

  async remove(collection: CollectionName, id: string): Promise<boolean> {
    const ref = this.col(collection).doc(id);
    const existing = await ref.get();
    if (!existing.exists) return false;
    await ref.delete();
    return true;
  }

  async query<T extends WithId>(
    collection: CollectionName,
    field: string,
    op: QueryOp,
    value: unknown
  ): Promise<T[]> {
    const snap = await this.col(collection)
      .where(field, op, value as never)
      .get();
    return snap.docs.map((d) => ({ ...(d.data() as object), id: d.id })) as T[];
  }

  async clear(collection: CollectionName): Promise<void> {
    const snap = await this.col(collection).get();
    const batch = this.db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}
