import { Separator } from '@/shared/components/ui/separator';

export const Footer = () => {
  return (
    <div className="fixed z-20 bottom-0 left-0 right-0 px-6 py-2 flex items-center gap-2 border-t bg-primary-foreground">
      <p className="text-xs text-gray-500">
        Made with <span className="text-red-500">💜</span> by Sepehr
      </p>

      <Separator orientation="vertical" />

      <p className="text-xs text-gray-500">
        <span>Powered by</span>
        <a
          href="https://osty.dev"
          target="_blank"
          rel="noreferrer"
          className="ml-1 text-violet-500"
        >
          Osty.js
        </a>
      </p>
    </div>
  );
};
