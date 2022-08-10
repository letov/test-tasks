import { expect, test, beforeAll, afterAll } from 'vitest';
import { User, userModel } from '../src/api/models/user.model.js';
import { client } from '../src/api/models/database.js';

const testNickname = 'testnickname';

const removeTestingUser = async () => {
    await client.query(
        'DELETE FROM public."user" WHERE nickname = $1',
        [testNickname],
    );
}

beforeAll(async () => {
    await removeTestingUser();
});

afterAll(async () => {
    await removeTestingUser();
})

test('Test user model', async () => {
    let user = new User({
        uid: null,
        email: 'mail@mail.com',
        password: 'AAAaaa111',
        nickname: testNickname,
    });
    user = await userModel.createUser(user);
    const originalHash = user.passwordHash;
    expect(originalHash).not.toBeNull();
    const users = await userModel.getUsers([user.uid]);
    expect(users.length).greaterThan(0);
    try {
        user.password = 'wrong-password';
    } catch (error) {
        expect(error).not.toBeNull();
    }
    user.password = 'bbAAA111';
    user = await userModel.updateUser(user);
    expect(originalHash).not.toBe(user.passwordHash);
    const _user = await userModel.getUser(user.uid);
    expect(_user.nickname).toBe(user.nickname);
    userModel.deleteUser(user.uid);
});



