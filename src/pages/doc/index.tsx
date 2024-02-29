import { MDXEditorMethods } from '@mdxeditor/editor';
import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { Loader2, Trash2Icon } from 'lucide-react';
import { useActiveUser, useNdk, useNewEvent, useNip07, useSubscribe } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MainLayout } from '@/shared/components/main-layout';
import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/components/ui/hover-card';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Muted } from '@/shared/components/ui/typography/muted';
import { useToast } from '@/shared/components/ui/use-toast';

import { BackButton } from '@/features/back-button';
import { Delegatee } from '@/features/delegatee';
import { Markdown } from '@/features/markdown';

import { DOC_KIND } from '@/shared/config';

const View = ({ data }: { data: nip19.AddressPointer }) => {
  const [titleInput, setTitleInput] = useState('');
  const [delegateeState, setDelegateeState] = useState('');
  const [delegateeUser, setDelegateeUser] = useState<NDKUserProfile | null>();
  const [owner, setOwner] = useState<NDKUserProfile | null>();
  const [lastEditor, setLastEditor] = useState<NDKUserProfile | null>();
  const markdownRef = useRef<MDXEditorMethods>(null);

  useNip07();
  const { createNewEvent } = useNewEvent();
  const { activeUser } = useActiveUser();
  const { ndk } = useNdk();

  const { toast } = useToast();

  const { identifier, kind, pubkey } = data;

  const { events: originalEvents, eose: originalEose } = useSubscribe({
    filters: [{ kinds: [kind], '#d': [identifier], authors: [pubkey], limit: 1 }],
    enabled: !!identifier && !!kind && !!pubkey,
  });
  const isMyDocument =
    originalEvents.length > 0 && activeUser && originalEvents[0].pubkey === activeUser.pubkey;
  const isDelegatedToMe =
    originalEvents.length > 0 &&
    activeUser &&
    originalEvents[0].tags.some(([k, delegatee]) => k == 'D' && delegatee == activeUser.pubkey);
  const editMode = isMyDocument || isDelegatedToMe;

  const [, delegatee] = originalEvents[0]?.tags.find(([k]) => k == 'D') || [];

  const {
    events: delegateeEvents,
    eose: delegateeEose,
    isSubscribed: isDelegateeSubscribed,
  } = useSubscribe({
    filters: [{ kinds: [kind], '#d': [identifier], authors: [delegatee], limit: 1 }],
    enabled: !!identifier && !!kind && !!delegatee,
  });

  let mostRecentEvent = originalEvents.length > 0 ? originalEvents[0] : undefined;

  if (
    delegateeEvents.length > 0 &&
    delegateeEvents[0].created_at &&
    mostRecentEvent &&
    mostRecentEvent.created_at &&
    delegateeEvents[0].created_at > mostRecentEvent.created_at
  ) {
    mostRecentEvent = delegateeEvents[0];
  }

  const title = mostRecentEvent?.tagValue('title');
  const content = mostRecentEvent?.content;

  const handleSave = () => {
    const markdown = markdownRef.current?.getMarkdown();

    const e = createNewEvent();
    e.kind = DOC_KIND;
    e.content = markdown || '';
    e.generateTags();
    e.tags = [
      ['title', titleInput],
      ['d', mostRecentEvent?.dTag || ''],
    ];

    if (isMyDocument) {
      e.tags.push(['D', delegateeState, activeUser.pubkey]); // delegatee, delegator
    }

    if (isDelegatedToMe) {
      e.tags.push(['D', '', originalEvents[0]?.pubkey]); // delegatee, delegator
    }

    e.publish().then(() => {
      toast({
        title: 'Saved!',
      });
    });
  };

  useEffect(() => {
    setTitleInput(title || '');
    setDelegateeState(delegatee);
    markdownRef.current?.setMarkdown(content || '');
  }, [title, content, setTitleInput, delegatee, setDelegateeState]);

  useEffect(() => {
    if (originalEvents.length > 0) {
      originalEvents[0].author.fetchProfile().then((profile) => {
        setOwner(profile);
      });
    }
  }, [originalEvents]);

  useEffect(() => {
    if (mostRecentEvent) {
      mostRecentEvent.author.fetchProfile().then((profile) => {
        setLastEditor(profile);
      });
    }
  }, [mostRecentEvent]);

  useEffect(() => {
    if (!!delegateeState) {
      ndk
        .getUser({ pubkey: delegateeState })
        .fetchProfile({ groupable: false })
        .then((profile) => {
          setDelegateeUser(profile);
        });
    }
  }, [ndk, delegateeState, setDelegateeUser]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [handleSave]);

  if (!originalEose || (isDelegateeSubscribed && !delegateeEose && !delegateeEvents)) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin w-16 h-16" />
      </div>
    );
  }

  if (mostRecentEvent == undefined && originalEose) {
    return <p>No document found</p>;
  }

  return (
    <>
      <MainLayout
        title={
          <>
            <BackButton />

            <div>
              <p className="text-xl font-semibold">
                {isMyDocument
                  ? 'Edit your document'
                  : isDelegatedToMe
                    ? 'Edit delegated document'
                    : title}
              </p>
            </div>

            {editMode && (
              <Button className="ml-auto flex items-center gap-4" onClick={() => handleSave()}>
                <span>Save</span>

                <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground opacity-100">
                  <span className="text-lg">⌘</span>S
                </kbd>
              </Button>
            )}
          </>
        }
      >
        <Card className="mb-8 pt-6">
          <CardContent className="flex items-center gap-4">
            <p className="text-muted-foreground flex items-center gap-2">
              <span>Owner:</span>

              <HoverCard>
                <HoverCardTrigger className="cursor-pointer hover:underline">
                  {owner === undefined ? (
                    <Skeleton className="w-16 h-4" />
                  ) : owner === null ? (
                    originalEvents[0]?.pubkey.slice(0, 6) + '...'
                  ) : (
                    owner.name
                  )}
                </HoverCardTrigger>
                <HoverCardContent className="flex items-center gap-4">
                  <Avatar>
                    {owner?.image && (
                      <AvatarImage src={owner?.image || ''} alt={owner?.name || 'avatar'} />
                    )}
                  </Avatar>
                  <div>
                    <h4>{owner?.name || 'Anonostrich'}</h4>
                    <Muted>{owner?.nip05 || ''}</Muted>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <span>Last edit by:</span>

              <HoverCard>
                <HoverCardTrigger className="cursor-pointer hover:underline">
                  {lastEditor === undefined ? (
                    <Skeleton className="w-16 h-4" />
                  ) : lastEditor === null ? (
                    mostRecentEvent?.pubkey.slice(0, 6) + '...'
                  ) : (
                    lastEditor.name
                  )}
                </HoverCardTrigger>
                <HoverCardContent className="flex items-center gap-4">
                  <Avatar>
                    {lastEditor?.image && (
                      <AvatarImage
                        src={lastEditor?.image || ''}
                        alt={lastEditor?.name || 'avatar'}
                      />
                    )}
                  </Avatar>
                  <div>
                    <h4>{lastEditor?.name || 'Anonostrich'}</h4>
                    <Muted>{lastEditor?.nip05 || ''}</Muted>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </p>
          </CardContent>
        </Card>

        {editMode && (
          <div className="mb-8 flex flex-col sm:flex-row items-baseline gap-4">
            <span className="text-xl font-semibold">Title:</span>

            <Input
              autoFocus
              placeholder="Title"
              className="text-lg sm:text-2xl font-semibold h-14"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />
          </div>
        )}

        <div className="border rounded-lg">
          <Markdown
            markdownRef={markdownRef}
            markdown={content || ''}
            readonly={!editMode}
            hideToolbar={!editMode}
            key={editMode ? 'edit' : 'view'}
          />
        </div>

        {isMyDocument ? (
          delegateeState ? (
            <div className="mt-8">
              <Card>
                <CardContent className="pt-5">
                  <p className="mb-2">
                    <span className="text-muted-foreground">Who can edit this document?{` `}</span>
                    <span className="font-semibold">Me and </span>
                    <HoverCard open={delegateeUser === null ? false : undefined}>
                      <HoverCardTrigger className="cursor-pointer font-semibold hover:underline">
                        {delegateeUser === undefined ? (
                          <Skeleton className="w-16 h-4" />
                        ) : delegateeUser === null ? (
                          delegateeState.slice(0, 6) + '...'
                        ) : (
                          delegateeUser.name
                        )}
                      </HoverCardTrigger>
                      <HoverCardContent className="flex items-center gap-4">
                        <Avatar>
                          {delegateeUser?.image && (
                            <AvatarImage
                              src={delegateeUser?.image || ''}
                              alt={delegateeUser?.name || 'avatar'}
                            />
                          )}
                        </Avatar>
                        <div>
                          <h4>{delegateeUser?.name || 'Anonostrich'}</h4>
                          <Muted>{delegateeUser?.nip05 || ''}</Muted>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </p>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex gap-1 items-center"
                    onClick={() => setDelegateeState('')}
                  >
                    <span>Revoke access</span>
                    <Trash2Icon className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="mt-8">
              <Card>
                <CardContent className="pt-5">
                  <p className="mb-2">
                    <span className="text-muted-foreground">Who can edit this document?{` `}</span>
                    <span className="font-semibold">Only me!</span>
                  </p>
                  <p className="mb-2 text-muted-foreground">
                    Add a delegatee to allow someone else to edit this document.
                  </p>
                  <Delegatee setDelegateeState={setDelegateeState} />
                </CardContent>
              </Card>
            </div>
          )
        ) : null}

        {isDelegatedToMe && (
          <div className="mt-4">
            <Muted>This document is delegated to you by the owner</Muted>
          </div>
        )}
      </MainLayout>
    </>
  );
};

export const DocPage = () => {
  const { naddr } = useParams();

  const { data, type } = nip19.decode(naddr || '');

  if (type != 'naddr') return null;

  return (
    <>
      <View data={data} key={data.identifier + data.kind + data.pubkey} />
    </>
  );
};
