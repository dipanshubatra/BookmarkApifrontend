function formatDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

export default function BookmarkList({
  bookmarks,
  isLoading,
  activeTag,
  availableTags,
  busyBookmarkId,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpen,
  onTagSelect
}) {
  return (
    <section className="panel panel--stretch bookmark-list-panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Your collection</p>
          <h2>{activeTag ? `Bookmarks tagged "${activeTag}"` : "All bookmarks"}</h2>
        </div>
        <span className="panel__meta">{bookmarks.length} visible</span>
      </div>

      <div className="bookmark-list-scroll">
        <div className="bookmark-list-scroll__hint">
          <span className="bookmark-list-scroll__label">Bookmark collection scroller</span>
          <span className="bookmark-list-scroll__meta">Scroll to explore saved links</span>
        </div>

        {availableTags.length ? (
          <div className="tag-cloud">
            {availableTags.map((tag) => (
              <button
                key={tag}
                className={`tag-chip ${tag === activeTag ? "tag-chip--active" : ""}`}
                type="button"
                onClick={() => onTagSelect(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        ) : null}

        {isLoading ? <p className="empty-state">Loading bookmarks...</p> : null}

        {!isLoading && !bookmarks.length ? (
          <p className="empty-state">No bookmarks found for the current view.</p>
        ) : null}

        {!isLoading && bookmarks.length ? (
          <div className="bookmark-grid">
            {bookmarks.map((bookmark) => {
              const isBusy = busyBookmarkId === bookmark.id;

              return (
                <article
                  key={bookmark.id ?? `${bookmark.title}-${bookmark.url}`}
                  className="bookmark-card"
                >
                  <div className="bookmark-card__top">
                    <div>
                      <h3>{bookmark.title || "Untitled bookmark"}</h3>
                      <button
                        className="bookmark-link"
                        type="button"
                        onClick={() => onOpen(bookmark)}
                      >
                        {bookmark.url}
                      </button>
                    </div>

                    <button
                      className={`favorite-toggle ${bookmark.favorite ? "favorite-toggle--active" : ""}`}
                      type="button"
                      onClick={() => onToggleFavorite(bookmark.id)}
                      disabled={isBusy}
                      aria-label={bookmark.favorite ? "Remove favorite" : "Mark as favorite"}
                    >
                      {"\u2605"}
                    </button>
                  </div>

                  <p className="bookmark-card__description">
                    {bookmark.description || "No description provided for this bookmark."}
                  </p>

                  <div className="bookmark-card__meta">
                    <span>Visits: {bookmark.visitCount}</span>
                    <span>{formatDate(bookmark.updatedAt || bookmark.createdAt) || "Recently added"}</span>
                  </div>

                  <div className="bookmark-card__tags">
                    {bookmark.tags.length ? (
                      bookmark.tags.map((tag) => (
                        <button
                          key={tag}
                          className="tag-chip"
                          type="button"
                          onClick={() => onTagSelect(tag)}
                        >
                          #{tag}
                        </button>
                      ))
                    ) : (
                      <span className="bookmark-card__no-tags">No tags</span>
                    )}
                  </div>

                  <div className="bookmark-card__actions">
                    <button
                      className="button button--ghost"
                      type="button"
                      onClick={() => onEdit(bookmark.id)}
                      disabled={isBusy}
                    >
                      Edit
                    </button>
                    <button
                      className="button button--secondary"
                      type="button"
                      onClick={() => onOpen(bookmark)}
                      disabled={isBusy}
                    >
                      Open
                    </button>
                    <button
                      className="button button--danger"
                      type="button"
                      onClick={() => onDelete(bookmark.id)}
                      disabled={isBusy}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
