"use client";
import { AccountItem } from "@/app/[locale]/manage/accounts/context/account-table-context";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteEmployeeMutation } from "@/hooks/data/useAccount";
import { handleErrorApi } from "@/utils/handleError";
import { useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AlertDialogDeleteAccount({
    employeeDelete,
    setEmployeeDelete,
}: {
    employeeDelete: AccountItem | null;
    setEmployeeDelete: (value: AccountItem | null) => void;
}) {
    const t = useTranslations("DeleteEmployeeDialog");
    const tCommon = useTranslations("Common");
    const { mutateAsync } = useDeleteEmployeeMutation();

    const handleDelete = useCallback(async () => {
        if (employeeDelete) {
            try {
                await mutateAsync(employeeDelete.id);
                setEmployeeDelete(null);
                toast.success(t("successMessage", { name: employeeDelete.name }));
            } catch (error) {
                handleErrorApi(error);
            }
        }
    }, [employeeDelete, mutateAsync, setEmployeeDelete, t]);

    return (
        <AlertDialog
            open={Boolean(employeeDelete)}
            onOpenChange={(value) => {
                if (!value) {
                    setEmployeeDelete(null);
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("description", { name: employeeDelete?.name || "" })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>{tCommon("continue")}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
