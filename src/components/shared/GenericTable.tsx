import { ReactNode, useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from './IconButton';
import { CustomInput } from './CustomInput';
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

  const searchableColumns = columns.filter((col) => col.searchable !== false);

  const [filterConfig, setFilterConfig] = useState<Record<string, boolean>>(() => {
    const config: Record<string, boolean> = {};
    searchableColumns.forEach((col) => {
      config[col.key] = true;
    });
    return config;
  });

  useEffect(() => {
    setFilterConfig((prev) => {
      const next: Record<string, boolean> = {};
      searchableColumns.forEach((col) => {
        next[col.key] = prev[col.key] ?? true;
      });
      return next;
    });
  }, [columns, searchableColumns]);

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
            : 'w-full bg-card rounded-3xl flex flex-col h-full overflow-visible shadow-2xl border border-card/40'
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

              <div className="order-2 flex-1 min-w-[200px]">
                <CustomInput
                  id="table-search"
                  name="table-search"
                  value={effectiveSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={searchPlaceholder || t('table.search')}
                  label={undefined}
                  fullWidth
                  wrapperClassName="mb-0"
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
                <div className="flex flex-wrap items-center gap-4 md:gap-6 p-4 bg-background/60 rounded-2xl">
                  <span className="text-sm font-medium text-text/80">{t('table.searchBy')}:</span>

                  {searchableColumns.map((col) => (
                    <label key={col.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterConfig[col.key] ?? false}
                        onChange={() => {
                          setFilterConfig((prev) => ({
                            ...prev,
                            [col.key]: !prev[col.key],
                          }));
                        }}
                        className="w-4 h-4 text-primary border-text/20 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-text/80">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col flex-1 min-h-0 w-full">
          <div className="hidden md:block w-full overflow-x-auto">
            <div
              className={`grid min-w-full border-t border-b border-card/40 font-semibold text-sm text-text/80 flex-shrink-0 bg-background/60 ${
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
                <div className="py-8 text-center text-text/40 font-body">{t('table.loading')}</div>
              ) : filteredData.length === 0 ? (
                <div className="py-8 text-center text-text/40 font-body">{t('table.noDataFound')}</div>
              ) : (
                filteredData.map((item, idx) => {
                  const defaultRowClass = `group grid border-b border-card/30 last:border-b-0 text-sm ${
                    idx % 2 === 0 ? 'bg-card' : 'bg-background/60'
                  } hover:bg-activeMenu/40 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`;

                  const customRowClass = rowClassName ? rowClassName(item, idx) : '';

                  return (
                    <div
                      key={item.id}
                      className={`${defaultRowClass} ${customRowClass}`}
                      style={{ gridTemplateColumns }}
                      onClick={() => onRowClick?.(item)}
                    >
                      {showNumberColumn && (
                        <div className="py-2 px-4 text-left font-body text-text/80">
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

                            return (
                              <IconButton
                                key={actionIdx}
                                variant="ghost"
                                size="sm"
                                className={action.className || 'text-text/70 hover:text-primary'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(item);
                                }}
                                aria-label={action.label}
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
                <div className="py-8 text-center text-text/40 font-body">{t('table.loading')}</div>
              ) : filteredData.length === 0 ? (
                <div className="py-8 text-center text-text/40 font-body">{t('table.noDataFound')}</div>
              ) : (
                filteredData.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-card border border-card/40 rounded-2xl p-4 space-y-2 hover:bg-activeMenu/20 transition-colors shadow-sm"
                    onClick={() => onRowClick?.(item)}
                  >
                    {showNumberColumn && (
                      <div className="flex justify-between border-b border-card/40 pb-2 mb-2">
                        <span className="font-semibold text-text/80 font-body">{t('table.number')}:</span>
                        <span className="text-text/80 font-body">{(page - 1) * itemsPerPage + (idx + 1)}</span>
                      </div>
                    )}

                    {columns.map((col) => (
                      <div key={col.key} className="flex justify-between gap-4">
                        <span className="font-semibold text-text/80 font-body">{col.label}:</span>
                        <span className="text-text/80 text-right font-body">
                          {col.render
                            ? col.render(item, idx)
                            : String((item as Record<string, unknown>)[col.key] ?? '')}
                        </span>
                      </div>
                    ))}

                    {actions && actions.length > 0 && (
                      <div className="flex justify-end items-center gap-2 pt-2 border-t border-card/40 mt-2">
                        {actions.map((action, actionIdx) => {
                          if (action.show && !action.show(item)) {
                            return null;
                          }

                          return (
                            <IconButton
                              key={actionIdx}
                              variant="ghost"
                              size="sm"
                              className={action.className || 'text-text/70 hover:text-primary'}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(item);
                              }}
                              aria-label={action.label}
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
                <span key={i} className="mx-1 text-text/40 font-body">
                  ...
                </span>
              ) : (
                <IconButton
                  key={p}
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
                    ${p === page ? 'bg-primary text-primary-text' : 'bg-background/80 text-text/80 hover:bg-background'}
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
