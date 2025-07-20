import http from "@/services/api/http";
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from "@/utils/validation/indicator.schema";
import queryString from "query-string";

const clientRequestIndicatorApi = {
    getDashBoarIndicator: (queryParams: DashboardIndicatorQueryParamsType) => {
        const query = queryParams
            ? `?${queryString.stringify({
                  fromDate: queryParams.fromDate ? queryParams.fromDate.toISOString() : undefined,
                  toDate: queryParams.toDate ? queryParams.toDate.toISOString() : undefined,
              })}`
            : "";
        return http.get<DashboardIndicatorResType>(`/indicators/dashboard${query}`);
    },
};

export default clientRequestIndicatorApi;
