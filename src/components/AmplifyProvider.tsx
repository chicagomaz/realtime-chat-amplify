'use client';

import { useEffect } from 'react';
import '@/lib/amplify';

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Amplify is configured via the import above
    // This component ensures it's loaded before any child components
  }, []);

  return <>{children}</>;
}
