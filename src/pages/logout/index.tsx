import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/shared/components/ui/use-toast';

import { useStore } from '@/shared/store';

export const LogoutPage = () => {
  const { setSigner } = useStore();

  const navigate = useNavigate();

  const { toast } = useToast();

  useEffect(() => {
    setSigner(undefined);

    toast({
      title: 'Logged out!',
    });

    navigate('/');
  }, [setSigner, navigate, toast]);

  return null;
};
