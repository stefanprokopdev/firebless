<div align="center">


# Firebless
[![Build Status](https://img.shields.io/travis/com/stefan-prokop-cz/firebless/master.svg?style=flat-square)](https://travis-ci.com/stefan-prokop-cz/firebless)
[![Npm](https://img.shields.io/npm/v/firebless.svg?style=flat-square)](https://www.npmjs.com/package/firebless)
[![Coverage](https://img.shields.io/codeclimate/coverage/stefan-prokop-cz/firebless.svg?style=flat-square)](https://codeclimate.com/github/stefan-prokop-cz/firebless)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/stefan-prokop-cz/firebless.svg?style=flat-square)](https://codeclimate.com/github/stefan-prokop-cz/firebless)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/stefan-prokop-cz/firebless.svg?style=flat-square)](https://snyk.io/test/github/stefan-prokop-cz/firebless?targetFile=package.json)
[![License](https://img.shields.io/github/license/stefan-prokop-cz/firebless.svg?style=flat-square)](https://github.com/stefan-prokop-cz/firebless/blob/master/LICENSE)

Firebless allows you to create repositories from [Firestore](https://cloud.google.com/firestore/) collections. It providing basic methods such as `detail`, `list`, `create`, `update`, `delete` and more.

</div>

## Install

```
npm i firebless
```

## Basic usage
```typescript
import { defaultFirestoreRepository, initFirestore } from 'firebless';

const db = initFirestore({/* todo */}); // or use custom instance

interface User {
  id?: string;
  name: string;
}
const userRepository = defaultFirestoreRepository.bind<User>(db.collection('users'));
// userRepository.detailById('123')
// userRepository.list({ name: 'Test' })
// ...
```

## Custom repository
```typescript
import { defaultFirestoreRepository, initFirestore } from 'firebless';

const db = initFirestore({/* todo */}); // or use custom instance

interface User {
  id?: string;
  name: string;
}
const userRepository = (defaultRepo => {
    const list = () => {
        // custom logic
        return defaultRepo.list({}, defaultRepo.getCollection().orderBy('name', 'asc'));
    };
    return {
        ...defaultRepo,
        list,
    };
})(defaultFirestoreRepository.bind<User>(db.collection('users')));
```

## Examples
- [Create](./CreateExample.md)
- [List](./ListExample.md)
- [Detail](./DetailExample.md)
- [Update](./UpdateExample.md)
- [Delete](./DeleteExample.md)
- [Bulk](./BulkExample.md)

- [API documentation](https://stefan-prokop-cz.github.io/firebless/)

## Debug

You need to set the `NODE_DEBUG` variable to the `firebless`.

## Testing

```
npm t

npm run test:coverage
```

## License

This project is licensed under [MIT](./LICENSE).
