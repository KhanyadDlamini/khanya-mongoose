import Connection from "./connection.js";
import Model from "./model.js";
import Schema from "./schema.js";

export default class khanyaMongoose {
    constructor(uri, dbName, options = {}) {
        this.connection = new Connection(uri, options);
        this.dbName = dbName;
        this.db = null;
    }

    async connect() {
        this.db = await this.connection.connect(this.dbName);
        return this.db;
    }

    Schema(definition, options = {}) {
        return new Schema(definition, options);
    }

    model(name, schema) {
        if (!this.db) throw new Error("Database not connected. Call connect() first.");
        return new Model(name, schema, this.db);
    }

    async disconnect() {
        return await this.connection.disconnect();
    }
}
