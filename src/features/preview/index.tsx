import { useWindowSize } from '@uidotdev/usehooks';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

type Props = {
  content: string;
  footer?: React.ReactNode;
};

const PAPER_WIDTH = 1000;
const PAPER_HEIGHT = 1250;
const EXTRA_PADDING = 0.3 * PAPER_HEIGHT;
const PAPER_HEIGHT_WITH_PADDING = PAPER_HEIGHT + EXTRA_PADDING;

export const Preview = ({ content, footer }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);

  const { width } = useWindowSize();

  useEffect(() => {
    if (ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      setScale(width / PAPER_WIDTH);
    }
  }, [width, setScale]);

  return (
    <>
      <div
        ref={ref}
        className="relative border rounded-md overflow-hidden bg-background hover:border-primary hover:shadow-lg transition-all duration-150 ease-in-out hover:-translate-y-1"
        style={{ height: scale * PAPER_HEIGHT_WITH_PADDING }}
      >
        <div
          className="origin-top-left p-10"
          style={{
            transform: `scale(${scale})`,
            width: `${PAPER_WIDTH}px`,
            height: `${PAPER_HEIGHT_WITH_PADDING}px`,
          }}
        >
          <Markdown>{content}</Markdown>
        </div>

        {footer && (
          <div
            className="absolute bottom-0 left-0 right-0 px-4 py-2 border-t flex flex-col gap-2"
            style={{ height: EXTRA_PADDING * scale }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  );
};
