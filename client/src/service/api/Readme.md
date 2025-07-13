# 📄 HTTP Service

## 📌 Purpose

This file provides a **Fullstack HTTP Client Service** for **Next.js** projects.  
It works on both the **Client-side** (_browser_) and **Server-side** (_Server Components / API Routes_), with built-in:

-   **Base URL handling** (uses `envConfig` by default)
-   Automatic **Access Token** & **Refresh Token** injection
-   Unified **error handling** for `401 Unauthorized` and `422 Entity Error`
-   **Interceptors** for customizing requests and responses
-   Singleton pattern to reuse the same HTTP instance

---

## ⚙️ How It Works

✅ **1. Fullstack & Base URL**

-   The `Http` class works **everywhere** (Client and Server).
-   The **default Base URL** is set from `envConfig.NEXT_PUBLIC_API_ENDPOINT`.
-   If you set `baseUrl: ""` → the request will target **Next.js internal API routes** (`/api/*`).

---

✅ **2. Session Token Handling**

-   Integrates with `clientSessionToken`:
    -   On the **Client**, reads `accessToken` from `localStorage` and attaches it to `Authorization` header.
-   If the server responds with `401 Unauthorized`:
    -   Calls `/api/auth/logout` (Client-side) or `redirect()` (Server-side).
    -   Clears local tokens.

---

✅ **3. Request & Response Interceptors**

-   `useRequest()` → Add custom headers like `Authorization` or modify the request.
-   `useResponse()` → Automatically store new tokens after `login` or `register`.

---

✅ **4. Backend vs Next.js API**

**Call external backend (default)**

```ts
await http.get("/users");
// --> BASE_URL + /users --> https://api.example.com/users
```

**Call internal Next.js API route**

```ts
await http.get("/api/revalidate", { baseUrl: "" });
// --> Calls your Next.js `/api/revalidate` handler directly
```

---

## 🔗 Usage Example

```ts
// Standard backend request
await http.get("/auth/me");

// Call Next.js API Route
await http.post("/api/send-email", { email }, { baseUrl: "" });

// POST with body
await http.post("/auth/login", { username, password });
```

---

## 🛑 Error Handling

-   **401** → Triggers logout flow and clears tokens.
-   **422** → Throws `EntityError` automatically.
-   Other errors → Throws a generic `httpError`.

---

## 📂 Recommended Structure

| Layer           | Path                                        |
| --------------- | ------------------------------------------- |
| `Http` Client   | `src/service/http.ts`                       |
| Token Manager   | `src/service/storage/clientSessionToken.ts` |
| App Config      | `src/config/app.config.ts`                  |
| API Definitions | `src/api/authApi.ts` / `src/api/userApi.ts` |

---

## ✅ Checklist

-   [x] Supports `GET`, `POST`, `PUT`, `DELETE`
-   [x] Fullstack-safe (Client & Server)
-   [x] Token auto-injection
-   [x] Handles Next.js API Routes & Backend
-   [x] Singleton pattern
-   [x] Custom request/response interceptors

---

**Author:** TaplamIT-ndtrg281
**Updated:** 2025
