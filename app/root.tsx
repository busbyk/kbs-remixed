import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import GlobalLoadingIndicator from './components/GlobalLoadingIndicator';
import tailwindStyles from './tailwind.css';
import nProgressStyles from '../node_modules/nprogress/nprogress.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: "Kellen's Remix Starter",
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStyles },
  { rel: 'stylesheet', href: nProgressStyles },
];

export const loader: LoaderFunction = () => {
  return json({
    ENV: {},
  });
};

export default function App() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <GlobalLoadingIndicator />
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(loaderData.ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
