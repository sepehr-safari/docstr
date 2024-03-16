import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useActiveUser } from 'nostr-hooks';

export const UserAvatar = () => {
  const { activeUser } = useActiveUser();

  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={activeUser?.profile?.image} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};
