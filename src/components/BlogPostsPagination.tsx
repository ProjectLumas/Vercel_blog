// src/components/BlogPostsPagination.tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export const BlogPostsPagination = ({
  pagination,
  basePath = "/?page=",
}: {
  basePath?: string;
  pagination: StrapiPagination;
}) => {
  if (pagination.pageCount <= 1) {
    return null;
  }

  // Gera a lista de números de página a serem exibidos
  const pages = Array.from({ length: pagination.pageCount }, (_, i) => i + 1);

  return (
    <Pagination>
      <PaginationContent>
        {pagination.page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`${basePath}${pagination.page - 1}`} />
          </PaginationItem>
        )}

        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink href={`${basePath}${pageNumber}`} isActive={pageNumber === pagination.page}>
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        {pagination.page < pagination.pageCount && (
          <PaginationItem>
            <PaginationNext href={`${basePath}${pagination.page + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};