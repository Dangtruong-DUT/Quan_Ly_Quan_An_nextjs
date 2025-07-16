"use client";

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
import { TableItem } from "@/app/manage/tables/context/TableTableContext";
import columns from "@/app/manage/orders/_components/tables-dialog/columns";
import { DataTable } from "@/components/ui/data-table";
import { useGetTables } from "@/hooks/data/useTables";

const PAGE_SIZE = 10;

export function TablesDialog({ onChoose }: { onChoose: (table: TableItem) => void }) {
    const [open, setOpen] = useState(false);
    const { data: tableDataQuery } = useGetTables();
    const data = tableDataQuery?.payload.data || [];
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
        table.setPagination({
            pageIndex: 0,
            pageSize: PAGE_SIZE,
        });
    }, [table]);

    useEffect(() => {
        if (selectedRow) {
            const selectedTable = selectedRow.original as TableItem;
            table.getSelectedRowModel().rows = [];
            onChoose(selectedTable);
            setOpen(false);
        }
    }, [selectedRow, onChoose, table]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Thay đổi</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-full overflow-auto">
                <DialogHeader>
                    <DialogTitle>Chọn bàn</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="w-full">
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Số bàn"
                                value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
                                onChange={(event) => table.getColumn("number")?.setFilterValue(event.target.value)}
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
                                    pathname="/manage/Tables"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
