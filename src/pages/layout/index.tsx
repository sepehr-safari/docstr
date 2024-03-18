import { UserAvatar } from '@/features/user-avatar';

import { Footer } from '@/shared/components/footer';
import { Navbar } from '@/shared/components/navbar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar>
        <UserAvatar />
      </Navbar>

      <div className="px-6 pt-24 pb-12 h-full mx-auto max-w-screen-lg">{children}</div>

      <Footer />
    </>
  );
};
