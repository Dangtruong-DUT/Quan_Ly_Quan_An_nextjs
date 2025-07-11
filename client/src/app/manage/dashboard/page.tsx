import AccountRequestApi from "@/apiRequest/account.request";
import { handleErrorApiOnNextServer } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function DashboardPage() {
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get("accessToken")?.value;
    let name = "";
    try {
        const res = await AccountRequestApi.nextMe(accessToken!);
        name = res.payload.data.name;
    } catch (error) {
        handleErrorApiOnNextServer(error);
    }

    return <div> Dashboard {name} </div>;
}
