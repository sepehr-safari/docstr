import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

import { DelegatedDocsList, OriginalDocsList } from '@/features/docs-list';

export const MyDocs = ({ publicKey }: { publicKey: string | undefined }) => {
  return (
    <>
      <Tabs defaultValue="original">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="original">My original docs</TabsTrigger>
          <TabsTrigger value="delegated">Delegated to me</TabsTrigger>
        </TabsList>

        <TabsContent value="original">
          <OriginalDocsList publicKey={publicKey} />
        </TabsContent>

        <TabsContent value="delegated">
          <DelegatedDocsList publicKey={publicKey} />
        </TabsContent>
      </Tabs>
    </>
  );
};
