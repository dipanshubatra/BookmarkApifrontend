import { useState } from "react";

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
  const [searchPop, setSearchPop] = useState(false);
  const [tagPop, setTagPop] = useState(false);

  function handleSearch(event) {
    setSearchPop(true);
    window.setTimeout(() => setSearchPop(false), 900);
    onSearchSubmit(event);
  }

  function handleTagFilter(event) {
    setTagPop(true);
    window.setTimeout(() => setTagPop(false), 900);
    onTagSubmit(event);
  }

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
        <form className="toolbar__group" onSubmit={handleSearch}>
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
          <button
            className={`button dashboard-cta dashboard-cta--search ${
              searchPop ? "dashboard-cta--search-pop" : ""
            }`}
            type="submit"
          >
            <span className="dashboard-cta__label">Search bookmarks</span>
            <span className="dashboard-cta__burst" aria-hidden="true">
              <span className="dashboard-cta__bookmark dashboard-cta__bookmark--one">{"\uD83D\uDD16"}</span>
              <span className="dashboard-cta__bookmark dashboard-cta__bookmark--two">{"\uD83D\uDD16"}</span>
              <span className="dashboard-cta__bookmark dashboard-cta__bookmark--three">{"\uD83D\uDD16"}</span>
            </span>
          </button>
        </form>

        <form className="toolbar__group" onSubmit={handleTagFilter}>
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
          <button
            className={`button dashboard-cta dashboard-cta--tag ${
              tagPop ? "dashboard-cta--tag-pop" : ""
            }`}
            type="submit"
          >
            <span className="dashboard-cta__label">Filter by tag</span>
            <span className="dashboard-cta__burst" aria-hidden="true">
              <span className="dashboard-cta__tag dashboard-cta__tag--one">{"\uD83C\uDFF7"}</span>
              <span className="dashboard-cta__tag dashboard-cta__tag--two">{"\uD83C\uDFF7"}</span>
              <span className="dashboard-cta__tag dashboard-cta__tag--three">{"\uD83C\uDFF7"}</span>
            </span>
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
