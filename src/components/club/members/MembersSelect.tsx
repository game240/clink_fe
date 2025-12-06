import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import ic_arrow_down from "../../../assets/club/members/ic_arrow_down.svg";

interface MembersSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: string[];
}

const MembersSelect = ({ value, onChange, disabled = false, options }: MembersSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        className={twMerge(
          "flex justify-between items-center px-[12px] w-full h-[40px] typo-text-lg-r text-gray-09 cursor-pointer",
          disabled && "cursor-default"
        )}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
          }
        }}
        disabled={disabled}
      >
        <span className="w-[12px] h-[12px]"></span>
        <span>{value}</span>
        {!disabled && <img alt="" className="w-[12px] h-[12px]" src={ic_arrow_down} />}
      </button>
      {isOpen && !disabled && (
        <div className="absolute top-full py-[11px] w-full bg-white rounded-[12px] translate-y-[5px] z-10 shadow-[4px_4px_35px_10px_rgba(0,0,0,0.1)]">
          {options.map((option) => (
            <button
              key={option}
              className={twMerge(
                "w-full h-[30px] bg-white typo-text-md-m text-center cursor-pointer hover:bg-card-2",
                value === option && "bg-card-2"
              )}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersSelect;
