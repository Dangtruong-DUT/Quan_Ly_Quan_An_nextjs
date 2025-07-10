import AccountRequestApi from "@/apiRequest/account.request";
import { useQuery } from "@tanstack/react-query";

export function useAccountProfile() {
    return useQuery({
        queryKey: ["accountProfile"],
        queryFn: AccountRequestApi.me,
        staleTime: 1000 * 60 * 5,
    });
}
