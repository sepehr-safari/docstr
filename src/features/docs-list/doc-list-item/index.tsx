import { NDKEvent } from '@nostr-dev-kit/ndk';
import { useSubscribe } from 'nostr-hooks';

import { Skeleton } from '@/shared/components/ui/skeleton';

import { DOC_KIND } from '@/shared/config';

export const DocListItem = ({ originalEvent }: { originalEvent: NDKEvent }) => {
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

  if (isSubscribed && !delegateeEose) return <Skeleton className="w-1/2 h-5" />;

  return (
    <div>
      <p>{title}</p>
    </div>
  );
};
