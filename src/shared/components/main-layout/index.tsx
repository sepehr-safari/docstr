import { ModeToggle } from '@/shared/components/mode-toggle';

export const MainLayout = ({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="py-20">
        <div className="fixed z-20 top-0 left-0 right-0 h-20 flex items-center gap-2 p-6 bg-primary-foreground">
          {title}
        </div>

        <div className="p-6 h-full">{children}</div>

        <div className="fixed z-20 bottom-0 left-0 right-0 px-6 py-4 flex items-center border-t bg-primary-foreground">
          <div>
            <p className="text-xs text-gray-500">
              Made with <span className="text-red-500">💜</span> by Sepehr
            </p>

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

          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
      </div>
    </>
  );
};
