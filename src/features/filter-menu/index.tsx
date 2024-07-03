import { CaretDownIcon } from '@radix-ui/react-icons';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { Filter } from './config';

export function FilterMenu({
  filter,
  setFilter,
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {filter}

          <CaretDownIcon className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={filter}
          onValueChange={(value) => setFilter(value as Filter)}
        >
          {Object.values(Filter).map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
