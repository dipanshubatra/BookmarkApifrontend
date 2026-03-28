import { useEffect, useState } from "react";
import {
  createBookmark,
  deleteBookmark,
  getBookmarkById,
  getBookmarks,
  getBookmarksByTag,
  recordVisit,
  searchBookmarks,
  toggleFavorite,
  updateBookmark
} from "../api/bookmarkApi";
import BookmarkForm from "../components/BookmarkForm";
import BookmarkList from "../components/BookmarkList";
import FloatingGlassScene from "../components/FloatingGlassScene";
import MessageBanner from "../components/MessageBanner";
import Pagination from "../components/Pagination";
import SearchToolbar from "../components/SearchToolbar";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/apiError";
import {
  buildBookmarkPayload,
  collectTags,
  normalizePageResponse,
  toBookmarkFormValues
} from "../utils/bookmarks";

const EMPTY_FORM = {
  title: "",
  url: "",
  description: "",
  tags: ""
};

const DEFAULT_VIEW = {
  mode: "all",
  query: "",
  tag: ""
};

function createEmptyPageState(page, size) {
  return {
    content: [],
    number: page,
    size,
    totalPages: 1,
    totalElements: 0,
    first: page === 0,
    last: true
  };
}

export default function DashboardPage() {
  const { logout } = useAuth();
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [pagination, setPagination] = useState(createEmptyPageState(0, 10));
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [activeView, setActiveView] = useState(DEFAULT_VIEW);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingBookmark, setIsLoadingBookmark] = useState(false);
  const [busyBookmarkId, setBusyBookmarkId] = useState(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadBookmarks() {
      setIsLoading(true);
      setPageError("");

      try {
        let data;

        if (activeView.mode === "tag" && activeView.tag) {
          data = await getBookmarksByTag(activeView.tag);
        } else if (activeView.mode === "search" && activeView.query) {
          data = await searchBookmarks(activeView.query, page, pageSize);
        } else {
          data = await getBookmarks(page, pageSize, "id", "asc");
        }

        if (ignore) {
          return;
        }

        const nextPage = normalizePageResponse(data, page, pageSize);
        setBookmarks(nextPage.content);
        setPagination(nextPage);
      } catch (loadError) {
        if (!ignore) {
          setPageError(getErrorMessage(loadError, "Unable to load bookmarks."));
          setBookmarks([]);
          setPagination(createEmptyPageState(page, pageSize));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadBookmarks();

    return () => {
      ignore = true;
    };
  }, [activeView, page, pageSize, refreshIndex]);

  function handleFormChange(field, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value
    }));
  }

  function resetForm() {
    setEditingId(null);
    setFormValues(EMPTY_FORM);
    setFormError("");
  }

  async function handleSubmitBookmark(event) {
    event.preventDefault();
    setFormError("");
    setActionError("");
    setNotice("");
    setIsSaving(true);

    try {
      const payload = buildBookmarkPayload(formValues);

      if (!payload.title || !payload.url) {
        throw new Error("Title and URL are required.");
      }

      if (editingId) {
        await updateBookmark(editingId, payload);
        setNotice("Bookmark updated successfully.");
      } else {
        await createBookmark(payload);
        setNotice("Bookmark created successfully.");
      }

      resetForm();

      if (activeView.mode === "all" && page !== 0) {
        setPage(0);
      } else {
        setRefreshIndex((value) => value + 1);
      }
    } catch (submitError) {
      setFormError(
        getErrorMessage(
          submitError,
          editingId ? "Unable to update bookmark." : "Unable to create bookmark."
        )
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEditBookmark(id) {
    setActionError("");
    setFormError("");
    setNotice("");
    setIsLoadingBookmark(true);

    try {
      const data = await getBookmarkById(id);
      setEditingId(id);
      setFormValues(toBookmarkFormValues(data));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (editError) {
      setActionError(getErrorMessage(editError, "Unable to load bookmark details."));
    } finally {
      setIsLoadingBookmark(false);
    }
  }

  async function handleDeleteBookmark(id) {
    const confirmed = window.confirm("Delete this bookmark?");

    if (!confirmed) {
      return;
    }

    setBusyBookmarkId(id);
    setActionError("");
    setNotice("");

    try {
      await deleteBookmark(id);

      if (editingId === id) {
        resetForm();
      }

      setNotice("Bookmark deleted successfully.");

      if (bookmarks.length === 1 && page > 0 && activeView.mode !== "tag") {
        setPage((currentPage) => Math.max(currentPage - 1, 0));
      } else {
        setRefreshIndex((value) => value + 1);
      }
    } catch (deleteError) {
      setActionError(getErrorMessage(deleteError, "Unable to delete bookmark."));
    } finally {
      setBusyBookmarkId(null);
    }
  }

  async function handleToggleFavorite(id) {
    setBusyBookmarkId(id);
    setActionError("");
    setNotice("");

    try {
      await toggleFavorite(id);
      setRefreshIndex((value) => value + 1);
    } catch (favoriteError) {
      setActionError(getErrorMessage(favoriteError, "Unable to update favorite state."));
    } finally {
      setBusyBookmarkId(null);
    }
  }

  async function handleOpenBookmark(bookmark) {
    try {
      if (bookmark.id !== null && bookmark.id !== undefined) {
        await recordVisit(bookmark.id);
      }
    } catch {
      // Visit tracking should not block opening the link.
    } finally {
      window.open(bookmark.url, "_blank", "noopener,noreferrer");
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const nextQuery = searchInput.trim();
    setActionError("");
    setNotice("");
    setTagInput("");
    setPage(0);
    setActiveView(
      nextQuery
        ? {
            mode: "search",
            query: nextQuery,
            tag: ""
          }
        : DEFAULT_VIEW
    );
  }

  function handleTagSubmit(event) {
    event.preventDefault();
    const nextTag = tagInput.trim();
    setActionError("");
    setNotice("");
    setSearchInput("");
    setPage(0);
    setActiveView(
      nextTag
        ? {
            mode: "tag",
            query: "",
            tag: nextTag
          }
        : DEFAULT_VIEW
    );
  }

  function handleTagSelect(tag) {
    setTagInput(tag);
    setSearchInput("");
    setPage(0);
    setActiveView({
      mode: "tag",
      query: "",
      tag
    });
  }

  function handleClearFilters() {
    setSearchInput("");
    setTagInput("");
    setPage(0);
    setActiveView(DEFAULT_VIEW);
    setRefreshIndex((value) => value + 1);
  }

  function handlePageSizeChange(size) {
    setPageSize(size);
    setPage(0);
  }

  const hasActiveFilters = activeView.mode !== "all";
  const availableTags = collectTags(bookmarks);
  const totalBookmarks = activeView.mode === "tag" ? bookmarks.length : pagination.totalElements;
  const activeModeLabel = activeView.mode === "all"
    ? "All bookmarks"
    : activeView.mode === "search"
      ? "Search view"
      : "Tag view";
  const activeFilterLabel = activeView.mode === "search"
    ? activeView.query
    : activeView.mode === "tag"
      ? `#${activeView.tag}`
      : "No active filter";
  const pageTitle = activeView.mode === "search"
    ? `Search results for "${activeView.query}"`
    : activeView.mode === "tag"
      ? `Filtered by tag "${activeView.tag}"`
      : "Browse your saved bookmarks";

  return (
    <div className="dashboard-shell glass-page">
      <FloatingGlassScene variant="dashboard" />

      <section className="dashboard-hero panel">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Bookmark Manager</p>
            <h1>Dashboard</h1>
            <p>{pageTitle}</p>
          </div>

          <button className="button button--ghost" type="button" onClick={logout}>
            Log out
          </button>
        </header>

        <div className="dashboard-hero__stats">
          <article className="glass-stat">
            <span>Visible</span>
            <strong>{bookmarks.length}</strong>
          </article>
          <article className="glass-stat">
            <span>Total</span>
            <strong>{totalBookmarks}</strong>
          </article>
          <article className="glass-stat">
            <span>View</span>
            <strong>{activeModeLabel}</strong>
          </article>
          <article className="glass-stat">
            <span>Filter</span>
            <strong>{activeFilterLabel}</strong>
          </article>
        </div>
      </section>

      <MessageBanner kind="success" message={notice} />
      <MessageBanner kind="error" message={pageError || actionError} />

      <div className="dashboard-grid">
        <div className="dashboard-grid__sidebar">
          <BookmarkForm
            values={formValues}
            onChange={handleFormChange}
            onSubmit={handleSubmitBookmark}
            onCancelEdit={resetForm}
            isSaving={isSaving}
            isLoadingBookmark={isLoadingBookmark}
            isEditing={Boolean(editingId)}
            error={formError}
          />
        </div>

        <div className="dashboard-grid__content">
          <SearchToolbar
            searchValue={searchInput}
            tagValue={tagInput}
            onSearchChange={setSearchInput}
            onTagChange={setTagInput}
            onSearchSubmit={handleSearchSubmit}
            onTagSubmit={handleTagSubmit}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />

          <BookmarkList
            bookmarks={bookmarks}
            isLoading={isLoading}
            activeTag={activeView.mode === "tag" ? activeView.tag : ""}
            availableTags={availableTags}
            busyBookmarkId={busyBookmarkId}
            onEdit={handleEditBookmark}
            onDelete={handleDeleteBookmark}
            onToggleFavorite={handleToggleFavorite}
            onOpen={handleOpenBookmark}
            onTagSelect={handleTagSelect}
          />

          {activeView.mode !== "tag" ? (
            <Pagination
              page={pagination.number}
              totalPages={pagination.totalPages}
              totalElements={pagination.totalElements}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
