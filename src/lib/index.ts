import * as defaultFirestoreRepository from './firestoreRepository';
export { default as initFirestore } from './initFirestore';
export {
    applyFilters,
    applyPagination,
    bulkCreate,
    bulkDelete,
    bulkUpdate,
    create,
    detail,
    detailById,
    getDocument,
    getModelData,
    list,
    Pagination,
    remove,
    removeById,
    update,
    updateById,
    upsert,
} from './queries';
export { defaultFirestoreRepository };
