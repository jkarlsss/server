import { useSearchParams } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { useState } from "react";

interface PaginationCardsProps {
  totalPages: number;
}

export function PaginationCards({ totalPages }: PaginationCardsProps) {
  const [searchParams] = useSearchParams();

  const initialPage = Number(searchParams.get("page") || "1");

  const [current, setCurrent] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrent(page);
    window.location.search = `?page=${page}`;
  };
  return (
    <Pagination>
      <PaginationContent>
       
        <PaginationItem>
          <PaginationPrevious href="#" 
          onClick={() => {
            if (current === 1) return
            handlePageChange(current - 1)
          }}
          />
        </PaginationItem>
         {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem key={index + 1}>
            <PaginationLink
              href="#"
              isActive={current === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#"
          onClick={() => {
            if (current === totalPages) return
            handlePageChange(current + 1)
          }} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
