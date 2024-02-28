import { createBrowserRouter } from 'react-router-dom';

import { DocPage } from './doc';
import { ExplorePage } from './explore';
import { HomePage } from './home';
import { MyPage } from './my';
import { NewPage } from './new';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/my',
    element: <MyPage />,
  },
  {
    path: '/new',
    element: <NewPage />,
  },
  {
    path: '/explore',
    element: <ExplorePage />,
  },
  {
    path: '/doc/:naddr',
    element: <DocPage />,
  },
]);
