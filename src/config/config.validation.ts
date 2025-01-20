import * as Joi from 'joi';
export const configurationSchema = Joi.object({
  app: Joi.object({
    name: Joi.string().default('Boilerplate'),
    env: Joi.string().valid('dev', 'stage', 'preprod', 'prod').default('dev'),
    port: Joi.number().default(3000),
    base_path: Joi.string().default('api/v1'),
    clustering: Joi.bool().default(false),
  }),
  logger: Joi.object({
    rsa_key_public: Joi.string().default('secret'),
  }),
  db: Joi.object({
    dialect: Joi.string()
      .valid('postgres', 'mysql', 'sqlite', 'mariadb', 'oracle', 'mssql')
      .default('postgres'),
    host: Joi.string().hostname().default('localhost'),
    port: Joi.number().port().default(5432),
    name: Joi.string().default('postgres'),
    username: Joi.string().default('postgres'),
    password: Joi.string().default('postgres'),
  }),
  jwt: Joi.object({
    secret: Joi.string().default('secret'),
    expiresIn: Joi.string().default('1h'),
  }),
});
