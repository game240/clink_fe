import { twMerge } from "tailwind-merge";
import { type ButtonHTMLAttributes } from "react";

interface RoundBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary";
}

const RoundBtn = ({
  className,
  color = "primary",
  ...props
}: RoundBtnProps) => {
  let colorClassName;
  if (color === "primary") {
    colorClassName = "bg-primary-04 text-white";
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
