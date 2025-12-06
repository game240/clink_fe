import Dialog from "@mui/material/Dialog";
import MembersInput from "./MembersInput";
import { useEffect, useState, useRef } from "react";
import type { Member } from "../../../pages/club/ClubMembers";
import { twJoin } from "tailwind-merge";
import axiosClient from "../../../apis/axiosClient";
import { useSearchParams } from "react-router-dom";

interface MembersInviteDialogProps {
  open: boolean;
  onClose: () => void;
}

interface MemberResponse {
  user: Member;
  is_invited: boolean;
}

const MembersInviteDialog = ({ open, onClose }: MembersInviteDialogProps) => {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const [email, setEmail] = useState("");

  // 검색 API 호출 여부
  const [isCalled, setIsCalled] = useState(true);
  const [list, setList] = useState<MemberResponse[]>([]);

  // 검색 Debouncing 처리
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 이전 타이머가 있으면 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 이메일이 비어있으면 결과 초기화
    if (!email.trim()) {
      setList([]);
      setIsCalled(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const { data } = await axiosClient.get(
          `/club/search-users?email=${email}&clubId=${clubId}`
        );
        setList(data);
        setIsCalled(true);
      } catch (error) {
        console.error(error);
        setList([]);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [email, clubId]);

  const handleInvite = async (user: Member) => {
    try {
      await axiosClient.post(`/club/invite`, {
        clubId: clubId,
        profileId: user.id,
      });

      alert("초대가 전송되었습니다.");
      setList(
        list.map((member) =>
          member.user.id !== user.id ? member : { ...member, is_invited: true }
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
          },
        },
      }}
    >
      <section className="pt-[55px] pb-[50px] px-[38px] w-[530px]">
        <div className="flex flex-col gap-[20px]">
          <h1 className="typo-head-sm-b text-gray-09 text-center">새로운 회원 초대</h1>
          <p className="typo-text-lg-m text-[#53575B] text-center">
            보낸 초대를 상대가 승인하면 동아리에 자동으로 가입됩니다.
          </p>
        </div>

        <MembersInput
          className="mt-[40px]"
          placeholder="이메일을 검색해보세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {isCalled && list.length > 0 && (
          <section className="flex flex-col gap-[17px] mt-[25px] py-[17px] px-[25px] border border-gray-01 rounded-[20px]">
            {list.map((member, index) => (
              <>
                <div key={member.user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <p className="typo-title-md-b text-gray-09">{member.user.name}</p>
                    <p className="typo-text-lg-r text-gray-09">{member.user.email}</p>
                  </div>

                  <button
                    className={twJoin(
                      "w-[89px] h-[40px] rounded-[10px] typo-text-md-b text-white",
                      member.is_invited
                        ? "bg-primary-03 cursor-default"
                        : "bg-primary-04 cursor-pointer"
                    )}
                    onClick={() => handleInvite(member.user)}
                  >
                    {member.is_invited ? "초대 완료" : "초대하기"}
                  </button>
                </div>
                {index !== list.length - 1 && <div className="h-[1px] bg-gray-00"></div>}
              </>
            ))}
          </section>
        )}

        {isCalled && list.length === 0 && (
          <div className="flex flex-col gap-[10px] mt-[47px]">
            <p className="typo-text-lg-b text-gray-06 text-center">검색 결과가 없습니다</p>
            <p className="typo-text-md-m text-gray-05 text-center">
              입력하신 이메일이 맞는지 다시 한 번 확인해주세요.
            </p>
          </div>
        )}

        <div className="flex justify-center mt-[50px]">
          <button
            className="w-[148px] h-[56px] bg-gray-00 rounded-[12px] typo-title-md-b text-gray-04 cursor-pointer"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </section>
    </Dialog>
  );
};

export default MembersInviteDialog;
