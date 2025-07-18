"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { UpdateMeBody, UpdateMeBodyType } from "@/utils/validation/account.schema";
import { useAccountProfile, useUpdateAccountProfileMutation } from "@/hooks/data/useAccount";
import { useUploadMediaMutation } from "@/hooks/data/useMedia";
import { handleErrorApi } from "@/utils/handleError";

export default function UpdateProfileForm() {
    const [file, setFile] = useState<File | null>(null);
    const avatarPreviewRef = useRef<HTMLInputElement>(null);

    const form = useForm<UpdateMeBodyType>({
        resolver: zodResolver(UpdateMeBody),
        defaultValues: {
            name: "",
            avatar: undefined,
        },
        mode: "onChange",
    });

    const { data } = useAccountProfile();
    const user = data?.payload.data;

    useEffect(() => {
        form.reset({
            name: user?.name || "",
            avatar: user?.avatar || undefined,
        });
    }, [user, form]);

    const { mutateAsync: uploadImageMutateAsync, isPending: isUploadingAvatar } = useUploadMediaMutation();
    const { mutateAsync: updateProfileMutateAsync, isPending: isUpdatingProfile } = useUpdateAccountProfileMutation();

    const isLoading = isUploadingAvatar || isUpdatingProfile;

    const handleSubmit = useCallback(
        async (data: UpdateMeBodyType) => {
            console.log("Submitting profile update", data);
            try {
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);
                    const uploadResponse = await uploadImageMutateAsync(formData);
                    data.avatar = uploadResponse.payload?.data;
                } else {
                    data.avatar = user?.avatar || undefined;
                }
                const updateProfileRes = await updateProfileMutateAsync(data);
                const { avatar, name } = updateProfileRes.payload.data;

                form.reset({
                    avatar: avatar || "",
                    name,
                });
                toast.success(updateProfileRes.payload.message || "Cập nhật thông tin thành công");
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        },
        [file, form, uploadImageMutateAsync, updateProfileMutateAsync, user?.avatar]
    );

    const avatarSrc = useMemo(
        () => (file != null ? URL.createObjectURL(file) : user?.avatar ?? undefined),
        [file, user?.avatar]
    );
    const onReset = useCallback(() => {
        form.reset();
        setFile(null);
    }, [form]);
    const handleChangeAvatar = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0] || null;
            setFile(selectedFile);
            form.setValue("avatar", selectedFile ? URL.createObjectURL(selectedFile) : "");
        },
        [form]
    );
    return (
        <Form {...form}>
            <form
                noValidate
                className="grid auto-rows-max items-start gap-4 md:gap-8"
                onSubmit={form.handleSubmit(handleSubmit)}
                method="POST"
                onReset={onReset}
            >
                <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({}) => (
                                    <FormItem>
                                        <div className="flex gap-2 items-start justify-start">
                                            <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                                                <AvatarImage src={avatarSrc} />
                                                <AvatarFallback className="rounded-none">
                                                    {user?.name.split(" ").at(-1) || "USER"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <FormMessage />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={avatarPreviewRef}
                                                onChange={handleChangeAvatar}
                                            />
                                            <button
                                                className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                                                type="button"
                                                onClick={() => {
                                                    avatarPreviewRef.current?.click();
                                                }}
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
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">Tên</Label>
                                            <Input id="name" type="text" className="w-full" {...field} />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className=" items-center gap-2 md:ml-auto flex">
                                <Button variant="outline" size="sm" type="reset">
                                    Cancel
                                </Button>
                                <Button size="sm" type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving" : "Save"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
