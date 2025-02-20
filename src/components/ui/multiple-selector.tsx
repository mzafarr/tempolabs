"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Option = {
  value: string;
  label: string;
  disable?: boolean;
  /** Fixed option that can't be removed. */
  fixed?: boolean;
  /** Group this option belongs to. Used for sorting. */
  group?: string;
};

interface MultiSelectorProps {
  value?: Option[];
  defaultOptions?: Option[];
  onChange?: (options: Option[]) => void;
  placeholder?: string;
  /** Limit the number of options that can be selected. */
  maxSelected?: number;
  /** Function to get more options when search is performed. */
  onSearch?: (search: string) => Promise<Option[]>;
  /** Delay in milliseconds before triggering search. */
  searchDebounce?: number;
  /** Show loading state when searching. */
  searchingText?: string;
  /** Show when no options match search input. */
  notFoundText?: string;
  /** Group options by field. */
  groupBy?: keyof Option;
}

export function MultiSelector({
  value,
  defaultOptions = [],
  onChange,
  placeholder = "Select options...",
  maxSelected,
  onSearch,
  searchDebounce = 300,
  searchingText = "Searching...",
  notFoundText = "No options found.",
  groupBy,
}: MultiSelectorProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option[]>(value || []);
  const [options, setOptions] = React.useState<Option[]>(defaultOptions);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearch = React.useCallback(
    async (search: string) => {
      if (onSearch && search) {
        setIsSearching(true);
        const results = await onSearch(search);
        setOptions(results);
        setIsSearching(false);
      }
    },
    [onSearch],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Backspace" && !searchTerm && selected.length > 0) {
        const newSelected = [...selected];
        const lastItem = newSelected[selected.length - 1];
        if (!lastItem.fixed) {
          newSelected.pop();
          setSelected(newSelected);
          onChange?.(newSelected);
        }
      }
    },
    [onChange, searchTerm, selected],
  );

  const debounceSearch = React.useMemo(() => {
    const fn = (value: string) => {
      handleSearch(value);
    };

    if (searchDebounce === 0) return fn;

    return debounce(fn, searchDebounce);
  }, [handleSearch, searchDebounce]);

  const filteredOptions = options.filter(
    (option) => !selected.some((s) => s.value === option.value),
  );

  const groupedOptions = React.useMemo(() => {
    if (!groupBy) return filteredOptions;

    const groups = filteredOptions.reduce(
      (acc, option) => {
        const groupValue = option[groupBy] as string;
        if (!acc[groupValue]) acc[groupValue] = [];
        acc[groupValue].push(option);
        return acc;
      },
      {} as Record<string, Option[]>,
    );

    return Object.entries(groups);
  }, [filteredOptions, groupBy]);

  const handleSelect = React.useCallback(
    (option: Option) => {
      if (maxSelected && selected.length >= maxSelected) return;

      const newSelected = [...selected, option];
      setSelected(newSelected);
      onChange?.(newSelected);
      setSearchTerm("");
    },
    [maxSelected, onChange, selected],
  );

  const handleRemove = React.useCallback(
    (option: Option) => {
      if (option.fixed) return;

      const newSelected = selected.filter((s) => s.value !== option.value);
      setSelected(newSelected);
      onChange?.(newSelected);
    },
    [onChange, selected],
  );

  const selectables = React.useMemo(
    () => (groupBy ? groupedOptions : filteredOptions),
    [groupBy, groupedOptions, filteredOptions],
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => (
            <Badge key={option.value} variant="secondary">
              {option.label}
              {!option.fixed && (
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRemove(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleRemove(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={searchTerm}
            onValueChange={(value) => {
              setSearchTerm(value);
              debounceSearch(value);
            }}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {isSearching ? (
                <CommandItem className="text-sm" disabled>
                  {searchingText}
                </CommandItem>
              ) : selectables.length === 0 ? (
                <CommandItem className="text-sm" disabled>
                  {notFoundText}
                </CommandItem>
              ) : (
                selectables.map((option) => {
                  if (groupBy) {
                    const [groupName, groupOptions] = option as [
                      string,
                      Option[],
                    ];
                    return (
                      <CommandGroup
                        key={groupName}
                        heading={groupName}
                        className="p-1"
                      >
                        {groupOptions.map((groupOption) => (
                          <CommandItem
                            key={groupOption.value}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={() => {
                              handleSelect(groupOption);
                              inputRef.current?.focus();
                            }}
                            className="cursor-pointer"
                          >
                            {groupOption.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    );
                  }

                  const ungroupedOption = option as Option;
                  return (
                    <CommandItem
                      key={ungroupedOption.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        handleSelect(ungroupedOption);
                        inputRef.current?.focus();
                      }}
                      className="cursor-pointer"
                    >
                      {ungroupedOption.label}
                    </CommandItem>
                  );
                })
              )}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
