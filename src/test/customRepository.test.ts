// @ts-ignore
import MockFirebase from 'mock-cloud-firestore';
import { defaultFirestoreRepository } from '../lib/index';

let fixtures = {
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
                    surname: 'a',
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

const userRepository = (defaultRepo => {
    const list = () => {
        const query = defaultRepo.getCollection().where('age', '>', 15);
        return defaultRepo.list({ surname: 'a' }, query);
    };
    return {
        ...defaultRepo,
        list,
    }
})(defaultFirestoreRepository.bind<User>(firestore.collection('users')));

describe('Custom repository', () => {
    it('List', async () => {
        const users = await userRepository.list();
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(1);
        expect(users[0]).toMatchSnapshot();
    });
    it('List 1', async () => {
        await userRepository.create({ age: 25, birthDate: new Date('2020-01-01'), name: 'name', surname: 'a' });
        const users = await userRepository.list();
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(2);
    });
});
