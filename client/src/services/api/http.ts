/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config/app.config";
import { HttpStatus } from "@/constants/httpStatus";
import { clientSessionToken } from "@/services/storage/clientSessionToken";
import { SetCookieBodyType } from "@/types/auth";
import { LoginResType } from "@/utils/validation/auth.schema";
import { redirect } from "next/navigation";

const isClient = typeof window !== "undefined";

export type CustomOptionsType = RequestInit & {
    baseUrl?: string;
};
export type ResponseType<T> = {
    payload: T;
    status: number;
};

export type EntityErrorPayload = {
    message: string;
    errors: {
        field: string;
        message: string;
    }[];
};

export class httpError extends Error {
    protected _status: number;
    protected _payload: {
        message: string;
        [key: string]: any;
    };
    constructor({ payload, status, message = "Http Error" }: { payload: any; status: number; message?: string }) {
        super(message);
        this._payload = payload;
        this._status = status;
    }
    get status() {
        return this._status;
    }
    get payload() {
        return this._payload;
    }
}
export class EntityError extends httpError {
    constructor({
        payload,
        message = "Entity Error",
    }: {
        payload: EntityErrorPayload;
        status: typeof HttpStatus.ENTITY_ERROR_STATUS;
        message?: string;
    }) {
        super({ payload, status: HttpStatus.ENTITY_ERROR_STATUS, message });
    }

    override get status(): typeof HttpStatus.ENTITY_ERROR_STATUS {
        return HttpStatus.ENTITY_ERROR_STATUS;
    }

    override get payload(): EntityErrorPayload {
        return super.payload as EntityErrorPayload;
    }
}

type RequestPropsType = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    url: string;
    options?: CustomOptionsType;
};

class Http {
    private static instance: Http | null = null;
    private static callStack: { [key: string]: Promise<any> } = {};

    private requestInterceptors: Array<(options: CustomOptionsType) => Promise<CustomOptionsType> | CustomOptionsType> =
        [];
    private responseInterceptors: Array<
        (response: ResponseType<any>, url: string) => Promise<ResponseType<any>> | ResponseType<any>
    > = [];

    private constructor() {}

    static getInstance(): Http {
        if (!this.instance) {
            this.instance = new Http();
        }
        return this.instance;
    }

    useRequest(interceptor: (options: CustomOptionsType) => Promise<CustomOptionsType> | CustomOptionsType) {
        this.requestInterceptors.push(interceptor);
    }

    useResponse(
        interceptor: (response: ResponseType<any>, url: string) => Promise<ResponseType<any>> | ResponseType<any>
    ) {
        this.responseInterceptors.push(interceptor);
    }

    private async applyRequestInterceptors(options: CustomOptionsType): Promise<CustomOptionsType> {
        let result = options;
        for (const interceptor of this.requestInterceptors) {
            result = await interceptor(result);
        }
        return result;
    }

    private async applyResponseInterceptors<Response>(
        response: ResponseType<Response>,
        url: string
    ): Promise<ResponseType<Response>> {
        let result = response;
        for (const interceptor of this.responseInterceptors) {
            result = await interceptor(result, url);
        }
        return result;
    }

