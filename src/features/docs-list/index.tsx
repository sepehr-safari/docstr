import { NDKKind } from '@nostr-dev-kit/ndk';
import { ExternalLinkIcon } from 'lucide-react';
import { useSubscribe } from 'nostr-hooks';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

import { DOC_KIND } from '@/shared/config';

import { DocListItem } from './doc-list-item';

// TODO: should merge these components into one
export const OriginalDocsList = ({ publicKey }: { publicKey: string | undefined }) => {
  const navigate = useNavigate();

  const { events, eose } = useSubscribe({
    filters: [{ kinds: [DOC_KIND as NDKKind], authors: [publicKey as string] }],
    enabled: publicKey != undefined,
  });

  const filteredEvents = events.filter((event) =>
    event.tags.some(([k, , delegator]) => k == 'D' && delegator == publicKey),
  );

  if (filteredEvents.length == 0 && !eose) {
    return (
      <div className="p-4 border rounded-md my-2">
        <Skeleton className="w-1/2 h-5" />
      </div>
    );
  }

  if (filteredEvents.length == 0 && eose) {
    return (
      <div className="p-4 border rounded-md my-2">
        <p>No documents found</p>
      </div>
    );
  }

  return (
    <>
      {filteredEvents.map((event) => (
        <div key={event.id} className="p-4 border rounded-md my-2 flex items-center">
          <DocListItem originalEvent={event} />

          <Button
            size="icon"
            className="ml-auto"
            variant="ghost"
            onClick={() => {
              navigate(`/doc/${event.encode()}`);
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </div>
      ))}
    </>
  );
};

export const DelegatedDocsList = ({ publicKey }: { publicKey: string | undefined }) => {
  const navigate = useNavigate();

  const { events, eose } = useSubscribe({
    filters: [{ kinds: [DOC_KIND as NDKKind], '#D': [publicKey as string] }],
    enabled: publicKey != undefined,
  });

  if (events.length == 0 && !eose) {
    return (
      <div className="p-4 border rounded-md my-2">
        <Skeleton className="w-1/2 h-5" />
      </div>
    );
  }

  if (events.length == 0 && eose) {
    return (
      <div className="p-4 border rounded-md my-2">
        <p>No documents found</p>
      </div>
    );
  }

  return (
    <>
      {events.map((event) => (
        <div key={event.id} className="p-4 border rounded-md my-2 flex items-center">
          <DocListItem originalEvent={event} />

          <Button
            size="icon"
            className="ml-auto"
            variant="ghost"
            onClick={() => {
              navigate(`/doc/${event.encode()}`);
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </div>
      ))}
    </>
  );
};

export const ExploreDocsList = () => {
  const navigate = useNavigate();

  const { events, eose } = useSubscribe({
    filters: [{ kinds: [DOC_KIND as NDKKind] }],
    enabled: true,
  });

  const filteredEvents = events.filter((event) =>
    event.tags.some(([k, , delegator]) => k == 'D' && event.pubkey == delegator),
  );

  if (filteredEvents.length == 0 && !eose) {
    return (
      <div className="p-4 border rounded-md my-2">
        <Skeleton className="w-1/2 h-5" />
      </div>
    );
  }

  if (filteredEvents.length == 0 && eose) {
    return (
      <div className="p-4 border rounded-md my-2">
        <p>No documents found</p>
      </div>
    );
  }

  return (
    <>
      {filteredEvents.map((event) => (
        <div key={event.id} className="p-4 border rounded-md my-2 flex items-center">
          <DocListItem originalEvent={event} />

          <Button
            size="icon"
            className="ml-auto"
            variant="ghost"
            onClick={() => {
              navigate(`/doc/${event.encode()}`);
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </div>
      ))}
    </>
  );
};
