import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<DishItem>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "image",
        header: "Ảnh",
        cell: ({ row }) => (
            <div>
                <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                    <AvatarImage src={row.getValue("image")} />
                    <AvatarFallback className="rounded-none">{row.original.name}</AvatarFallback>
                </Avatar>
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: "Tên",
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "price",
        header: "Giá cả",
        cell: ({ row }) => <div className="capitalize">{formatCurrency(row.getValue("price"))}</div>,
    },
    {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => (
            <div dangerouslySetInnerHTML={{ __html: row.getValue("description") }} className="whitespace-pre-line" />
        ),
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <div>{getVietnameseDishStatus(row.getValue("status"))}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: function Actions({ row }) {
            const { setDishIdEdit, setDishDelete } = useContext(DishTableContext);
            const openEditDish = () => {
                setDishIdEdit(row.original.id);
            };

            const openDeleteDish = () => {
                setDishDelete(row.original);
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
                        <DropdownMenuItem onClick={openEditDish}>Sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={openDeleteDish}>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default columns;
