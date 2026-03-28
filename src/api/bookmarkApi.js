import { api } from "./client";

export async function createBookmark(payload) {
  const response = await api.post("/bookmarks", payload);
  return response.data;
}

export async function getBookmarks(page = 0, size = 10, sortBy = "id", direction = "asc") {
  const response = await api.get("/bookmarks", {
    params: {
      page,
      size,
      sortBy,
      direction
    }
  });
  return response.data;
}

export async function getBookmarkById(id) {
  const response = await api.get(`/bookmarks/${id}`);
  return response.data;
}

export async function updateBookmark(id, payload) {
  const response = await api.put(`/bookmarks/${id}`, payload);
  return response.data;
}

export async function deleteBookmark(id) {
  const response = await api.delete(`/bookmarks/${id}`);
  return response.data;
}

export async function searchBookmarks(query, page = 0, size = 10) {
  const response = await api.get("/bookmarks/search", {
    params: {
      query,
      page,
      size
    }
  });
  return response.data;
}

export async function getBookmarksByTag(tagName) {
  const response = await api.get(`/bookmarks/tags/${encodeURIComponent(tagName)}`);
  return response.data;
}

export async function toggleFavorite(id) {
  const response = await api.patch(`/bookmarks/${id}/favorite`);
  return response.data;
}

export async function recordVisit(id) {
  const response = await api.post(`/bookmarks/${id}/visit`);
  return response.data;
}
