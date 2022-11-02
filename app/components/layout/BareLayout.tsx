import { Link } from '@remix-run/react';
import classNames from 'classnames';

interface BareLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export default function BareLayout({
  children,
  header,
  className,
}: BareLayoutProps) {
  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col p-4 sm:p-8">
      <header>
        {header ?? (
          <nav className="flex">
            <Link to="/">Home</Link>
          </nav>
        )}
      </header>
      <main className={classNames('py-14 flex-col flex-grow', className)}>
        {children}
      </main>
    </div>
  );
}
