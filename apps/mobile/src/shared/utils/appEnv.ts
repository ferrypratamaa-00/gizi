const requiredEnv = (key: string) => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Missing env: ${key}`);
    }
    return value;
};

export const appEnv = {
    APP_NAME: requiredEnv("VITE_APP_NAME"),
};
