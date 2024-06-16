import * as Joi from 'joi';

export default () => ({
    port: parseInt(process.env.APP_PORT, 10) || 4000,
    databaseUrl: process.env.DATABASE_URL,
});

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
    PORT: Joi.number().port().default(4000),
    DATABASE_URL: Joi.string().uri().required(),
});
