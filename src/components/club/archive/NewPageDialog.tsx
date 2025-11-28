import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "./Select";

interface NewPageDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  wikiType: "knowhow" | "work";
}

const NewPageDialog = ({ open, setOpen, wikiType }: NewPageDialogProps) => {
  const [title, setTitle] = useState("");
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const navigate = useNavigate();
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          borderRadius: "20px",
        },
      }}
    >
      <section className="pt-[55px] pb-[50px] px-[38px] w-[530px] h-[496px]">
        <h1 className="typo-head-sm-b text-gray-09 text-center">
          새로운 글쓰기
        </h1>
        <div className="flex flex-col gap-[15px] mt-[40px]">
          <p className="pl-[20px] typo-text-lg-m text-[#53575B]">글 제목</p>
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            className="px-[20px] w-full h-[58px] border border-gray-01 rounded-[12px] typo-text-lg-m text-gray-09 placeholder:text-gray-04 focus:outline-none focus:border-primary-04"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="h-[25px]"></div>

        <div className="flex flex-col gap-[15px] mb-[50px]">
          <p className="pl-[20px] typo-text-lg-m text-[#53575B]">
            글 공개 범위
          </p>
          <Select
            isOpenSelect={isOpenSelect}
            setIsOpenSelect={setIsOpenSelect}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            disabled={wikiType === "work"}
          />
        </div>

        <div className="flex justify-center gap-[30px] w-full">
          <button
            className="w-[136px] h-[56px] bg-gray-00 rounded-[12px] typo-title-md-b text-gray-04 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            닫기
          </button>
          <button
            className="w-[136px] h-[56px] bg-primary-04 rounded-[12px] typo-title-md-b text-white cursor-pointer disabled:bg-primary-03 disabled:cursor-default"
            onClick={() => {
              navigate(
                `/edit/${encodeURI(
                  title || ""
                )}?clubId=${clubId}&wikiType=${wikiType}`,
                {
                  state: {
                    isPublic: wikiType === "knowhow" ? isPublic : false,
                  },
                }
              );
            }}
            disabled={!title}
          >
            다음
          </button>
        </div>
      </section>
    </Dialog>
  );
};

export default NewPageDialog;
