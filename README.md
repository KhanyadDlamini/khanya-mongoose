# Khanya Mongoose
# khanya-mongoose

[![npm version](https://img.shields.io/npm/v/khanya-mongoose)](https://www.npmjs.com/package/khanya-mongoose)
[![npm downloads](https://img.shields.io/npm/dm/khanya-mongoose)](https://www.npmjs.com/package/khanya-mongoose)
[![license](https://img.shields.io/npm/l/khanya-mongoose)](https://www.npmjs.com/package/khanya-mongoose)
[![GitHub repo](https://img.shields.io/badge/github-KhanyadDlamini%2Fkhanya--mongoose-blue)](https://github.com/KhanyadDlamini/khanya-mongoose)

[![NPM](https://nodei.co/npm/khanya-mongoose.png)](https://npmjs.org/package/khanya-mongoose)


A powerful and flexible MongoDB Object Data Modeling (ODM) library for Node.js, featuring built-in schema validation, middleware hooks, virtual fields, plugins, soft deletes, query chaining, and population support.

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

Khanya Mongoose is a powerful and modern Object Data Modeling (ODM) library for MongoDB. It provides an elegant and intuitive API inspired by Mongoose, enabling developers to define schemas, perform advanced query chaining, leverage plugins and virtuals, use pre/post hooks, implement soft deletes, and populate references between collections with ease.

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
Install Khanya Mongoose using npm:
```bash
npm install khanya-mongoose
```

Or with Yarn:
```bash
yarn install khanya-mongoose
```

# Quick Start
Getting started with Khanya Mongoose is both simple and intuitive. With its Mongoose-inspired API, you can quickly define schemas, create models, and interact with your MongoDB database without unnecessary complexity. Whether you’re performing advanced queries, using hooks, or populating references between collections, Khanya Mongoose makes it easy to get up and running in just a few lines of code, allowing you to focus on building your application rather than managing boilerplate.
```javascript
import khanyaMongoose from "khanya-mongoose";
const km = new khanyaMongoose("mongodb://127.0.0.1:27017", "my_db");
await km.connect();
await km.disconnect();
```

# Schemas
With Khanya Mongoose, defining schemas is simple and powerful. You can specify field types, add validation rules, set default values, and configure advanced options with ease. Schemas act as the blueprint for your data, giving you full control over structure while keeping your code clean and maintainable
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
With Khanya Mongoose, you can create models from your schemas to interact seamlessly with MongoDB collections. Models provide a powerful interface for querying, updating, and managing your data while enforcing the structure and rules defined in your schemas. This makes working with collections intuitive, consistent, and efficient.
```javascript
import { model } from 'khanya-mongoose';
const User = model('User', userSchema);
``` 

# Query Chaining
Khanya Mongoose lets you build complex queries effortlessly using a fluent, chainable API. You can filter, sort, limit, and populate data in a readable and intuitive way, making even advanced queries easy to construct and maintain. This approach keeps your code clean while giving you full control over how you retrieve and manipulate data.
```javascript
const users = await User.find().where('age').gt(18).sort('-name').limit(10).exec();
```

# Plugins
With Khanya Mongoose, you can extend your models’ functionality using reusable plugins. Plugins allow you to add custom behavior, utilities, or features across multiple schemas and models, promoting code reuse and keeping your application modular and maintainable.
```javascript
import { timestampPlugin } from 'khanya-mongoose/plugins/timestamp';
userSchema.plugin(timestampPlugin);
```

# Hooks
Pre and post hooks in Khanya Mongoose let you execute custom logic before or after specific operations, such as saving, updating, or deleting documents. This feature enables you to enforce rules, modify data, trigger side effects, or integrate with other systems seamlessly, all while keeping your code organized and maintainable.
```javascript
userSchema.pre("save", (doc) => {
  console.log(`Saving user: ${doc.name}`);
});
```

# Virtuals
Virtuals in Khanya Mongoose allow you to define computed fields that exist only in your application logic and don’t get stored in the database. They can be used to format data, combine multiple fields, or provide derived values, giving you flexibility to enrich your models without altering the underlying data structure.
```javascript
userSchema.addVirtual("greeting", (doc) => `Hello, my name is ${doc.name}`);

const users = await User.find().exec();
console.log(users[0].greeting);
```

# Soft Delete
Soft delete in Khanya Mongoose allows you to mark a document as deleted without permanently removing it from the database. This approach preserves your data for auditing, recovery, or historical reference, while keeping it excluded from normal queries, giving you flexibility and safety when managing records.
```javascript
await User.delete({ name: "Bob" });
```

# Populate / References
With Khanya Mongoose, you can define references between collections and populate them effortlessly. This allows you to create relationships between documents, query related data in a single call, and work with connected datasets seamlessly — all while keeping your queries readable and your models organized.
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
The following example demonstrates how to get started with Khanya Mongoose. It covers connecting to a MongoDB database, defining a schema with validation and defaults, adding virtual fields and hooks, creating a model, performing queries with chaining, populating references, and using soft delete functionality. This illustrates how Khanya Mongoose provides a clean, intuitive API for working with MongoDB while keeping your data operations organized and maintainable
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


