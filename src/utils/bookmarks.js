function normalizeTag(tag) {
  if (typeof tag === "string") {
    return tag.trim();
  }

  if (tag?.name) {
    return String(tag.name).trim();
  }

  if (tag?.tagName) {
    return String(tag.tagName).trim();
  }

  if (tag?.value) {
    return String(tag.value).trim();
  }

  return "";
}

export function parseTagInput(value) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function buildBookmarkPayload(values) {
  return {
    title: values.title.trim(),
    url: values.url.trim(),
    description: values.description.trim(),
    tags: parseTagInput(values.tags)
  };
}

export function normalizeBookmark(bookmark = {}) {
  const rawTags = Array.isArray(bookmark.tags)
    ? bookmark.tags
    : Array.isArray(bookmark.tagNames)
      ? bookmark.tagNames
      : [];

  return {
    id: bookmark.id ?? bookmark.bookmarkId ?? null,
    title: bookmark.title ?? bookmark.name ?? "",
    url: bookmark.url ?? bookmark.link ?? "",
    description: bookmark.description ?? bookmark.notes ?? "",
    tags: rawTags.map(normalizeTag).filter(Boolean),
    favorite: Boolean(bookmark.favorite ?? bookmark.isFavorite),
    visitCount: bookmark.visitCount ?? bookmark.visits ?? 0,
    createdAt: bookmark.createdAt ?? bookmark.created_at ?? null,
    updatedAt: bookmark.updatedAt ?? bookmark.updated_at ?? null
  };
}

export function normalizePageResponse(data, requestedPage = 0, requestedSize = 10) {
  if (Array.isArray(data)) {
    return {
      content: data.map(normalizeBookmark),
      number: 0,
      size: data.length || requestedSize,
      totalPages: 1,
      totalElements: data.length,
      first: true,
      last: true
    };
  }

  const content = Array.isArray(data?.content)
    ? data.content
    : Array.isArray(data?.items)
      ? data.items
      : [];

  return {
    content: content.map(normalizeBookmark),
    number: data?.number ?? data?.page ?? requestedPage,
    size: data?.size ?? requestedSize,
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? content.length,
    first: data?.first ?? requestedPage === 0,
    last:
      data?.last ??
      (data?.totalPages ? (data.number ?? requestedPage) + 1 >= data.totalPages : true)
  };
}

export function toBookmarkFormValues(bookmark) {
  const item = normalizeBookmark(bookmark);

  return {
    title: item.title,
    url: item.url,
    description: item.description,
    tags: item.tags.join(", ")
  };
}

export function collectTags(bookmarks) {
  const tagSet = new Set();

  bookmarks.forEach((bookmark) => {
    normalizeBookmark(bookmark).tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort((left, right) => left.localeCompare(right));
}
