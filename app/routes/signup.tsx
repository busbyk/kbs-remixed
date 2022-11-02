import { Link, useActionData, useLoaderData } from '@remix-run/react';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { json, redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/lib/server/auth.server';

import { commitSession, getSession } from '~/lib/server/session.server';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import Input from '~/components/input/Input';
import SubmitButton from '~/components/input/SubmitButton';
import { returnToCookie } from '~/lib/server/cookies.server';
import BareLayout from '~/components/layout/BareLayout';
import { safeRedirect } from '~/lib/utils';
import { createUser, getUserByEmail } from '~/models/users.server';

export const action: ActionFunction = async ({ request }) => {
  const validated = await validator.validate(await request.formData());

  if (validated.error) return validationError(validated.error);

  const existingUser = await getUserByEmail(validated.data.email);
  if (existingUser) {
    return validationError({
      fieldErrors: {
        email: 'A user with this email already exists.',
      },
    });
  }

  const user = await createUser(validated.data.email, validated.data.password);

  const session = await getSession(request.headers.get('cookie'));

  session.set(authenticator.sessionKey, user);

  return redirect('/dashboard', {
    headers: { 'Set-Cookie': await commitSession(session) },
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') as string | null;

  let headers = new Headers();
  if (returnTo) {
    headers.append(
      'Set-Cookie',
      await returnToCookie.serialize(safeRedirect(returnTo))
    );
  }

  await authenticator.isAuthenticated(request, {
    successRedirect: safeRedirect(returnTo ?? '/dashboard'),
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
    password: z.string().min(8, {
      message: 'Password is required and must be at least 8 characters.',
    }),
  })
);

export default function Signup() {
  const loaderData = useLoaderData();
  const actionData = useActionData();

  const error = loaderData?.error || actionData?.error;

  return (
    <BareLayout>
      <div className="h-full flex flex-col justify-center items-center gap-8">
        <h3>Sign Up</h3>
        <ValidatedForm
          validator={validator}
          method="post"
          className="flex flex-col space-y-3 w-full sm:w-fit"
        >
          <div className="flex flex-col">
            <Input name="email" label="Email:" type="text" />
            <Input name="password" label="Password:" type="password" />
          </div>
          <SubmitButton label="Sign up" labelSubmitting="Signing up..." />
          {error && <p className="text-red-600 mt-3">{error.message}</p>}
        </ValidatedForm>
        <Link to="/login" className="w-full text-center text-xs">
          Already signed up?
        </Link>
      </div>
    </BareLayout>
  );
}
