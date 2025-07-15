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
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useUploadMediaMutation } from "@/hooks/data/useMedia";
import { useEditEmployeeMutation, useGetEmployeeDetail } from "@/hooks/data/useAccount";
import { UpdateEmployeeAccountBody, UpdateEmployeeAccountBodyType } from "@/utils/validation/account.schema";
import { handleErrorApi } from "@/utils/handleError";

export default function EditEmployee({
    id,
    setId,
    onSubmitSuccess,
}: {
    id?: number | undefined;
    setId: (value: number | undefined) => void;
    onSubmitSuccess?: () => void;
}) {
    const { mutateAsync: uploadImageMutateAsync, isPending: isUploadingAvatar } = useUploadMediaMutation();
    const { mutateAsync: updateProfileMutateAsync, isPending: isUpdatingProfile } = useEditEmployeeMutation({ id });
    const isLoading = isUploadingAvatar || isUpdatingProfile;

    const { data } = useGetEmployeeDetail({ id });
    const [file, setFile] = useState<File | null>(null);
    const avatarInputRef = useRef<HTMLInputElement | null>(null);
    const form = useForm<UpdateEmployeeAccountBodyType>({
        resolver: zodResolver(UpdateEmployeeAccountBody),
        defaultValues: {
            name: "",
            email: "",
            avatar: undefined,
            password: undefined,
            confirmPassword: undefined,
            changePassword: false,
            role: "Employee",
        },
    });

    useEffect(() => {
        if (data) {
            const { name, email, avatar, role } = data.payload.data;
            form.reset({
                name: name,
                email: email,
                avatar: avatar || undefined,
                changePassword: form.getValues("changePassword"),
                password: form.getValues("password"),
                confirmPassword: form.getValues("confirmPassword"),
                role: role,
            });
        }
    }, [data, form]);

    const handleSubmit = useCallback(
        async (body: UpdateEmployeeAccountBodyType) => {
            if (isLoading) return;
            if (data?.payload == undefined) return;
            try {
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);
                    const uploadResponse = await uploadImageMutateAsync(formData);
                    body.avatar = uploadResponse.payload?.data;
                } else {
                    body.avatar = data.payload.data.avatar || undefined;
                }
                const updateProfileRes = await updateProfileMutateAsync({ id: data.payload.data.id, body });
                toast.success(updateProfileRes.payload.message || "Cập nhật thông tin thành công");
                form.reset();
                setFile(null);
                setId(undefined);
                onSubmitSuccess?.();
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        },
        [file, form, uploadImageMutateAsync, updateProfileMutateAsync, data, isLoading, setFile, setId, onSubmitSuccess]
    );

    const avatar = form.watch("avatar");
    const name = form.watch("name");
    const changePassword = form.watch("changePassword");
    const previewAvatarFromFile = useMemo(() => {
        if (file) {
            return URL.createObjectURL(file);
        }
        return avatar;
    }, [file, avatar]);

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
                    <DialogTitle>Update Account</DialogTitle>
                    <DialogDescription>Name, email, password are required</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="edit-employee-form"
                        onSubmit={form.handleSubmit(handleSubmit)}
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
                                                    {name || "Avatar"}
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
                                name="changePassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="email">Change password</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {changePassword && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                                <Label htmlFor="password">New password</Label>
                                                <div className="col-span-3 w-full space-y-2">
                                                    <Input
                                                        id="password"
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
                            )}
                            {changePassword && (
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                                <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                            )}
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="submit" form="edit-employee-form">
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
