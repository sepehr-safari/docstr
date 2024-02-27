import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { create } from 'zustand';

type State = {
  signer: NDKPrivateKeySigner | undefined;
};

type Actions = {
  setSigner: (signer: NDKPrivateKeySigner | undefined) => void;
};

export const useStore = create<State & Actions>((set) => ({
  signer: undefined,
  setSigner: (signer) => set({ signer }),
}));
