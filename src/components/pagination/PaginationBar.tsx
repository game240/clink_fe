import { useState } from "react";
import ic_left_arrow_gray from "../../assets/pagination/ic_left_arrow_gray.svg";
import ic_left_arrow_gray_disabled from "../../assets/pagination/ic_left_arrow_gray_disabled.svg";
import ic_dots from "../../assets/pagination/ic_dots.svg";
import { twJoin } from "tailwind-merge";

const PaginationBar = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 11;

  const getPageItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      "...",
      totalPages,
    ];
  };
  return (
    <div className="flex justify-center items-center gap-[30px] mt-[24px]">
      <button
        className="typo-text-lg-r text-gray-05 disabled:text-gray-02"
        disabled={currentPage === 1}
        onClick={() => {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }}
      >
        <img
          src={
            currentPage === 1 ? ic_left_arrow_gray_disabled : ic_left_arrow_gray
          }
          alt="<"
        />
      </button>
      {getPageItems().map((item, index) => {
        if (item === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="typo-text-lg-r text-gray-03 px-[8px]"
            >
              <img src={ic_dots} alt="..." />
            </span>
          );
        }

        const pageNumber = item as number;

        return (
          <button
            key={pageNumber}
            className={twJoin(
              "px-[8px]",
              pageNumber === currentPage
                ? "typo-text-lg-b text-gray-09"
                : "typo-text-lg-r text-gray-03"
            )}
            onClick={() => {
              if (pageNumber !== currentPage) {
                setCurrentPage(pageNumber);
              }
            }}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        className="typo-text-lg-r text-gray-05 disabled:text-gray-02"
        disabled={currentPage === totalPages}
        onClick={() => {
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          }
        }}
      >
        <img
          src={
            currentPage === totalPages
              ? ic_left_arrow_gray_disabled
              : ic_left_arrow_gray
          }
          alt=">"
          className="rotate-180"
        />
      </button>
    </div>
  );
};

export default PaginationBar;
