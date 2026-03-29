export const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookmark-backend-z38v.onrender.com";
```

**2. Vercel mein environment variable check kar:**

Vercel → Settings → Environment Variables mein confirm kar ki exactly yeh hai:
```
VITE_API_BASE_URL = https://bookmark-backend-z38v.onrender.com
