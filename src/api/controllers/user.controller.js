import { Validator } from 'jsonschema';
import { User, userModel } from "../models/user.model.js";
import { tagModel } from "../models/tag.model.js";
import jwt from "jsonwebtoken";
import { configCommon }  from "../../config.js";

const validator = new Validator();

const userPostSchema = {
    "id": "/UserPostSchema",
    "type": "object",
    "properties": {
        "email": {"type": "string"},
        "password": {"type": "string"},
        "nickname": {"type": "string"}
    },
    "required": ["email", "password", "nickname"]
};

const userPutSchema = {
    "id": "/UserPutSchema",
    "type": "object",
    "properties": {
        "email": {"type": "string"},
        "password": {"type": "string"},
        "nickname": {"type": "string"}
    },
};

const loginPostSchema = {
    "id": "/LoginSchema",
    "type": "object",
    "properties": {
        "email": {"type": "string"},
        "password": {"type": "string"}
    },
    "required": ["email", "password"]
};

const userTagSchema = {
    "id": "/UserTagSchema",
    "type": "array",
    "items": {
        "type": "number"
    }
};

const validateUserSchema = (json, schema) => {
    if (!validator.validate(json, schema).valid) {
        throw new Error('Incorrect schema');
    }
}

const userController = {
    async singin(json) {
        validateUserSchema(json, userPostSchema);
        let user = new User(json);
        user = await userModel.createUser(user);
        return this.genToken(user.uid);
    },

    async login(json) {
        validateUserSchema(json, loginPostSchema);
        const user = await userModel.getUserByEmailAndPassword(json.email, json.password);
        return this.genToken(user.uid);
    },

    genToken(uid) {
        return jwt.sign({ uid: uid }, configCommon.secret, {
            expiresIn: configCommon.expires
        });
    },

    async getUser(uid) {
        const user = await userModel.getUser(uid);
        let tags = await tagModel.getTagsByCreator(uid);
        tags = tags.reduce((acc, item) => {
            acc.push({
                "id": item.id,
                "name": item.name,
                "sortOrder": item.sortOrder
            });
            return acc;
        }, []);
        return {
            "email": user.email,
            "nickname": user.nickname,
            "tags": tags
        }
    },

    async updateUser(uid, json) {
        validateUserSchema(json, userPutSchema);
        let user = await userModel.getUser(uid);
        user = new User({
            uid: user.uid,
            email: json.email || user.email,
            password: json.password,
            nickname: json.nickname || user.nickname,
        }, !json.hasOwnProperty('password'));
        user = await userModel.updateUser(user);
        return {
            "email": user.email,
            "nickname": user.nickname
        }
    },

    async deleteUser(uid) {
        await userModel.deleteUser(uid);
    },

    async addUserTags(uid, tagIds) {
        validateUserSchema(tagIds, userTagSchema);
        return await userModel.addUserTags(uid, tagIds);
    }
}

export { userController };
