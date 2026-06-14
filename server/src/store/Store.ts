import type { CollectionName } from "../types";

export interface WithId {
  id: string;
}

export type QueryOp = "==" | ">=" | "<=";

export interface Store {
  /** Return all documents in a collection (optionally sorted by a field). */
  list<T extends WithId>(
    collection: CollectionName,
    opts?: { orderBy?: keyof T; direction?: "asc" | "desc" }
  ): Promise<T[]>;

  /** Fetch one document by id, or null. */
  get<T extends WithId>(collection: CollectionName, id: string): Promise<T | null>;

  /** Create a document. Generates an id if one is not supplied. */
  create<T extends WithId>(
    collection: CollectionName,
    data: Omit<T, "id"> & { id?: string }
  ): Promise<T>;

  /** Patch a document. Returns the updated doc, or null if missing. */
  update<T extends WithId>(
    collection: CollectionName,
    id: string,
    patch: Partial<T>
  ): Promise<T | null>;

  /** Delete a document. Returns true if it existed. */
  remove(collection: CollectionName, id: string): Promise<boolean>;

  /** Simple single-field query. */
  query<T extends WithId>(
    collection: CollectionName,
    field: string,
    op: QueryOp,
    value: unknown
  ): Promise<T[]>;

  /** Test/seed helper — wipe a collection. */
  clear(collection: CollectionName): Promise<void>;
}
