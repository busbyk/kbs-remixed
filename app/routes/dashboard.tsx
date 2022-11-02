import { Form, Link, useLoaderData, useTransition } from '@remix-run/react';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { authenticator } from '~/lib/server/auth.server';
import BareLayout from '~/components/layout/BareLayout';

export let action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: '/' });
};

export const loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json({ user });
};

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  const transition = useTransition();
  const isLoggingOut =
    transition.submission?.formData.get('_action') === 'logout';

  return (
    <BareLayout
      header={
        <nav className="flex justify-between">
          <Link to="/">Home</Link>
          <Form method="post">
            <button
              type="submit"
              disabled={!!isLoggingOut}
              name="_action"
              value="logout"
            >
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </Form>
        </nav>
      }
    >
      <h1>Welcome, {user.email}</h1>
    </BareLayout>
  );
}
