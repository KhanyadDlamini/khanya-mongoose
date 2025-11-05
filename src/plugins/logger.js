export const loggerPlugin = (model, options = {}) => {
    const log = options.logger || console.log;

    const wrap = (methodName) => {
        const original = model[methodName].bind(model);
        model[methodName] = async (...args) => {
            log(`🔹 [${methodName.toUpperCase()}] called with:`, args);
            const result = await original(...args);
            log(`🔹 [${methodName.toUpperCase()}] result:`, result);
            return result;
        };
    };

    ["create", "update", "delete", "find", "findOne"].forEach(wrap);
};
