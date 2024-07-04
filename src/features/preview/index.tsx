import { useWindowSize } from '@uidotdev/usehooks';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

type Props = {
  content: string;
  footer?: React.ReactNode;
  footerHeightFactor?: number;
};

const PAPER_WIDTH = 1000;
const PAPER_HEIGHT = 1250;

export const Preview = ({ content, footer, footerHeightFactor = 0.3 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);

  const { width } = useWindowSize();

  const fullHeight = PAPER_HEIGHT + PAPER_HEIGHT * footerHeightFactor;

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
        style={{ height: scale * fullHeight }}
      >
        <div
          className="origin-top-left p-10"
          style={{
            transform: `scale(${scale})`,
            width: `${PAPER_WIDTH}px`,
            height: `${fullHeight}px`,
          }}
        >
          <Markdown>{content}</Markdown>
        </div>

        {footer && (
          <div
            className="bg-background absolute bottom-0 left-0 right-0 px-4 py-2 border-t flex flex-col justify-around"
            style={{ height: PAPER_HEIGHT * footerHeightFactor * scale }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  );
};
