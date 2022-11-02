import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import BareLayout from '~/components/layout/BareLayout';
import { getUsers } from '~/models/users.server';

export async function loader() {
  const users = await getUsers();
  return json(users);
}

export default function Index() {
  const users = useLoaderData<typeof loader>();

  return (
    <BareLayout
      header={
        <nav className="flex justify-between">
          <Link to="/">Home</Link>
          <div className="flex gap-6">
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </div>
        </nav>
      }
    >
      <div className="flex flex-col items-center gap-8">
        <h1>Welcome to Remix</h1>
        <div className="flex flex-col gap-2">
          <h3>Our favorite users:</h3>
          <ul className="flex flex-col gap-2">
            {users.map((user) => (
              <li key={user.id}>{user.email}</li>
            ))}
          </ul>
        </div>
      </div>
    </BareLayout>
  );
}
