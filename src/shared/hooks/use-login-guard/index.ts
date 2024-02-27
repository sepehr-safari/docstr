import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/shared/components/ui/use-toast';

import { useStore } from '@/shared/store';

export const useLoginGuard = () => {
  const navigate = useNavigate();

  const { signer } = useStore();

  const { toast } = useToast();

  useEffect(() => {
    if (!signer) {
      toast({
        title: 'You need to login first!',
        variant: 'destructive',
      });

      navigate('/login', { replace: true });
    }
  }, [signer, toast, navigate]);

  return {
    isLogged: !!signer,
  };
};
