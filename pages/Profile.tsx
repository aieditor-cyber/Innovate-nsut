import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCurrentUser, logout, getUserData } from '../services/authService';
import type { User } from 'firebase/auth';

interface UserProfile {
  displayName?: string;
  email?: string;
  photoURL?: string;
  createdAt?: string;
  bio?: string;
  location?: string;
  role?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);

    // Fetch user profile data from Firestore
    const fetchUserData = async () => {
      try {
        if (currentUser.uid) {
          const userData = await getUserData(currentUser.uid);
          setProfile(userData || {});
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-[var(--color-text-main)]">Loading profile...</div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.displayName || profile?.displayName || 'User';
  const email = user.email || '';
  const photoURL = user.photoURL;
  const joinDate = user.metadata?.creationTime || new Date().toISOString();
  const bio = profile?.bio || 'Welcome to TerraVision';
  const location = profile?.location || 'Location not set';
  const role = profile?.role || 'User';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] text-[var(--color-text-main)]">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-6">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xl font-bold">
                  {initials}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold">{displayName}</h1>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {role} · {location}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
            >
              Logout
            </button>
          </div>

          <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h2 className="text-lg font-medium mb-2">About</h2>
              <p className="text-sm text-[var(--color-text-muted)]">{bio}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] rounded border border-[var(--color-border-light)]">
                  <div className="text-xs text-[var(--color-text-muted)]">Email</div>
                  <div className="font-medium text-sm break-all">{email}</div>
                </div>

                <div className="p-3 bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] rounded border border-[var(--color-border-light)]">
                  <div className="text-xs text-[var(--color-text-muted)]">Member since</div>
                  <div className="font-medium">
                    {new Date(joinDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-3">
              <div className="p-3 rounded border border-[var(--color-border-light)] text-sm bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
                <div className="text-xs text-[var(--color-text-muted)]">Account Type</div>
                <div className="font-semibold">
                  {user.providerData[0]?.providerId === 'google.com'
                    ? 'Google OAuth'
                    : 'Email & Password'}
                </div>
              </div>

              <div className="p-3 rounded border border-[var(--color-border-light)] text-sm bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
                <div className="text-xs text-[var(--color-text-muted)]">UID</div>
                <div className="font-semibold text-xs break-all">{user.uid}</div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;
