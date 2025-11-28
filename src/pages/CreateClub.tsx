import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../apis/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import { AxiosError } from "axios";
import ic_plus from "../assets/create_club/ic_plus.svg";
import ic_delete from "../assets/create_club/ic_delete.svg";
import RoundBtn from "../components/button/RoundBtn";
import Dialog from "@mui/material/Dialog";
import { twJoin } from "tailwind-merge";

type CreateClubResponse = {
  club: {
    id: string;
    name: string;
    description: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
  };
  membership: {
    club_id: string;
    profile_id: string;
    role: string;
    status: string;
    officer_title: string | null;
    joined_at: string;
    ord: number;
  };
};

const CreateClub = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [openThumbnailDeleteDialog, setOpenThumbnailDeleteDialog] =
    useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (description.length > 40) {
      setDescription(description.slice(0, 40));
    }
  }, [description]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    const trimmed = name.trim();
    if (trimmed.trim().length === 0) {
      alert("동아리 이름을 입력하세요.");
      return;
    }
    if (location.length === 0) {
      alert("소속 학교를 입력하세요.");
      return;
    }
    if (description.length === 0) {
      alert("동아리 한 줄 소개를 입력하세요.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", trimmed);
      formData.append("description", description.trim() || "");
      formData.append("profile_id", user.id);
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }
      const { data } = await axiosClient.post<CreateClubResponse>(
        "/club",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);
      alert("동아리가 생성되었습니다.");
      setName("");
      setDescription("");
      setTimeout(() => {
        navigate("/organizations");
      }, 700);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.error || error.message);
      } else {
        alert("오류가 발생했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <main>로딩 중…</main>;
  }

  return (
    <main>
      <div className="flex flex-col justify-center items-center w-full h-[240px] bg-primary-01">
        <h1 className="text-[32px] font-bold text-gray-08">동아리 생성</h1>
        <p className="text-text-lg-m text-gray-07">
          새로운 동아리를 만들어 보세요!
        </p>
      </div>
      <form
        className="flex flex-col gap-[40px] pt-[70px] px-[12.083333333333333333333333333333%]"
        onSubmit={onSubmit}
      >
        <section className="flex flex-col gap-[20px]">
          <h2 className="text-title-lg-b">동아리 대표 사진 등록</h2>
          <div
            className={twJoin(
              "flex justify-center items-center relative size-[304px] rounded-[20px] border border-gray-01 bg-contain bg-center bg-no-repeat",
              !thumbnail ? "cursor-pointer" : "cursor-default"
            )}
            onClick={() => {
              if (!thumbnail && fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            style={{ backgroundImage: `url(${thumbnail})` }}
          >
            {!thumbnail && <img src={ic_plus} alt="" />}
            {thumbnail && (
              <button
                className="absolute top-[20px] right-[20px] cursor-pointer z-10"
                type="button"
                onClick={() => {
                  setOpenThumbnailDeleteDialog(true);
                }}
              >
                <img src={ic_delete} alt="" />
              </button>
            )}
          </div>
          <input
            className="hidden"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                  if (e.target?.result) {
                    setThumbnail(e.target.result as string);
                    setThumbnailFile(file);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </section>

        <Dialog
          open={openThumbnailDeleteDialog}
          onClose={() => {
            setOpenThumbnailDeleteDialog(false);
          }}
          slotProps={{
            paper: {
              sx: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                margin: 0,
                paddingTop: "60px",
                paddingBottom: "50px",
                width: "460px",
                height: "278px",
                borderRadius: "12px",
              },
            },
          }}
        >
          <div className="flex flex-col gap-[20px]">
            <h1 className="text-[24px] font-bold">
              동아리 대표 사진을 삭제하시겠어요?
            </h1>
            <p className="typo-text-lg-m text-neutral-gray-08">
              대표 사진을 삭제하면 다시 등록해야 합니다.
            </p>
          </div>
          <div className="flex justify-center gap-[30px] w-full">
            <RoundBtn
              className="w-[148px] h-[56px]"
              color="gray"
              onClick={() => {
                setOpenThumbnailDeleteDialog(false);
              }}
            >
              닫기
            </RoundBtn>
            <RoundBtn
              className="w-[148px] h-[56px]"
              color="primary"
              onClick={() => {
                setThumbnail(null);
                setThumbnailFile(null);
                setOpenThumbnailDeleteDialog(false);
              }}
            >
              삭제
            </RoundBtn>
          </div>
        </Dialog>

        <section className="flex flex-col gap-[20px]">
          <h2 className="text-title-lg-b">동아리 이름</h2>
          <input
            type="text"
            className="w-full h-[78px] py-[28px] px-[25px] rounded-[20px] border-1 border-gray-01 text-text-lg-r text-gray-08"
            placeholder="동아리 이름을 입력해주세요."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </section>

        <section className="flex flex-col gap-[20px]">
          <h2 className="text-title-lg-b">소속 학교</h2>
          <input
            type="text"
            className="w-full h-[78px] py-[28px] px-[25px] rounded-[20px] border-1 border-gray-01 text-text-lg-r text-gray-08"
            placeholder="동아리가 소속되어 있는 학교를 입력해주세요."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </section>

        <section className="flex flex-col gap-[20px]">
          <h2 className="text-title-lg-b">동아리 한 줄 소개</h2>
          <input
            type="text"
            className="w-full h-[78px] py-[28px] px-[25px] rounded-[20px] border-1 border-gray-01 text-text-lg-r text-gray-08"
            placeholder="우리 동아리의 한 줄 소개를 작성해주세요. (공백 포함 40자 내외)"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <div className="flex justify-end w-full mt-[-5px]">
            <p className="text-text-sm-r text-gray-04">
              <span className="text-gray-07">{description.length}</span>/40
              (최소 10자)
            </p>
          </div>
        </section>

        <div className="flex justify-center gap-[40px] w-full mt-[67px] mb-[100px]">
          <RoundBtn
            className="w-[230px] h-[70px]"
            color="gray"
            onClick={() => {
              navigate(-1);
            }}
          >
            뒤로
          </RoundBtn>

          <RoundBtn
            className="w-[230px] h-[70px]"
            onClick={onSubmit}
            disabled={
              submitting || !(name && location && description.length >= 10)
            }
          >
            완료
          </RoundBtn>
        </div>
      </form>
    </main>
  );
};

export default CreateClub;
