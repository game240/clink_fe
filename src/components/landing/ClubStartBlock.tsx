import { twMerge } from "tailwind-merge";
import RoundBtn from "../button/RoundBtn";

interface ClubStartBlockProps {
  className?: string;
  title: string;
  description: string;
  src: string;
  onClick: () => void;
}

const ClubStartBlock = ({
  className,
  title,
  description,
  src,
  onClick,
}: ClubStartBlockProps) => {
  return (
    <div
      className={twMerge(
        "flex justify-between py-[30px] pl-[85px] pr-[111px] w-[712px] h-[250px] rounded-[20px]",
        className
      )}
    >
      <div className="pt-[12px] pb-[10px]">
        <h2 className="text-head-lg-b text-primary-05">{title}</h2>
        <p className="mt-[13px] mb-[33px] text-title-md-r text-gray-07">
          {description}
        </p>
        <RoundBtn color="primary" onClick={onClick}>
          바로가기
        </RoundBtn>
      </div>
      <img src={src} alt="" />
    </div>
  );
};

export default ClubStartBlock;
