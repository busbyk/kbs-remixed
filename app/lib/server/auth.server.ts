import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';
import { FormStrategy } from 'remix-auth-form';
import { validator } from '~/routes/login';
import { validationError } from 'remix-validated-form';
import type { User } from '@prisma/client';
import { verifyLogin } from '~/models/users.server';

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const validationResult = await validator.validate(form);

    if (validationResult.error) {
      throw validationError(validationResult.error);
    }

    const user = await verifyLogin(
      validationResult.data.email,
      validationResult.data.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return user;
  }),
  'user-pass'
);
