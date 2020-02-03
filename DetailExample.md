# Firebless examples - detail

- The `detail` method allows you to read one record from the collection

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

## Detail by ID
```typescript
const detailById = (id: string) => userRepository.detailById(id);
```

## Detail with exact match
```typescript
const detail = (params?: Partial<User>) => userRepository.detail(params);
```

## Detail with custom query
```typescript
const detail = () => {
    const query = userRepository.getCollection().orderBy('name');
    return userRepository.detail({}, query);
};
```

## Detail with exact match & custom query
```typescript
const detail = () => {
    const query = userRepository.getCollection().orderBy('name');
    return userRepository.detail({ age: 15 }, query);
};
```

## Custom detail method
```typescript
const userRepository = (defaultRepo => {
    const detail = (data: Partial<User>) => {
        // your custom logic
        const query = userRepository.getCollection().orderBy('name');
        return defaultRepo.list(data, query);
    };
    const detailById = (name: string) => {
        // your custom logic
        return detail({ name });
    };
    return {
        ...defaultRepo,
        detail,
        detailById,
    };
})(defaultFirestoreRepository.bind<User>(firestore.collection('users')));
```

- You can also read more about helper functions in [API documentation](https://stefan-prokop-cz.github.io/firebless/)
