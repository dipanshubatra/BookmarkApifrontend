const ACCESS_TOKEN_KEY = "bookmark_manager_access_token";

let accessToken =
  typeof window !== "undefined" ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null;

export const tokenStorage = {
  get() {
    return accessToken;
  },

  set(token) {
    accessToken = token;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },

  clear() {
    accessToken = null;

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }
};
