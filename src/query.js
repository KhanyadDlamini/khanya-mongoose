export default class Query {
    constructor(collection) {
        this.collection = collection;
        this._filter = {};
        this._projection = null;
        this._limit = null;
        this._sort = null;
    }

    find(filter = {}) {
        this._filter = filter;
        return this;
    }

    select(projection) {
        this._projection = projection;
        return this;
    }

    limit(n) {
        this._limit = n;
        return this;
    }

    sort(sortObj) {
        this._sort = sortObj;
        return this;
    }

    async exec() {
        let cursor = this.collection.find(this._filter);
        if (this._projection) cursor = cursor.project(this._projection);
        if (this._sort) cursor = cursor.sort(this._sort);
        if (this._limit) cursor = cursor.limit(this._limit);
        return await cursor.toArray();
    }

    async findOne(filter = {}) {
        return await this.collection.findOne(filter);
    }

    async insertOne(doc) {
        const res = await this.collection.insertOne(doc);
        return { insertedId: res.insertedId };
    }

    async update(filter, update) {
        const res = await this.collection.updateMany(filter, { $set: update });
        return { modifiedCount: res.modifiedCount };
    }

    async delete(filter) {
        const res = await this.collection.deleteMany(filter);
        return { deletedCount: res.deletedCount };
    }
}
