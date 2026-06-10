"use client";

import { useState, useMemo } from "react";
import { Search, Download, ListFilter } from "lucide-react";
import { Event, Transaction } from "../../../types/transaction";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/drop-down/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { PaginationDemo } from "../../feedback/Pagination";
import Link from "next/link";
import Image from "next/image";

interface TransactionTableProps {
  data: Transaction[];
  selectedEvent?: Event;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Successful":
      return "bg-[#E6F9F1] text-accent";
    case "Failed":
      return "bg-[#FEECEB] text-[#EA1D24]";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export function TransactionTable({
  data,
  selectedEvent,
}: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  const filteredData = useMemo(() => {
    return data.filter((transaction) => {
      const matchesSearch = transaction.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || transaction.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, selectedStatus]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-subtitle-24 font-semibold text-secondary flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center">
              <Image
                src={"images/receipt-text.svg"}
                alt="receipt-text"
                width={34}
                height={34}
              />
            </div>
            Transactions
          </h2>
        </div>
      </div>
      <div className="mb-4 flex justify-between all ease-in-out duration-300">
        {selectedEvent && (
          <div className=" flex items-center gap-2 rounded-[8.5px] border border-gray-300">
            <span className="text-sm font-medium bg-[#CDD4E2]/40 text-secondary border py-1.5 px-3.5 rounded-[8.5px] ">
              {selectedEvent.title}
            </span>
            <span className="text-sm py-1.25 px-4 text-gray-500">
              {selectedEvent.date}
            </span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Search for attendees"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 py-2 rounded-lg border-gray-300"
            />
            <Search className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
          </div>
          <Button
            onClick={() => {
              if (filteredData.length === 0) {
                alert("No transactions to export.");
                return;
              }

              const headers = [
                "ID",
                "Username",
                "Amount (USD)",
                "Status",
                "Timestamp",
              ];
              const rows = filteredData.map((t) => [
                t.id,
                t.username,
                t.amount.toString(),
                t.status,
                t.timestamp,
              ]);

              const csvContent = [headers, ...rows]
                .map((row) =>
                  row
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(","),
                )
                .join("\n");

              const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-primary hover:bg-primary-hover text-white gap-2 rounded-lg flex items-center cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-background type-detail-semibold text-center">
                ID
              </TableHead>
              <TableHead className="text-background type-detail-semibold text-center w-[125px]">
                Username
              </TableHead>
              <TableHead className="text-background type-detail-semibold relative">
                <span className="flex justify-center">Amount</span>
              </TableHead>
              <TableHead className="text-background type-detail-semibold text-center">
                Payment
              </TableHead>

              <TableHead className="text-background type-detail-semibold text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex justify-center items-center gap-2 cursor-pointer select-none transition-colors duration-150 hover:text-blue-200">
                      <span>
                        Status{" "}
                        {selectedStatus !== "all" ? `(${selectedStatus})` : ""}
                      </span>
                      <ListFilter size={15} className="shrink-0" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border border-slate-100 shadow-xl bg-white p-1 min-w-[135px]">
                    <DropdownMenuRadioGroup
                      value={selectedStatus}
                      onValueChange={(val) => {
                        setSelectedStatus(val);
                        setCurrentPage(1);
                      }}
                    >
                      <DropdownMenuRadioItem
                        value="all"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        All
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="Successful"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Successful
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="Failed"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Failed
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        value="Pending"
                        className="rounded-lg cursor-pointer text-sm font-medium text-slate-600 focus:bg-slate-50"
                      >
                        Pending
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>

              <TableHead className="text-background w-[80px] type-detail-semibold text-center">
                Timestamp
              </TableHead>
              <TableHead className="text-background type-detail-semibold text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((transaction, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 border-gray-200"
                >
                  <TableCell className="type-detail mr-1.5 text-gray-700">
                    {transaction.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.avatar ? (
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            className="bg-cover object-fill"
                            src={transaction.avatar}
                            alt={transaction.username}
                          />
                          <AvatarFallback>
                            {transaction.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[12px] font-medium text-white shrink-0">
                          {transaction.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="type-detail text-gray-700">
                        {transaction.username}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center w-16 type-detail font-bold rounded text-gray-400">
                      ${transaction.amount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex justify-center">
                      <span className="inline-flex items-center justify-center w-16 h-6 type-detail font-bold rounded">
                        <Image
                          src={"/images/webill365.svg"}
                          alt="webill365"
                          width={49}
                          height={14}
                        />
                      </span>
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="flex justify-center">
                      <span
                        className={`type-desc-small-semibold inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full ${getStatusColor(
                          transaction.status,
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    <span className="flex type-desc-small-semibold justify-center">
                      {transaction.timestamp}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <Link
                      href={`/transaction-history/${transaction.uuid}`}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <span className="flex justify-end">
                        <Image
                          src={"/export.svg"}
                          alt="export"
                          width={22}
                          height={22}
                        />
                      </span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 text-sm py-6"
                >
                  No Transaction found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <PaginationDemo
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
