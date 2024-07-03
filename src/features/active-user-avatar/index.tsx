import { useActiveUser } from 'nostr-hooks';

import { NOSTR_ICON_URL } from '@/shared/config';

import { loader } from '@/shared/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

export const ActiveUserAvatar = () => {
  const { activeUser } = useActiveUser();

  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={loader(activeUser?.profile?.image || NOSTR_ICON_URL)} />
      <AvatarFallback />
    </Avatar>
  );
};
