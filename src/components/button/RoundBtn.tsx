import { twMerge } from "tailwind-merge";
import { type ButtonHTMLAttributes } from "react";

interface RoundBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "gray";
}

const RoundBtn = ({
  className,
  color = "primary",
  ...props
}: RoundBtnProps) => {
  let colorClassName;
  if (color === "primary") {
    colorClassName = "bg-primary-04 text-white disabled:bg-primary-03";
  } else if (color === "gray") {
    colorClassName = "bg-gray-00 text-gray-04";
  }
  return (
    <button
      className={twMerge(
        "flex justify-center items-center w-[148px] h-[68px] rounded-[12px] typo-title-md-b cursor-pointer",
        colorClassName,
        className
      )}
      {...props}
    ></button>
  );
};

export default RoundBtn;
