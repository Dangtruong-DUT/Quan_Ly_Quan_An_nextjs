"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DishStatus, DishStatusValues } from "@/constants/type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateDishBody, CreateDishBodyType } from "@/utils/validation/dish.schema";
import { getVietnameseDishStatus } from "@/helpers/common";
import { useAddDishMutation } from "@/hooks/data/useDishes";
import { handleErrorApi } from "@/utils/handleError";
import { useUploadMediaMutation } from "@/hooks/data/useMedia";
import { toast } from "sonner";

export default function AddDish() {
    const { mutateAsync: addDishMutate, isPending: isAddingDish } = useAddDishMutation();
    const { mutateAsync: uploadMediaMutate, isPending: isUploadingMedia } = useUploadMediaMutation();
    const isLoading = isAddingDish || isUploadingMedia;
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const form = useForm<CreateDishBodyType>({
        resolver: zodResolver(CreateDishBody),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            image: "",
            status: DishStatus.Unavailable,
        },
    });
    const image = form.watch("image");
    const name = form.watch("name");
    const previewAvatarFromFile = useMemo(() => {
        if (file) {
            return URL.createObjectURL(file);
        }
        return image;
    }, [file, image]);

    const onReset = useCallback(() => {
        form.reset();
        setFile(null);
        setOpen(false);
    }, [form, setFile, setOpen]);

    const handleOnSubmit = useCallback(
        async (body: CreateDishBodyType) => {
            if (isLoading) return;
            try {
                if (!file) {
                    form.setError("image", {
                        type: "manual",
                        message: "Please upload an image",
                    });
                    return;
                }
                const formData = new FormData();
                formData.append("file", file);
                const resUpload = await uploadMediaMutate(formData);
                body.image = resUpload.payload.data;

                const res = await addDishMutate(body);
                toast.success(res.payload.message);
                onReset();
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        },
        [file, isLoading, form]
    );

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create New Dish</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>Create New Dish</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="add-dish-form"
                        onSubmit={form.handleSubmit(handleOnSubmit)}
                        onReset={onReset}
                        method="POST"
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
                                                <span className="sr-only">Upload</span>
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
                                            <Label htmlFor="name">Name</Label>
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
                                            <Label htmlFor="price">Price</Label>
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
                                            <Label htmlFor="description">Description</Label>
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
                                            <Label htmlFor="description">Status</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {DishStatusValues.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {getVietnameseDishStatus(status)}
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
                    <Button type="submit" form="add-dish-form">
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
