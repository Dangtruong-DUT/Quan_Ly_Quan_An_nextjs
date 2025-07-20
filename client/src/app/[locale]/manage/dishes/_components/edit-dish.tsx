"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DishStatus, DishStatusValues } from "@/constants/type";
import { Textarea } from "@/components/ui/textarea";
import { UpdateDishBody, UpdateDishBodyType } from "@/utils/validation/dish.schema";
import { useDishStatus } from "@/helpers/common";
import { useEditDishMutation, useGetDishDetail } from "@/hooks/data/useDishes";
import { useUploadMediaMutation } from "@/hooks/data/useMedia";
import { handleErrorApi } from "@/utils/handleError";
import { toast } from "sonner";
import clientRequestRevalidateApi from "@/api/clientToServer/revalidate";
import { useTranslations } from "next-intl";

export default function EditDish({
    id,
    setId,
    onSubmitSuccess,
}: {
    id?: number | undefined;
    setId: (value: number | undefined) => void;
    onSubmitSuccess?: () => void;
}) {
    const getDishStatus = useDishStatus();
    const t = useTranslations("EditDish");
    const { mutateAsync: editDishMutate, isPending: isEditingDish } = useEditDishMutation({ id });
    const { mutateAsync: uploadMediaMutate, isPending: isUploading } = useUploadMediaMutation();
    const isLoading = isEditingDish || isUploading;
    const [file, setFile] = useState<File | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const form = useForm<UpdateDishBodyType>({
        resolver: zodResolver(UpdateDishBody),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            image: "",
            status: DishStatus.Unavailable,
        },
    });

    const { data: resFromServer } = useGetDishDetail({ id });
    const dish = resFromServer?.payload.data;

    useEffect(() => {
        if (dish) {
            form.reset({
                name: dish.name,
                description: dish.description,
                price: dish.price,
                image: dish.image,
                status: dish.status,
            });
        }
    }, [form, dish]);

    const image = form.watch("image");
    const name = form.watch("name");
    const previewAvatarFromFile = useMemo(() => {
        if (file) {
            return URL.createObjectURL(file);
        }
        return image;
    }, [file, image]);
    const onReset = useCallback(() => {
        setFile(null);
        form.reset();
        setId(undefined);
    }, [setId, form]);
    const handleSubmit = useCallback(
        async (body: UpdateDishBodyType) => {
            if (isLoading) return;
            try {
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await uploadMediaMutate(formData);
                    body.image = res.payload.data;
                } else {
                    body.image = dish?.image || "";
                }
                await editDishMutate({ id: id!, body });
                toast.success(t("successMessage"));
                onSubmitSuccess?.();
                onReset();
                await clientRequestRevalidateApi.revalidate({ tag: "dishes" });
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        },
        [id, isLoading, uploadMediaMutate, editDishMutate, file, dish, onSubmitSuccess, onReset, form, t]
    );

    return (
        <Dialog
            open={Boolean(id)}
            onOpenChange={(value) => {
                if (!value) {
                    setId(undefined);
                }
            }}
        >
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>{t("dialogDescription")}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="edit-dish-form"
                        onSubmit={form.handleSubmit(handleSubmit)}
                        method="post"
                        onReset={onReset}
                    >
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex gap-2 items-start justify-start">
                                            <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                                                <AvatarImage src={previewAvatarFromFile} />
                                                <AvatarFallback className="rounded-none">
                                                    {name || "Avatar"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={imageInputRef}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setFile(file);
                                                        field.onChange("http://localhost:3000/" + file.name);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            <button
                                                className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                                                type="button"
                                                onClick={() => imageInputRef.current?.click()}
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                                <span className="sr-only">{t("upload")}</span>
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="name">{t("dishName")}</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input id="name" className="w-full" {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="price">{t("price")}</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input id="price" className="w-full" {...field} type="number" />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="description">{t("dishDescription")}</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Textarea id="description" className="w-full" {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="status">{t("status")}</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger id="status">
                                                            <SelectValue placeholder={t("selectStatus")} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {DishStatusValues.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {getDishStatus(status)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="submit" form="edit-dish-form" disabled={isLoading}>
                        {t("saveButton")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
