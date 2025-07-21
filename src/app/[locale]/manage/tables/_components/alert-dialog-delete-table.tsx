import { TableItem } from "@/app/[locale]/manage/tables/context/TableTableContext";
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
import { useDeleteTableMutation } from "@/hooks/data/useTables";
import { handleErrorApi } from "@/utils/handleError";
import { useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AlertDialogDeleteTable({
    tableDelete,
    setTableDelete,
}: {
    tableDelete: TableItem | null;
    setTableDelete: (value: TableItem | null) => void;
}) {
    const t = useTranslations("DeleteTable");
    const { mutateAsync } = useDeleteTableMutation();

    const handleDeleteTable = useCallback(async () => {
        try {
            if (!tableDelete) return;
            const res = await mutateAsync(tableDelete.number);
            toast.success(res.payload.message);
            setTableDelete(null);
        } catch (error) {
            handleErrorApi(error);
        }
    }, [tableDelete, setTableDelete, mutateAsync]);
    return (
        <AlertDialog
            open={Boolean(tableDelete)}
            onOpenChange={(value) => {
                if (!value) {
                    setTableDelete(null);
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("description", { number: tableDelete?.number || 0 })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteTable}>{t("continue")}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
