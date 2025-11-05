export const timestampsPlugin = (model, options = {}) => {
    const originalCreate = model.create.bind(model);
    const originalUpdate = model.update.bind(model);

    // Wrap create
    model.create = async (doc) => {
        const now = new Date();
        if (!doc.createdAt) doc.createdAt = now;
        if (!doc.updatedAt) doc.updatedAt = now;
        return await originalCreate(doc);
    };

    // Wrap update
    model.update = async (filter, update) => {
        update.updatedAt = new Date();
        return await originalUpdate(filter, update);
    };
};
