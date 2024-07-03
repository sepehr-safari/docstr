import { NDKUser } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { loader } from '@/shared/utils';

import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

const SearchResults = ({
  search,
  handleSelect,
}: {
  search: string;
  handleSelect: (pubkey: string) => void;
}) => {
  const [users, setUsers] = useState<NDKUser[] | null>();

  const { events } = useSubscribe({
    filters: [{ search, limit: 5, kinds: [0] }],
    enabled: !!search,
    relays: ['wss://relay.nostr.band'],
  });

  useEffect(() => {
    events.forEach((event) => {
      event.author?.fetchProfile().then(() => {
        setUsers((prev) => {
          if (!prev) {
            return [event.author];
          }

          if (prev.find((user) => user.pubkey === event.author.pubkey)) {
            return prev;
          }

          return [...prev, event.author];
        });
      });
    });
  }, [events, setUsers]);

  return (
    <>
      <div className="grid gap-2">
        {users ? (
          users.map((user) => (
            <Button
              key={user.pubkey}
              variant="secondary"
              className="py-8 flex items-center h-14 justify-start text-left"
              onClick={() => handleSelect(user.pubkey)}
            >
              <Avatar>
                <AvatarImage
                  src={loader(user.profile?.image || '')}
                  alt={user.profile?.name || 'avatar'}
                />
              </Avatar>

              <div className="ml-2 truncate w-40">
                <p className="font-semibold">{user.profile?.name}</p>
                <p className="text-xs text-muted-foreground">{user.profile?.nip05}</p>
              </div>
            </Button>
          ))
        ) : (
          <Label>No users found</Label>
        )}
      </div>
    </>
  );
};

export const Delegatee = ({
  setDelegateePubkey,
}: {
  setDelegateePubkey: (delegateePubkey: string) => void;
}) => {
  const [search, setSearch] = useState('');

  const handleSelect = (pubkey: string) => {
    setDelegateePubkey(pubkey);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Add a delegatee</Button>
      </PopoverTrigger>
      <PopoverContent className="w-full m-4">
        <Input
          placeholder="Search..."
          className="mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <SearchResults key={search} search={search} handleSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
};
