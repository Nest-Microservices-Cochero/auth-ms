import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  /// 1
  JWT_SECRET: string;
  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),

    /// 2
    JWT_SECRET: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

/// 3
const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if (error) {
  throw new Error(`Environment variables validation failed ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  /// 4
  jwtSecret: envVars.JWT_SECRET,
  natsServers: envVars.NATS_SERVERS,
};
