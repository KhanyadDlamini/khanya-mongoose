import Query from "./query.js";
import { validateDocument } from "./utils/validator.js";

export default class Model {
    constructor(name, schema, db) {
        this.name = name;
        this.schema = schema;
        this.collection = db.collection(name);
        this.query = new Query(this.collection);
        this.db = db;

        // Apply all schema plugins
        this.schema.applyPlugins(this);
    }

    async _runHook(type, hook, doc) {
        if (this.schema.middlewares[type]?.[hook]) {
            await this.schema.middlewares[type][hook](doc);
        }
    }

    async create(doc) {
        if (this.schema.options.timestamps) {
            const now = new Date();
            doc.createdAt = now;
            doc.updatedAt = now;
        }

        await this._runHook("pre", "save", doc);
        validateDocument(this.schema, doc);

        const result = await this.query.insertOne(doc);

        await this._runHook("post", "save", doc);
        return result;
    }

    async populate(docs, field) {
        if (!this.schema.references[field]) throw new Error(`No reference found for ${field}`);
        const { ref, localField, foreignField } = this.schema.references[field];
        const foreignCollection = this.db.collection(ref);

        return Promise.all(
            docs.map(async (doc) => {
                const localValue = doc[localField];
                const related = await foreignCollection.findOne({ [foreignField]: localValue });
                doc[field] = related || null;
                return doc;
            })
        );
    }

    async find(filter = {}) {
        const results = await this.query.find(filter).exec();
        results.forEach((doc) => {
            for (const [key, getter] of Object.entries(this.schema.virtuals)) {
                doc[key] = getter(doc);
            }
        });
        return results;
    }

    async findOne(filter = {}) {
        const doc = await this.query.findOne(filter);
        if (!doc) return null;
        for (const [key, getter] of Object.entries(this.schema.virtuals)) {
            doc[key] = getter(doc);
        }
        return doc;
    }

    async update(filter, update) {
        if (this.schema.options.timestamps) update.updatedAt = new Date();
        return await this.query.update(filter, update);
    }

    async delete(filter) {
        return await this.query.delete(filter);
    }

    exec() {
        return this.query.exec();
    }
}
