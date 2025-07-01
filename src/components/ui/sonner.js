'use client';

import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme();

  return (
    <SonnerToaster
      theme={theme}
      position="top-right"
      closeButton
      duration={3000} // ✅ Auto close after 3s
      visibleToasts={5}
      className="toaster group"
      toastOptions={{
        style: {
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        },
        classNames: {
          toast:
            'group toast justify-between group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg relative',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'absolute right-2 top-2 text-sm text-muted-foreground hover:text-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, sonnerToast as toast };
