export const configuration = () => ({
  app: {
    name: process.env.APP_NAME,
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    base_path: process.env.BASE_PATH,
    clustering: process.env.CLUSTERING,
  },
  logger: {
    rsa_key_public: process.env.LOGGER_RSA_KEY_PUBLIC,
  },
  db: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION,
  },
});
