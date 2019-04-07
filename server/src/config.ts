const dbUrl = process.env.NODE_ENV === 'production'
  ? process.env.REDIS_URL
  : 'redis://127.0.0.1:6379';

export const config = {
  dbUrl,
};
