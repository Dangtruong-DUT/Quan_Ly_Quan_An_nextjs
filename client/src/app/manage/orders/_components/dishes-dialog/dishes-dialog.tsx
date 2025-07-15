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
import columns from "@/app/manage/orders/_components/dishes-dialog/columns";

type DishItem = DishListResType["data"][0];
const fakeData = [
    {
        id: 6,
        name: "bánh mì Việt nam",
        price: 100000,
        description: "hello",
        image: "http://localhost:4000/static/6d05d144f70f4eadbd3a89428645e346.png",
        status: "Unavailable",
        createdAt: "2024-06-26T04:31:09.710Z",
        updatedAt: "2024-07-03T07:41:54.613Z",
    },
    {
        id: 2,
        name: "Spaghetti 5",
        price: 50000,
        description: "Mỳ ý",
        image: "http://localhost:4000/static/e0001b7e08604e0dbabf0d8f95e6174a.jpg",
        status: "Available",
        createdAt: "2024-06-01T03:50:26.434Z",
        updatedAt: "2024-07-03T07:42:34.917Z",
    },
    {
        id: 1,
        name: "Beef steak",
        price: 190000,
        description: "Bò bít tết Mỹ",
        image: "http://localhost:4000/static/4f2867ef88214b4b961e72cf05e093b4.jpg",
        status: "Available",
        createdAt: "2024-06-01T03:45:43.148Z",
        updatedAt: "2024-06-01T03:45:43.148Z",
    },
] as unknown as DishItem[];

const PAGE_SIZE = 10;
export function DishesDialog({}: { onChoose: (dish: DishItem) => void }) {
    const [open, setOpen] = useState(false);
    const data = fakeData;
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

    useEffect(() => {
        table.setPagination({
            pageIndex: 0,
            pageSize: PAGE_SIZE,
        });
    }, [table]);

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
                                    pathname="/manage/dishes"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
