## 📂 `src/api`

This folder is responsible for defining and organizing **all API calls** in the application, clearly divided by request context.

---

### 🗂️ Folder Structure

```
src/api/
  ├── clientToServer/   # API calls from Browser (Client) to Next.js Server or Backend Server
  ├── nextToBackend/    # API calls from Next.js Server to Backend Server only
```

---

### 📌 `clientToServer/`

**Purpose:**
API functions here are called **directly from the browser**.
By default, requests will target the **backend server** using the singleton `http` instance from `src/services/api/http.ts`.

-   **Special case:**

    -   If `baseUrl: ""` is explicitly set, the request will go to the **Next.js server** instead.

-   **Naming Convention:**

    -   Each file must export an object with the prefix `clientRequest`
    -   Each method/property should describe the specific logic.

**Example:**

```ts
import http from "@/services/api/http";
import {
    AccountListResType,
    AccountResType,
    ChangePasswordBodyType,
    CreateEmployeeAccountBodyType,
    UpdateEmployeeAccountBodyType,
    UpdateMeBodyType,
} from "@/utils/validation/account.schema";

const clientRequestAccountApi = {
    me: () => http.get<AccountResType>("/accounts/me"),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>("/accounts/me", body),
    changePassword: (body: ChangePasswordBodyType) => http.put<AccountResType>("/accounts/change-password", body),
    list: () => http.get<AccountListResType>("/accounts"),
    AddEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>("/accounts", body),
    EditEmployee: ({ id, body }: { id: number; body: UpdateEmployeeAccountBodyType }) =>
        http.put<AccountResType>(`/accounts/detail/${id}`, body),
    DeleteEmployee: (id: number) => http.delete(`/accounts/detail/${id}`),
    getEmployeeDetail: (id: number) => http.get<AccountResType>(`/accounts/detail/${id}`),
};
export default clientRequestAccountApi;
```

---

### 📌 `nextToBackend/`

**Purpose:**
Contains API functions **used by the Next.js Server to communicate with the Backend Server**.

-   **Important Rule:**

    -   You **must not** set `baseUrl: ""` in these calls, as doing so will cause the Next.js server to call itself recursively.

-   **Naming Convention:**

    -   Each file must export an object with the prefix `nextRequest`
    -   Each method/property should start with `next` + feature name.

**Example:**

```ts
import http from "@/services/api/http";
import {
    LoginBodyType,
    LoginResType,
    LogoutBodyType,
    RefreshTokenBodyType,
    RefreshTokenResType,
} from "@/utils/validation/auth.schema";

const nextRequestAuthApi = {
    nextLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
    nextLogout: (body: LogoutBodyType, accessToken: string) =>
        http.post("/auth/logout", body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
    nextRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>("/auth/refresh-token", body, {}),
};
export default nextRequestAuthApi;
```

---

### ⚙️ Summary

✅ **Clear separation** between client-initiated and server-initiated requests
✅ Follows consistent **naming conventions** for easy maintenance
✅ Works with the `http` singleton for all requests, by default targeting the backend
✅ Ensures safe API flows and avoids misrouted calls

---

## **Always follow this structure to keep API calls clean, predictable and secure.**

---

**Author:** TaplamIT-ndtrg281
**Updated:** 2025
