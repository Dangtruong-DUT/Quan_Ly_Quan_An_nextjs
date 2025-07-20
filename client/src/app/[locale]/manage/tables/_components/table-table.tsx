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
import EditTable from "@/app/[locale]/manage/tables/_components/edit-table";
import AlertDialogDeleteTable from "@/app/[locale]/manage/tables/_components/alert-dialog-delete-table";
import { useTableTableContext } from "@/app/[locale]/manage/tables/context/TableTableContext";
import AddTable from "@/app/[locale]/manage/tables/_components/add-table";
import { useTableColumns } from "@/app/[locale]/manage/tables/_components/columns";
import { useGetTables } from "@/hooks/data/useTables";
import { useTranslations } from "next-intl";

const PAGE_SIZE = 10;
export default function TableTable() {
    const t = useTranslations("TableTable");
    const columns = useTableColumns();
    const searchParam = useSearchParams();
    const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
    const pageIndex = page - 1;

    const { tableIdEdit, setTableIdEdit, tableDelete, setTableDelete } = useTableTableContext();

    const queryData = useGetTables();

    const data = queryData.data?.payload.data || [];
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
            <EditTable id={tableIdEdit} setId={setTableIdEdit} />
            <AlertDialogDeleteTable tableDelete={tableDelete} setTableDelete={setTableDelete} />
            <div className="flex items-center py-4">
                <Input
                    placeholder={t("filterPlaceholder")}
                    value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("number")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <div className="ml-auto flex items-center gap-2">
                    <AddTable />
                </div>
            </div>
            <DataTable columns={columns} table={table} />
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-xs text-muted-foreground py-4 flex-1 ">
                    {t("showing")} <strong>{table.getPaginationRowModel().rows.length}</strong> {t("in")}{" "}
                    <strong>{data.length}</strong> {t("results")}
                </div>
                <div>
                    <AutoPagination
                        page={table.getState().pagination.pageIndex + 1}
                        pageSize={table.getPageCount()}
                        pathname="/manage/tables"
                    />
                </div>
            </div>
        </div>
    );
}
