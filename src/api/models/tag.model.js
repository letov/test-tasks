import { client } from './database.js';

class Tag {
    #id;
    #creator;
    #name;
    #sortOrder;

    constructor(params) {
        this.#id = params.id;
        this.#creator = params.creator;
        this.#name = params.name;
        this.#sortOrder = params.sortOrder;
        this.validate();
    }

    validate() {
        if (!this.validateName()) {
            throw new Error('Max name length is 20');
        }
    }

    validateName() {
        return this.#name.length <= 20;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get creator() {
        return this.#creator;
    }

    set creator(value) {
        this.#creator = value;
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get sortOrder() {
        return this.#sortOrder;
    }

    set sortOrder(value) {
        this.#sortOrder = value;
    }
}

const tagService = {
    async getTagsByCreator(uid) {
        const results = await client.query(
            'SELECT * FROM public."tag" WHERE creator = $1',
            [uid],
        );
        return results.rows.reduce((acc, item) => {
            acc.push(new Tag(item));
            return acc;
        }, []);
    },

    async getTag(id) {
        const results = await client.query(
            'SELECT * FROM public."tag" WHERE id = $1',
            [id],
        );
        if (0 === results.rows.length) {
            throw new Error('Tag does not exist');
        }
        const tag = results.rows[0];
        return new Tag({
            id: tag.id,
            creator: tag.creator,
            name: tag.name,
            sortOrder: tag.sort_order,
        });
    },

    async getTags(json) {
        let sql = 'SELECT * ' +
                  'FROM public."tag" as t ' +
                  'LEFT JOIN public."user" as u ON (t.creator = u.uid) ';
        let orderBy = [];
        if (json.hasOwnProperty('sortByOrder')) {
            orderBy.push('t.sort_order');
        }
        if (json.hasOwnProperty('sortByName')) {
            orderBy.push('t.name');
        }
        sql += orderBy.length > 0 ? `ORDER BY ${orderBy.join(',')} ` : '';
        sql += json.hasOwnProperty('offset') ? `OFFSET ${Number(json.offset)} ` : '';
        sql += json.hasOwnProperty('length') ? `LIMIT ${Number(json.length)} ` : '';
        console.log(sql);
        const results = await client.query(sql);
        if (0 === results.rows.length) {
            throw new Error('Tags do not exist');
        }
        return results.rows.reduce((acc, item) => {
            acc.push({
                id: item.id,
                creator: item.creator,
                nickname: item.nickname,
                name: item.name,
                sortOrder: item.sort_order,
            });
            return acc;
        }, []);
    },

    async createTag(tag) {
        const result = await client.query(
            'INSERT INTO public."tag" (creator, name, sort_order) VALUES ($1, $2, $3) RETURNING id',
            [tag.creator, tag.name, tag.sortOrder ?? 0]
        ).catch((err) => {
            throw new Error(err.message);
        });
        tag.id = result.rows[0].id;
        return tag;
    },


}

export { Tag, tagService }
