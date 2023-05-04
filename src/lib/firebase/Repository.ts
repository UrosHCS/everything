import { db } from '.';
import {
  CollectionReference,
  DocumentSnapshot,
  QuerySnapshot,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export class Repository<T> {
  private ref: CollectionReference<T>;

  constructor(public collectionName: string) {
    this.ref = collection(db, collectionName) as CollectionReference<T>;
  }

  get(id: string): Promise<DocumentSnapshot<T>> {
    return getDoc(this.doc(id));
  }

  all(): Promise<QuerySnapshot<T>> {
    return getDocs(this.ref);
  }

  async create(data: any): Promise<DocumentSnapshot<T>> {
    const docRef = doc(this.ref);
    await setDoc(docRef, data);
    return getDoc(docRef);
  }

  async update(id: string, data: any): Promise<void> {
    const docRef = this.doc(id);
    return updateDoc(docRef, data);
  }

  async updateAndGet(id: string, data: any): Promise<DocumentSnapshot<T>> {
    const docRef = this.doc(id);
    await updateDoc(docRef, data);
    return getDoc(docRef);
  }

  async delete(id: string): Promise<void> {
    const docRef = this.doc(id);
    await deleteDoc(docRef);
  }

  private doc(id: string) {
    return doc(this.ref, id);
  }
}
