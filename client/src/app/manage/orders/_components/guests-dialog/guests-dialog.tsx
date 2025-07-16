import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AutoPagination from "@/components/auto-pagination";
import { useEffect, useState } from "react";
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
import { endOfDay, format, startOfDay } from "date-fns";
import { GuestItem } from "@/app/manage/orders/_components/guests-dialog/columns";
import columns from "@/app/manage/orders/_components/guests-dialog/columns";
import { DataTable } from "@/components/ui/data-table";
import { useGetListGuestQuery } from "@/hooks/data/useAccount";

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function GuestsDialog({ onChoose }: { onChoose: (guest: GuestItem) => void }) {
    const [open, setOpen] = useState(false);
    const [fromDate, setFromDate] = useState(initFromDate);
    const [toDate, setToDate] = useState(initToDate);

    const { data: orderListQuery } = useGetListGuestQuery({
        fromDate,
        toDate,
    });
    const data = orderListQuery?.payload.data || [];
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: PAGE_SIZE,
    });

    const table = useReactTable({
        data,
        columns,
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

    const resetDateFilter = () => {
        setFromDate(initFromDate);
        setToDate(initToDate);
    };

    const selectedRow = table.getSelectedRowModel().rows[0];
    useEffect(() => {
        if (selectedRow) {
            onChoose(selectedRow.original);
            setOpen(false);
            table.getSelectedRowModel().rows = [];
        }
    }, [selectedRow, onChoose, table]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Chọn khách</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-full overflow-auto">
                <DialogHeader>
                    <DialogTitle>Chọn khách hàng</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="w-full">
                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center">
                                <span className="mr-2">Từ</span>
                                <Input
                                    type="datetime-local"
                                    placeholder="Từ ngày"
                                    className="text-sm"
                                    value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
                                    onChange={(event) => setFromDate(new Date(event.target.value))}
                                />
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">Đến</span>
                                <Input
                                    type="datetime-local"
                                    placeholder="Đến ngày"
                                    value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
                                    onChange={(event) => setToDate(new Date(event.target.value))}
                                />
                            </div>
                            <Button className="" variant={"outline"} onClick={resetDateFilter}>
                                Reset
                            </Button>
                        </div>
                        <div className="flex items-center py-4 gap-2">
                            <Input
                                placeholder="Tên hoặc Id"
                                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                                className="w-[170px]"
                            />
                            <Input
                                placeholder="Số bàn"
                                value={(table.getColumn("tableNumber")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => table.getColumn("tableNumber")?.setFilterValue(event.target.value)}
                                className="w-[80px]"
                            />
                        </div>
                        <DataTable columns={columns} table={table} />
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="text-xs text-muted-foreground py-4 flex-1 ">
                                Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
                                <strong>{data.length}</strong> kết quả
                            </div>
                            <div>
                                <AutoPagination
                                    page={table.getState().pagination.pageIndex + 1}
                                    pageSize={table.getPageCount()}
                                    onPageChange={(page) =>
                                        table.setPagination({
                                            pageIndex: page - 1,
                                            pageSize: PAGE_SIZE,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
