import clientRequestIndicatorApi from "@/api/clientToServer/indicator";
import { DashboardIndicatorQueryParamsType } from "@/utils/validation/indicator.schema";
import { useQuery } from "@tanstack/react-query";

export function useDashboardIndicator(queryParams: DashboardIndicatorQueryParamsType) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboardIndicator", queryParams],
        queryFn: () => clientRequestIndicatorApi.getDashBoarIndicator(queryParams),
    });

    return {
        data,
        isLoading,
        error,
    };
}
