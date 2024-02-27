import { useNavigate } from 'react-router-dom';

import { MainLayout } from '@/shared/components/main-layout';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';

import { BackButton } from '@/features/back-button';
import { MyDocs } from '@/features/my-docs';

import { useLoginGuard } from '@/shared/hooks/use-login-guard';
import { useMe } from '@/shared/hooks/use-me';

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

        <MyDocs publicKey={me?.pubkey} />
      </MainLayout>
    </>
  );
};
