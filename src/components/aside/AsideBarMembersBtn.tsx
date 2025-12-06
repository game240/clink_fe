import type { HTMLAttributes } from "react";
import { twJoin } from "tailwind-merge";

interface AsideBarMembersBtn extends HTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
}
const AsideBarMembersBtn = ({ isSelected = false, ...props }: AsideBarMembersBtn) => {
  return (
    <button
      className={twJoin(
        "w-full h-[74px] bg-[#F5F6F8]/70 typo-title-lg-m cursor-pointer",
        isSelected ? "text-primary-04" : "text-gray-08"
      )}
      {...props}
    ></button>
  );
};

export default AsideBarMembersBtn;
