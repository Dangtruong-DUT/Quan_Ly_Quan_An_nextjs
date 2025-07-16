"use client";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/auto-pagination";
import { OrderStatusValues } from "@/constants/type";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { endOfDay, startOfDay } from "date-fns";
import { getVietnameseOrderStatus } from "@/helpers/common";
import EditOrder from "@/app/manage/orders/_components/edit-order";
import AddOrder from "@/app/manage/orders/_components/add-order";
import orderTableColumns from "@/app/manage/orders/_components/order-table/columns";
import { useOrderService } from "@/app/manage/orders/_components/order.service";
import { DataTable } from "@/components/ui/data-table";
import { useOrderTableContext } from "@/app/manage/orders/context/order-table-provider";
import { useGetOrderListQuery } from "@/hooks/data/useOrder";
import { useGetTables } from "@/hooks/data/useTables";
import { formatDateTimeLocal } from "@/utils/formatting/formatTime";
import OrderStatics from "@/app/manage/orders/_components/order-statics/order-statics";
import socket from "@/service/socket/socket";
import { GuestCreateOrdersResType } from "@/utils/validation/guest.schema";
import { toast } from "sonner";
import { PayGuestOrdersResType, UpdateOrderResType } from "@/utils/validation/order.schema";

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());
export default function OrderTable() {
    const searchParam = useSearchParams();
    const [fromDate, setFromDate] = useState(initFromDate);
    const [toDate, setToDate] = useState(initToDate);
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const { data: orderListQuery, refetch: refetchOrderList } = useGetOrderListQuery({
        fromDate,
        toDate,
    });
    const { data: tableListQuery } = useGetTables();
    const dishList = useMemo(() => orderListQuery?.payload.data || [], [orderListQuery]);
    const tableList = useMemo(() => tableListQuery?.payload.data || [], [tableListQuery]);

    const tableListSortedByNumber = tableList.sort((a, b) => a.number - b.number);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex,
        pageSize: PAGE_SIZE,
    });

    const { statics, orderObjectByGuestId, servingGuestByTableNumber } = useOrderService(dishList);

    const table = useReactTable({
        data: dishList,
        columns: orderTableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        autoResetPageIndex: false,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    useEffect(() => {
        table.setPagination({
            pageIndex,
            pageSize: PAGE_SIZE,
        });
    }, [table, pageIndex]);

    const resetDateFilter = useCallback(() => {
        setFromDate(initFromDate);
        setToDate(initToDate);
    }, []);

    const { orderIdEdit, setOrderIdEdit, setOrderObjectByGuestId } = useOrderTableContext();

    useEffect(() => {
        setOrderObjectByGuestId(orderObjectByGuestId);
    }, [orderObjectByGuestId, setOrderObjectByGuestId]);

    const handleOnFilterStatusChange = useCallback(
        (currentValue: string) => {
            console.log("handleOnFilterStatusChange", currentValue);
            const column = table.getColumn("status");
            const currentFilterValue = column?.getFilterValue() ?? "";
            console.log("currentFilterValue", currentFilterValue);
            console.log("currentValue", currentValue);
            if (currentValue == "all") {
                column?.setFilterValue("");
            } else {
                column?.setFilterValue(currentValue);
            }
        },
        [table]
    );

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            console.log(socket.id, "Connected to socket server");
        }

        function onDisconnect() {
            console.log("Disconnected from socket server");
        }

        function onNewOrder(data: GuestCreateOrdersResType["data"]) {
            const { guest } = data[0];
            refetchOrderWithinRange();
            toast.message(`Đơn hàng mới`, {
                description: `Khách hàng ${guest?.name} tại bàn ${guest?.tableNumber} vừa đặt ${data.length} món.`,
            });
        }

        function onOrderUpdate(data: UpdateOrderResType["data"]) {
            refetchOrderWithinRange();
            toast.message(`Đơn hàng ${data.dishSnapshot.name} đã được cập nhật`, {
                description: `Trạng thái đơn hàng hiện tại: ${getVietnameseOrderStatus(data.status)}`,
            });
        }
        function onPayment(data: PayGuestOrdersResType["data"]) {
            refetchOrderWithinRange();
            const { guest } = data[0];
            const total = data.reduce((sum, order) => sum + order.quantity * order.dishSnapshot.price, 0);
            toast.message(`Đã thanh toán thành công  ${data.length} đơn`, {
                description: `Tổng số tiền khách hàng ${guest?.name} thanh toán là ${total} VNĐ`,
            });
        }

        function refetchOrderWithinRange() {
            const now = new Date();
            if (fromDate <= now && now <= toDate) {
                refetchOrderList(); // Refetch orders if within the date range
            }
        }
        socket.on("update-order", onOrderUpdate);
        socket.on("new-order", onNewOrder);
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("payment", onPayment);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("new-order", onNewOrder);
            socket.off("update-order", onOrderUpdate);
            socket.off("payment", onPayment);
        };
    }, [refetchOrderList, fromDate, toDate]);

    return (
        <div className="w-full">
            <EditOrder id={orderIdEdit} setId={setOrderIdEdit} onSubmitSuccess={() => {}} />
            <div className=" flex items-center">
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center">
                        <span className="mr-2">Từ</span>
                        <Input
                            type="datetime-local"
                            placeholder="Từ ngày"
                            className="text-sm"
                            value={formatDateTimeLocal(fromDate)}
                            onChange={(event) => setFromDate(new Date(event.target.value))}
                        />
                    </div>
                    <div className="flex items-center">
                        <span className="mr-2">Đến</span>
                        <Input
                            type="datetime-local"
                            placeholder="Đến ngày"
                            value={formatDateTimeLocal(toDate)}
                            onChange={(event) => setToDate(new Date(event.target.value))}
                        />
                    </div>
                    <Button className="" variant={"outline"} onClick={resetDateFilter}>
                        Reset
                    </Button>
                </div>
                <div className="ml-auto">
                    <AddOrder />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 py-4">
                <Input
                    placeholder="Tên khách"
                    value={(table.getColumn("guestName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("guestName")?.setFilterValue(event.target.value)}
                    className="max-w-[100px]"
                />
                <Input
                    placeholder="Số bàn"
                    value={(table.getColumn("tableNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("tableNumber")?.setFilterValue(event.target.value)}
                    className="max-w-[80px]"
                />

                <Select
                    onValueChange={handleOnFilterStatusChange}
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="all">Tất cả</SelectItem>
                            {OrderStatusValues.map((status) => (
                                <SelectItem key={status.toString()} value={status.toString()}>
                                    {getVietnameseOrderStatus(status)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <OrderStatics
                statics={statics}
                tableList={tableListSortedByNumber}
                servingGuestByTableNumber={servingGuestByTableNumber}
            />
            {/* <TableSkeleton /> */}
            <DataTable columns={orderTableColumns} table={table} />

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-xs text-muted-foreground py-4 flex-1 ">
                    Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
                    <strong>{dishList.length}</strong> kết quả
                </div>
                <div>
                    <AutoPagination
                        page={table.getState().pagination.pageIndex + 1}
                        pageSize={table.getPageCount()}
                        pathname="/manage/orders"
                    />
                </div>
            </div>
        </div>
    );
}
