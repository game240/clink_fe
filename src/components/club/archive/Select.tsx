import { twMerge } from "tailwind-merge";
import ic_select_arrow from "../../../assets/club/archive/ic_select_arrow.svg";

interface SelectProps {
  isOpenSelect: boolean;
  setIsOpenSelect: (isOpenSelect: boolean) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  disabled: boolean;
}

const Select = ({
  isOpenSelect,
  setIsOpenSelect,
  isPublic,
  setIsPublic,
  disabled,
}: SelectProps) => {
  return (
    <div className="relative">
      <button
        className={twMerge(
          "flex justify-between items-center px-[20px] w-full h-[58px] border border-gray-01 rounded-[12px] typo-text-lg-m text-gray-09 placeholder:text-gray-04 cursor-pointer",
          isOpenSelect && "border-primary-04",
          disabled && "bg-gray-00 text-gray-03 cursor-default"
        )}
        onClick={() => {
          if (disabled) {
            return;
          }
          setIsOpenSelect(!isOpenSelect);
        }}
      >
        <p>{isPublic ? "전체 공개" : "운영진 공개"}</p>
        <img src={ic_select_arrow} alt="" />
      </button>
      {isOpenSelect && (
        <div className="absolute top-full w-full bg-white border border-primary-04 rounded-[12px] translate-y-[5px]">
          <button
            className={twMerge(
              "px-[20px] py-[18px] w-full h-[58px] bg-white rounded-[12px] typo-text-lg-m text-gray-04 hover:bg-primary-01 hover:text-primary-05 text-start cursor-pointer",
              isPublic && "bg-primary-01 text-primary-05"
            )}
            onClick={() => {
              setIsPublic(true);
              setIsOpenSelect(false);
            }}
          >
            전체 공개
          </button>
          <button
            className={twMerge(
              "px-[20px] py-[18px] w-full h-[58px] bg-white rounded-[12px] typo-text-lg-m text-gray-04 hover:bg-primary-01 hover:text-primary-05 text-start cursor-pointer",
              !isPublic && "bg-primary-01 text-primary-05"
            )}
            onClick={() => {
              setIsPublic(false);
              setIsOpenSelect(false);
            }}
          >
            운영진 공개
          </button>
        </div>
      )}
    </div>
  );
};

export default Select;
