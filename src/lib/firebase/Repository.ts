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
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

export class Repository<T> {
  private ref: CollectionReference<T>;

  constructor(public collectionName: string) {
    this.ref = collection(db, collectionName) as CollectionReference<T>;
  }

  getById(id: string): Promise<DocumentSnapshot<T>> {
    return getDoc(this.doc(id));
  }

  getAll(): Promise<QuerySnapshot<T>> {
    return getDocs(this.ref);
  }

  getWhere(key: string, value: string): Promise<QuerySnapshot<T>> {
    return getDocs(query(this.ref, where(key, '==', value)));
  }

  async findAll(): Promise<T[]> {
    const snapshot = await this.getAll();
    return snapshot.docs.map(doc => doc.data());
  }

  async findById(id: string): Promise<T | undefined> {
    const snapshot = await this.getById(id);
    return snapshot.data();
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
