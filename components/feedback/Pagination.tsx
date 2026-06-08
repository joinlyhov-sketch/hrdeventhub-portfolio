import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination/pagination";

interface PaginationDemoProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationDemo({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationDemoProps) {
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    onPageChange(page);
  };

  const linkClass =
    "hover:bg-transparent hover:text-inherit aria-[current=page]:bg-[#F0F3FF]";

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => handlePageClick(e, i)}
              isActive={currentPage === i}
              className={linkClass}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
      return pages;
    }

    pages.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          onClick={(e) => handlePageClick(e, 1)}
          isActive={currentPage === 1}
          className={linkClass}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    if (currentPage <= 2) {
      pages.push(
        <PaginationItem key={2}>
          <PaginationLink
            href="#"
            onClick={(e) => handlePageClick(e, 2)}
            isActive={currentPage === 2}
            className={linkClass}
          >
            2
          </PaginationLink>
        </PaginationItem>,
      );

      pages.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    } else if (currentPage >= totalPages - 1) {
      pages.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );

      pages.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink
            href="#"
            onClick={(e) => handlePageClick(e, totalPages - 1)}
            isActive={currentPage === totalPages - 1}
            className={linkClass}
          >
            {totalPages - 1}
          </PaginationLink>
        </PaginationItem>,
      );
    } else {
      pages.push(
        <PaginationItem key={currentPage}>
          <PaginationLink
            href="#"
            onClick={(e) => handlePageClick(e, currentPage)}
            isActive={true}
            className={linkClass}
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>,
      );

      pages.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    pages.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          href="#"
          onClick={(e) => handlePageClick(e, totalPages)}
          isActive={currentPage === totalPages}
          className={linkClass}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>,
    );

    return pages;
  };

  return (
    <div className="flex w-full justify-end mt-6 mb-6">
      <Pagination className="mx-0 justify-end w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={handlePrevious}
              className={`hover:bg-transparent hover:text-inherit ${
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }`}
            />
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={handleNext}
              className={`hover:bg-transparent hover:text-inherit ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
