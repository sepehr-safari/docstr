import { CaretSortIcon } from '@radix-ui/react-icons';
import { useWindowSize } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { TEMPLATES } from '@/shared/config';

import { Button } from '@/shared/components/ui/button';
import { H4 } from '@/shared/components/ui/typography/h4';

import { Preview } from '@/features/preview';

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
  const [templates, setTemplates] = useState<
    { id: number; content: string; title: string; url: string }[]
  >([]);

  const { width } = useWindowSize();

  useEffect(() => {
    TEMPLATES.forEach((template) => {
      fetch(template.url)
        .then((res) => res.text())
        .then((data) => {
          setTemplates((prev) => {
            const foundIndex = prev.findIndex((t) => t.id === template.id);
            if (foundIndex === -1) {
              return [
                ...prev,
                { id: template.id, content: data, title: template.title, url: template.url },
              ];
            } else {
              prev[foundIndex] = { ...prev[foundIndex], content: data };
              return prev;
            }
          });
        });
    });
  }, [setTemplates]);

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
          {templates
            .slice(0, state ? templates.length : displayCountBasedOnWidth(width))
            .map((template) => (
              <Link to={`/new?t=${template.id}`} key={template.id}>
                <Preview
                  footerHeightFactor={0.2}
                  content={template.content}
                  footer={
                    <>
                      <p className="text-sm font-semibold truncate">{template.title}</p>
                    </>
                  }
                />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
