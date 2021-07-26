import type { CollectionReference, SetOptions, Query, Precondition, FieldValue } from '@google-cloud/firestore';

import {
    bulkCreate,
    bulkDelete,
    bulkUpdate,
    create,
    detail,
    detailById,
    getModelData,
    list,
    remove,
    removeById,
    update,
    updateById,
    upsert,
} from './queries';

type AllowType<O extends { id?: any }, Allowed> = {
    [K in keyof Omit<O, 'id'>]: O[K] | Allowed;
} & Pick<O, 'id'>

export const bind = <Model extends { id?: string }>(collection: CollectionReference) => {
    return {
        bulkCreate: (data?: Partial<AllowType<Model, FieldValue>>[]) => bulkCreate<AllowType<Model, FieldValue>>(collection, data),
        bulkUpdate: (data?: Partial<AllowType<Model, FieldValue>>[], options?: SetOptions) =>
            bulkUpdate<AllowType<Model, FieldValue>>(collection, data, {
                merge: true,
                ...options,
            }),
        bulkDelete: (ids?: string[], precondition?: Precondition) => bulkDelete(collection, ids, precondition),
        create: async (data?: Partial<AllowType<Model, FieldValue>>) => {
            const doc = await create<AllowType<Model, FieldValue>>(collection, data);
            return getModelData(doc) as Model;
        },
        delete: (params?: Partial<Model>, options?: Query) => remove<Model>(collection, params, options),
        deleteById: (id: string, precondition?: Precondition) => removeById(collection, id, precondition),
        detail: async (params?: Partial<Model>, options?: Query) => {
            const doc = await detail<Model>(collection, params, options);
            return getModelData<Model>(doc);
        },
        detailById: async (id: string) => {
            const doc = await detailById(collection, id);
            return getModelData<Model>(doc);
        },
        getCollection: () => collection,
        getFirestore: () => collection.firestore,
        list: async (filters?: Partial<Model>, options?: Query) => {
            const docs = await list<Model>(collection, filters, options);
            return docs.map(doc => getModelData<Model>(doc)) as Model[];
        },
        update: (params?: Partial<AllowType<Model, FieldValue>>, data?: Partial<AllowType<Model, FieldValue>>, options?: SetOptions) =>
            update<AllowType<Model, FieldValue>>(collection, params, data, {
                merge: true,
                ...options,
            }),
        updateById: async (id: string, data?: Partial<AllowType<Model, FieldValue>>, options?: SetOptions) => {
            const doc = await updateById<AllowType<Model, FieldValue>>(collection, id, data, {
                merge: true,
                ...options,
            });
            return getModelData(doc) as Model;
        },
        upsert: async (data?: Partial<AllowType<Model, FieldValue>>, options?: SetOptions) => {
            const doc = await upsert<AllowType<Model, FieldValue>>(collection, data, {
                merge: true,
                ...options,
            });
            return getModelData(doc) as Model;
        },
    };
};