    static async errorHandler(error: httpError, options: CustomOptionsType) {
        if (error.status === HttpStatus.UNAUTHORIZED_STATUS) {
            console.log(error);
            if (isClient) {
                try {
                    await fetch("/api/auth/logout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: null,
                    });
                } catch (logoutError) {
                    console.error("Logout request failed:", logoutError);
                } finally {
                    clientSessionToken.clear();
                    // Redirect to login page có thể dẫn đến vòng lặp vô hạn nếu không xử lý đúng
                    //khi trang login có yêu cầu cần token
                    // window.location.href = "/";
                }
            } else {
                const accessToken = (options as any)?.headers?.Authorization?.replace("Bearer ", "") || "";
                redirect("/logout?accessToken=" + accessToken);
            }
        }
        throw error;
    }

    private async rawRequest<Response>(props: RequestPropsType): Promise<ResponseType<Response>> {
        const { method, url, options } = props;
        const key = `${method}:${url}:${JSON.stringify(options)}`;

        if (Http.callStack[key] !== undefined) {
            return Http.callStack[key];
        }

        const basePromise = this._rawRequest<Response>({ method, url, options });
        Http.callStack[key] = basePromise;

        try {
            return await basePromise;
        } catch (error) {
            if (error instanceof httpError) {
                throw await Http.errorHandler(error, options || {});
            } else {
                console.error("Unexpected error in rawRequest:", error);
                throw new httpError({
                    payload: { message: "An unexpected error occurred." },
                    status: 500,
                });
            }
        } finally {
            if (Http.callStack[key] === basePromise) {
                delete Http.callStack[key];
            }
        }
    }

    private async _rawRequest<Response>(props: RequestPropsType): Promise<ResponseType<Response>> {
        const { method, options } = props;
        let { url } = props;

        let baseUrl = options?.baseUrl ?? envConfig.NEXT_PUBLIC_API_ENDPOINT;

        if (url.startsWith("/")) url = url.slice(1);
        if (!baseUrl.endsWith("/")) baseUrl += "/";

        const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

        const interceptedOptions = await this.applyRequestInterceptors(options || {});

        const fetchOptions = {
            ...interceptedOptions,
            method,
        };

        const isFormData = fetchOptions.body instanceof FormData;
        const body = isFormData ? fetchOptions.body : JSON.stringify(fetchOptions.body);

        const baseHeaders: Record<string, string> = isFormData ? {} : { "Content-Type": "application/json" };

        const mergedHeaders: HeadersInit = {
            ...baseHeaders,
            ...(fetchOptions.headers as Record<string, string> | undefined),
        };

        const response = await fetch(fullUrl, {
            ...fetchOptions,
            headers: mergedHeaders,
            body,
        });

        if (!response.ok) {
            const errorPayload = await response.json();
            if (response.status === HttpStatus.ENTITY_ERROR_STATUS) {
                throw new EntityError({
                    payload: errorPayload,
                    status: HttpStatus.ENTITY_ERROR_STATUS,
                });
            } else {
                throw new httpError({
                    payload: errorPayload,
                    status: response.status,
                    message: errorPayload.message || "Request failed",
                });
            }
        }

        const payload: Response = await response.json();
        const wrappedResponse: ResponseType<Response> = { payload, status: response.status };

        return this.applyResponseInterceptors(wrappedResponse, url);
    }

    get<Response>(url: string, options?: Omit<CustomOptionsType, "body">): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>({ method: "GET", url, options });
    }

    post<Response>(url: string, body: any, options?: Omit<CustomOptionsType, "body">): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>({ method: "POST", url, options: { ...options, body } });
    }

    put<Response>(url: string, body: any, options?: Omit<CustomOptionsType, "body">): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>({ method: "PUT", url, options: { ...options, body } });
    }

    delete<Response>(
        url: string,
        body?: any,
        options?: Omit<CustomOptionsType, "body">
    ): Promise<ResponseType<Response>> {
        return this.rawRequest<Response>({ method: "DELETE", url, options: { ...options, body } });
    }
}

const http = Http.getInstance();

http.useRequest((options) => {
    if (clientSessionToken.accessToken) {
        return {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${clientSessionToken.accessToken}`,
            },
        };
    }
    return options;
});

http.useResponse((response, url) => {
    if (!isClient) return response;

    const isAuth = ["auth/login", "auth/register"].some((endpoint) => url.includes(endpoint));
    if (isAuth && response.status === HttpStatus.OK_STATUS) {
        const { accessToken, refreshToken } = (response.payload as LoginResType).data;
        clientSessionToken.accessToken = accessToken || null;
        clientSessionToken.refreshToken = refreshToken || null;
    }

    if (url.includes("api/auth/token") && response.status === HttpStatus.OK_STATUS) {
        const { accessToken, refreshToken } = response.payload as SetCookieBodyType;
        clientSessionToken.accessToken = accessToken || null;
        clientSessionToken.refreshToken = refreshToken || null;
    }

    if (url.includes("/logout") && response.status === HttpStatus.OK_STATUS) {
        clientSessionToken.clear();
    }
    return response;
});

export default http;
