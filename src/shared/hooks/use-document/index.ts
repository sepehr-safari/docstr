import { MDXEditorMethods } from '@mdxeditor/editor';
import { NDKEvent, NDKKind, NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useActiveUser, useNdk, useNewEvent, useSubscribe } from 'nostr-hooks';
import { nip19 } from 'nostr-tools';
import { useEffect, useRef, useState } from 'react';

import { DOC_KIND } from '@/shared/config';

import { useToast } from '@/shared/components/ui/use-toast';

export const useDocument = ({ naddr }: { naddr: string | undefined }) => {
  const markdownRef = useRef<MDXEditorMethods>(null);

  const [lastEditor, setLastEditor] = useState<NDKUserProfile | null>();
  const [delegateeUser, setDelegateeUser] = useState<NDKUserProfile | null>();
  const [owner, setOwner] = useState<NDKUserProfile | null>();

  const [kind, setKind] = useState<NDKKind>();
  const [identifier, setIdentifier] = useState<string>();
  const [pubkey, setPubkey] = useState<string>();

  const [mostRecentEvent, setMostRecentEvent] = useState<NDKEvent>();

  const [isMyDocument, setIsMyDocument] = useState<boolean>(false);
  const [isDelegatedToMe, setIsDelegatedToMe] = useState<boolean>(false);

  const [canEdit, setCanEdit] = useState<boolean>(false);

  const [delegateePubkey, setDelegateePubkey] = useState<string>('');

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const { createNewEvent } = useNewEvent();
  const { activeUser } = useActiveUser();
  const { ndk } = useNdk();

  const { toast } = useToast();

  useEffect(() => {
    const { data, type } = nip19.decode(naddr || '');

    if (type != 'naddr') return;

    const { identifier, kind, pubkey } = data;

    setKind(kind);
    setIdentifier(identifier);
    setPubkey(pubkey);
  }, [naddr, setKind, setIdentifier, setPubkey]);

  const { events: originalEvents, eose: originalEose } = useSubscribe({
    filters:
      !!kind && !!identifier && !!pubkey
        ? [{ kinds: [kind], '#d': [identifier], authors: [pubkey] }]
        : [],
    enabled: !!kind && !!identifier && !!pubkey,
  });

  const {
    events: delegateeEvents,
    eose: delegateeEose,
    isSubscribed: isDelegateeSubscribed,
  } = useSubscribe({
    filters:
      !!kind && !!identifier && !!delegateePubkey
        ? [{ kinds: [kind], '#d': [identifier], authors: [delegateePubkey] }]
        : [],
    enabled: !!kind && !!identifier && !!delegateePubkey,
  });

  useEffect(() => {
    if (originalEvents.length > 0) {
      setMostRecentEvent(originalEvents[0]);
    }
  }, [originalEvents, setMostRecentEvent]);

  useEffect(() => {
    if (originalEvents.length > 0 && activeUser) {
      setIsMyDocument(originalEvents[0].pubkey === activeUser.pubkey);

      setIsDelegatedToMe(
        originalEvents[0].tags.some(
          ([k, delegatee]) => k == 'D' && delegatee === activeUser.pubkey,
        ),
      );
    }
  }, [originalEvents, activeUser, setIsDelegatedToMe, setIsMyDocument]);

  useEffect(() => {
    setCanEdit(isMyDocument || isDelegatedToMe);
  }, [isDelegatedToMe, isMyDocument, setCanEdit]);

  useEffect(() => {
    const [, delegateePubkey] = originalEvents[0]?.tags.find(([k]) => k == 'D') || [];

    setDelegateePubkey(delegateePubkey);
  }, [originalEvents, setDelegateePubkey]);

  useEffect(() => {
    setMostRecentEvent((prev) => {
      if (!prev) return;
      if (!prev.created_at) return;
      if (delegateeEvents.length == 0) return;
      if (!delegateeEvents[0].created_at) return;

      if (delegateeEvents[0].created_at > prev.created_at) return delegateeEvents[0];
    });
  }, [delegateeEvents, setMostRecentEvent]);

  useEffect(() => {
    if (!mostRecentEvent) return;

    setTitle(mostRecentEvent.tagValue('title') || '');
    setContent(mostRecentEvent.content || '');
  }, [mostRecentEvent, setTitle, setContent]);

  useEffect(() => {
    if (mostRecentEvent) {
      mostRecentEvent.author.fetchProfile().then((profile) => {
        setLastEditor(profile);
      });
    }
  }, [mostRecentEvent, setLastEditor]);

  useEffect(() => {
    if (originalEvents.length == 0) return;

    originalEvents[0].author.fetchProfile().then((profile) => {
      setOwner(profile);
    });
  }, [originalEvents, setOwner]);

  useEffect(() => {
    if (!delegateePubkey) return;

    ndk
      .getUser({ pubkey: delegateePubkey })
      .fetchProfile({ groupable: true })
      .then((profile) => {
        setDelegateeUser(profile);
      });
  }, [ndk, delegateePubkey, setDelegateeUser]);

  useEffect(() => {
    markdownRef.current?.setMarkdown(content || '');
  }, [content]);

  const updateDocument = (title: string, content: string) => {
    if (!mostRecentEvent) return;
    if (!activeUser) return;

    const e = createNewEvent();
    e.kind = DOC_KIND;
    e.content = content;
    e.generateTags();
    e.tags = [
      ['title', title],
      ['d', mostRecentEvent?.dTag || ''],
    ];

    if (isMyDocument) {
      e.tags.push(['D', delegateePubkey, activeUser.pubkey]); // delegatee, delegator
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

  return {
    canEdit,
    content,
    markdownRef,
    delegateeUser,
    lastEditor,
    owner,
    title,
    updateDocument,
    isMyDocument,
    isDelegatedToMe,
    delegateePubkey,
    setDelegateePubkey,
    status: (!originalEose || (isDelegateeSubscribed && !delegateeEose && !delegateeEvents)
      ? 'loading'
      : mostRecentEvent == undefined && originalEose
        ? 'not-found'
        : 'ok') as 'ok' | 'loading' | 'not-found',
  };
};
