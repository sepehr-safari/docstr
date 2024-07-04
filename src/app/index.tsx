import { useNostrHooks } from 'nostr-hooks';
import { RouterProvider } from 'react-router-dom';

import { ThemeProvider } from '@/shared/components/theme-provider';
import { Toaster } from '@/shared/components/ui/toaster';

import { router } from './router';

import './index.css';

export const App = () => {
  useNostrHooks();

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </>
  );
};
