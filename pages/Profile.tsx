import React from 'react';
import Navbar from '../components/Navbar';

const Profile: React.FC = () => {
  // static data for now
  const user = {
    name: 'Aria Sharma',
    email: 'aria.sharma@example.com',
    role: 'Urban Planner',
    location: 'New Delhi, IN',
    joined: '2024-06-12',
    bio: 'Passionate about sustainable cities, green infrastructure and community-driven planning.'
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] text-[var(--color-text-main)]">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xl font-bold">AS</div>
            <div>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="text-sm text-[var(--color-text-muted)]">{user.role} · {user.location}</p>
            </div>
          </div>

          <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium mb-2">About</h2>
              <p className="text-sm text-[var(--color-text-muted)]">{user.bio}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] rounded border border-[var(--color-border-light)]">
                  <div className="text-xs text-[var(--color-text-muted)]">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>

                <div className="p-3 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] rounded border border-[var(--color-border-light)]">
                  <div className="text-xs text-[var(--color-text-muted)]">Member since</div>
                  <div className="font-medium">{new Date(user.joined).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <aside className="space-y-3">
              <div className="p-3 rounded border border-[var(--color-border-light)] text-sm bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
                <div className="text-xs text-[var(--color-text-muted)]">Projects</div>
                <div className="font-semibold">8</div>
              </div>

              <div className="p-3 rounded border border-[var(--color-border-light)] text-sm bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
                <div className="text-xs text-[var(--color-text-muted)]">Role</div>
                <div className="font-semibold">{user.role}</div>
              </div>
            </aside>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Profile;
