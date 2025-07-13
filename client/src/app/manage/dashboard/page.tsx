import nextRequestAccountApi from "@/api/nextToBackend/accounts";
import { handleErrorApiOnNextServer } from "@/utils/handleError";
import { cookies } from "next/headers";

export default async function DashboardPage() {
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get("accessToken")?.value;
    let name = "";
    try {
        const res = await nextRequestAccountApi.nexMe(accessToken!);
        name = res.payload.data.name;
    } catch (error) {
        handleErrorApiOnNextServer(error);
    }

    return <div> Dashboard {name} </div>;
}
