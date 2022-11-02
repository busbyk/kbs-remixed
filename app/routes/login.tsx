import { Link, useLoaderData } from '@remix-run/react';
import { ValidatedForm } from 'remix-validated-form';
import { json } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/lib/server/auth.server';

import { getSession } from '~/lib/server/session.server';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import Input from '~/components/input/Input';
import SubmitButton from '~/components/input/SubmitButton';
import { returnToCookie } from '~/lib/server/cookies.server';
import BareLayout from '~/components/layout/BareLayout';
import { safeRedirect } from '~/lib/utils';

export const action: ActionFunction = async ({ request }) => {
  const returnTo = await returnToCookie.parse(request.headers.get('Cookie'));

  return await authenticator.authenticate('user-pass', request, {
    successRedirect: safeRedirect(returnTo ?? '/dashboard'),
    failureRedirect: '/login',
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') as string | null;

  let headers = new Headers();
  if (returnTo) {
    headers.append('Set-Cookie', await returnToCookie.serialize(returnTo));
  }

  await authenticator.isAuthenticated(request, {
    successRedirect: returnTo ?? '/dashboard',
  });
  const session = await getSession(request.headers.get('cookie'));
  const error = session.get(authenticator.sessionErrorKey);
  return json({ error }, { headers });
};

export const validator = withZod(
  z.object({
    email: z.string().min(1, {
      message: 'Email is required',
    }),
    password: z.string().min(1, { message: 'Password is required' }),
  })
);

export default function Login() {
  const { error } = useLoaderData();

  return (
    <BareLayout>
      <div className="h-full flex flex-col justify-center items-center gap-8">
        <h3>Log In</h3>
        <ValidatedForm
          validator={validator}
          method="post"
          className="flex flex-col space-y-3 w-full sm:w-fit"
        >
          <div className="flex flex-col">
            <Input name="email" label="Email:" type="text" />
            <Input name="password" label="Password:" type="password" />
          </div>
          <SubmitButton label="Log in" labelSubmitting="Logging in..." />
          {error && <p className="text-red-600 mt-3">{error.message}</p>}
        </ValidatedForm>
        <div className="flex gap-2 text-center text-xs">
          <Link to="/signup">Sign Up</Link>
          <span>|</span>
          <Link to="/forgotpassword">Forgot password?</Link>
        </div>
      </div>
    </BareLayout>
  );
}
