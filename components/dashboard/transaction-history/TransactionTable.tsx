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

interface TransactionTableProps {
  data: Transaction[];
  selectedEvent?: Event;
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

  // const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-subtitle-24 font-semibold text-secondary flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center">
              <svg
                width="26"
                height="26"
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
      <div className="mb-4 flex justify-between all ease-in-out duration-300">
        {selectedEvent && (
          <div className=" flex items-center gap-2 rounded-[8.5px] border border-gray-300">
            <span className="text-sm font-medium bg-[#CDD4E2]/40 text-secondary border py-1.25 px-3.5 rounded-[8.5px] ">
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
            onClick={() => alert("Export Excel Successfully")}
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
                    <div className="flex items-center ">
                      <Avatar className="w-7 h-7">
                        <AvatarImage
                          src={transaction.avatar}
                          alt={transaction.username}
                        />
                        <AvatarFallback>
                          {transaction.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
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
                        <svg
                          width="45"
                          height="9"
                          viewBox="0 0 47 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_3873_132403)">
                            <path
                              d="M35.3182 5.85571C35.3182 6.43635 35.1887 6.94597 34.9255 7.38508C34.6643 7.82423 34.2913 8.16631 33.8064 8.4119C33.3236 8.65749 32.7601 8.78003 32.117 8.78003C31.5553 8.78003 31.0373 8.67863 30.5655 8.47316C30.0937 8.26553 29.692 7.97548 29.3633 7.59544L30.1073 6.80933L30.6446 6.24279C30.7566 6.41737 30.9168 6.56592 31.121 6.68628C31.1603 6.71011 31.2022 6.73343 31.2458 6.75459C31.5117 6.88902 31.7903 6.95518 32.0821 6.95518C32.3302 6.95518 32.5495 6.908 32.7403 6.81585C32.9314 6.72367 33.0806 6.58924 33.1901 6.41682C33.2974 6.24443 33.3524 6.03677 33.3524 5.79391C33.3524 5.55102 33.2954 5.34555 33.1834 5.17097C33.0717 4.99858 32.9114 4.86901 32.7072 4.77901C32.501 4.68956 32.2549 4.64674 31.9699 4.64674C31.8206 4.64674 31.6647 4.65596 31.5045 4.67494C31.3442 4.69607 31.2171 4.72697 31.1205 4.76439C31.1205 4.76439 31.119 4.7651 31.1159 4.76655V3.58198L31.1205 3.5771L32.4696 2.0103H31.1205V0.210938H35.1507V1.38359L33.4174 3.36566C33.7289 3.39874 34.0142 3.49523 34.2734 3.66058C34.5959 3.86606 34.8505 4.1561 35.0369 4.53127C35.2254 4.90643 35.3176 5.34773 35.3176 5.85517L35.3182 5.85571Z"
                              fill="#FF6700"
                            />
                            <path
                              d="M40.9865 4.31439C40.743 3.8834 40.4168 3.54077 40.0084 3.28706C39.6003 3.03331 39.145 2.90647 38.6431 2.90647C38.6329 2.90647 38.6244 2.90756 38.6149 2.90756L40.5195 0.210938H38.272L35.9908 3.66762C35.5411 4.37674 35.3164 5.08152 35.3164 5.78251C35.3164 6.34689 35.4494 6.85651 35.7155 7.31137C35.9811 7.76677 36.3412 8.1251 36.7942 8.38697C37.2473 8.64882 37.7584 8.78003 38.328 8.78003C38.8977 8.78003 39.4198 8.64718 39.8728 8.381C40.3261 8.11537 40.6854 7.757 40.9515 7.30539C41.2171 6.85433 41.3504 6.34256 41.3504 5.77059C41.3504 5.23117 41.2284 4.74541 40.9854 4.31439H40.9865ZM39.2898 6.3572C39.1961 6.54639 39.0669 6.69386 38.902 6.7985C38.7374 6.90312 38.5463 6.9557 38.329 6.9557C38.1117 6.9557 37.9317 6.90312 37.7671 6.7985C37.6022 6.69386 37.4733 6.54694 37.3793 6.3572C37.2855 6.16798 37.2388 5.95654 37.2388 5.72289C37.2388 5.48922 37.2855 5.27996 37.3793 5.09456C37.4733 4.90913 37.6022 4.76221 37.7671 4.65323C37.9317 4.54427 38.1189 4.49006 38.329 4.49006C38.5391 4.49006 38.7374 4.54264 38.902 4.64728C39.0669 4.7519 39.1961 4.89937 39.2898 5.08858C39.3836 5.27832 39.4303 5.48977 39.4303 5.72344C39.4303 5.95708 39.3836 6.16853 39.2898 6.35772V6.3572Z"
                              fill="#FF6700"
                            />
                            <path
                              d="M46.4372 4.39899C46.2276 3.96797 45.9186 3.62155 45.5103 3.3597C45.1022 3.09783 44.5944 2.9672 43.9875 2.9672C43.7476 2.9672 43.5401 2.98724 43.3642 3.02736C43.3162 3.03821 43.2694 3.05122 43.2229 3.06584L43.348 2.01193H46.3139V0.210938H41.74L41.3468 4.15121L42.1337 4.92486C42.306 4.7877 42.4987 4.68088 42.7123 4.60446C42.926 4.52801 43.16 4.4895 43.4145 4.4895C43.6988 4.4895 43.9428 4.54211 44.1449 4.64673C44.3471 4.75138 44.5027 4.89666 44.6111 5.08209C44.7195 5.26749 44.7739 5.48488 44.7739 5.73481C44.7739 5.98473 44.7195 6.20051 44.6111 6.38158C44.5022 6.56267 44.3525 6.70361 44.1614 6.80447C43.9706 6.9053 43.7435 6.95572 43.4816 6.95572C43.1893 6.95572 42.9099 6.88904 42.6443 6.7562C42.3782 6.62338 42.1781 6.45208 42.043 6.24227L40.7617 7.59598C41.0838 7.97493 41.4937 8.26661 41.9922 8.47209C42.4902 8.67756 43.0128 8.78002 43.5596 8.78002C44.2115 8.78002 44.775 8.65479 45.2509 8.40541C45.7265 8.15548 46.0956 7.80688 46.3575 7.35961C46.6198 6.91233 46.7508 6.39892 46.7508 5.81831C46.7508 5.30272 46.646 4.82943 46.4361 4.39844L46.4372 4.39899Z"
                              fill="#FF6700"
                            />
                            <path
                              d="M21.327 4.6527C21.1622 4.4765 20.9666 4.33067 20.7423 4.2114C20.8961 4.11868 21.0347 4.01297 21.1526 3.89098C21.5155 3.5169 21.6985 3.04255 21.6985 2.47058C21.6985 2.04446 21.6002 1.66116 21.4062 1.32287C21.2106 0.984572 20.9324 0.714586 20.5689 0.513452C20.206 0.311776 19.7761 0.210938 19.2816 0.210938H15.6641V8.78111H19.204C19.7584 8.78111 20.2393 8.67213 20.6481 8.45474C21.0553 8.23732 21.3714 7.94024 21.5977 7.56617C21.822 7.19046 21.9344 6.76271 21.9344 6.27805C21.9344 5.6264 21.7323 5.08424 21.3275 4.65325L21.327 4.6527ZM17.6419 1.81893H18.7992C19.0613 1.81893 19.2761 1.88886 19.4449 2.02928C19.6138 2.17078 19.6969 2.3898 19.6969 2.68798C19.6969 2.98615 19.6138 3.20681 19.4449 3.34667C19.2761 3.48819 19.0608 3.55811 18.7992 3.55811H17.6419V1.81893ZM19.6697 6.88904C19.4868 7.07823 19.2372 7.17202 18.9227 7.17202H17.6419V5.11787H18.9227C19.1319 5.11787 19.3134 5.1596 19.4676 5.24471C19.6213 5.32983 19.7393 5.45019 19.8225 5.60687C19.9041 5.76464 19.9459 5.94352 19.9459 6.1452C19.9459 6.45208 19.8547 6.69982 19.6702 6.88904H19.6697Z"
                              fill="#0F1FEA"
                            />
                            <path
                              d="M22.2812 8.78174V2.72656H24.2481V8.78174H22.2812Z"
                              fill="#0F1FEA"
                            />
                            <path
                              d="M24.8438 8.78003V0.210938H26.7989V8.78003H24.8438Z"
                              fill="#0F1FEA"
                            />
                            <path
                              d="M27.4062 8.78002V0.210938H29.3615V8.78002H27.4062Z"
                              fill="#0F1FEA"
                            />
                            <path
                              d="M23.2647 2.32637C23.8078 2.32637 24.2481 1.85282 24.2481 1.26866C24.2481 0.684493 23.8078 0.210938 23.2647 0.210938C22.7215 0.210938 22.2812 0.684493 22.2812 1.26866C22.2812 1.85282 22.7215 2.32637 23.2647 2.32637Z"
                              fill="#FF6700"
                            />
                            <path
                              d="M9.11317 0.210938L7.72251 5.2523L6.34898 0.210938H4.74207L3.37409 5.23226L1.98897 0.210938H0L2.5283 8.78003H4.15739L5.54099 3.68011L6.93317 8.78003H8.55166L11.0911 0.210938H9.11317Z"
                              fill="#0F1FEA"
                            />
                            <path
                              d="M14.1371 5.90214C14.126 6.01762 14.1018 6.12875 14.0645 6.23719C14.003 6.42153 13.9042 6.58903 13.7681 6.73486C13.4193 7.10787 12.9233 7.22334 12.4822 7.07967L13.5796 5.90214L15.2318 4.12988C15.1245 3.94554 14.997 3.7737 14.8503 3.61323C14.7011 3.45275 14.5408 3.31614 14.3699 3.20013C14.2187 3.09603 14.0584 3.00873 13.8936 2.94043C12.8845 2.50834 11.6864 2.73063 10.8678 3.61053C10.3718 4.14398 10.0976 4.82817 10.0517 5.52698C10.0341 5.76065 10.0432 5.99918 10.078 6.23285C10.1374 6.63185 10.271 7.0233 10.4797 7.37514C10.5896 7.55948 10.7166 7.73133 10.8638 7.8918C11.013 8.05012 11.1733 8.18888 11.3421 8.30493C12.4303 9.05307 13.8941 8.91862 14.8462 7.89668C15.2807 7.42936 15.5438 6.84654 15.6361 6.23989C15.6537 6.1266 15.6623 6.01546 15.6668 5.90269H14.1375L14.1371 5.90214ZM11.583 5.52916C11.6249 5.25049 11.7453 4.98376 11.945 4.76907C12.2917 4.39606 12.7897 4.28059 13.2287 4.42426L11.6203 6.14937C11.5654 5.94878 11.5523 5.73409 11.583 5.52862V5.52916Z"
                              fill="#0F1FEA"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3873_132403">
                              <rect width="47" height="9" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
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
                      href={"/transaction-history/1"}
                      className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <span className="flex justify-end">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 10.9969L21.2 2.79688"
                            stroke="#292D32"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21.9992 6.8V2H17.1992"
                            stroke="#292D32"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
                            stroke="#292D32"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
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
