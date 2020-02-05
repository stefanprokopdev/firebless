import { Firestore } from '@google-cloud/firestore';
// @ts-ignore
import MockFirebase from 'mock-cloud-firestore';
import { defaultFirestoreRepository, initFirestore } from '../lib/index';
import { idMatcher } from './matchers';

const fixtures = {
    __collection__: {
        users: {
            __doc__: {
                user_a: {
                    age: 15,
                    name: 'user',
                    surname: 'a',
                    birthDate: new Date('2019-01-01'),
                },
                user_b: {
                    age: 30,
                    name: 'user',
                    surname: 'b',
                    birthDate: new Date('2018-01-01'),
                },
            },
        },
    },
};

const firebase = new MockFirebase(fixtures);
const firestore = firebase.firestore();

interface User {
    id?: string;
    name: string;
    surname: string;
    age: number;
    birthDate: Date;
}

const userRepository = defaultFirestoreRepository.bind<User>(firestore.collection('users'));

describe('Firestore repository', () => {
    it('Initialization', () => {
        const db = initFirestore({});
        expect(db).toBeInstanceOf(Firestore);
    });
    it('List', async () => {
        const users = await userRepository.list();
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(2);
        expect(users[0]).toMatchSnapshot();
    });
    it('List with filters', async () => {
        const users = await userRepository.list({ age: 15 });
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(1);
        expect(users[0]).toMatchSnapshot();
    });
    it('List with options', async () => {
        const users = await userRepository.list({}, userRepository.getCollection().where('age', '>=', 16));
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(1);
        const { age } = users[0];
        expect(age).toBe(30);
    });
    it('Empty list', async () => {
        const users = await userRepository.list({ age: 20 },
            userRepository.getCollection().where('surname', '==', 'a'));
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(0);
    });
    it('List with ordering', async () => {
        const users = await userRepository.list({}, userRepository.getCollection().orderBy('age', 'desc'));
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(2);
        const u1 = users[0];
        const u2 = users[1];
        expect(u1.age).toBeGreaterThan(u2.age);
    });
    it('List with filters & ordering', async () => {
        const users = await userRepository.list({ name: 'user' }, userRepository.getCollection().orderBy('age', 'asc'));
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(2);
        const u1 = users[0];
        const u2 = users[1];
        expect(u1.age).toBeLessThan(u2.age);
    });
    it('Detail with filters & ordering', async () => {
        await userRepository.create({ age: 100, id: 'user_l', surname: 'l', name: 'user' });
        const first = await userRepository.detail({ name: 'user' }, userRepository.getCollection().orderBy('age', 'desc'));
        const second = await userRepository.detail({ name: 'user' }, userRepository.getCollection().orderBy('age', 'asc'));
        expect(first?.age).toBeGreaterThan(second!.age);
    });
    it('Create', async () => {
        const user: User = {
            age: 10,
            birthDate: new Date('2020-01-01'),
            name: 'Test',
            surname: 'Testovic',
        };
        const createdUser = await userRepository.create(user);
        expect(createdUser).toMatchSnapshot(idMatcher);
        const users = await userRepository.list();
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(4);
    });
    it('Update by ID', async () => {
        const user = await userRepository.detail({ surname: 'a' });
        expect(!user).toBe(false);
        const updatedUser = await userRepository.updateById(user!.id!, { surname: 'c' });
        expect(updatedUser.surname).toBe('c');
        const u = await userRepository.detail({ surname: 'a' });
        expect(u).toBeNull();
        expect(updatedUser).toMatchSnapshot();
    });
    it('Upsert', async () => {
        const data: User = {
            name: 'Stefan',
            surname: 'Prokop',
            age: 1,
            birthDate: new Date('2020-01-01'),
            id: '123',
        };
        const user = await userRepository.upsert(data);
        const updatedUser = await userRepository.upsert({ ...data, surname: 'Stefan' });
        expect(user.surname === updatedUser.surname).toBe(false);
        expect(user.id === updatedUser.id).toBe(true);
        expect(updatedUser).toMatchSnapshot();
    });
    it('Detail by ID', async () => {
        const user = await userRepository.detailById('123');
        expect(user).toMatchSnapshot();
    });
    it('Empty detail', async () => {
        const user = await userRepository.detailById('abcdefg');
        expect(user).toBeNull();
    });
    it('Detail with filters', async () => {
        const user = await userRepository.detail({ name: 'user' });
        expect(user).toMatchSnapshot();
    });
    it('Delete by ID', async () => {
        try {
            await userRepository.deleteById('123');
        } catch (_) {}
        const user = await userRepository.detailById('123');
        expect(user).toBeNull();
    });
    it.skip('Bulk create', async () => {
        const prevUsers = await userRepository.list();
        await userRepository.bulkCreate([
            { age: 5, name: 'Philip', surname: 'Palencia' },
            { age: 11, name: 'Dwayne', surname: 'Carter' },
        ]);
        const users = await userRepository.list();
        expect(Array.isArray(prevUsers)).toBe(true);
        expect(Array.isArray(users)).toBe(true);
        expect(prevUsers.length).toBeLessThan(users.length);
        expect(users.length - prevUsers.length).toBe(2);
    });
    it('Bulk update', async () => {
        const prevUsers = await userRepository.list();
        await userRepository.bulkUpdate(prevUsers.map(u => ({ id: u.id, name: 'Bulk', surname: 'Update' })));
        const users = await userRepository.list();
        expect(Array.isArray(prevUsers)).toBe(true);
        expect(Array.isArray(users)).toBe(true);
        expect(prevUsers.length).toEqual(prevUsers.length);
        users.forEach(user => {
            expect(user.name).toEqual('Bulk');
            expect(user.surname).toEqual('Update');
        });
    });
    it('Bulk delete', async () => {
        const prevUsers = await userRepository.list();
        await userRepository.bulkDelete(prevUsers.filter(u => u.id).map(u => u.id) as string[]);
        const users = await userRepository.list();
        expect(Array.isArray(prevUsers)).toBe(true);
        expect(Array.isArray(users)).toBe(true);
        expect(prevUsers.length).toBeGreaterThan(users.length);
        expect(users.length).toEqual(0);
    });
});
