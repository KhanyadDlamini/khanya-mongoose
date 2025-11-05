export const softDeletePlugin = (model, options = {}) => {
    const originalDelete = model.delete.bind(model);

    model.delete = async (filter) => {
        const updateFields = {
            deleted: true,
            deletedAt: new Date(),
        };
        return await model.update(filter, updateFields);
    };
};
