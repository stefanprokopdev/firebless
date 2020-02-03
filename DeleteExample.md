# Firebless examples - delete

- The `delete` method allows you to remove record from the collection

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
const remove = () => userRepository.delete({ name: 'Stefan' });
const deleteById = (id: string) => userRepository.deleteById(id);
```

## Delete with custom query
```typescript
const query = userRepository.getCollection().where('age', '>', 15);
const remove = () => userRepository.delete({}, query);
```

## Delete with exact match and custom query
```typescript
const query = userRepository.getCollection().where('age', '>', 15);
const remove = () => userRepository.delete({ name: 'Stefan' }, query);
```

## Custom delete method
```typescript
const userRepository = (defaultRepo => {
    const delete = () => {
        // your custom logic
        return defaultRepo.update({ name: 'Stefan' });
    };
    const deleteById = (id: string) => {
        // your custom logic
        return defaultRepo.deleteById(id);
    };
    return {
        ...defaultRepo,
        delete,
        deleteById,
    };
})(defaultFirestoreRepository.bind<User>(firestore.collection('users')));
```

- You can also read more about helper functions in [API documentation](https://stefan-prokop-cz.github.io/firebless/)
