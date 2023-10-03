import { firestoreInstance } from '../firebase';
import { CollectionReference, DocumentSnapshot, QuerySnapshot, WriteResult } from '@google-cloud/firestore';
import { DocWithId } from '@lib/types';

export class Repository<T> {
  private collectionRef: CollectionReference<T>;

  constructor(public collectionName: string) {
    this.collectionRef = firestoreInstance.collection(collectionName) as CollectionReference<T>;
  }

  // Find methods that return just the data, with added id field

  async findAll(): Promise<DocWithId<T>[]> {
    const snapshot = await this.getAll();
    return snapshot.docs.map(doc => this.docToData(doc)!);
  }

  async findById(id: string): Promise<DocWithId<T> | undefined> {
    return this.docToData(await this.getById(id));
  }

  async findOneBy(key: string, value: string): Promise<DocWithId<T> | undefined> {
    const snapshot = await this.collectionRef.where(key, '==', value).limit(1).get();
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
    return this.collectionRef.doc(id).get();
  }

  private getAll(): Promise<QuerySnapshot<T>> {
    return this.collectionRef.get();
  }

  // Mutations

  async create(data: T): Promise<DocumentSnapshot<T>> {
    const docRef = await this.collectionRef.add(data);
    return docRef.get();
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    // @ts-expect-error firestore type is anoying
    await this.collectionRef.doc(id).update(data);
  }

  async updateAndGet(id: string, data: Partial<T>): Promise<DocumentSnapshot<T>> {
    await this.update(id, data);
    return this.getById(id);
  }

  delete(id: string): Promise<WriteResult> {
    return this.collectionRef.doc(id).delete();
  }
}
