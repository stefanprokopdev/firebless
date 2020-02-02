import util from 'util';
import CollectionReference = FirebaseFirestore.CollectionReference;
import DocumentSnapshot = FirebaseFirestore.DocumentSnapshot;
import SetOptions = FirebaseFirestore.SetOptions;
import Query = FirebaseFirestore.Query;
import Precondition = FirebaseFirestore.Precondition;

const logger = util.debuglog('firebless');

export interface Pagination {
    limit?: number;
    offset?: number;
}

export const bulkCreate = async <T extends { id?: string }>(collection: CollectionReference, data?: Partial<T>[]) => {
    const batch = collection.firestore.batch();
    logger(`[bulkCreate]: initialized on collection #${collection.id} in path ${collection.path}`, { data, dataLength: data?.length });
    (data || []).forEach(d => {
        const doc = getDocument<T>(collection, d);
        batch.create(doc, data);
    });
    const result = await batch.commit();
    logger('[bulkCreate]: successfully completed', { writeTimes: result.map(r => r.writeTime.toDate()) });
    return result;
};

export const bulkUpdate = async <T extends { id?: string }>(collection: CollectionReference, data?: Partial<T>[], options?: SetOptions) => {
    const batch = collection.firestore.batch();
    logger(`[bulkUpdate]: initialized on collection #${collection.id} in path ${collection.path}`, { data, options, dataLength: data?.length });
    (data || []).forEach(d => {
        const doc = getDocument(collection, d);
        batch.set(doc, data, options);
    });
    const result = await batch.commit();
    logger('[bulkUpdate]: successfully completed', { writeTimes: result.map(r => r.writeTime.toDate()) });
    return result;
};

export const bulkDelete = async (collection: CollectionReference, ids?: string[], precondition?: Precondition) => {
    const batch = collection.firestore.batch();
    logger(`[bulkCreate]: initialized on collection #${collection.id} in path ${collection.path}`, { ids, precondition });
    (ids || []).forEach(id => batch.delete(collection.doc(id), precondition));
    const result = await batch.commit();
    logger('[bulkDelete]: successfully completed', { writeTimes: result.map(r => r.writeTime.toDate()) });
    return result;
};

export const create = async <T extends { id?: string }>(collection: CollectionReference, data?: Partial<T>) => {
    logger(`[create]: trying to create doc in collection #${collection.id} in path ${collection.path}`, { data });
    if (!data) {
        logger('[create]: empty data', { data });
        return null;
    }
    const doc = await collection.add(data);
    logger(`[create]: document #${doc.id} successfully created in path ${doc.path}`);
    return doc.get();
};

export const list = async <T extends { id?: string }>(collection: CollectionReference, filters?: Partial<T> & Pagination, options?: Query) => {
    logger(`[list]: initialized on collection #${collection.id} in path ${collection.path}`, { filters, options });
    const result = await applyFilters(options || collection, filters).get();
    logger(`[list]: ${result.size} records found`);
    if (result.empty) {
        return [];
    }
    return result.docs;
};

export const remove = async <T extends { id?: string }>(collection: CollectionReference, params?: Partial<T>, options?: Query, precondition?: Precondition) => {
    logger(`[remove]: initialized on collection #${collection.id} in path ${collection.path}`, { params, options, precondition });
    const documents = await list<T>(collection, params, options);
    const batch = collection.firestore.batch();
    logger('[remove]: batch successfully initialized');
    documents.forEach(doc => batch.delete(doc.ref, precondition));
    const result = await batch.commit();
    logger('[remove]: batch successfully completed', { writeTimes: result.map(r => r.writeTime.toDate()) });
    return result;
};

export const removeById = async (collection: CollectionReference, id: string, precondition?: Precondition) => {
    logger(`[removeById]: trying to remove doc ${id} from collection #${collection.id} in path ${collection.path}`, { precondition });
    const result = await collection.doc(id).delete(precondition);
    logger(`[removeById]: successfully completed at ${result.writeTime.toDate()}`);
    return result;
};

export const detail = async <T extends { id?: string }>(collection: CollectionReference, params?: Partial<T>, options?: Query) => {
    logger(`[detail]: initialized on collection #${collection.id} in path ${collection.path}`, { params, options });
    const records = await list(collection, params, options);
    logger(`[detail]: ${records.length} records found`);
    return records.length <= 0 ? null : records[0];
};

export const detailById = async <T extends { id?: string }>(collection: CollectionReference, id: string) => {
    logger(`[detailById]: trying to find doc #${id} in collection #${collection.id} in path ${collection.path}`);
    const record = await collection.doc(id).get();
    logger(`[detailById]: #${record.id} found`);
    return record.exists ? record : null;
};

export const update = async <T extends { id?: string }>(collection: CollectionReference, params?: Partial<T>, data?: Partial<T>, options?: SetOptions) => {
    logger(`[update]: initialized on collection #${collection.id} in path ${collection.path}`, { params, data, options });
    const documents = await list(collection, params);
    logger(`[update]: ${documents.length} documents found`);
    const batch = collection.firestore.batch();
    logger('[update]: batch successfully initialized');
    documents.forEach(doc => batch.set(doc.ref, data, options));
    const result = await batch.commit();
    logger('[update]: batch successfully completed', { writeTimes: result.map(r => r.writeTime.toDate()) });
    return result;
};

export const updateById = async <T extends { id?: string }>(collection: CollectionReference, id: string, data?: Partial<T>, options?: SetOptions) => {
    logger(`[updateById]: trying to update doc ${id} in collection #${collection.id} in path ${collection.path}`, { data, options });
    if (!data) {
        logger('[updateById]: empty data', { data });
        return null;
    }
    await collection.doc(id).set(data, options);
    logger(`[updateById]: document #${id} successfully updated`);
    return detailById(collection, id);
};

export const upsert = async <T extends { id?: string }>(collection: CollectionReference, data?: Partial<T>, options?: SetOptions) => {
    logger(`[upsert]: initialized on collection #${collection.id} in path ${collection.path}`, { data, options });
    if (!data) {
        logger('[upsert]: empty data', { data });
        return null;
    }
    const doc = getDocument(collection, data);
    logger(`[upsert]: document ${doc.id} initialized`);
    await doc.set(data, options);
    logger(`[upsert]: document ${doc.id} successfully created / updated`);
    return doc.get();
};

export const getDocument = <T extends { id?: string }>(collection: CollectionReference, data?: Partial<T>) => {
    if (data && data.id) {
        return collection.doc(data.id!);
    }
    return collection.doc();
};

export const getModelData = <T>(record?: DocumentSnapshot | null): T | null => {
    if (!record || !record.exists) {
        return null;
    }
    return {
        ...record.data(),
        id: record.id,
        createdAt: record.createTime?.toDate(),
        updatedAt: record.updateTime?.toDate(),
    } as any as T;
};

export const applyFilters = <T extends object>(query: Query, filters?: Partial<T>) => {
    Object.keys(filters || []).forEach(field => {
        if (['limit', 'offset'].includes(field)) {
            return;
        }
        // @ts-ignore
        query = query.where(field, '==', filters[field]);
    });
    return applyPagination(query, filters);
};

export const applyPagination = (query: Query, params?: Pagination) => {
    if (params?.offset) {
        query = query.offset(params.offset);
    }
    if (params?.limit) {
        query = query.limit(params.limit);
    }
    return query;
};
