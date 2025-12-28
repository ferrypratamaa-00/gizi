const requiredENv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

const optionalEnv = (key: string, defaultValue: string): string => {
    return process.env[key] ?? defaultValue;
};

export const appEnv = {
    NODE_ENV: optionalEnv("NODE_ENV", "development"),
    APP_NAME: optionalEnv("APP_NAME", "Gizi Platform API"),
    APP_PORT: optionalEnv("APP_PORT", "3000"),

    //SUPABASE
    SUPABASE_URL: requiredENv("SUPABASE_URL"),
    SUPABASE_ANON_KEY: requiredENv("SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: requiredENv("SUPABASE_SERVICE_ROLE_KEY"),

    //DATABASE
    DATABASE_URL: requiredENv("DATABASE_URL"),

    //JWT
    JWT_SECRET: requiredENv("JWT_SECRET"),
    JWT_ACCESS_TOKEN_EXPIRY: optionalEnv("JWT_ACCESS_TOKEN_EXPIRY", "15m"),
    JWT_REFRESH_TOKEN_EXPIRY: optionalEnv("JWT_REFRESH_TOKEN_EXPIRY", "30d"),

    //BCRYPT
    BCRYPT_SALT_ROUNDS: Number.parseInt(
        optionalEnv("BCRYPT_SALT_ROUNDS", "10"),
        10
    ),

    //RATE LIMIT
    RATE_LIMIT_MAX_REQUESTS: Number.parseInt(
        optionalEnv("RATE_LIMIT_MAX_REQUESTS", "100"),
        10
    ),
    RATE_LIMIT_WINDOW_MS: Number.parseInt(
        optionalEnv("RATE_LIMIT_WINDOW_MS", "60000"),
        10
    ),

    //LOG
    LOG_LEVEL: optionalEnv("LOG_LEVEL", "info"),
};
