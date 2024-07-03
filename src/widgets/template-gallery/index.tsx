import { CaretSortIcon } from '@radix-ui/react-icons';

import { Button } from '@/shared/components/ui/button';
import { H4 } from '@/shared/components/ui/typography/h4';
import { Preview } from '@/features/preview';
import { useWindowSize } from '@uidotdev/usehooks';
import { useState } from 'react';

const items = [1, 2, 3, 4, 5, 6];

const displayCountBasedOnWidth = (width: number | null) => {
  if (!width) return 2;
  if (width < 640) return 2;
  if (width < 768) return 3;
  if (width < 1024) return 4;
  if (width < 1280) return 5;
  return 6;
};

export const TemplateGallery = () => {
  const [state, setState] = useState(false);

  const { width } = useWindowSize();

  return (
    <div className="bg-secondary">
      <div className="max-w-md sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto p-4 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <H4>Start a new document</H4>

          <div className="ml-auto">
            <Button
              variant="outline"
              onClick={() => {
                setState((prev) => !prev);
              }}
            >
              Template Gallery
              <CaretSortIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.slice(0, state ? 5 : displayCountBasedOnWidth(width)).map((item) => (
            <Preview
              key={item}
              content=""
              footer={
                <>
                  <p className="text-sm font-semibold truncate">Blank document</p>
                  <p className="text-xs font-extralight truncate">Blank document</p>
                </>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
