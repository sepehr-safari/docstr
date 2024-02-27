import { NDKUser } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';

import { useStore } from '@/shared/store';

export const useMe = () => {
  const [me, setMe] = useState<NDKUser | undefined>(undefined);

  const { signer } = useStore();

  useEffect(() => {
    signer?.user().then((user) => {
      setMe(user);
    });
  }, [signer, setMe]);

  return {
    signer,
    me,
  };
};
