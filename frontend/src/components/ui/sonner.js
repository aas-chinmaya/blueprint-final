// 'use client';

// import { useTheme } from 'next-themes';
// import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

// const Toaster = ({ ...props }) => {
//   const { theme = 'system' } = useTheme();

//   return (
//     <SonnerToaster
//       theme={theme}
//       position="top-right"
//       closeButton // ✅ enables the close button
//       duration={3000}
//       visibleToasts={5}
//       toastOptions={{
//         style: {
//           padding: '16px',
//           borderRadius: '8px',
//           border: '1px solid var(--border)',
//           position: 'relative', // ✅ Ensure child positioning works
//         },
//         classNames: {
//           toast:
//             'relative group toast justify-between bg-background text-foreground border-border shadow-lg',
//           description: 'text-muted-foreground',
//           actionButton: 'bg-primary text-primary-foreground',
//           cancelButton:
//             'absolute top-2 right-2 text-muted-foreground hover:text-foreground', // ✅ Close icon in top-right
//         },
//       }}
//       {...props}
//     />
//   );
// };

// export { Toaster, sonnerToast as toast };
'use client';

import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';

/**
 * Normalize any data type (string, object, array, etc.) into a displayable string.
 */
const normalizeMessage = (input) => {
  if (typeof input === 'string' || typeof input === 'number') return String(input);

  if (Array.isArray(input)) {
    return input.map(normalizeMessage).join('\n');
  }

  if (typeof input === 'object' && input !== null) {
    try {
      return JSON.stringify(input, null, 2);
    } catch {
      return '⚠️ Unserializable object';
    }
  }

  return '⚠️ Unsupported message format';
};

/**
 * Base toast wrapper that auto-normalizes the message.
 */
const toast = (message, options = {}) => {
  return sonnerToast(normalizeMessage(message), options);
};

/**
 * Add support for .success(), .error(), .info(), .warning()
 */
toast.success = (message, options = {}) =>
  sonnerToast.success(normalizeMessage(message), options);

toast.error = (message, options = {}) =>
  sonnerToast.error(normalizeMessage(message), options);

toast.info = (message, options = {}) =>
  sonnerToast.info(normalizeMessage(message), options);

toast.warning = (message, options = {}) =>
  sonnerToast.warning(normalizeMessage(message), options);

/**
 * Custom Toaster component with dark/light theme and enhanced styling.
 */
const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme();

  return (
    <SonnerToaster
      theme={theme}
      position="top-right"
      closeButton
      duration={3000}
      visibleToasts={5}
      toastOptions={{
        style: {
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          position: 'relative',
        },
        classNames: {
          toast: 'relative group toast justify-between bg-background text-foreground border-border shadow-lg',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'absolute top-2 right-2 text-muted-foreground hover:text-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };