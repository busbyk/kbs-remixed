import { useFetchers, useTransition } from '@remix-run/react';
import { useEffect, useMemo } from 'react';
import NProgress from 'nprogress';

export default function GlobalLoadingIndicator() {
  const transition = useTransition();
  const fetchers = useFetchers();

  const state = useMemo<'idle' | 'loading'>(() => {
    let states = [
      transition.state,
      ...fetchers.map((fetcher) => fetcher.state),
    ];
    if (states.every((state) => state === 'idle')) return 'idle';
    return 'loading';
  }, [transition.state, fetchers]);

  useEffect(() => {
    if (state === 'loading') NProgress.start();
    if (state === 'idle') NProgress.done();
  }, [state]);

  return <></>;
}
