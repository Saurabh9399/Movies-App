// components/withAuth.tsx
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthHOC = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, redirect to the sign-in page
        router.push('/sign-in');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;
