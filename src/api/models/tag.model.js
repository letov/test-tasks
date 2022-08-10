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
    }
}
