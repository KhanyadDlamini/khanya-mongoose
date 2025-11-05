import { ObjectId } from "mongodb";
import khanyaMongoose from "./src/index.js";
import { loggerPlugin } from "./src/plugins/logger.js";
import { softDeletePlugin } from "./src/plugins/softDelete.js";
import { timestampsPlugin } from "./src/plugins/timestamps.js";

const km = new khanyaMongoose("mongodb://127.0.0.1:27017", "khanya_pro_db");

const run = async () => {
    try {
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

        // Virtual field
        userSchema.addVirtual("greeting", (doc) => `Hello, my name is ${doc.name}`);

        // Pre-save hook
        userSchema.pre("save", (doc) => {
            console.log(`💾 [HOOK] Saving user: ${doc.name}`);
        });

        // Apply plugins
        userSchema.plugin(softDeletePlugin);
        userSchema.plugin(timestampsPlugin);
        userSchema.plugin(loggerPlugin);

        const User = km.model("User", userSchema);

        // ======= POSTS SCHEMA =======
        const postSchema = km.Schema(
            {
                title: { type: String, required: true },
                userId: { type: ObjectId, required: true }, // <-- fixed type
            },
            { timestamps: true }
        );

        // Reference for populate
        postSchema.addReference("user", { ref: "User", localField: "userId", foreignField: "_id" });

        // Apply logger plugin
        postSchema.plugin(loggerPlugin);

        const Post = km.model("Post", postSchema);

        // ======= CREATE USERS =======
        const { insertedId: aliceId } = await User.create({
            name: "Alice",
            age: 28,
            email: "alice@example.com",
        });

        const { insertedId: bobId } = await User.create({
            name: "Bob",
            age: 32,
            email: "bob@example.com",
        });

        // ======= CREATE POSTS =======
        await Post.create({ title: "Alice's First Post", userId: aliceId });
        await Post.create({ title: "Bob's First Post", userId: bobId });

        // ======= FETCH USERS =======
        let users = await User.find();
        console.log("\n👤 Users with virtuals:");
        console.log(users);

        // ======= FETCH POSTS & POPULATE USER =======
        let posts = await Post.find();
        posts = await Post.populate(posts, "user");
        console.log("\n📝 Posts populated with users:");
        console.log(posts);

        // ======= SOFT DELETE BOB =======
        await User.delete({ name: "Bob" });

        console.log("\n🗑 Users after soft delete:");
        console.log(await User.find());

        await km.disconnect();
    } catch (err) {
        console.error("❌ Error:", err);
    }
};

run();
