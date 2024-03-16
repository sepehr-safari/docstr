import { createBrowserRouter } from 'react-router-dom';

import { DocPage } from './doc';
import { ExplorePage } from './explore';
import { HomePage } from './home';
import { MyPage } from './my';
import { NewPage } from './new';

import { UserAvatar } from '@/features/user-avatar';

import { Footer } from '@/shared/components/footer';
import { Navbar } from '@/shared/components/navbar';

// TODO: extract to shared layout
export const MainLayout = ({ children }: { children: React.ReactNode }) => {
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: '/my',
    element: (
      <MainLayout>
        <MyPage />
      </MainLayout>
    ),
  },
  {
    path: '/new',
    element: (
      <MainLayout>
        <NewPage />
      </MainLayout>
    ),
  },
  {
    path: '/explore',
    element: (
      <MainLayout>
        <ExplorePage />
      </MainLayout>
    ),
  },
  {
    path: '/doc/:naddr',
    element: (
      <MainLayout>
        <DocPage />
      </MainLayout>
    ),
  },
]);
