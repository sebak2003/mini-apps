function getEnv(key: string): string | undefined {
  return process.env[key];
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: ${key}. ` +
        `Check your .env.local or Vercel project settings.`
    );
  }
  return value;
}

export const env = {
  get VERCEL_TOKEN() {
    return getEnv("VERCEL_TOKEN");
  },
  get VERCEL_ORG_ID() {
    return getEnv("VERCEL_ORG_ID");
  },
  get VERCEL_PROJECT_ID() {
    return getEnv("VERCEL_PROJECT_ID");
  },
  get BLOB_READ_WRITE_TOKEN() {
    return getEnv("BLOB_READ_WRITE_TOKEN");
  },
  get DATABASE_URL() {
    return getEnv("DATABASE_URL");
  },
  get DATABASE_URL_UNPOOLED() {
    return getEnv("DATABASE_URL_UNPOOLED");
  },

  /** Get any env var by key */
  get: getEnv,
  /** Get a required env var (throws if missing) */
  required: requireEnv,
} as const;

export type Env = typeof env;
