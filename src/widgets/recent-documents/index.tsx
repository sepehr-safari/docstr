import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { Loader2 } from 'lucide-react';
import { useSubscribe } from 'nostr-hooks';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { DOC_KIND, NOSTR_ICON_URL } from '@/shared/config';

import { loader } from '@/shared/utils';

import { useDocument } from '@/shared/hooks/use-document';

import { Avatar, AvatarImage } from '@/shared/components/ui/avatar';
import { H4 } from '@/shared/components/ui/typography/h4';

import { FilterMenu } from '@/features/filter-menu';
import { Filter } from '@/features/filter-menu/config';
import { Preview } from '@/features/preview';

const LocalPreview = ({ event }: { event: NDKEvent }) => {
  const naddr = event.encode();

  const { content, title, owner, delegateeUser } = useDocument({ naddr });

  return (
    <Link to={`/doc/${naddr}`}>
      <Preview
        content={content}
        footer={
          <>
            <p className="text-sm font-semibold truncate">{title}</p>
            <div className="flex items-center gap-2">
              <div className="flex group">
                <Avatar className="w-7 h-7">
                  <AvatarImage
                    src={loader(owner?.image || NOSTR_ICON_URL)}
                    alt={owner?.displayName}
                  />
                </Avatar>
                {delegateeUser && (
                  <Avatar className="-ml-2 w-7 h-7 group-hover:ml-0 transition-all">
                    <AvatarImage
                      src={loader(delegateeUser.image || NOSTR_ICON_URL)}
                      alt={delegateeUser.displayName}
                    />
                  </Avatar>
                )}
              </div>
              <div className="w-1/2">
                <p className="text-xs font-extralight truncate">
                  {owner ? owner.displayName : event.author.npub}
                </p>
                {delegateeUser && (
                  <p className="text-xs font-extralight truncate">{delegateeUser.displayName}</p>
                )}
              </div>
            </div>
          </>
        }
      />
    </Link>
  );
};

export const RecentDocuments = () => {
  const [filter, setFilter] = useState<Filter>(Filter.OwnedByAnyone);

  const { events, eose } = useSubscribe({
    filters: [{ kinds: [DOC_KIND as NDKKind] }],
    enabled: true,
  });

  const filteredEvents = events.filter((event) =>
    event.tags.some(([k, , delegator]) => k == 'D' && event.pubkey == delegator),
  );

  if (filteredEvents.length == 0 && !eose) {
    return (
      <>
        <Loader2 className="mx-auto mt-4 w-10 h-10 animate-spin" />
      </>
    );
  }

  if (filteredEvents.length == 0 && eose) {
    return (
      <div className="p-4 border rounded-md my-2">
        <p>No documents found</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-md sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto p-4 flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <H4>Recent Documents</H4>

          <div className="ml-auto">
            <FilterMenu filter={filter} setFilter={setFilter} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredEvents.map((event) => (
            <LocalPreview key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  );
};
