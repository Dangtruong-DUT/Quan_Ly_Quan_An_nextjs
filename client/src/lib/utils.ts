import { EntityError, httpError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleErrorApi(error: unknown, setError?: UseFormSetError<any>) {
    console.log("Error in handleErrorApi:", error);
    if (error instanceof EntityError && setError) {
        const { errors } = error.payload;
        errors.forEach((error) => {
            setError(error.field, { type: "server", message: error.message });
        });
    } else if (error instanceof httpError) {
        if (error.status === 401) {
            return;
        }
        const { message } = error.payload;
        toast.error(message || "An error occurred", {
            description: "Please try again later.",
        });
    }
}

export function handleErrorApiOnNextServer(error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).digest?.includes("NEXT_REDIRECT")) throw error;
    console.error("Error fetching data:", error);
}
