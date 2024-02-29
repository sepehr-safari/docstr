import { NDKEvent, NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useNdk, useSubscribe } from 'nostr-hooks';
import { useEffect, useState } from 'react';

import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { DOC_KIND } from '@/shared/config';

export const DocListItem = ({ originalEvent }: { originalEvent: NDKEvent }) => {
  const [owner, setOwner] = useState<NDKUserProfile | null>();
  const [delegateeUser, setDelegateeUser] = useState<NDKUserProfile | null>();

  const { ndk } = useNdk();

  const [, delegatee] = originalEvent.tags.find(([k]) => k == 'D') || [];

  const {
    events: delegateeEvents,
    eose: delegateeEose,
    isSubscribed,
  } = useSubscribe({
    filters: [
      {
        kinds: [originalEvent.kind || DOC_KIND],
        '#d': [originalEvent.dTag || ''],
        authors: [delegatee],
        limit: 1,
      },
    ],
    enabled: !!originalEvent.dTag && !!originalEvent.kind && !!delegatee,
  });

  let mostRecentEvent = originalEvent;

  if (
    delegateeEvents.length > 0 &&
    delegateeEvents[0].created_at &&
    mostRecentEvent &&
    mostRecentEvent.created_at &&
    delegateeEvents[0].created_at > mostRecentEvent.created_at
  ) {
    mostRecentEvent = delegateeEvents[0];
  }

  const title = mostRecentEvent.tagValue('title');

  useEffect(() => {
    originalEvent.author.fetchProfile().then((profile) => {
      setOwner(profile);
    });
  }, [originalEvent]);

  useEffect(() => {
    if (!!delegatee) {
      ndk
        .getUser({ pubkey: delegatee })
        .fetchProfile({ groupable: false })
        .then((profile) => {
          setDelegateeUser(profile);
        });
    }
  }, [ndk, delegatee, setDelegateeUser]);

  if (isSubscribed && !delegateeEose && !delegateeEvents) return <Skeleton className="w-1/2 h-5" />;

  return (
    <div>
      <h3>{title}</h3>

      <div className="mt-2 flex items-center gap-4">
        <div className="flex items-center">
          <Avatar className="w-8 h-8 rounded-full">
            <AvatarImage
              src={
                owner?.image ||
                'https://primal.b-cdn.net/media-cache?s=m&a=1&u=https%3A%2F%2Fraw.githubusercontent.com%2Fsepehr-safari%2Fnostribe-web-client%2Fmain%2Fpublic%2Fnostribe.png'
              }
              alt={owner?.name || 'avatar'}
            />
          </Avatar>

          <div className="ml-2">
            <p className="text-muted-foreground">{owner?.name || 'Nostrich'}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Avatar className="w-8 h-8 rounded-full">
            <AvatarImage
              src={
                delegateeUser?.image ||
                'https://primal.b-cdn.net/media-cache?s=m&a=1&u=https%3A%2F%2Fraw.githubusercontent.com%2Fsepehr-safari%2Fnostribe-web-client%2Fmain%2Fpublic%2Fnostribe.png'
              }
              alt={delegateeUser?.name || 'avatar'}
            />
          </Avatar>

          <div className="ml-2">
            <p className="text-muted-foreground">{delegateeUser?.name || 'Nostrich'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
