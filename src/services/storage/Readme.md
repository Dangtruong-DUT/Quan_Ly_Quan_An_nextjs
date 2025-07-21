## 📄 SessionToken

### 📌 Purpose

This file implements **`SessionToken`** using the **singleton pattern** to manage **login tokens** (`accessToken` and `refreshToken`) **on the client-side**.
It keeps tokens stored and synchronized via `localStorage`.

---

### ⚙️ How it works

-   `SessionToken` always has **only one single instance** (`getInstance()`).
-   When initialized, if the environment is **client-side** (`window` and `localStorage` exist), it will read any existing tokens from `localStorage` and store them in `_accessToken` and `_refreshToken`.
-   The setters (`set accessToken` & `set refreshToken`) will **update the internal value** and persist it to `localStorage`.
-   If used on the server-side (e.g., Next.js SSR), the class **blocks any attempt** to set or clear tokens to prevent logical errors.

---

### 🧩 API

| Property / Method | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `accessToken`     | Get or set the **Access Token**. When set, it automatically saves the value to `localStorage`.  |
| `refreshToken`    | Get or set the **Refresh Token**. When set, it automatically saves the value to `localStorage`. |
| `clear()`         | Remove both `accessToken` and `refreshToken` from `localStorage`.                               |
| `getInstance()`   | Returns the **singleton instance** of `SessionToken`.                                           |

---

### ⚡️ Notes

✅ **Works only on the client-side.**
🚫 Throws an error if `set` or `clear` is called in a server-side environment.

---

### ✅ Example Usage

```ts
import { clientSessionToken } from "@/service/storage/clientSessionToken";

// Save tokens
clientSessionToken.accessToken = "abc123";
clientSessionToken.refreshToken = "refresh123";

// Read token
console.log(clientSessionToken.accessToken);

// Clear tokens
clientSessionToken.clear();
```

---

## 📌 Summary

`SessionToken` is designed for:

-   Managing login sessions **on the client**.
-   Keeping tokens in sync between `localStorage` and JavaScript state.
-   Sharing a single point of token management for any API service.

---

**Author:** TaplamIT-ndtrg281
**Updated:** 2025
