export const aggregationPlugin = (model) => {
    model.aggregate = async (pipeline = []) => {
        if (!Array.isArray(pipeline)) {
            throw new Error("Aggregation pipeline must be an array");
        }
        const db = model.getDatabase();
        return await db.collection(model.collectionName).aggregate(pipeline).toArray();
    };
};
