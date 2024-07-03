import { MDXEditorMethods } from '@mdxeditor/editor';
import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { Trash2Icon } from 'lucide-react';
import { useActiveUser, useNdk, useNewEvent, useNip07 } from 'nostr-hooks';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DOC_KIND } from '@/shared/config';
import { loader } from '@/shared/utils';

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

export const NewPage = () => {
  const [titleInput, setTitleInput] = useState('');
  const [delegateePubkey, setDelegateePubkey] = useState('');
  const [delegateeUser, setDelegateeUser] = useState<NDKUserProfile | null>();
  const markdownRef = useRef<MDXEditorMethods>(null);

  useNip07();
  const { createNewEvent } = useNewEvent();
  const { activeUser } = useActiveUser();
  const { ndk } = useNdk();

  const { toast } = useToast();

  const navigate = useNavigate();

  const handlePublish = () => {
    if (!activeUser) {
      toast({ title: 'You need to be logged in to create a document' });
      return;
    }

    if (!titleInput) {
      toast({ title: 'Title is required' });
      return;
    }

    const markdown = markdownRef.current?.getMarkdown();

    const e = createNewEvent();
    e.kind = DOC_KIND;
    e.content = markdown || '';
    e.tags = [
      ['title', titleInput],
      ['D', delegateePubkey, activeUser.pubkey],
    ];
    e.generateTags();
    e.publish().then(() => {
      navigate('/doc/' + e.encode(), { replace: true });
    });
  };

  useEffect(() => {
    if (!!delegateePubkey) {
      ndk
        .getUser({ pubkey: delegateePubkey })
        .fetchProfile({ groupable: false })
        .then((profile) => {
          setDelegateeUser(profile);
        });
    }
  }, [ndk, delegateePubkey, setDelegateeUser]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handlePublish();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [handlePublish]);

  return (
    <>
      <div className="m-4 flex gap-2 items-center">
        <BackButton />

        <div>
          <p className="text-xl font-semibold">New Document</p>
        </div>

        <Button className="ml-auto flex items-center gap-4" onClick={() => handlePublish()}>
          <span>Publish</span>

          <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground opacity-100">
            <span className="text-lg">⌘</span>S
          </kbd>
        </Button>
      </div>

      <div className="mb-4 mx-4">
        <Input
          autoFocus
          placeholder="Title"
          className="text-lg sm:text-2xl font-semibold h-14"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />
      </div>

      <div className="mx-4 border rounded-lg">
        <Markdown markdownRef={markdownRef} content="" />
      </div>

      {Boolean(delegateePubkey) ? (
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
      )}
    </>
  );
};
