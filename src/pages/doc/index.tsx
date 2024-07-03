import { formatRelative } from 'date-fns';
import { Loader2, Trash2Icon } from 'lucide-react';
import { useNip07 } from 'nostr-hooks';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NOSTR_ICON_URL } from '@/shared/config';

import { loader } from '@/shared/utils';

import { useDocument } from '@/shared/hooks/use-document';

import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/components/ui/hover-card';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Muted } from '@/shared/components/ui/typography/muted';

import { BackButton } from '@/features/back-button';
import { Delegatee } from '@/features/delegatee';
import { Markdown } from '@/features/markdown';

export const DocPage = () => {
  const [titleInput, setTitleInput] = useState('');

  const { naddr } = useParams();

  useNip07();

  const {
    content,
    canEdit,
    markdownRef,
    delegateeUser,
    lastEditor,
    owner,
    status,
    title,
    updateDocument,
    isDelegatedToMe,
    isMyDocument,
    delegateePubkey,
    setDelegateePubkey,
    mostRecentEvent,
  } = useDocument({ naddr });

  useEffect(() => {
    setTitleInput(title || '');
  }, [title, setTitleInput]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        updateDocument(titleInput, markdownRef.current?.getMarkdown() || '');
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [updateDocument, titleInput]);

  if (status == 'loading') {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="mt-4 animate-spin w-10 h-10" />
      </div>
    );
  }

  if (status == 'not-found') {
    return <p>No document found</p>;
  }

  return (
    <>
      <div className="m-4 flex gap-2 items-center">
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

        {canEdit && (
          <Button
            className="ml-auto flex items-center gap-4"
            onClick={() => updateDocument(titleInput, markdownRef.current?.getMarkdown() || '')}
          >
            <span>Save</span>

            <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground opacity-100">
              <span className="text-lg">⌘</span>S
            </kbd>
          </Button>
        )}
      </div>

      {canEdit && (
        <div className="mb-4 mx-4">
          <Input
            autoFocus
            placeholder="Title"
            className="text-lg sm:text-2xl font-semibold h-14"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
        </div>
      )}

      <Card className="m-4 p-4 flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex group">
            <Avatar className="w-8 h-8">
              <AvatarImage src={loader(owner?.image || NOSTR_ICON_URL)} alt={owner?.displayName} />
            </Avatar>
            {delegateeUser && (
              <Avatar className="-ml-2 w-8 h-8 group-hover:ml-0 transition-all">
                <AvatarImage
                  src={loader(delegateeUser.image || NOSTR_ICON_URL)}
                  alt={delegateeUser.displayName}
                />
              </Avatar>
            )}
          </div>

          <div className="max-w-80">
            <p className="truncate">
              {owner ? owner.displayName : mostRecentEvent?.author.npub || 'N/A'}
            </p>

            {delegateeUser && <p className="truncate">{delegateeUser.displayName}</p>}
          </div>
        </div>

        {/* <div className="text-muted-foreground flex items-center gap-2">
          <span>Owner:</span>

          <HoverCard>
            <HoverCardTrigger className="cursor-pointer hover:underline">
              {owner === undefined ? (
                <Skeleton className="w-16 h-4" />
              ) : owner === null ? (
                'N/A'
              ) : (
                owner.name
              )}
            </HoverCardTrigger>
            <HoverCardContent className="flex items-center gap-4">
              <Avatar>
                {owner?.image && (
                  <AvatarImage src={loader(owner?.image || '')} alt={owner?.name || 'avatar'} />
                )}
              </Avatar>
              <div>
                <h4>{owner?.name || 'N/A'}</h4>
                <Muted>{owner?.nip05 || ''}</Muted>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div> */}

        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={loader(lastEditor?.image || NOSTR_ICON_URL)}
              alt={lastEditor?.displayName}
            />
          </Avatar>

          <p className="font-light truncate">
            {mostRecentEvent && mostRecentEvent.created_at
              ? formatRelative(mostRecentEvent.created_at * 1000, new Date())
              : 'N/A'}
          </p>
        </div>
      </Card>

      <div className="mx-4 border rounded-lg">
        <Markdown
          markdownRef={markdownRef}
          content={content}
          readonly={!canEdit}
          hideToolbar={!canEdit}
          key={canEdit ? 'edit' : 'view'}
        />
      </div>

      {isMyDocument ? (
        Boolean(delegateePubkey) ? (
          <div className="mx-4 mt-8">
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
                        delegateePubkey.slice(0, 6) + '...'
                      ) : (
                        delegateeUser.name
                      )}
                    </HoverCardTrigger>
                    <HoverCardContent className="flex items-center gap-4">
                      <Avatar>
                        {delegateeUser?.image && (
                          <AvatarImage
                            src={loader(delegateeUser?.image || '')}
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
                  onClick={() => setDelegateePubkey('')}
                >
                  <span>Revoke access</span>
                  <Trash2Icon className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mx-4 mt-8">
            <Card>
              <CardContent className="pt-5">
                <p className="mb-2">
                  <span className="text-muted-foreground">Who can edit this document?{` `}</span>
                  <span className="font-semibold">Only me!</span>
                </p>
                <p className="mb-2 text-muted-foreground">
                  Add a delegatee to allow someone else to edit this document.
                </p>
                <Delegatee setDelegateePubkey={setDelegateePubkey} />
              </CardContent>
            </Card>
          </div>
        )
      ) : null}

      {isDelegatedToMe && (
        <div className="mx-4 mt-4">
          <Muted>This document is delegated to you by the owner</Muted>
        </div>
      )}
    </>
  );
};
