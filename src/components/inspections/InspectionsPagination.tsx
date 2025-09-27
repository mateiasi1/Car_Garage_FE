import { FC } from 'react';

type InspectionsPaginationProps = {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
};

const InspectionsPagination: FC<InspectionsPaginationProps> = ({ page, setPage, totalPages }) => {
  const getPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        pages.push(i);
      } else if ((i === page - 2 && page > 3) || (i === page + 2 && page < totalPages - 2)) {
        pages.push('...');
      }
    }
    return pages.filter((v, i, arr) => v !== arr[i - 1]);
  };

  return (
    <div className="flex items-center mt-4 flex-shrink-0">
      {getPagination().map((p, i) =>
        p === '...' ? (
          <span key={i} className="mx-1 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`mx-1 px-3 py-1 rounded ${
              p === page ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setPage(Number(p))}
            disabled={p === page}
          >
            {p}
          </button>
        )
      )}
    </div>
  );
};

export default InspectionsPagination;
