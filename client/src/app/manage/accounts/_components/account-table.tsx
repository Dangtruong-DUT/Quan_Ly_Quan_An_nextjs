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

import AutoPagination from "@/components/auto-pagination";
import AlertDialogDeleteAccount from "@/app/manage/accounts/_components/alert-dialog-delete-account";

import columns from "@/app/manage/accounts/_components/column";
import { DataTable } from "@/components/ui/data-table";
import { useSearchParams } from "next/navigation";
import { useAccountTableContext } from "@/app/manage/accounts/context/account-table-context";
import EditEmployee from "@/app/manage/accounts/_components/edit-employee";
import AddEmployee from "@/app/manage/accounts/_components/add-employee";
import { useGetAccountList } from "@/app/queries/useAccount";

const PAGE_SIZE = 10;
export default function AccountTable() {
    const { employeeIdEdit, setEmployeeIdEdit, employeeDelete, setEmployeeDelete } = useAccountTableContext();
    const searchParams = useSearchParams();
    const pageParam = searchParams.get("page");
    const page = pageParam ? Number(pageParam) : 1;
    const pageIndex = page - 1;
    // const params = Object.fromEntries(searchParam.entries())
    const { data: resListFromServer } = useGetAccountList();
    const data = resListFromServer?.payload.data || [];
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
            <EditEmployee id={employeeIdEdit} setId={setEmployeeIdEdit} />
            <AlertDialogDeleteAccount employeeDelete={employeeDelete} setEmployeeDelete={setEmployeeDelete} />
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <div className="ml-auto flex items-center gap-2">
                    <AddEmployee />
                </div>
            </div>
            <DataTable table={table} columns={columns} />
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-xs text-muted-foreground py-4 flex-1 ">
                    Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong
                    <strong>{data.length}</strong> kết quả
                </div>
                <div>
                    <AutoPagination
                        page={table.getState().pagination.pageIndex + 1}
                        pageSize={table.getPageCount()}
                        pathname="/manage/accounts"
                    />
                </div>
            </div>
        </div>
    );
}
