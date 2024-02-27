import { MDXEditorMethods } from '@mdxeditor/editor';
import { useNewEvent } from 'nostr-hooks';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BackButton } from '@/features/back-button';
import { Markdown } from '@/features/markdown';

import { MainLayout } from '@/shared/components/main-layout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';

import { useLoginGuard } from '@/shared/hooks/use-login-guard';
import { useMe } from '@/shared/hooks/use-me';

import { DOC_KIND } from '@/shared/config';

export const NewPage = () => {
  const markdownRef = useRef<MDXEditorMethods>(null);
  const [delegateeInput, setDelegateeInput] = useState('');
  const [title, setTitle] = useState('');

  const { me } = useMe();

  const { toast } = useToast();

  const { createNewEvent } = useNewEvent();

  const navigate = useNavigate();

  useLoginGuard();

  return (
    <>
      <MainLayout
        title={
          <>
            <BackButton />

            <span>New Document</span>

            <Button
              className="ml-auto"
              onClick={() => {
                if (!me) {
                  toast({ title: 'Error' });
                  return;
                }

                if (!title) {
                  toast({ title: 'Title is required' });
                  return;
                }

                const markdown = markdownRef.current?.getMarkdown();

                const e = createNewEvent();
                e.kind = DOC_KIND;
                e.content = markdown || '';
                e.tags = [
                  ['title', title],
                  ['D', delegateeInput, me.pubkey],
                ];
                e.generateTags();
                e.publish().then(() => {
                  navigate('/doc/' + e.encode(), { replace: true });
                });
              }}
            >
              Publish
            </Button>
          </>
        }
      >
        <Input
          autoFocus
          placeholder="Title"
          className="mb-4 text-2xl font-bold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Markdown markdownRef={markdownRef} />

        <Input
          placeholder="Delegatee Pubkey (you can change this later)"
          className="mt-4"
          value={delegateeInput}
          onChange={(e) => setDelegateeInput(e.target.value)}
        />
      </MainLayout>
    </>
  );
};
