import { useNavigate } from 'react-router-dom';

import { MainLayout } from '@/shared/components/main-layout';
import { Button } from '@/shared/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import { Separator } from '@/shared/components/ui/separator';

import { useMe } from '@/shared/hooks/use-me';

export const CollapsibleKeyPair = ({
  publicKey,
  privateKey,
}: {
  publicKey: string | undefined;
  privateKey: string | undefined;
}) => {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button size="sm" className="w-full" variant="outline">
          Key-Pair
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4 p-4 border rounded-md text-xs font-thin">
        <p>{publicKey}</p>
        <p>{privateKey}</p>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const HomePage = () => {
  const navigate = useNavigate();

  const { signer, me } = useMe();

  return (
    <MainLayout
      title={
        <>
          <span>Docstr</span>

          {signer ? (
            <Button
              size="sm"
              className="ml-auto"
              variant="outline"
              onClick={() => {
                navigate('/logout');
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              className="ml-auto"
              variant="outline"
              onClick={() => {
                navigate('/login');
              }}
            >
              Login
            </Button>
          )}
        </>
      }
    >
      <div className="flex gap-4 items-center">
        <Button
          size="sm"
          className="w-full"
          onClick={() => {
            navigate('/my');
          }}
        >
          My Docs
        </Button>

        <Button
          size="sm"
          className="w-full"
          onClick={() => {
            navigate('/explore');
          }}
        >
          Explore Docs
        </Button>
      </div>

      {me && (
        <>
          <Separator className="my-4" />

          <CollapsibleKeyPair publicKey={me?.pubkey} privateKey={signer?.privateKey} />
        </>
      )}
    </MainLayout>
  );
};
