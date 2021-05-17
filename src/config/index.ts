export default (): any => ({
  redisURL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  jwt: {
    secret: process.env.JWT_SECRET || 'SuperSecret',
    expiresIn: process.env.JWT_EXPIRES_IN || 24 * 60 * 60,
  },
})