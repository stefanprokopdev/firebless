# Firebless examples - update

- The `update` method allows you to update data in the collection

## Prerequisites
```typescript
import { defaultFirestoreRepository, initFirestore } from "firebless";

interface User {
    id?: string;
    name: string;
    surname: string;
    age: number;
}

const firestore = initFirestore({});
const userRepository = defaultFirestoreRepository.bind<User>(firestore.collection('users'));
```

## Basic usage
```typescript
const update = () => userRepository.update({ name: 'Stefan' }, { surname: 'Prokop' });
const updateById = (id: string) => userRepository.updateById(id, { surname: 'Prokop' });
```

## Update by ID
```typescript
const updateById = (id: string) => userRepository.updateById(id, { name: 'Stefan' });
```

## Update by ID with options
```typescript
const options = { merge: true }; // SetOptions
const updateById = (id: string) => userRepository.updateById(id, { name: 'Stefan' }, options);
```

## Update with options
```typescript
const update = () => userRepository.update({}, { name: 'Stefan' }, { merge: true });
```

## Upsert
- The `upsert` method allows you to create or update if record already exist
- It trying to find record by ID

```typescript
const user = { name: 'Stefan', surname: 'Prokop', age: 15 };

const upsert = () => userRepository.upsert(user);
const upsertWithOptions = () => userRepository.upsert(user, { merge: true });
```

## Custom update method
```typescript
const userRepository = (defaultRepo => {
    const update = (data: Partial<User>) => {
        // your custom logic
        return defaultRepo.update({}, data);
    };
    const updateById = (id: string, data: Partial<User>) => {
        // your custom logic
        return defaultRepo.updateById(id, data, { merge: true });
    };
    return {
        ...defaultRepo,
        update,
        updateById,
    };
})(defaultFirestoreRepository.bind<User>(firestore.collection('users')));
```

- You can also read more about helper functions in [API documentation](https://stefan-prokop-cz.github.io/firebless/)
