import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
        <h2 className="text-2xl font-bold mb-2 text-[var(--color-text-main)]">Welcome back</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">Sign in to access your account</p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)]">Email</label>
            <input type="email" placeholder="you@domain.com" className="mt-1 block w-full rounded-md border border-[var(--color-border-light)] bg-transparent px-3 py-2 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)]">Password</label>
            <input type="password" placeholder="••••••••" className="mt-1 block w-full rounded-md border border-[var(--color-border-light)] bg-transparent px-3 py-2 text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>

          <button className="w-full py-2 rounded-md bg-[var(--color-primary)] text-white font-semibold hover:opacity-95">Sign in</button>
        </form>

        <div className="mt-4 text-sm text-[var(--color-text-muted)]">
          Don't have an account? <Link to="/signup" className="text-[var(--color-primary)] font-semibold">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
