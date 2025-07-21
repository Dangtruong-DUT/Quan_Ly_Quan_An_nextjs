import http from "@/services/api/http";

const clientRequestRevalidateApi = {
    revalidate: ({ tag }: { tag: string }) =>
        http.get("/api/revalidate?tag=" + tag, {
            baseUrl: "",
        }),
};

export default clientRequestRevalidateApi;
