import { expect, test, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { configCommon }  from "../src/config.js";
import { client } from "../src/api/models/database.js";
import { User } from "../src/api/models/user.model.js";

const apiUrl = `${configCommon.host}:${configCommon.port}`;
const testNickname = 'testnickname';

const seedUserData = {
    "nickname": 'nickname1',
    "password": 'pass1',
};

const removeTestingUser = async () => {
    await client.query(
        'DELETE FROM public."user" WHERE nickname LIKE $1',
        [`${testNickname}%`],
    );
}

const getSeedUser = async () => {
    const results = await client.query(
        'SELECT * FROM public."user" WHERE nickname = $1',
        [seedUserData.nickname],
    );
    const item = results.rows[0];
    return new User({
        uid: item.uid,
        email: item.email,
        passwordHash: item.password,
        nickname: item.nickname,
    }, true);
}

const randString = () => {
    return Math.random().toString(32).replace(/\./g, '');
}

const validUserData = () => {
    return {
        "nickname": `${testNickname}${randString()}`,
        "password": "AAAAAbbbbbbb111111111",
        "email": `example${randString()}@exe.com`,
    }
}

const genValidUser = async () => {
    const request = supertest(apiUrl);
    const userData = validUserData();
    const loginData = {
        "password": userData.password,
        "email": userData.email,
    }
    const token = (await request.post('/signin').send(userData)).body.token;
    return { userData, loginData, token };
}

beforeAll(async () => {
    await removeTestingUser();
});

afterAll(async () => {
    await removeTestingUser();
})

test('POST /signin', async () => {
    const request = supertest(apiUrl);
    let json = { "nickname": `${testNickname}${randString()}` }
    let response = await request.post('/signin').send(json);
    expect(response.body.error).toBe('Incorrect schema');
    json.email = "example@exe.com";
    json.password = "example";
    response = await request.post('/signin').send(json);
    expect(response.body.error).toBe('Password need at least one digit, lowercase letter and uppercase letter, min 8 letters');
    json.password = "AAAAAbbbbbbb111111111";
    response = await request.post('/signin').send(validUserData());
    expect(response.body.token).not.toBeUndefined();
});

test('POST /login', async () => {
    const request = supertest(apiUrl);
    let json = { "email": `${testNickname}${randString()}`, "password": "SOMEWRONGPASSWORD" }
    let response = await request.post('/login').send(json);
    expect(response.body.error).toBe('Incorrect auth data');
    const user = await genValidUser();
    response = await request.post('/login').send(user.loginData);
    expect(response.body.token).not.toBeUndefined();
});

test('GET /user', async () => {
    const request = supertest(apiUrl);
    const user = await getSeedUser();
    let response = await request.post('/user').send();
    expect(response.body.error).toBe("jwt must be provided");
    let json = { "email": user.email, "password": seedUserData.password }
    response = await request.post('/login').send(json);
    expect(response.body.token).not.toBeUndefined();
    response = await request.post('/user').set('Authorization', 'bearer ' + response.body.token);
    expect(response.body.tags).not.toBeUndefined();
});

