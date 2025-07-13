"use client";
import { AccountItem } from "@/app/manage/accounts/context/account-table-context";
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

export default function AlertDialogDeleteAccount({
    employeeDelete,
    setEmployeeDelete,
}: {
    employeeDelete: AccountItem | null;
    setEmployeeDelete: (value: AccountItem | null) => void;
}) {
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
                        Account
                        <span className="bg-foreground text-primary-foreground rounded px-1">
                            {employeeDelete?.name}
                        </span>
                        will be deleted permanently.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
