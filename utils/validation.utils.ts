export async function validate<T>(schema: any, values: T) {
    const { error } = schema.safeParse(values);
    if (error) {
        const errors: Record<string, string> = {};
        error.errors.forEach((e: any) => {
            if (e.path && e.path.length) {
                errors[e.path[0]] = e.message;
            }
        });
        return { isValid: false, errors };
    }
    return { isValid: true, errors: {} };
}