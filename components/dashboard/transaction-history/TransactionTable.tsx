"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Transaction } from "../../../types/transaction";
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
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

interface TransactionTableProps {
  data: Transaction[];
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Successful":
      return "bg-green-100 text-green-700";
    case "Failed":
      return "bg-red-100 text-red-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string): string => {
  switch (status) {
    case "Successful":
      return "✓";
    case "Failed":
      return "✕";
    default:
      return "○";
  }
};

export function TransactionTable({ data }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  const filteredData = useMemo(
    () =>
      data.filter((transaction) =>
        transaction.username.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [data, searchTerm],
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-fs-subtitle font-semibold text-secondary flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 6V8.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2C19.11 2.01 20.11 2.45 20.83 3.17C21.55 3.9 22 4.9 22 6Z"
                  stroke="#0F2854"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 7V21C2 21.83 2.93998 22.3 3.59998 21.8L5.31 20.52C5.71 20.22 6.27 20.26 6.63 20.62L8.28998 22.29C8.67998 22.68 9.32002 22.68 9.71002 22.29L11.39 20.61C11.74 20.26 12.3 20.22 12.69 20.52L14.4 21.8C15.06 22.29 16 21.82 16 21V4C16 2.9 16.9 2 18 2H7H6C3 2 2 3.79 2 6V7Z"
                  stroke="#0F2854"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 9H12"
                  stroke="#0F2854"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.75 13H11.25"
                  stroke="#0F2854"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            Transactions
          </h2>
        </div>
      </div>
      <div className="mb-4 flex justify-between">
        <div className="w-[260px] flex items-center gap-2 rounded-[8.5px] border-[1px] border-gray-300">
          <span className="text-sm font-medium bg-[#CDD4E2]/40 text-secondary border py-[5px] px-[14px]  rounded-[8.5px] ">
            {/* {eventName } */}
            Monthly Party
          </span>
          <span className="text-sm py-[5px] px-4 text-gray-500">
            {/* {eventDate} */}
            Oct 12, 2026
          </span>
        </div>
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
          <Button className="bg-primary hover:bg-primary-hover text-white gap-2 rounded-lg flex items-center">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-background type-desc-semibold text-center">
                Transaction ID
              </TableHead>
              <TableHead className="text-background type-desc-semibold text-center">
                Username
              </TableHead>
              <TableHead className="text-background type-desc-semibold relative">
                <span className="flex justify-center">Amount</span>
              </TableHead>
              <TableHead className="text-background type-desc-semibold text-center">
                Payment
              </TableHead>
              <TableHead className="text-background type-desc-semibold text-center">
                Status
              </TableHead>
              <TableHead className="text-background type-desc-semibold text-center">
                Timestamp
              </TableHead>
              <TableHead className="text-background type-desc-semibold text-center pr-3">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((transaction, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50 border-gray-200"
              >
                <TableCell className="font-mono text-sm text-gray-700">
                  {transaction.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={transaction.avatar}
                        alt={transaction.username}
                      />
                      <AvatarFallback>
                        {transaction.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-700">
                      {transaction.username}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 flex justify-center font-semibold">
                  ${transaction.amount}
                </TableCell>
                <TableCell>
                  <span className="flex justify-center">
                    <span className="inline-flex items-center justify-center w-16 h-6 bg-blue-50 text-blue-600 text-xs font-bold rounded">
                      {transaction.payment}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="flex justify-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}
                  >
                    {/* <span>{getStatusIcon(transaction.status)}</span> */}
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  <span className="flex justify-center">
                    {transaction.timestamp}
                  </span>
                </TableCell>
                <TableCell className="w-7">
                  <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="flex justify-end">
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </span>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {renderPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            disabled={typeof page !== "number"}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              page === currentPage
                ? "bg-secondary text-white"
                : typeof page === "number"
                  ? "hover:bg-gray-100 text-gray-700"
                  : "text-gray-400 cursor-default"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
