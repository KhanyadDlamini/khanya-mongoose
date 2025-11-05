export function validateDocument(schema, doc) {
    const def = schema.getDefinition();
    const errors = [];

    for (const [field, rules] of Object.entries(def)) {
        let value = doc[field];

        // Apply default if value is undefined
        if (value === undefined && rules.default !== undefined) {
            doc[field] = typeof rules.default === "function" ? rules.default() : rules.default;
            value = doc[field];
        }

        // Skip validation if value is undefined or null (optional field)
        if (value === undefined || value === null) {
            if (rules.required) {
                errors.push(`Field "${field}" is required`);
            }
            continue;
        }

        // Type validation
        if (rules.type) {
            const typeName = rules.type.name.toLowerCase();
            let valid = false;

            // Handle arrays
            if (Array.isArray(value) && rules.type === Array) valid = true;
            // Handle dates
            else if (rules.type === Date && value instanceof Date) valid = true;
            // Handle primitives (string, number, boolean)
            else if (typeof value === typeName) valid = true;
            // Handle custom class instances
            else if (value instanceof rules.type) valid = true;

            if (!valid) {
                errors.push(`Field "${field}" should be type ${rules.type.name}`);
            }
        }

        // Enum validation
        if (rules.enum && !rules.enum.includes(value)) {
            errors.push(`Field "${field}" must be one of: ${rules.enum.join(", ")}`);
        }

        // Custom validator
        if (rules.validate && typeof rules.validate === "function") {
            const isValid = rules.validate(value);
            if (!isValid) errors.push(`Field "${field}" failed custom validation`);
        }
    }

    if (errors.length) throw new Error(errors.join("; "));
    return true;
}
