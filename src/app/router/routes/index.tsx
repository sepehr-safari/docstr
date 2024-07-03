import { RouteObject } from 'react-router-dom';

import { Layout } from '@/pages/layout';
import { DocPage } from '@/pages/doc';
import { HomePage } from '@/pages/home';
import { MyPage } from '@/pages/my';
import { NewPage } from '@/pages/new';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
  {
    path: '/my',
    element: (
      <Layout>
        <MyPage />
      </Layout>
    ),
  },
  {
    path: '/new',
    element: (
      <Layout>
        <NewPage />
      </Layout>
    ),
  },
  {
    path: '/doc/:naddr',
    element: (
      <Layout>
        <DocPage />
      </Layout>
    ),
  },
];
