import { ModeToggle } from '@/shared/components/mode-toggle';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';

export const MainLayout = ({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Card className="w-full max-w-screen-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">{title}</CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="pt-4 overflow-y-auto max-h-96">{children}</CardContent>

          <Separator />

          <CardFooter className="pt-4 flex items-center justify-between">
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

            <ModeToggle />
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
