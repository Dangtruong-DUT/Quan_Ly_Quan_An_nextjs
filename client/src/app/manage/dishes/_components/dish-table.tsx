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
import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/auto-pagination";
import { DataTable } from "@/components/ui/data-table";
import columns from "@/app/manage/dishes/_components/columns";
import { useDishTableContext } from "@/app/manage/dishes/context/DishTableContext";
import AlertDialogDeleteDish from "@/app/manage/dishes/_components/alert-dialog-delete-dish";
import AddDish from "@/app/manage/dishes/_components/add-dish";
import EditDish from "@/app/manage/dishes/_components/edit-dish";
import { useGetDishes } from "@/hooks/data/useDishes";

// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function DishTable() {
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;
    const { dishIdEdit, setDishIdEdit, dishDelete, setDishDelete } = useDishTableContext();
    const { data: resFromServer } = useGetDishes();
    const data = resFromServer?.payload.data || [];
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex,
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
            pageIndex,
            pageSize: PAGE_SIZE,
        });
    }, [table, pageIndex]);

    return (
        <div className="w-full">
            <EditDish id={dishIdEdit} setId={setDishIdEdit} />
            <AlertDialogDeleteDish dishDelete={dishDelete} setDishDelete={setDishDelete} />
            <div className="flex items-center py-4">
                <Input
                    placeholder="filter by name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <div className="ml-auto flex items-center gap-2">
                    <AddDish />
                </div>
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
                        pathname="/manage/dishes"
                    />
                </div>
            </div>
        </div>
    );
}
