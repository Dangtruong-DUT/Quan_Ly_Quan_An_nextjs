const isClient = typeof window !== "undefined" && typeof localStorage !== "undefined";

class SessionToken {
    private _accessToken: string | null = null;
    private _refreshToken: string | null = null;
    private static instance: SessionToken | null = null;

    private constructor() {
        if (isClient) {
            this._accessToken = localStorage.getItem("accessToken");
            this._refreshToken = localStorage.getItem("refreshToken");
        }
    }

    static getInstance(): SessionToken {
        if (!this.instance) {
            this.instance = new SessionToken();
        }
        return this.instance;
    }

    get accessToken() {
        return this._accessToken;
    }

    set accessToken(value: string | null) {
        if (!isClient) {
            throw new Error("Cannot set session token on the server side.");
        }
        if (value === null) {
            localStorage.removeItem("accessToken");
        } else {
            localStorage.setItem("accessToken", value);
        }
        this._accessToken = value;
    }
    get refreshToken() {
        return this._refreshToken;
    }
    set refreshToken(value: string | null) {
        if (!isClient) {
            throw new Error("Cannot set session token expiration on the server side.");
        }
        if (value === null) {
            localStorage.removeItem("refreshToken");
        } else {
            localStorage.setItem("refreshToken", value);
        }
        this._refreshToken = value;
    }
    clear() {
        if (!isClient) {
            throw new Error("Cannot clear session token on the server side.");
        }
        this.accessToken = null;
        this.refreshToken = null;
    }
}

export const clientSessionToken = SessionToken.getInstance();
