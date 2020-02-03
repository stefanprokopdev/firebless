# Firebless examples - list

- The `list` method allows you to list data from the collection

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
const list = () => userRepository.list(); // [<User>, <User>], returns all the data
```

## List with exact match filters
```typescript
const user1 = {
    // ...
    age: 15,
    name: 'Test',
};
const user2 = {
    // ...
    age: 30,
    name: 'Stefan'
};
const list = () => userRepository.list({ age: 15 }); // [{ name: 'test', age: 15 }]
const list = () => userRepository.list({ age: 15, name: 'Stefan' }); // []
const list = () => userRepository.list({ age: 15, name: 'Test' }); // // [{ name: 'test', age: 15 }]
```

## List with custom query
```typescript
const user1 = {
    // ...
    age: 15,
    name: 'Test',
};
const user2 = {
    // ...
    age: 30,
    name: 'Stefan'
};
const query = userRepository.getCollection().where('age', '>', 10);
const list = () => userRepository.list({}, query); // [user1, user2]
```

## List with exact match & custom query
```typescript
const user1 = {
    // ...
    age: 10,
    name: 'Stefan',
};
const user2 = {
    // ...
    age: 30,
    name: 'Stefan'
};
const query = userRepository.getCollection().where('age', '>', 10);
const list = () => userRepository.list({ name: 'Stefan' }, query); // [user2]
```

## Custom list method
```typescript
const userRepository = (defaultRepo => {
    const list = (data: Partial<User>) => {
        // your custom logic
        const query = defaultRepo.getCollection().orderBy('name');
        return defaultRepo.list(data, query);
    };
    return {
        ...defaultRepo,
        list,
    };
})(defaultFirestoreRepository.bind<User>(firestore.collection('users')));
```

- You can also read more about helper functions in [API documentation](https://stefan-prokop-cz.github.io/firebless/)
