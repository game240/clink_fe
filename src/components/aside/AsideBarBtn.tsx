import type { HTMLAttributes } from "react";
import { twJoin } from "tailwind-merge";

interface AsideBarBtn extends HTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
}

const AsideBarBtn = ({ isSelected = false, ...props }: AsideBarBtn) => {
  return (
    <button
      className={twJoin(
        "w-full h-[74px] typo-title-lg-m cursor-pointer",
        isSelected ? "text-primary-04 bg-primary-01" : "text-gray-08"
      )}
      {...props}
    ></button>
  );
};

export default AsideBarBtn;
