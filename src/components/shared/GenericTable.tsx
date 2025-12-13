import { ReactNode, useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from './IconButton';
import { CustomInput } from './CustomInput';
import { CustomCheckbox } from './CustomCheckbox';
import { ListFilter as ListFilterIcon } from 'lucide-react';

export interface TableColumn<T> {
  key: string;
  label: string;
  width?: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  searchable?: boolean;
  getSearchValue?: (item: T) => string;
}

export interface TableAction<T> {
  icon: ReactNode;
  label: string;
  onClick: (item: T) => void;
  className?: string;
  show?: (item: T) => boolean;
  isDisabled?: (item: T) => boolean;
}

export interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  search?: string;
  onSearchChange?: (search: string) => void;

  searchPlaceholder?: string;
  embedded?: boolean;
  showFilters?: boolean;
  toolbarActions?: ReactNode;
  showNumberColumn?: boolean;
  rowClassName?: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  itemsPerPage?: number;
}

const GenericTable = <T extends { id: string }>({
  data,
  columns,
  actions,
  isLoading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  search,
  onSearchChange,
  searchPlaceholder,
  embedded = false,
  showFilters = false,
  toolbarActions,
  showNumberColumn = true,
  rowClassName,
  onRowClick,
  itemsPerPage = 25,
}: GenericTableProps<T>) => {
  const { t } = useTranslation();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [showScrollbarGutter, setShowScrollbarGutter] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [internalSearch, setInternalSearch] = useState('');
  const effectiveSearch = search ?? internalSearch;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearch(value);
    }
  };

  const [filterConfig, setFilterConfig] = useState<Record<string, boolean>>(() => {
    const config: Record<string, boolean> = {};
    columns
      .filter((col) => col.searchable !== false)
      .forEach((col) => {
        config[col.key] = true;
      });
    return config;
  });

  // Memoize searchable columns to prevent infinite loops
  const searchableColumns = columns.filter((col) => col.searchable !== false);

  // Update filterConfig when columns change (only check column keys)
  useEffect(() => {
    const columnKeys = columns.filter((col) => col.searchable !== false).map((col) => col.key);

    setFilterConfig((prev) => {
      const next: Record<string, boolean> = {};
      columnKeys.forEach((key) => {
        next[key] = prev[key] ?? true;
      });
      // Only update if keys changed
      const prevKeys = Object.keys(prev).sort().join(',');
      const nextKeys = Object.keys(next).sort().join(',');
      if (prevKeys === nextKeys) {
        return prev; // Return same reference to prevent re-render
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.map((c) => c.key).join(',')]);

  const filteredData = data.filter((item) => {
    if (!effectiveSearch) return true;

    const searchLower = effectiveSearch.toLowerCase();

    return searchableColumns.some((col) => {
      if (!filterConfig[col.key]) return false;

      let value = '';

      if (col.getSearchValue) {
        value = col.getSearchValue(item) ?? '';
      } else {
        const raw = (item as Record<string, unknown>)[col.key];
        value = raw == null ? '' : String(raw);
      }

      return value.toLowerCase().includes(searchLower);
    });
  });

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (el) {
      setShowScrollbarGutter(el.scrollHeight > el.clientHeight);
    }
  }, [filteredData, isLoading]);

  const gridTemplateColumns = [
    showNumberColumn ? '120px' : '',
    ...columns.map((col) => col.width || '1fr'),
    actions && actions.length > 0 ? '110px' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const showToolbar = showFilters || onSearchChange || toolbarActions || !search;

  return (
    <div className={embedded ? 'flex flex-col w-full h-full' : 'flex flex-col h-[calc(100vh-12rem)] w-full'}>
      <div
        className={
          embedded
            ? 'w-full flex flex-col h-full'
            : 'w-full bg-surface rounded-xl flex flex-col h-full overflow-visible border border-border'
        }
      >
        {showToolbar && (
          <div className="space-y-4 flex-shrink-0 p-4 pb-0">
            <div className="flex items-center gap-3 flex-wrap">
              {showFilters && (
                <div className="order-1 flex items-center">
                  <IconButton
                    aria-label="Filter rows"
                    onClick={() => setFiltersVisible((prev) => !prev)}
                    variant={filtersVisible ? 'secondary' : 'primary'}
                    size="md"
                    className="flex items-center justify-center"
                  >
                    <ListFilterIcon className="w-5 h-5" />
                  </IconButton>
                </div>
              )}

              <div className="order-2 flex-1 min-w-[200px] flex items-center">
                <CustomInput
                  id="table-search"
                  name="table-search"
                  value={effectiveSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={searchPlaceholder || t('table.search')}
                  label={undefined}
                  fullWidth
                  wrapperClassName="!mt-0 !mb-0"
                />
              </div>

              <div className="order-3 w-full md:w-auto [&>*]:w-full md:[&>*]:w-auto flex items-center">
                {toolbarActions}
              </div>
            </div>

            {showFilters && searchableColumns.length > 0 && (
              <div
                className={`transition-all duration-200 ease-in-out overflow-hidden ${
                  filtersVisible ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 bg-primary-light/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-text">{t('table.searchBy')}:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {searchableColumns.map((col) => (
                      <CustomCheckbox
                        key={col.key}
                        id={`filter-${col.key}`}
                        name={`filter-${col.key}`}
                        label={col.label}
                        checked={filterConfig[col.key] ?? false}
                        onChange={() => {
                          setFilterConfig((prev) => ({
                            ...prev,
                            [col.key]: !prev[col.key],
                          }));
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col flex-1 min-h-0 w-full">
          <div className="hidden md:block w-full overflow-x-auto">
            <div
              className={`grid min-w-full border-b border-border font-semibold text-sm text-muted flex-shrink-0 bg-primary-light/30 ${
                showScrollbarGutter ? 'pr-[16px]' : ''
              }`}
              style={{ gridTemplateColumns }}
            >
              {showNumberColumn && <div className="py-2 px-4 text-left font-body">{t('table.number')}</div>}
              {columns.map((col) => (
                <div key={col.key} className={`py-2 px-4 text-left font-body ${col.className || ''}`}>
                  {col.label}
                </div>
              ))}
              {actions && actions.length > 0 && (
                <div className="py-2 px-4 text-left font-body">{t('table.actions')}</div>
              )}
            </div>
          </div>

          <div ref={bodyRef} className={embedded ? 'flex-1 min-h-0 w-full' : 'flex-1 min-h-0 overflow-y-auto w-full'}>
            <div className="hidden md:block overflow-x-auto">
              {isLoading ? (
                <div className="py-8 text-center text-muted font-body">{t('table.loading')}</div>
              ) : filteredData.length === 0 ? (
                <div className="py-8 text-center text-muted font-body">{t('table.noDataFound')}</div>
              ) : (
                filteredData.map((item, idx) => {
                  const defaultRowClass = `group grid border-b border-border last:border-b-0 text-sm ${
                    idx % 2 === 0 ? 'bg-surface' : 'bg-primary-light/20'
                  } hover:bg-primary-light/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`;

                  const customRowClass = rowClassName ? rowClassName(item, idx) : '';

                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      className={`${defaultRowClass} ${customRowClass}`}
                      style={{ gridTemplateColumns }}
                      onClick={() => onRowClick?.(item)}
                    >
                      {showNumberColumn && (
                        <div className="py-2 px-4 text-left font-body text-muted">
                          {(page - 1) * itemsPerPage + (idx + 1)}
                        </div>
                      )}

                      {columns.map((col) => (
                        <div key={col.key} className={`py-2 px-4 text-left font-body text-text ${col.className || ''}`}>
                          {col.render
                            ? col.render(item, idx)
                            : String((item as Record<string, unknown>)[col.key] ?? '')}
                        </div>
                      ))}

                      {actions && actions.length > 0 && (
                        <div className="py-2 px-4 text-left flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {actions.map((action, actionIdx) => {
                            if (action.show && !action.show(item)) {
                              return null;
                            }

                            const disabled = action.isDisabled?.(item) ?? false;

                            return (
                              <IconButton
                                key={actionIdx}
                                variant="ghost"
                                size="sm"
                                className={`${action.className || 'text-text/70 hover:text-primary'} ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!disabled) {
                                    action.onClick(item);
                                  }
                                }}
                                aria-label={action.label}
                                disabled={disabled}
                              >
                                {action.icon}
                              </IconButton>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="md:hidden space-y-4 p-4">
              {isLoading ? (
                <div className="py-8 text-center text-muted font-body">{t('table.loading')}</div>
              ) : filteredData.length === 0 ? (
                <div className="py-8 text-center text-muted font-body">{t('table.noDataFound')}</div>
              ) : (
                filteredData.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="bg-surface border border-border rounded-lg p-4 space-y-2 hover:bg-primary-light/30 transition-colors"
                    onClick={() => onRowClick?.(item)}
                  >
                    {showNumberColumn && (
                      <div className="flex justify-between border-b border-border pb-2 mb-2">
                        <span className="font-semibold text-muted font-body">{t('table.number')}:</span>
                        <span className="text-muted font-body">{(page - 1) * itemsPerPage + (idx + 1)}</span>
                      </div>
                    )}

                    {columns.map((col) => (
                      <div key={col.key} className="flex justify-between gap-4">
                        <span className="font-semibold text-muted font-body">{col.label}:</span>
                        <span className="text-text text-right font-body">
                          {col.render
                            ? col.render(item, idx)
                            : String((item as Record<string, unknown>)[col.key] ?? '')}
                        </span>
                      </div>
                    ))}

                    {actions && actions.length > 0 && (
                      <div className="flex justify-end items-center gap-2 pt-2 border-t border-border mt-2">
                        {actions.map((action, actionIdx) => {
                          if (action.show && !action.show(item)) {
                            return null;
                          }

                          const disabled = action.isDisabled?.(item) ?? false;

                          return (
                            <IconButton
                              key={actionIdx}
                              variant="ghost"
                              size="sm"
                              className={`${action.className || 'text-text/70 hover:text-primary'} ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!disabled) {
                                  action.onClick(item);
                                }
                              }}
                              aria-label={action.label}
                              disabled={disabled}
                            >
                              {action.icon}
                            </IconButton>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-start flex-wrap gap-2 p-4 flex-shrink-0">
            {getPaginationNumbers(page, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="mx-1 text-muted font-body">
                  ...
                </span>
              ) : (
                <IconButton
                  key={`page-${p}`}
                  type="button"
                  size="sm"
                  variant={p === page ? 'primary' : 'ghost'}
                  disabled={p === page}
                  aria-label={t('table.goToPage', { page: p })}
                  className={`
                    rounded-full
                    w-9 h-9 sm:w-10 sm:h-10
                    flex items-center justify-center
                    text-sm font-body
                    ${p === page ? 'bg-primary text-primary-text' : 'bg-primary-light text-text hover:bg-primary-light/70'}
                  `}
                  onClick={() => onPageChange(Number(p))}
                >
                  {p}
                </IconButton>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const getPaginationNumbers = (page: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if ((i === page - 2 && page > 3) || (i === page + 2 && page < totalPages - 2)) {
      pages.push('...');
    }
  }
  return pages.filter((v, i, arr) => v !== arr[i - 1]);
};

export default GenericTable;
