import MessageBanner from "./MessageBanner";

export default function BookmarkForm({
  values,
  onChange,
  onSubmit,
  onCancelEdit,
  isSaving,
  isLoadingBookmark,
  isEditing,
  error
}) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">{isEditing ? "Edit bookmark" : "New bookmark"}</p>
          <h2>{isEditing ? "Update selected bookmark" : "Create a bookmark"}</h2>
        </div>
        {isEditing ? (
          <button className="button button--ghost" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        ) : null}
      </div>

      <MessageBanner kind="error" message={error} />

      <form className="bookmark-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={values.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="Spring Security Docs"
            required
            disabled={isSaving || isLoadingBookmark}
          />
        </label>

        <label className="field">
          <span>URL</span>
          <input
            type="url"
            value={values.url}
            onChange={(event) => onChange("url", event.target.value)}
            placeholder="https://example.com"
            required
            disabled={isSaving || isLoadingBookmark}
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            rows="4"
            value={values.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Optional notes about this bookmark"
            disabled={isSaving || isLoadingBookmark}
          />
        </label>

        <label className="field">
          <span>Tags</span>
          <input
            type="text"
            value={values.tags}
            onChange={(event) => onChange("tags", event.target.value)}
            placeholder="java, spring, security"
            disabled={isSaving || isLoadingBookmark}
          />
          <small>Separate tags with commas.</small>
        </label>

        <button
          className="button button--primary button--full"
          type="submit"
          disabled={isSaving || isLoadingBookmark}
        >
          {isLoadingBookmark
            ? "Loading bookmark..."
            : isSaving
              ? "Saving..."
              : isEditing
                ? "Update bookmark"
                : "Create bookmark"}
        </button>
      </form>
    </section>
  );
}
