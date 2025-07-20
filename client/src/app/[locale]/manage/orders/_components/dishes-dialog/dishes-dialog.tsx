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
import { DishListResType } from "@/utils/validation/dish.schema";
import { DataTable } from "@/components/ui/data-table";
import { useGetDishes } from "@/hooks/data/useDishes";
import columns from "@/app/[locale]/manage/orders/_components/dishes-dialog/columns";

type DishItem = DishListResType["data"][0];

const PAGE_SIZE = 10;
export function DishesDialog({ onChoose }: { onChoose: (dish: DishItem) => void }) {
    const [open, setOpen] = useState(false);
    const { data: dishListData } = useGetDishes();
    const data = dishListData?.payload.data || [];
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
        enableMultiRowSelection: false,
        enableRowSelection: true,
        getRowId: (row) => String(row.id),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    const selectedRow = table.getSelectedRowModel().rows[0];
    useEffect(() => {
        if (selectedRow) {
            onChoose(selectedRow.original as DishItem);
            setOpen(false);
        }
    }, [selectedRow, onChoose]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Thay đổi</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Chọn món ăn</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="w-full">
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Lọc tên"
                                value={(table.getColumn("dishName")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => table.getColumn("dishName")?.setFilterValue(event.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                        <DataTable table={table} columns={columns} />
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
