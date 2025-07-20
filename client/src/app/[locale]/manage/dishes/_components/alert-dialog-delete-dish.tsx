import clientRequestRevalidateApi from "@/api/clientToServer/revalidate";
import { DishItem } from "@/app/[locale]/manage/dishes/context/DishTableContext";
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
import { useTranslations } from "next-intl";

export default function AlertDialogDeleteDish({
    dishDelete,
    setDishDelete,
}: {
    dishDelete: DishItem | null;
    setDishDelete: (value: DishItem | null) => void;
}) {
    const t = useTranslations("DeleteDishDialog");
    const tCommon = useTranslations("Common");
    const { mutateAsync: deleteDishMutate } = useDeleteDishMutation();
    const handleDeleteDish = useCallback(async () => {
        if (dishDelete) {
            try {
                await deleteDishMutate(dishDelete.id);
                toast.success(t("successMessage"));
                setDishDelete(null);
                await clientRequestRevalidateApi.revalidate({ tag: "dishes" });
            } catch (error) {
                handleErrorApi(error);
            }
        }
    }, [deleteDishMutate, dishDelete, setDishDelete, t]);
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
                    <AlertDialogTitle>{t("title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("description", { name: dishDelete?.name || "" })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDish}>{tCommon("continue")}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
