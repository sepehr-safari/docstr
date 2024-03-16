import { BackButton } from '@/features/back-button';
import { ExploreDocsList } from '@/features/docs-list';

export const ExplorePage = () => {
  return (
    <>
      <div className="flex gap-4 items-center mb-4">
        <BackButton />
        Explore Docs
      </div>

      <ExploreDocsList />
    </>
  );
};
