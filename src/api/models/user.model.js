import { client } from './database.js';
import EmailValidator from 'email-validator';

class User {
    #uid;
    #email;
    #password;
    #passwordHash;
    #nickname;

    constructor(params, skipValidate = false) {
        this.#uid = params.uid;
        this.#email = params.email;
        this.#password = params.password;
        this.#passwordHash = params.passwordHash;
        this.#nickname = params.nickname;
        if (!skipValidate) {
            this.validate();
        }
    }

    validate() {
        if (!this.validateEmail()) {
            throw new Error('Wrong email');
        }
        if (!this.validatePassword()) {
            throw new Error('Password need at least one digit, lowercase letter and uppercase letter, min 8 letters');
        }
        if (!this.validateNickname()) {
            throw new Error('Nickname contains only lowercase, min 8 letters');
        }
    }

    validateEmail() {
        return EmailValidator.validate(this.#email);
    }

    validatePassword() {
        return this.#password.length >= 8 &&
            /[A-Z]+/.test(this.#password) &&
            /[a-z]+/.test(this.#password) &&
            /\d+/.test(this.#password);
    }

    validateNickname() {
        return this.#nickname.length >= 8 &&
            /[a-z]+/.test(this.#password);
    }

    get uid() {
        return this.#uid;
    }

    set uid(value) {
        this.#uid = value;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        this.#email = value;
        this.validateEmail();
    }

    get password() {
        return this.#password;
    }

    set password(value) {
        this.#password = value;
        this.validatePassword();
    }

    get nickname() {
        return this.#nickname;
    }

    set nickname(value) {
        this.#nickname = value;
        this.validateNickname();
    }

    get passwordHash() {
        return this.#passwordHash;
    }
}

const userModel = {
    async getUsers(uids) {
        const results = await client.query(
            'SELECT * FROM public."user" WHERE uid = ANY ($1)',
            [uids],
        );
        return results.rows.reduce((acc, item) => {
            acc.push(new User({
                uid: item.uid,
                email: item.email,
                passwordHash: item.password,
                nickname: item.nickname,
            }, true));
            return acc;
        }, []);
    },

    async getUser(uid) {
        const users = await this.getUsers([uid]);
        if (0 === users.length) {
            throw new Error('User not exist');
        }
        return users[0];
    },

    async getUserByEmailAndPassword(email, password) {
        const results = await client.query(
            'SELECT * FROM public."user" WHERE email = $1 AND password = md5($2)',
            [email, password],
        );
        if (0 === results.rows.length) {
            throw new Error('Incorrect auth data');
        }
        const item = results.rows[0];
        return new User({
            uid: item.uid,
            email: item.email,
            passwordHash: item.password,
            nickname: item.nickname,
        }, true);
    },

    async createUser(user) {
        const result = await client.query(
            'INSERT INTO public."user" (email, password, nickname) VALUES ($1, md5($2), $3) RETURNING uid',
            [user.email, user.password, user.nickname]
        ).catch(() => {
            throw new Error('Duplicate user');
        });
        return await this.getUser(result.rows[0].uid);
    },

    async deleteUser(uid) {
        await client.query(
            'DELETE FROM public."user" WHERE uid = $1',
            [uid]
        );
        return uid;
    },

    async updateUser(user) {
        if (null !== user.password) {
            await client.query(
                'UPDATE public."user" SET email = $1, password = md5($2), nickname = $3 WHERE uid = $4',
                [user.email, user.password, user.nickname, user.uid],
            ).catch(() => {
                throw new Error('Duplicate user');
            });
        } else {
            await client.query(
                'UPDATE  public."user" SET email = $1, nickname = $3 WHERE uid = $4',
                [user.email, user.nickname, user.uid],
            ).catch(() => {
                throw new Error('Duplicate user');
            });
        }
        return await this.getUser(user.uid);
    }
}

export { User, userModel }
