import { type ColumnDef } from "@tanstack/react-table";
import type { Models } from "appwrite";
import { MoreHorizontal } from "lucide-react";
import { formatDate } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string
//   amount: number
//   status: "pending" | "processing" | "success" | "failed"
//   email: string
// }

export const columns: ColumnDef<Models.Document>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "accountId",
    header: "ID",
  },
  {
    id: "profile",
    header: "Profile",
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-2">
        <img
          referrerPolicy="no-referrer"
          src={row.original.imageUrl}
          className="rounded-full"
          width={25}
          height={25}
          alt="Profile Image"
        />
        <p className="font-medium truncate">{row.original.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Account Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");

      return (
        <div className="flex items-center gap-2">
          {status === "user" ? (
            <Badge className="bg-green-500">{status}</Badge>
          ) : (
            <Badge className="bg-blue-500">{status}</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "joinedAt",
    header: "Date Joined",
    cell: ({ row }) => {
      const joinedAt: string = row.getValue("joinedAt");
      return <div>{formatDate(joinedAt)}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
