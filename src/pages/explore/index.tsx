import { MainLayout } from '@/shared/components/main-layout';

import { BackButton } from '@/features/back-button';
import { ExploreDocsList } from '@/features/docs-list';

export const ExplorePage = () => {
  return (
    <>
      <MainLayout
        title={
          <>
            <BackButton />
            Explore Docs
          </>
        }
      >
        <ExploreDocsList />
      </MainLayout>
    </>
  );
};
