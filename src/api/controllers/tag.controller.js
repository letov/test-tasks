import { Validator } from 'jsonschema';
import { Tag, tagModel } from "../models/tag.model.js";
import { userModel } from "../models/user.model.js";

const validator = new Validator();

const tagPostSchema = {
    "id": "/TagPostSchema",
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "sortOrder": {"type": "string"},
    },
    "required": ["name"]
};

const tagFilterSchema = {
    "id": "/TagFilterSchema",
    "type": "object",
    "properties": {
        "sortByName": {"type": "string"},
        "sortByOrder": {"type": "string"},
        "offset": {"type": "string"},
        "length": {"type": "string"},
    }
};

const validateTagSchema = (json, schema) => {
    if (!validator.validate(json, schema).valid) {
        throw new Error('Incorrect schema');
    }
}

const tagController = {
    async createTag(uid, json) {
        validateTagSchema(json, tagPostSchema);
        json.creator = uid;
        let tag = new Tag(json);
        tag = await tagModel.createTag(tag);
        return {
            "id": tag.id,
            "name": tag.name,
            "sortOrder": tag.sortOrder,
        };
    },

    async getTag(id) {
        const tag = await tagModel.getTag(id);
        const user = await userModel.getUser(tag.creator);
        return {
            "creator": {
                "nickname": user.nickname,
                "uid": user.uid,
            },
            "name": tag.name,
            "sortOrder": tag.sortOrder
        };
    },

    async getTags(json) {
        validateTagSchema(json, tagFilterSchema);
        const tags = await tagModel.getTags(json);
        return {
            "data": tags.reduce((acc, item) => {
                console.log(item)
                acc.push({
                    "creator": {
                        "nickname": item.nickname,
                        "uid": item.creator,
                    },
                    "name": item.name,
                    "sortOrder": item.sortOrder
                });
                return acc;
            }, []),
            "meta": {
                "offset": json.offset,
                "length": json.length,
                "quantity": tags.length
            }
        };
    }
}

export { tagController };
