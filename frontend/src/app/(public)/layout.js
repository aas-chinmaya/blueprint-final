'use client';

import { useState, useEffect } from 'react';
import PreLoader from '../(shared)/PreLoader';

export default function PublicLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return <>{ children}</>;
  // return <>{loading ? <PreLoader /> : children}</>;
}
