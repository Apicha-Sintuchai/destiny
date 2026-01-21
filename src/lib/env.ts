function getEnv(key: string, required = false): string | undefined {
    const value = process.env[key];
    
    if (!required || process.env.NODE_ENV === 'development' || !value) {
        return value;
    }
    
    return value;
}

export const env = {
    NODE_ENV: getEnv('NODE_ENV'),
    SESSION_SECRET: getEnv('SESSION_SECRET'),
    OPENAI_API_KEY: getEnv('OPENAI_API_KEY'),
    MINIO_ENDPOINT: getEnv('MINIO_ENDPOINT'),
    MINIO_PORT: getEnv('MINIO_PORT'),
    MINIO_USE_SSL: getEnv('MINIO_USE_SSL'),
    MINIO_ACCESS_KEY: getEnv('MINIO_ACCESS_KEY'),
    MINIO_SECRET_KEY: getEnv('MINIO_SECRET_KEY'),
}

export function requireEnv(key: keyof typeof env): string {
    const value = env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
