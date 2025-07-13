import { useAccountTableContext } from "@/app/manage/accounts/context/account-table-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccountType } from "@/utils/validation/account.schema";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<AccountType>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => (
            <div>
                <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                    <AvatarImage src={row.getValue("avatar")} />
                    <AvatarFallback className="rounded-none">{row.original.name}</AvatarFallback>
                </Avatar>
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: "Full Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Email
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: function Actions({ row }) {
            const { setEmployeeIdEdit, setEmployeeDelete } = useAccountTableContext();
            const openEditEmployee = () => {
                setEmployeeIdEdit(row.original.id);
            };

            const openDeleteEmployee = () => {
                setEmployeeDelete(row.original);
            };
            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={openEditEmployee}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={openDeleteEmployee}
                            className="text-red-500
                        "
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default columns;
