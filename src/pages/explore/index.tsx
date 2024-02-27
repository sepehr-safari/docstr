import { MainLayout } from '@/shared/components/main-layout';

import { BackButton } from '@/features/back-button';

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
        <div>Explore Docs</div>
      </MainLayout>
    </>
  );
};
