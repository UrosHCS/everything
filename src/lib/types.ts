/**
 * Firebase document doesn't have an id as a part of its data() method.
 * We need to add it manually when we get the data from the database.
 */
export type DocWithId<T> = T & { id: string };
