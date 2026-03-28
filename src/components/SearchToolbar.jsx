export default function SearchToolbar({
  searchValue,
  tagValue,
  onSearchChange,
  onTagChange,
  onSearchSubmit,
  onTagSubmit,
  onClearFilters,
  hasActiveFilters,
  pageSize,
  onPageSizeChange
}) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Search your collection</p>
          <h2>Find bookmarks faster</h2>
          <p className="toolbar__intro">
            Use keyword search when you remember part of a title, link, or note. Use
            tags only when you want to narrow results by a saved label.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <form className="toolbar__group" onSubmit={onSearchSubmit}>
          <label className="field">
            <span>Keyword search</span>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search bookmarks, links, or notes"
            />
            <small className="toolbar__helper">
              Best for finding something by text you remember.
            </small>
          </label>
          <button className="button button--primary" type="submit">
            Search bookmarks
          </button>
        </form>

        <form className="toolbar__group" onSubmit={onTagSubmit}>
          <label className="field">
            <span>Filter by saved tag</span>
            <input
              type="text"
              value={tagValue}
              onChange={(event) => onTagChange(event.target.value)}
              placeholder="Example: java"
            />
            <small className="toolbar__helper">
              Use this only if the bookmark already has that tag saved on it.
            </small>
          </label>
          <button className="button button--secondary" type="submit">
            Filter by tag
          </button>
        </form>

        <div className="toolbar__group toolbar__group--compact">
          <label className="field">
            <span>Results per page</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </label>

          <button
            className="button button--ghost"
            type="button"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
          >
            Reset view
          </button>
        </div>
      </div>
    </section>
  );
}
