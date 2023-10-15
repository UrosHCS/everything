import { FieldValue, firestoreInstance } from '../firebase';
import { CollectionReference, DocumentSnapshot, QuerySnapshot, WriteResult } from '@google-cloud/firestore';
import { DocWithId } from '@lib/types';

export class Repository<T> {
  public ref: CollectionReference<T>;

  constructor(public collectionName: string) {
    this.ref = firestoreInstance.collection(collectionName) as CollectionReference<T>;
  }

  // Find methods that return just the data, with added id field

  async findAll(): Promise<DocWithId<T>[]> {
    const snapshot = await this.getAll();
    return snapshot.docs.map(doc => this.docToData(doc)!);
  }

  async findById(id: string): Promise<DocWithId<T> | undefined> {
    return this.docToData(await this.getById(id));
  }

  async findOneWhere(where: Partial<DocWithId<T>>): Promise<DocWithId<T> | undefined> {
    const query = this.ref.limit(1);

    for (const [key, value] of Object.entries(where)) {
      query.where(key, '==', value);
    }

    const snapshot = await query.get();
    const first = snapshot.docs[0];

    if (!first) {
      return;
    }

    return this.docToData(first);
  }

  async findOneBy(key: string, value: string): Promise<DocWithId<T> | undefined> {
    const snapshot = await this.ref.where(key, '==', value).limit(1).get();
    const first = snapshot.docs[0];

    if (!first) {
      return;
    }

    return this.docToData(first);
  }

  private docToData(doc: DocumentSnapshot<T>): (T & { id: string }) | undefined {
    const data = doc.data();

    if (!data) {
      return undefined;
    }

    return { ...data, id: doc.id };
  }

  private getById(id: string): Promise<DocumentSnapshot<T>> {
    return this.ref.doc(id).get();
  }

  private getAll(): Promise<QuerySnapshot<T>> {
    return this.ref.get();
  }

  // Mutations

  async create(data: T): Promise<DocWithId<T>> {
    const docRef = await this.ref.add(data);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error('Document does not exist, even though it was just created!');
    }
    return this.docToData(doc)!;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    // @ts-expect-error firestore type is anoying
    await this.ref.doc(id).update(data);
  }

  async addToArray<K extends keyof T>(
    id: string,
    field: K,
    data: T[K] extends Array<infer E> ? E : never,
  ): Promise<void> {
    // @ts-expect-error firestore type is anoying
    await this.ref.doc(id).update({
      [field]: FieldValue.arrayUnion(data),
    });
  }

  async updateAndGet(id: string, data: Partial<T>): Promise<DocumentSnapshot<T>> {
    await this.update(id, data);
    return this.getById(id);
  }

  delete(id: string): Promise<WriteResult> {
    return this.ref.doc(id).delete();
  }
}
