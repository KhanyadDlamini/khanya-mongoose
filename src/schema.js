export default class Schema {
    constructor(definition, options = {}) {
        this.definition = definition;
        this.options = options; // timestamps, etc.
        this.virtuals = {}; // computed fields
        this.middlewares = { pre: {}, post: {} };
        this.references = {}; // for populate
        this.plugins = []; // array of plugin functions
    }

    addVirtual(name, getter) {
        this.virtuals[name] = getter;
    }

    addReference(field, { ref, localField = "_id", foreignField = "_id" }) {
        this.references[field] = { ref, localField, foreignField };
    }

    plugin(fn, options = {}) {
        if (typeof fn !== "function") throw new Error("Plugin must be a function");
        this.plugins.push({ fn, options });
    }

    applyPlugins(modelInstance) {
        for (const { fn, options } of this.plugins) {
            fn(modelInstance, options);
        }
    }

    pre(hook, fn) {
        this.middlewares.pre[hook] = fn;
    }

    post(hook, fn) {
        this.middlewares.post[hook] = fn;
    }

    getDefinition() {
        return this.definition;
    }
}
