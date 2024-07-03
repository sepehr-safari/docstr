import { ActiveUserAvatar } from '@/features/active-user-avatar';

import { Footer } from '@/shared/components/footer';
import { Navbar } from '@/shared/components/navbar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar>
        <ActiveUserAvatar />
      </Navbar>

      <div className="pt-16 pb-12">{children}</div>

      <Footer />
    </>
  );
};
