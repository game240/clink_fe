import { twMerge } from "tailwind-merge";

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
        <button
          className="flex justify-center items-center w-[148px] h-[68px] rounded-[12px] bg-white text-title-md-b text-gray-05 cursor-pointer"
          onClick={onClick}
        >
          바로가기
        </button>
      </div>
      <img src={src} alt="" />
    </div>
  );
};

export default ClubStartBlock;
