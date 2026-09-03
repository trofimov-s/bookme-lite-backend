import type { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

import { EnvKeys } from '@/shared';

export const ConfigModuleConfig: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: Joi.object({
    [EnvKeys.PORT]: Joi.number().default(3000),
    [EnvKeys.DATABASE_URL]: Joi.string().uri().required(),
    [EnvKeys.JWT_ACCESS_SECRET]: Joi.string().min(32).required(),
    [EnvKeys.JWT_REFRESH_SECRET]: Joi.string().min(32).required(),
    [EnvKeys.FRONTEND_URL]: Joi.string().uri().required(),
  }),
};
