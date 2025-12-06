import ic_search from "../../../assets/club/members/ic_search.svg";
import { twMerge } from "tailwind-merge";

const MembersInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div
      className={twMerge(
        "flex items-center gap-[17px] px-[24px] w-full h-[52px] bg-card rounded-[30px]",
        className
      )}
    >
      <img src={ic_search} alt="" />
      <input
        {...props}
        className="w-full h-full bg-transparent outline-none typo-text-lg-r text-gray-05"
      />
    </div>
  );
};

export default MembersInput;
