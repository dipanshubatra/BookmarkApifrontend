export default function Pagination({ page, totalPages, totalElements, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="button button--ghost"
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        Previous
      </button>

      <div className="pagination__meta">
        <strong>
          Page {page + 1} of {totalPages}
        </strong>
        <span>{totalElements} total bookmarks</span>
      </div>

      <button
        className="button button--ghost"
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page + 1 >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
