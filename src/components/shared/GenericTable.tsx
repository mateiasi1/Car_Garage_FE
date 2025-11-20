import { useLayoutEffect, useRef, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface TableColumn<T> {
    key: string;
    label: string;
    width?: string;
    render?: (item: T, index: number) => ReactNode;
    className?: string;
    searchable?: boolean;
}

export interface TableAction<T> {
    icon: string;
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
    onSearch?: (search: string) => void;
    searchPlaceholder?: string;
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
    search = '',
    onSearchChange,
    onSearch,
    searchPlaceholder,
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

    const [filterConfig, setFilterConfig] = useState<Record<string, boolean>>(() => {
        const config: Record<string, boolean> = {};
        columns.forEach(col => {
            if (col.searchable !== false) {
                config[col.key] = true;
            }
        });
        return config;
    });

    const searchableColumns = columns.filter(col => col.searchable !== false);

    const filteredData = data.filter(item => {
        if (!search) return true;

        const searchLower = search.toLowerCase();

        return searchableColumns.some(col => {
            if (!filterConfig[col.key]) return false;

            let value: string;
            if (col.render) {
                const itemRecord = item as Record<string, unknown>;
                value = String(itemRecord[col.key] ?? '');
            } else {
                value = String((item as Record<string, unknown>)[col.key] ?? '');
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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(search);
    };

    const gridTemplateColumns = [
        showNumberColumn ? '150px' : '',
        ...columns.map(col => col.width || '1fr'),
        actions && actions.length > 0 ? '100px' : '',
    ]
        .filter(Boolean)
        .join(' ');

    const showToolbar = showFilters || onSearchChange || toolbarActions;

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] w-full">
            <div className="w-full bg-white rounded-xl flex flex-col h-full overflow-hidden">
                {showToolbar && (
                    <div className="space-y-4 flex-shrink-0">
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                            {showFilters && (
                                <button
                                    type="button"
                                    onClick={() => setFiltersVisible(!filtersVisible)}
                                    className={`p-2 transition-colors ${filtersVisible ? 'text-primary' : 'text-gray-600'} hover:text-primary`}
                                >
                                    <i className={`fas fa-filter transition-transform ${filtersVisible ? 'rotate-180' : ''}`}></i>
                                </button>
                            )}

                            {onSearchChange && onSearch && (
                                <form onSubmit={handleSearchSubmit} className="flex-1">
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => onSearchChange(e.target.value)}
                                            placeholder={searchPlaceholder || t('table.search')}
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-hover cursor-pointer"
                                        >
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="flex-shrink-0">
                                {toolbarActions}
                            </div>
                        </div>

                        {showFilters && searchableColumns.length > 0 && (
                            <div
                                className={`transition-all duration-200 ease-in-out overflow-hidden ${
                                    filtersVisible ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="flex flex-wrap items-center gap-4 md:gap-6 p-4 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">{t('table.searchBy')}:</span>

                                    {searchableColumns.map((col) => (
                                        <label key={col.key} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filterConfig[col.key] ?? false}
                                                onChange={() => {
                                                    setFilterConfig(prev => ({
                                                        ...prev,
                                                        [col.key]: !prev[col.key]
                                                    }));
                                                }}
                                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-700">{col.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col flex-1 min-h-0 w-full">
                    {/* Desktop Table */}
                    <div className="hidden md:block w-full overflow-x-auto">
                        <div
                            className={`grid min-w-full border-b border-gray-200 font-semibold text-sm text-gray-700 flex-shrink-0 ${
                                showScrollbarGutter ? 'pr-[16px]' : ''
                            }`}
                            style={{ gridTemplateColumns }}
                        >
                            {showNumberColumn && <div className="py-2 px-4 text-left">{t('table.number')}</div>}
                            {columns.map((col) => (
                                <div key={col.key} className={`py-2 px-4 text-left ${col.className || ''}`}>
                                    {col.label}
                                </div>
                            ))}
                            {actions && actions.length > 0 && <div className="py-2 px-4 text-left">{t('table.actions')}</div>}
                        </div>
                    </div>

                    <div ref={bodyRef} className="flex-1 min-h-0 overflow-y-auto w-full">
                        {/* Desktop Table Body */}
                        <div className="hidden md:block overflow-x-auto">
                            {isLoading ? (
                                <div className="py-8 text-center text-gray-400">{t('table.loading')}</div>
                            ) : filteredData.length === 0 ? (
                                <div className="py-8 text-center text-gray-400">{t('table.noDataFound')}</div>
                            ) : (
                                filteredData.map((item, idx) => {
                                    const defaultRowClass = `group grid border-b border-gray-200 last:border-b-0 text-sm ${
                                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    } hover:bg-gray-200 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`;

                                    const customRowClass = rowClassName ? rowClassName(item, idx) : '';

                                    return (
                                        <div
                                            key={item.id}
                                            className={`${defaultRowClass} ${customRowClass}`}
                                            style={{ gridTemplateColumns }}
                                            onClick={() => onRowClick?.(item)}
                                        >
                                            {showNumberColumn && (
                                                <div className="py-2 px-4 text-left">{(page - 1) * itemsPerPage + (idx + 1)}</div>
                                            )}

                                            {columns.map((col) => (
                                                <div key={col.key} className={`py-2 px-4 text-left ${col.className || ''}`}>
                                                    {col.render ? col.render(item, idx) : String((item as Record<string, unknown>)[col.key] ?? '')}
                                                </div>
                                            ))}

                                            {actions && actions.length > 0 && (
                                                <div className="py-2 px-4 text-left flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {actions.map((action, actionIdx) => {
                                                        if (action.show && !action.show(item)) return null;

                                                        return (
                                                            <i
                                                                key={actionIdx}
                                                                className={`fas ${action.icon} cursor-pointer transition-colors ${action.className || 'text-gray-600 hover:text-gray-800'}`}
                                                                title={action.label}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    action.onClick(item);
                                                                }}
                                                            ></i>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden space-y-4 p-4">
                            {isLoading ? (
                                <div className="py-8 text-center text-gray-400">{t('table.loading')}</div>
                            ) : filteredData.length === 0 ? (
                                <div className="py-8 text-center text-gray-400">{t('table.noDataFound')}</div>
                            ) : (
                                filteredData.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 hover:bg-gray-50 transition-colors"
                                        onClick={() => onRowClick?.(item)}
                                    >
                                        {showNumberColumn && (
                                            <div className="flex justify-between border-b pb-2 mb-2">
                                                <span className="font-semibold text-gray-700">{t('table.number')}:</span>
                                                <span className="text-gray-600">{(page - 1) * itemsPerPage + (idx + 1)}</span>
                                            </div>
                                        )}

                                        {columns.map((col) => (
                                            <div key={col.key} className="flex justify-between">
                                                <span className="font-semibold text-gray-700">{col.label}:</span>
                                                <span className="text-gray-600 text-right">
                          {col.render ? col.render(item, idx) : String((item as Record<string, unknown>)[col.key] ?? '')}
                        </span>
                                            </div>
                                        ))}

                                        {actions && actions.length > 0 && (
                                            <div className="flex justify-end items-center space-x-3 pt-2 border-t mt-2">
                                                {actions.map((action, actionIdx) => {
                                                    if (action.show && !action.show(item)) return null;

                                                    return (
                                                        <i
                                                            key={actionIdx}
                                                            className={`fas ${action.icon} cursor-pointer transition-colors ${action.className || 'text-gray-600 hover:text-gray-800'}`}
                                                            title={action.label}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                action.onClick(item);
                                                            }}
                                                        ></i>
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
                    <div className="flex items-center justify-center flex-wrap gap-2 p-4 flex-shrink-0">
                        {getPaginationNumbers(page, totalPages).map((p, i) =>
                                p === '...' ? (
                                    <span key={i} className="mx-1 text-gray-400">
                  ...
                </span>
                                ) : (
                                    <button
                                        key={p}
                                        className={`px-3 py-1 rounded ${
                                            p === page ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        onClick={() => onPageChange(Number(p))}
                                        disabled={p === page}
                                    >
                                        {p}
                                    </button>
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