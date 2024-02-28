import { MDXEditorMethods } from '@mdxeditor/editor';
import { Loader2 } from 'lucide-react';
import { useNewEvent, useSubscribe } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MainLayout } from '@/shared/components/main-layout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Muted } from '@/shared/components/ui/typography/muted';
import { useToast } from '@/shared/components/ui/use-toast';

import { BackButton } from '@/features/back-button';
import { Markdown } from '@/features/markdown';

import { useMe } from '@/shared/hooks/use-me';

import { DOC_KIND } from '@/shared/config';

const View = ({ data }: { data: nip19.AddressPointer }) => {
  const [titleInput, setTitleInput] = useState('');
  const [delegateeInput, setDelegateeInput] = useState('');
  const markdownRef = useRef<MDXEditorMethods>(null);

  const { me } = useMe();

  const { toast } = useToast();

  const { createNewEvent } = useNewEvent();

  const { identifier, kind, pubkey } = data;

  const { events: originalEvents, eose: originalEose } = useSubscribe({
    filters: [{ kinds: [kind], '#d': [identifier], authors: [pubkey] }],
    enabled: !!identifier && !!kind && !!pubkey,
  });
  const isMyDocument = originalEvents.length > 0 && me && originalEvents[0].pubkey === me.pubkey;
  const isDelegatedToMe =
    originalEvents.length > 0 &&
    me &&
    originalEvents[0].tags.some(([k, delegatee]) => k == 'D' && delegatee == me.pubkey);
  const editMode = isMyDocument || isDelegatedToMe;

  const [, delegatee] = originalEvents[0]?.tags.find(([k]) => k == 'D') || [];

  const {
    events: delegateeEvents,
    eose: delegateeEose,
    isSubscribed: isDelegateeSubscribed,
  } = useSubscribe({
    filters: [{ kinds: [kind], '#d': [identifier], authors: [delegatee] }],
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

  useEffect(() => {
    setTitleInput(title || '');
    setDelegateeInput(delegatee);
    markdownRef.current?.setMarkdown(content || '');
  }, [title, content, setTitleInput, delegatee, setDelegateeInput]);

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
              <p>
                {isMyDocument
                  ? 'Edit your document'
                  : isDelegatedToMe
                    ? 'Edit delegated document'
                    : title}
              </p>

              <p className="mt-2 text-muted-foreground text-xs">
                Owner:{' '}
                {originalEvents[0]?.pubkey.slice(0, 5) +
                  '...' +
                  originalEvents[0]?.pubkey.slice(-5)}
              </p>
              <p className="mt-2 text-muted-foreground text-xs">
                Last edit by:{' '}
                {mostRecentEvent?.pubkey.slice(0, 5) + '...' + mostRecentEvent?.pubkey.slice(-5)}
              </p>
            </div>

            {editMode && (
              <Button
                className="ml-auto"
                onClick={() => {
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
                    e.tags.push(['D', delegateeInput, me.pubkey]); // delegatee, delegator
                  }

                  if (isDelegatedToMe) {
                    e.tags.push(['D', '', originalEvents[0]?.pubkey]); // delegatee, delegator
                  }

                  e.publish().then(() => {
                    toast({
                      title: 'Saved!',
                    });
                  });
                }}
              >
                Save
              </Button>
            )}
          </>
        }
      >
        {editMode && (
          <Input
            autoFocus
            placeholder="Title"
            className="mb-4 text-2xl font-bold"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
        )}

        <Markdown
          markdownRef={markdownRef}
          markdown={content || ''}
          readonly={!editMode}
          hideToolbar={!editMode}
        />

        {isMyDocument && (
          <Input
            placeholder="Delegatee Pubkey (you can change this later)"
            className="mt-4"
            value={delegateeInput}
            onChange={(e) => setDelegateeInput(e.target.value)}
          />
        )}

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
      <View data={data} />
    </>
  );
};
