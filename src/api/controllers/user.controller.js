import { Validator } from 'jsonschema';
import { User, userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { configCommon }  from "../../config.js";

const validator = new Validator();

const userPostSchema = {
    "id": "/UserSchema",
    "type": "object",
    "properties": {
        "email": {"type": "string"},
        "password": {"type": "string"},
        "nickname": {"type": "string"}
    },
    "required": ["email", "password", "nickname"]
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

const validateSchema = (json, schema) => {
    if (!validator.validate(json, schema).valid) {
        throw new Error('Incorrect schema');
    }
}

const userController = {
    async singin(json) {
        validateSchema(json, userPostSchema);
        const user = new User(json);
        await userModel.createUser(user);
        return this.genToken(user.uid);
    },

    async login(json) {
        validateSchema(json, loginPostSchema);
        const user = await userModel.getUserByEmailAndPassword(json.email, json.password);
        return this.genToken(user.uid);
    },

    genToken(uid) {
        return jwt.sign({ id: uid }, configCommon.secret, {
            expiresIn: configCommon.expires
        });
    }
}

export { userController };
