import { ExternalLinkIcon, Loader2 } from 'lucide-react';
import { useSubscribe } from 'nostr-hooks';

import { MainLayout } from '@/shared/components/main-layout';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

import { useLoginGuard } from '@/shared/hooks/use-login-guard';
import { useMe } from '@/shared/hooks/use-me';

import { BackButton } from '@/features/back-button';
import { useNavigate } from 'react-router-dom';
import { NDKEvent } from '@nostr-dev-kit/ndk';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const DocItem = ({ originalEvent }: { originalEvent: NDKEvent }) => {
  const [, delegatee] = originalEvent.tags.find(([k]) => k == 'D') || [];

  const {
    events: delegateeEvents,
    eose: delegateeEose,
    isSubscribed,
  } = useSubscribe({
    filters: [
      {
        kinds: [originalEvent.kind || 30023],
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

export const OriginalDocsList = ({ publicKey = '' }: { publicKey: string | undefined }) => {
  const navigate = useNavigate();

  const { events, eose } = useSubscribe({
    filters: [{ kinds: [30023], authors: [publicKey] }],
    enabled: !!publicKey,
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
          <DocItem originalEvent={event} />

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

export const DelegatedDocsList = ({ publicKey = '' }: { publicKey: string | undefined }) => {
  const navigate = useNavigate();

  const { events, eose } = useSubscribe({
    filters: [{ kinds: [30023], '#D': [publicKey] }],
    enabled: !!publicKey,
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
          <DocItem originalEvent={event} />

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

export const DocsList = ({ publicKey }: { publicKey: string | undefined }) => {
  return (
    <>
      <Tabs defaultValue="original">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="original">My original docs</TabsTrigger>
          <TabsTrigger value="delegated">Delegated to me</TabsTrigger>
        </TabsList>

        <TabsContent value="original">
          <OriginalDocsList publicKey={publicKey} />
        </TabsContent>

        <TabsContent value="delegated">
          <DelegatedDocsList publicKey={publicKey} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export const MyPage = () => {
  const { me } = useMe();

  const navigate = useNavigate();

  useLoginGuard();

  return (
    <>
      <MainLayout
        title={
          <>
            <BackButton />

            <span>My Docs</span>

            <Button
              size="sm"
              className="ml-auto"
              onClick={() => {
                navigate('/new');
              }}
            >
              New Document
            </Button>
          </>
        }
      >
        <Separator className="my-4" />

        <DocsList publicKey={me?.pubkey} />
      </MainLayout>
    </>
  );
};
