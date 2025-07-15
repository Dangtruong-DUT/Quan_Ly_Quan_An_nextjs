import { TableItem } from "@/app/manage/tables/context/TableTableContext";
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

export default function AlertDialogDeleteTable({
    tableDelete,
    setTableDelete,
}: {
    tableDelete: TableItem | null;
    setTableDelete: (value: TableItem | null) => void;
}) {
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
                    <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bàn{" "}
                        <span className="bg-foreground text-primary-foreground rounded px-1">
                            {tableDelete?.number}
                        </span>{" "}
                        sẽ bị xóa vĩnh viễn
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteTable}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
