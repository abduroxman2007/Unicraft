'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/signin');
        return;
      }

      // Redirect to appropriate profile based on user type
      switch (user?.user_type) {
        case 'student':
          router.push('/profile/student');
          break;
        case 'tutor':
          router.push('/profile/tutor');
          break;
        case 'admin':
          router.push('/profile/admin');
          break;
        default:
          router.push('/profile/student');
      }
    }
  }, [user, isAuthenticated, loading, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your profile...</p>
      </div>
    </div>
  );
}
