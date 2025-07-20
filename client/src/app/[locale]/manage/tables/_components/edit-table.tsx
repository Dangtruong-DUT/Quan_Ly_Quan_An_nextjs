"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableStatus, TableStatusValues } from "@/constants/type";
import { Switch } from "@/components/ui/switch";
import { Link } from "@/i18n/navigation";
import { UpdateTableBody, UpdateTableBodyType } from "@/utils/validation/table.schema";
import { getTableLink, getVietnameseTableStatus } from "@/helpers/common";
import { useGetTableDetail, useUpdateTableMutation } from "@/hooks/data/useTables";
import { useCallback, useEffect } from "react";
import { handleErrorApi } from "@/utils/handleError";
import { toast } from "sonner";
import QRcodeTableGenerate from "@/components/generate-table-qr-code";

export default function EditTable({
    id,
    setId,
}: {
    id?: number | undefined;
    setId: (value: number | undefined) => void;
    onSubmitSuccess?: () => void;
}) {
    const form = useForm<UpdateTableBodyType>({
        resolver: zodResolver(UpdateTableBody),
        defaultValues: {
            capacity: 2,
            status: TableStatus.Hidden,
            changeToken: false,
        },
    });

    const { mutateAsync: updateTableMutate, isPending } = useUpdateTableMutation({ id });
    const { data } = useGetTableDetail({ id });
    const tableData = data?.payload.data;

    useEffect(() => {
        if (tableData) {
            form.reset({
                capacity: tableData.capacity,
                status: tableData.status,
                changeToken: form.getValues("changeToken"),
            });
        }
    }, [tableData, form]);

    const onReset = useCallback(() => {
        form.reset();
        setId(undefined);
    }, [form, setId]);

    const handleSubmit = useCallback(
        async (data: UpdateTableBodyType) => {
            if (isPending || !tableData?.number) return;
            try {
                const res = await updateTableMutate({
                    id: tableData.number,
                    body: data,
                });
                toast.success(res.payload.message);
                onReset();
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        },
        [onReset, tableData, updateTableMutate, form, isPending]
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
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto" onCloseAutoFocus={onReset}>
                <DialogHeader>
                    <DialogTitle>Cập nhật bàn ăn</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="edit-table-form"
                        onSubmit={form.handleSubmit(handleSubmit)}
                        method="POST"
                        onReset={onReset}
                    >
                        <div className="grid gap-4 py-4">
                            <FormItem>
                                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                    <Label htmlFor="name">Số hiệu bàn</Label>
                                    <div className="col-span-3 w-full space-y-2">
                                        <Input
                                            id="number"
                                            type="number"
                                            className="w-full"
                                            value={tableData?.number || -1}
                                            readOnly
                                        />
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="price">Sức chứa (người)</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input id="capacity" className="w-full" {...field} type="number" />
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
                                            <Label htmlFor="description">Trạng thái</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {TableStatusValues.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {getVietnameseTableStatus(status)}
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
                            <FormField
                                control={form.control}
                                name="changeToken"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="price">Đổi QR Code</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="changeToken"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </div>
                                            </div>

                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                    <Label>QR Code</Label>
                                    <div className="col-span-3 w-full space-y-2 ">
                                        {tableData && (
                                            <QRcodeTableGenerate
                                                tableNumber={tableData.number}
                                                token={tableData.token}
                                            />
                                        )}
                                    </div>
                                </div>
                            </FormItem>
                            <FormItem>
                                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                    <Label>URL gọi món</Label>
                                    <div className="col-span-3 w-full space-y-2">
                                        {tableData && (
                                            <Link
                                                href={getTableLink({
                                                    token: tableData?.token || "",
                                                    tableNumber: tableData?.number || -1,
                                                })}
                                                target="_blank"
                                                className="break-all"
                                            >
                                                {getTableLink({
                                                    token: tableData?.token || "",
                                                    tableNumber: tableData?.number || -1,
                                                })}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </FormItem>
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="submit" form="edit-table-form" disabled={isPending}>
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
