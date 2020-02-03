# Firebless examples - create

- The `create` method allows you to add new record to the collection

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
const createUser = (): Promise<User> => {
    const user = { name: 'Stefan', surname: 'Prokop', age: 15 };
    return userRepository.create(user); // { id: randomId, name: 'Stefan', surname: 'Prokop', age: 15 }
}
```

## Custom ID
```typescript
const createUser = (): Promise<User> => {
    const user = { id: 'customId', name: 'Stefan', surname: 'Prokop', age: 15 };
    return userRepository.create(user); // { id: customId, name: 'Stefan', surname: 'Prokop', age: 15 }
}
```

## Custom create method
```typescript
const userRepository = (defaultRepo => {
    const create = (data: Partial<User>) => {
        // your custom logic
        return defaultRepo.create(data);
    };
    return {
        ...defaultRepo,
        create,
    };
})(defaultFirestoreRepository.bind<User>(firestore.collection('users')));
```

- You can also read more about helper functions in [API documentation](https://stefan-prokop-cz.github.io/firebless/)
