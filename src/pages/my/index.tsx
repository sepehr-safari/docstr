import { useActiveUser, useNip07 } from 'nostr-hooks';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '@/shared/components/main-layout';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';

import { BackButton } from '@/features/back-button';
import { MyDocs } from '@/features/my-docs';

export const MyPage = () => {
  useNip07();
  const { activeUser } = useActiveUser();

  const navigate = useNavigate();

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

        <MyDocs publicKey={activeUser?.pubkey} />
      </MainLayout>
    </>
  );
};
