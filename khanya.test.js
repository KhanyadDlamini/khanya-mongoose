// __tests__/khanyaPro.test.js
import { ObjectId } from "mongodb";
import khanyaMongoose from "./src/index.js";
import { loggerPlugin } from "./src/plugins/logger.js";
import { softDeletePlugin } from "./src/plugins/softDelete.js";
import { timestampsPlugin } from "./src/plugins/timestamps.js";

let km, User, Post;

beforeAll(async () => {
    km = new khanyaMongoose("mongodb://127.0.0.1:27017", "khanya_pro_db");
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
    userSchema.pre("save", (doc) => console.log(`💾 [HOOK] Saving user: ${doc.name}`));
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

    postSchema.addReference("user", { ref: "User", localField: "userId", foreignField: "_id" });
    postSchema.plugin(loggerPlugin);

    Post = km.model("Post", postSchema);
});

afterAll(async () => {
    // Clean up test database
    await User.delete({});
    await Post.delete({});
    await km.disconnect();
});

describe("Khanya Mongoose Pro Tests", () => {
    let aliceId, bobId;

    test("Create users", async () => {
        const alice = await User.create({ name: "Alice", age: 28, email: "alice@example.com" });
        const bob = await User.create({ name: "Bob", age: 32, email: "bob@example.com" });

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
        expect(users[0].greeting).toMatch(/Hello, my name/);
    });

    test("Populate posts with users", async () => {
        let posts = await Post.find().exec();
        posts = await Post.populate(posts, "user");

        expect(posts.length).toBeGreaterThanOrEqual(2);
        expect(posts[0].user.name).toBeDefined();
    });

    test("Soft delete Bob", async () => {
        await User.delete({ name: "Bob" });
        const activeUsers = await User.find({ deleted: false }).exec();
        expect(activeUsers.find(u => u.name === "Bob")).toBeUndefined();
    });
});
