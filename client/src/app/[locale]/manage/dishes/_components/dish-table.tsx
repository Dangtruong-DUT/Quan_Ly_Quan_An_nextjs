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
import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";
import AutoPagination from "@/components/auto-pagination";
import { DataTable } from "@/components/ui/data-table";
import { useGetDishes } from "@/hooks/data/useDishes";
import { useDishTableContext } from "@/app/[locale]/manage/dishes/context/DishTableContext";
import EditDish from "@/app/[locale]/manage/dishes/_components/edit-dish";
import AlertDialogDeleteDish from "@/app/[locale]/manage/dishes/_components/alert-dialog-delete-dish";
import AddDish from "@/app/[locale]/manage/dishes/_components/add-dish";
import columns from "@/app/[locale]/manage/dishes/_components/columns";

// Số lượng item trên 1 trang
const PAGE_SIZE = 10;
export default function DishTable() {
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;
    const { dishIdEdit, setDishIdEdit, dishDelete, setDishDelete } = useDishTableContext();
    const { data: resFromServer } = useGetDishes();
    const data = useMemo(() => resFromServer?.payload.data || [], [resFromServer]);
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
