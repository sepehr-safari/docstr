import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MainLayout } from '@/shared/components/main-layout';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import { useToast } from '@/shared/components/ui/use-toast';

import { BackButton } from '@/features/back-button';

import { useStore } from '@/shared/store';

export const LoginWithNewKey = () => {
  const { setSigner } = useStore();

  const navigate = useNavigate();

  const { toast } = useToast();

  return (
    <>
      <Button
        size="sm"
        className="w-full"
        onClick={() => {
          const privateKeySigner = NDKPrivateKeySigner.generate();

          setSigner(privateKeySigner);

          toast({
            title: 'Logged in!',
          });

          navigate('/my');
        }}
      >
        Generate New Key
      </Button>
    </>
  );
};

export const LoginWithExistingKey = () => {
  const [privateKey, setPrivateKey] = useState('');

  const { setSigner } = useStore();

  const navigate = useNavigate();

  const { toast } = useToast();

  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="Enter your private key"
        onChange={(e) => setPrivateKey(e.target.value)}
        value={privateKey}
      />

      <Button
        size="sm"
        onClick={() => {
          const privateKeySigner = new NDKPrivateKeySigner(privateKey);

          setSigner(privateKeySigner);

          toast({
            title: 'Logged in!',
          });

          navigate('/my');
        }}
      >
        Login
      </Button>
    </div>
  );
};

export const LoginPage = () => {
  const { signer } = useStore();

  const navigate = useNavigate();

  const { toast } = useToast();

  useEffect(() => {
    if (signer) {
      toast({
        title: 'Already logged in!',
      });

      navigate('/');
    }
  }, [signer, toast, navigate]);

  return (
    <>
      <MainLayout
        title={
          <>
            <BackButton />
            Login
          </>
        }
      >
        <LoginWithExistingKey />

        <Separator className="my-4" />

        <LoginWithNewKey />
      </MainLayout>
    </>
  );
};
