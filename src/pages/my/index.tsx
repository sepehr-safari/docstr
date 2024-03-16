import { useActiveUser, useNip07 } from 'nostr-hooks';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';

import { BackButton } from '@/features/back-button';
import { MyDocs } from '@/features/my-docs';

export const MyPage = () => {
  useNip07();
  const { activeUser } = useActiveUser();

  const navigate = useNavigate();

  return (
    <>
      <div className="mb-4 flex gap-4 items-center">
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
      </div>

      <div>
        <MyDocs publicKey={activeUser?.pubkey} />
      </div>
    </>
  );
};
