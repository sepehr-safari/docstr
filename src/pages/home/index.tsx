import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/ui/button';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
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
    </>
  );
};
