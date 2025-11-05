import { MongoClient } from "mongodb";

export default class Connection {
    static instance;

    constructor(uri, options = {}) {
        if (Connection.instance) return Connection.instance;
        this.uri = uri;
        this.client = new MongoClient(uri, { useUnifiedTopology: true, ...options });
        this.db = null;
        Connection.instance = this;
    }

    async connect(dbName) {
        if (!this.db) {
            try {
                await this.client.connect();
                console.log(`✅ Connected to MongoDB at ${this.uri}`);
                this.db = this.client.db(dbName);
            } catch (err) {
                console.error("❌ MongoDB connection failed:", err.message);
                throw err;
            }
        }
        return this.db;
    }

    getDatabase() {
        if (!this.db) throw new Error("Database not connected. Call connect() first.");
        return this.db;
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
            this.db = null;
            console.log("🔌 Disconnected from MongoDB");
        }
    }
}
