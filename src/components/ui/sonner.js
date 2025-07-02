'use client';

import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme();

  return (
    <SonnerToaster
      theme={theme}
      position="top-right"
      closeButton // ✅ enables the close button
      duration={3000}
      visibleToasts={5}
      toastOptions={{
        style: {
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          position: 'relative', // ✅ Ensure child positioning works
        },
        classNames: {
          toast:
            'relative group toast justify-between bg-background text-foreground border-border shadow-lg',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton:
            'absolute top-2 right-2 text-muted-foreground hover:text-foreground', // ✅ Close icon in top-right
        },
      }}
      {...props}
    />
  );
};

export { Toaster, sonnerToast as toast };
