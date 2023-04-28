import { firestoreInstance } from '../firebase';
import { CollectionReference, DocumentSnapshot, QuerySnapshot, WriteResult } from '@google-cloud/firestore';

export class Repository<T> {
  private collectionRef: CollectionReference<T>;

  constructor(public collectionName: string) {
    this.collectionRef = firestoreInstance.collection(collectionName) as CollectionReference<T>;
  }

  find(id: string): Promise<DocumentSnapshot<T>> {
    return this.collectionRef.doc(id).get();
  }

  all(): Promise<QuerySnapshot<T>> {
    return this.collectionRef.get();
  }

  async create(data: any): Promise<DocumentSnapshot<T>> {
    const docRef = await this.collectionRef.add(data);
    return docRef.get();
  }

  async update(id: string, data: any): Promise<void> {
    await this.collectionRef.doc(id).update(data);
  }

  async updateAndFind(id: string, data: any): Promise<DocumentSnapshot<T>> {
    await this.update(id, data);
    return this.find(id);
  }

  delete(id: string): Promise<WriteResult> {
    return this.collectionRef.doc(id).delete();
  }
}
