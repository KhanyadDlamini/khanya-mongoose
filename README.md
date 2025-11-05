# Khanya Mongoose

MongoDB ODM for Node.js with schema validation, hooks, virtuals, plugins, soft delete, chaining, and populate support.

# Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Schemas](#schemas)
- [Models](#models)
- [Query Chaining](#query-chaining)
- [Plugins](#plugins)
- [Hooks](#hooks)
- [Virtuals](#virtuals)
- [Soft Delete](#soft-delete)
- [Populate / References](#populate--references)
- [Example](#example)
- [License](#license)

# Introduction

Khanya Mongoose is a powerful, modern ODM for MongoDB. It allows you to define schemas, perform advanced queries with chaining, use plugins, virtuals, pre/post hooks, soft delete functionality, and populate references between collections — all while keeping an intuitive API inspired by Mongoose.

# Installation

```bash
npm install khanya-mongoose

MongoDB ODM for Node.js with schema validation, hooks, virtuals, plugins, soft delete, chaining, and populate support.
Table of Contents
Introduction
Installation
Quick Start
Schemas
Models
Query Chaining
Plugins
Hooks
Virtuals
Soft Delete
Populate / References
Example
License

```
# Introduction

Khanya Mongoose is a powerful, modern ODM for MongoDB. It allows you to define schemas, perform advanced queries with chaining, use plugins, virtuals, pre/post hooks, soft delete functionality, and populate references between collections — all while keeping an intuitive API inspired by Mongoose.
# Installation

```bash
npm install khanya-mongoose
```

# Quick Start

```javascript
import khanyaMongoose from "khanya-mongoose";
const km = new khanyaMongoose("mongodb://127.0.0.1:27017", "my_db");
await km.connect();
await km.disconnect();
```

# Schemas
Define schemas with field types, validation, defaults, and more.
```javascript
import { Schema } from 'khanya-mongoose';
const userSchema = km.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

```
# Models
Create models from schemas to interact with collections.
```javascript
import { model } from 'khanya-mongoose';
const User = model('User', userSchema);
``` 

# Query Chaining
Build complex queries with a fluent API.
```javascript
const users = await User.find().where('age').gt(18).sort('-name').limit(10).exec();
```

# Plugins
Extend model functionality with reusable plugins.
```javascript
import { timestampPlugin } from 'khanya-mongoose/plugins/timestamp';
userSchema.plugin(timestampPlugin);
```

# Hooks
Pre and post hooks allow running logic before or after certain operations:
```javascript
userSchema.pre("save", (doc) => {
  console.log(`💾 Saving user: ${doc.name}`);
});
```

# Virtuals
Virtuals let you define computed fields that don’t persist in the database:
```javascript
userSchema.addVirtual("greeting", (doc) => `Hello, my name is ${doc.name}`);

const users = await User.find().exec();
console.log(users[0].greeting);
```

# Soft Delete
Soft delete marks a document as deleted instead of removing it:
```javascript
await User.delete({ name: "Bob" });
```

# Populate / References
Define references between collections and populate them:
```javascript
postSchema.addReference("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
});

const posts = await Post.find().populate("user").exec();
console.log(posts[0].user.name);
```

# Code Example
```javascript
import khanyaMongoose from "khanya-mongoose";
import { loggerPlugin } from "./src/plugins/logger.js";
import { softDeletePlugin } from "./src/plugins/softDelete.js";
import { timestampsPlugin } from "./src/plugins/timestamps.js";

const km = new khanyaMongoose("mongodb://127.0.0.1:27017", "my_db");

const run = async () => {
  await km.connect();

  const userSchema = km.Schema(
    { name: String, age: Number, email: String, deleted: Boolean, deletedAt: Date },
    { timestamps: true }
  );

  userSchema.plugin(loggerPlugin);
  userSchema.plugin(softDeletePlugin);
  userSchema.plugin(timestampsPlugin);
  userSchema.addVirtual("greeting", (doc) => `Hello, my name is ${doc.name}`);

  const User = km.model("User", userSchema);

  const { insertedId } = await User.create({ name: "Alice", age: 28, email: "alice@example.com" });

  const users = await User.find().sort({ age: -1 }).limit(1).exec();
  console.log(users);

  await km.disconnect();
};

run();

```
# LICENCE
MIT License © Khanyakwezwe Dlamini


