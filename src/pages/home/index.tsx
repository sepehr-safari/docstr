import { RecentDocuments } from '@/widgets/recent-documents';
import { TemplateGallery } from '@/widgets/template-gallery';

export const HomePage = () => {
  return (
    <>
      <TemplateGallery />

      <RecentDocuments />
    </>
  );
};
