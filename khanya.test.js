import { ObjectId } from "mongodb";
import khanyaMongoose from "./src/index.js";
import { loggerPlugin } from "./src/plugins/logger.js";
import { softDeletePlugin } from "./src/plugins/softDelete.js";
import { timestampsPlugin } from "./src/plugins/timestamps.js";

// Use environment variable or fallback to local
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "khanya_pro_db";

let km;
let User;
let Post;

beforeAll(async () => {
    km = new khanyaMongoose(MONGO_URI, DB_NAME);
    await km.connect();

    // ======= USERS SCHEMA =======
    const userSchema = km.Schema(
        {
            name: { type: String, required: true },
            age: { type: Number, required: true },
            email: { type: String, required: true },
            deleted: { type: Boolean, default: false },
            deletedAt: { type: Date, default: null },
        },
        { timestamps: true }
    );

    userSchema.addVirtual("greeting", (doc) => `Hello, my name is ${doc.name}`);
    userSchema.pre("save", (doc) => {
        console.log(`💾 [HOOK] Saving user: ${doc.name}`);
    });

    userSchema.plugin(softDeletePlugin);
    userSchema.plugin(timestampsPlugin);
    userSchema.plugin(loggerPlugin);

    User = km.model("User", userSchema);

    // ======= POSTS SCHEMA =======
    const postSchema = km.Schema(
        {
            title: { type: String, required: true },
            userId: { type: ObjectId, required: true },
        },
        { timestamps: true }
    );

    postSchema.addReference("user", {
        ref: "User",
        localField: "userId",
        foreignField: "_id",
    });
    postSchema.plugin(loggerPlugin);

    Post = km.model("Post", postSchema);
});

afterAll(async () => {
    await km.disconnect();
});

describe("Khanya Mongoose Pro Tests", () => {
    let aliceId, bobId;

    test("Create users", async () => {
        const alice = await User.create({
            name: "Alice",
            age: 28,
            email: "alice@example.com",
        });
        const bob = await User.create({
            name: "Bob",
            age: 32,
            email: "bob@example.com",
        });

        aliceId = alice.insertedId;
        bobId = bob.insertedId;

        expect(aliceId).toBeDefined();
        expect(bobId).toBeDefined();
    });

    test("Create posts", async () => {
        const post1 = await Post.create({ title: "Alice's First Post", userId: aliceId });
        const post2 = await Post.create({ title: "Bob's First Post", userId: bobId });

        expect(post1.insertedId).toBeDefined();
        expect(post2.insertedId).toBeDefined();
    });

    test("Fetch users with virtuals", async () => {
        const users = await User.find().exec();
        expect(users.length).toBeGreaterThanOrEqual(2);
        expect(users[0].greeting).toContain("Hello, my name");
    });

    test("Populate posts with users", async () => {
        let posts = await Post.find().exec();
        posts = await Post.populate(posts, "user");
        expect(posts[0].user).toBeDefined();
        expect(posts[0].user.name).toBeDefined();
    });

    test("Soft delete a user", async () => {
        await User.delete({ name: "Bob" });
        const users = await User.find().exec();
        const bob = users.find((u) => u.name === "Bob");
        expect(bob.deleted).toBe(true);
        expect(bob.deletedAt).not.toBeNull();
    });
});
