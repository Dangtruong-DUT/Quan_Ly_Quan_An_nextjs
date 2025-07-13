"use client";
import { AccountItem } from "@/app/manage/accounts/context/account-table-context";
import { useDeleteEmployeeMutation } from "@/app/queries/useAccount";
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
import { handleErrorApi } from "@/lib/utils";
import { useCallback } from "react";
import { toast } from "sonner";

export default function AlertDialogDeleteAccount({
    employeeDelete,
    setEmployeeDelete,
}: {
    employeeDelete: AccountItem | null;
    setEmployeeDelete: (value: AccountItem | null) => void;
}) {
    const { mutateAsync } = useDeleteEmployeeMutation();

    const handleDelete = useCallback(async () => {
        if (employeeDelete) {
            try {
                await mutateAsync(employeeDelete.id);
                setEmployeeDelete(null);
                toast.success(`Employee ${employeeDelete.name} deleted successfully`);
            } catch (error) {
                handleErrorApi(error);
            }
        }
    }, [employeeDelete, mutateAsync, setEmployeeDelete]);

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
                    <AlertDialogTitle>Delete this Employee?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Account{" "}
                        <span className="bg-foreground text-primary-foreground rounded px-1">
                            {employeeDelete?.name}
                        </span>{" "}
                        will be deleted permanently.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
