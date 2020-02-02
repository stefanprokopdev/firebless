import CollectionReference = FirebaseFirestore.CollectionReference;
import SetOptions = FirebaseFirestore.SetOptions;
import Query = FirebaseFirestore.Query;
import Precondition = FirebaseFirestore.Precondition;
import {
    bulkCreate,
    bulkDelete,
    bulkUpdate,
    create,
    detail,
    detailById,
    getModelData,
    list,
    Pagination,
    remove,
    removeById,
    update,
    updateById,
    upsert,
} from './queries';

export const bind = <Model extends { id?: string }>(collection: CollectionReference) => {
    return {
        bulkCreate: (data?: Partial<Model>[]) => bulkCreate<Model>(collection, data),
        bulkUpdate: (data?: Partial<Model>[], options?: SetOptions) => bulkUpdate<Model>(collection, data, options),
        bulkDelete: (ids?: string[], precondition?: Precondition) => bulkDelete(collection, ids, precondition),
        create: async (data?: Partial<Model>) => {
            const doc = await create<Model>(collection, data);
            return getModelData(doc) as Model;
        },
        delete: (params?: Partial<Model>, options?: Query) => remove<Model>(collection, params, options),
        deleteById: (id: string, precondition?: Precondition) => removeById(collection, id, precondition),
        detail: async (params?: Partial<Model>, options?: Query) => {
            const doc = await detail<Model>(collection, params, options);
            return getModelData<Model>(doc);
        },
        detailById: async (id: string) => {
            const doc = await detailById<Model>(collection, id);
            return getModelData<Model>(doc);
        },
        getCollection: () => collection,
        getFirestore: () => collection.firestore,
        list: async (filters?: Partial<Model> & Pagination, options?: Query) => {
            const docs = await list<Model>(collection, filters, options);
            return docs.map(doc => getModelData<Model>(doc)) as Model[];
        },
        update: (params?: Partial<Model>, data?: Partial<Model>, options?: SetOptions) => update<Model>(collection, params, data, options),
        updateById: async (id: string, data?: Partial<Model>, options?: SetOptions) => {
            const doc = await updateById<Model>(collection, id, data, options);
            return getModelData(doc) as Model;
        },
        upsert: async (data?: Partial<Model>, options?: SetOptions) => {
            const doc = await upsert<Model>(collection, data, options);
            return getModelData(doc) as Model;
        },
    };
};
