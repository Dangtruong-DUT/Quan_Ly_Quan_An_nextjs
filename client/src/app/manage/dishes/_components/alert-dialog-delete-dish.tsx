import { DishItem } from "@/app/manage/dishes/context/DishTableContext";
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
import { useDeleteDishMutation } from "@/hooks/data/useDishes";
import { handleErrorApi } from "@/utils/handleError";
import { useCallback } from "react";
import { toast } from "sonner";

export default function AlertDialogDeleteDish({
    dishDelete,
    setDishDelete,
}: {
    dishDelete: DishItem | null;
    setDishDelete: (value: DishItem | null) => void;
}) {
    const { mutateAsync: deleteDishMutate } = useDeleteDishMutation();
    const handleDeleteDish = useCallback(async () => {
        if (dishDelete) {
            try {
                const res = await deleteDishMutate(dishDelete.id);
                toast.success(res.payload.message);
                setDishDelete(null);
            } catch (error) {
                handleErrorApi(error);
            }
        }
    }, [deleteDishMutate, dishDelete, setDishDelete]);
    return (
        <AlertDialog
            open={Boolean(dishDelete)}
            onOpenChange={(value) => {
                if (!value) {
                    setDishDelete(null);
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Dish{" "}
                        <span className="bg-foreground text-primary-foreground rounded px-1">{dishDelete?.name}</span>{" "}
                        wil be deleted permanently. Are you sure you want to continue?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDish}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
