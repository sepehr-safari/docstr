import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          navigate(-1);
        }}
      >
        <ArrowLeftIcon size={16} />
      </Button>
    </>
  );
};
