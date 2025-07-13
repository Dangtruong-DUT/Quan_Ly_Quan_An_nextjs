import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface Props {
    page: number;
    pageSize: number;
    pathname: string;
}

const RANGE = 2;

export default function AutoPagination({ page, pageSize, pathname }: Props) {
    const renderPagination = () => {
        let dotAfter = false;
        let dotBefore = false;

        return Array.from({ length: pageSize }).map((_, index) => {
            const pageNumber = index + 1;

            // Điều kiện hiển thị ...
            const showDotAfter = () =>
                !dotAfter &&
                ((page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) ||
                    (page > RANGE * 2 + 1 &&
                        page < pageSize - RANGE * 2 &&
                        pageNumber > page + RANGE &&
                        pageNumber < pageSize - RANGE + 1));

            const showDotBefore = () =>
                !dotBefore &&
                ((page > RANGE * 2 + 1 &&
                    page < pageSize - RANGE * 2 &&
                    pageNumber < page - RANGE &&
                    pageNumber > RANGE) ||
                    (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE));

            if (showDotAfter()) {
                dotAfter = true;
                return (
                    <PaginationItem key={`after-${index}`}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            if (showDotBefore()) {
                dotBefore = true;
                return (
                    <PaginationItem key={`before-${index}`}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            return (
                <PaginationItem key={pageNumber}>
                    <PaginationLink
                        href={{
                            pathname,
                            query: { page: pageNumber },
                        }}
                        isActive={pageNumber === page}
                    >
                        {pageNumber}
                    </PaginationLink>
                </PaginationItem>
            );
        });
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={{
                            pathname,
                            query: { page: page - 1 },
                        }}
                        className={cn({ "cursor-not-allowed": page === 1 })}
                        onClick={(e) => {
                            if (page === 1) e.preventDefault();
                        }}
                    />
                </PaginationItem>

                {renderPagination()}

                <PaginationItem>
                    <PaginationNext
                        href={{
                            pathname,
                            query: { page: page + 1 },
                        }}
                        className={cn({ "cursor-not-allowed": page === pageSize })}
                        onClick={(e) => {
                            if (page === pageSize) e.preventDefault();
                        }}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
