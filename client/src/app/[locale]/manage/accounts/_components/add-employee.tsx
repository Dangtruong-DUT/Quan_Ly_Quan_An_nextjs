"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAddEmployeeMutation } from "@/hooks/data/useAccount";
import { useUploadMediaMutation } from "@/hooks/data/useMedia";
import { CreateEmployeeAccountBody, CreateEmployeeAccountBodyType } from "@/utils/validation/account.schema";
import { handleErrorApi } from "@/utils/handleError";

export default function AddEmployee() {
    const { mutateAsync: addAccountMutate, isPending: isAddingAccount } = useAddEmployeeMutation();
    const { mutateAsync: uploadMediaMutate, isPending: isUploadMedia } = useUploadMediaMutation();
    const isLoading = isAddingAccount || isUploadMedia;
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement | null>(null);
    const form = useForm<CreateEmployeeAccountBodyType>({
        resolver: zodResolver(CreateEmployeeAccountBody),
        defaultValues: {
            name: "",
            email: "",
            avatar: undefined,
            password: "",
            confirmPassword: "",
        },
    });
    const avatar = form.watch("avatar");
    const name = form.watch("name");
    const previewAvatarFromFile = useMemo(() => {
        if (file) {
            return URL.createObjectURL(file);
        }
        return avatar;
    }, [file, avatar]);

    const onReset = useCallback(() => {
        setFile(null);
        form.reset();
    }, [form, setFile]);

    const handleOnSubmit = useCallback(
        async (data: CreateEmployeeAccountBodyType) => {
            if (isLoading) return;
            if (!file) {
                form.setError("avatar", {
                    type: "manual",
                    message: "Please upload an avatar image.",
                });
                return;
            }

            try {
                const formData = new FormData();
                formData.append("file", file);
                const uploadResponse = await uploadMediaMutate(formData);
                data.avatar = uploadResponse.payload.data;
                const res = await addAccountMutate(data);
                toast.success(`Employee ${res.payload.data.name} added successfully!`);
                onReset();
                setOpen(false);
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        },
        [addAccountMutate, file, form, uploadMediaMutate, setOpen, onReset, isLoading]
    );

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add new employee</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto" onCloseAutoFocus={onReset}>
                <DialogHeader>
                    <DialogTitle>Add new employee</DialogTitle>
                    <DialogDescription>Name, email, password are required</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="add-employee-form"
                        onSubmit={form.handleSubmit(handleOnSubmit)}
                        onReset={onReset}
                    >
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex gap-2 items-start justify-start">
                                            <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                                                <AvatarImage src={previewAvatarFromFile} />
                                                <AvatarFallback className="rounded-none">
                                                    {name.slice(0, 1).toLocaleUpperCase() || "Avatar"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={avatarInputRef}
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
                                                onClick={() => avatarInputRef.current?.click()}
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
                                            <Label htmlFor="name">Full name</Label>
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="email">Email</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input id="email" className="w-full" {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input id="password" className="w-full" type="password" {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="confirmPassword">Confirm password </Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input
                                                    id="confirmPassword"
                                                    className="w-full"
                                                    type="password"
                                                    {...field}
                                                />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="submit" form="add-employee-form" disabled={isLoading}>
                        Add New Employee
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
