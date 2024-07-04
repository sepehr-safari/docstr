import { FileIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

import { ModeToggle } from '@/shared/components/mode-toggle';

export const Navbar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed z-20 top-0 left-0 right-0 h-16 flex items-center gap-2 p-6 bg-primary-foreground">
      <Link to="/" className="flex items-center gap-1">
        <FileIcon className="w-8 h-8" />
        <h1 className="text-lg font-bold">Docstr</h1>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />

        {children}
      </div>
    </div>
  );
};
