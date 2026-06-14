import { randomUUID } from "node:crypto";
import type { CollectionName } from "../types";
import type { QueryOp, Store, WithId } from "./Store";

/**
 * In-memory store used for local development without GCP and for the test
 * suite. Mirrors the semantics of the Firestore implementation.
 */
export class MemoryStore implements Store {
  private data = new Map<CollectionName, Map<string, WithId>>();

  private col(collection: CollectionName): Map<string, WithId> {
    let m = this.data.get(collection);
    if (!m) {
      m = new Map();
      this.data.set(collection, m);
    }
    return m;
  }

  async list<T extends WithId>(
    collection: CollectionName,
    opts?: { orderBy?: keyof T; direction?: "asc" | "desc" }
  ): Promise<T[]> {
    const items = [...this.col(collection).values()].map((d) =>
      structuredClone(d)
    ) as T[];
    if (opts?.orderBy) {
      const key = opts.orderBy;
      const dir = opts.direction === "desc" ? -1 : 1;
      items.sort((a, b) => {
        const av = a[key] as unknown as number | string;
        const bv = b[key] as unknown as number | string;
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }
    return items;
  }

  async get<T extends WithId>(
    collection: CollectionName,
    id: string
  ): Promise<T | null> {
    const doc = this.col(collection).get(id);
    return doc ? (structuredClone(doc) as T) : null;
  }

  async create<T extends WithId>(
    collection: CollectionName,
    data: Omit<T, "id"> & { id?: string }
  ): Promise<T> {
    const id = data.id ?? randomUUID();
    const doc = { ...data, id } as unknown as T;
    this.col(collection).set(id, structuredClone(doc));
    return doc;
  }

  async update<T extends WithId>(
    collection: CollectionName,
    id: string,
    patch: Partial<T>
  ): Promise<T | null> {
    const existing = this.col(collection).get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch, id } as T;
    this.col(collection).set(id, structuredClone(updated));
    return updated;
  }

  async remove(collection: CollectionName, id: string): Promise<boolean> {
    return this.col(collection).delete(id);
  }

  async query<T extends WithId>(
    collection: CollectionName,
    field: string,
    op: QueryOp,
    value: unknown
  ): Promise<T[]> {
    return [...this.col(collection).values()]
      .filter((d) => {
        const v = (d as unknown as Record<string, unknown>)[field];
        if (op === "==") return v === value;
        if (op === ">=") return (v as number) >= (value as number);
        if (op === "<=") return (v as number) <= (value as number);
        return false;
      })
      .map((d) => structuredClone(d)) as T[];
  }

  async clear(collection: CollectionName): Promise<void> {
    this.col(collection).clear();
  }
}
