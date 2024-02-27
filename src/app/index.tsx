import NDK from '@nostr-dev-kit/ndk';
import { NostrHooksContextProvider } from 'nostr-hooks';
import { RouterProvider } from 'react-router-dom';

import './index.css';

import { router } from '@/pages';

import { ThemeProvider } from '@/shared/components/theme-provider';
import { Toaster } from '@/shared/components/ui/toaster';
import { useStore } from '@/shared/store';

export const App = () => {
  const signer = useStore((state) => state.signer);
  const ndk = new NDK({ signer, explicitRelayUrls: ['wss://nos.lol'] });

  return (
    <>
      <NostrHooksContextProvider ndk={ndk}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </NostrHooksContextProvider>
    </>
  );
};
