# Firebless examples - bulk / batch

- The `bulk` methods allows you to use [firestore batch](https://firebase.google.com/docs/firestore/manage-data/transactions)

## Prerequisites
```typescript
import { defaultFirestoreRepository, initFirestore } from "firebless";

interface User {
    id?: string;
    name: string;
    surname: string;
}

const firestore = initFirestore({});
const userRepository = defaultFirestoreRepository.bind<User>(firestore.collection('users'));
```

## Bulk create
```typescript
const data = [{ name: 'Stefan', surname: 'Prokop' }, { name: 'Test', surname: 'Testovic' }];
const bulkCreate = () => userRepository.bulkCreate(data);
```

## Bulk update
- It trying to find documents by ID
- If nothing found - new document is created (its like `bulkUpsert`)

```typescript
const data = [{ id: '1', name: 'Stefan', surname: 'Prokop' }, { id: '2', name: 'Test', surname: 'Testovic' }];
const bulkUpdate = () => userRepository.bulkUpdate(data);
const bulkUpdateWithOptions = () => userRepository.bulkUpdate(data, { merge: true });
```

## Bulk delete
```typescript
const ids = ['1', '2', '3'];
const bulkDelete = () => userRepository.bulkDelete(ids);
```

## Custom bulk method
```typescript
const userRepository = (defaultRepo => {
    const bulkDelete = () => {
        const batch = defaultRepo.getFirestore().batch();
        // your custom logic
        return batch.commit();
    };
    return {
        ...defaultRepo,
        bulkDelete,
    };
})(defaultFirestoreRepository.bind<User>(firestore.collection('users')));
```

- You can also read more about helper functions in [API documentation](https://stefan-prokop-cz.github.io/firebless/)
