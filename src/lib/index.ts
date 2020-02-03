import * as defaultFirestoreRepository from './firestoreRepository';
export { default as initFirestore } from './initFirestore';
export {
    applyFilters,
    bulkCreate,
    bulkDelete,
    bulkUpdate,
    create,
    detail,
    detailById,
    getDocument,
    getModelData,
    list,
    remove,
    removeById,
    update,
    updateById,
    upsert,
} from './queries';
export { defaultFirestoreRepository };
