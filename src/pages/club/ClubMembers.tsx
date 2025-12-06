import { useEffect, useState } from "react";
import MembersTable from "../../components/club/members/MembersTable";
import MembersInput from "../../components/club/members/MembersInput";
import MembersInviteDialog from "../../components/club/members/MembersInviteDialog";
import Dialog from "@mui/material/Dialog";
import axiosClient from "../../apis/axiosClient";
import { useSearchParams } from "react-router-dom";

export interface Member {
  id: string;
  name: string;
  position: string;
  graduationStatus: string;
  phone: string;
  email: string;
  isMe: boolean;
  isPresident: boolean;
}

const ClubMembers = () => {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  const [officers, setOfficers] = useState<Member[]>([
    {
      id: "1",
      name: "홍승리",
      position: "회장",
      graduationStatus: "재학",
      phone: "010-1234-5678",
      email: "jdfkl12348@naver.com",
      isMe: true,
      isPresident: true,
    },
    {
      id: "2",
      name: "최준혁",
      position: "홍보부",
      graduationStatus: "재학",
      phone: "010-1234-5678",
      email: "jdfkl12348@naver.com",
      isMe: false,
      isPresident: false,
    },
    {
      id: "3",
      name: "홍승민",
      position: "홍보부",
      graduationStatus: "재학",
      phone: "010-1234-5678",
      email: "hongseung@naver.com",
      isMe: false,
      isPresident: false,
    },
    {
      id: "4",
      name: "김민지",
      position: "시설관리부",
      graduationStatus: "재학",
      phone: "010-1234-5678",
      email: "hongseungli@naver.com",
      isMe: false,
      isPresident: false,
    },
    {
      id: "5",
      name: "박은지",
      position: "회계부",
      graduationStatus: "재학",
      phone: "010-1234-5678",
      email: "hongdsfafkjkls4@naver.com",
      isMe: false,
      isPresident: false,
    },
  ]);

  const [generalMembers, setGeneralMembers] = useState<Member[]>([
    {
      id: "1",
      name: "홍승리",
      position: "일반",
      graduationStatus: "재학",
      phone: "010-1234-5678",
      email: "jdfkl12348@naver.com",
      isMe: false,
      isPresident: false,
    },
  ]);

  const [graduatedMembers, setGraduatedMembers] = useState<Member[]>([
    {
      id: "1",
      name: "홍승리",
      position: "일반",
      graduationStatus: "졸업",
      phone: "010-1234-5678",
      email: "jdfkl12348@naver.com",
      isMe: false,
      isPresident: false,
    },
  ]);

  useEffect(() => {
    const fetchClubMembers = async () => {
      try {
        const { data } = await axiosClient.get(`/club/members?clubId=${clubId}`);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClubMembers();
  }, [clubId]);

  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);

  const [openOfficersDialog, setOpenOfficersDialog] = useState(false);
  const [pendingPositionChange, setPendingPositionChange] = useState<{
    id: string;
    newPosition: string;
  } | null>(null);

  const onChangePositionsOptions = (members: Member[], id: string, newPosition: string) => {
    return members.map((member) =>
      member.id === id ? { ...member, position: newPosition } : member
    );
  };

  // 운영진 직급 변경 시 onChangePositionsOptions 대신 사용
  const handleOfficersPositionChange = (members: Member[], id: string, newPosition: string) => {
    // '일반' 직급으로 강등할 때만 Dialog 표시
    if (newPosition === "일반") {
      setPendingPositionChange({ id, newPosition });
      setOpenOfficersDialog(true);
      // Dialog 확인 전까지는 변경하지 않으므로 원래 members 반환
      return members;
    }
    // 그 외의 경우는 바로 변경
    return onChangePositionsOptions(members, id, newPosition);
  };

  // Dialog 확인 버튼 클릭 시 실행
  const confirmOfficersPositionChange = () => {
    if (pendingPositionChange) {
      const updatedOfficers = onChangePositionsOptions(
        officers,
        pendingPositionChange.id,
        pendingPositionChange.newPosition
      );
      setOfficers(updatedOfficers);
      setPendingPositionChange(null);
      setOpenOfficersDialog(false);
    }
  };

  // Dialog 취소 버튼 클릭 시 실행
  const cancelOfficersPositionChange = () => {
    setPendingPositionChange(null);
    setOpenOfficersDialog(false);
  };

  const onChangeGraduationOptions = (
    members: Member[],
    id: string,
    newGraduationStatus: string
  ) => {
    return members.map((member) =>
      member.id === id ? { ...member, graduationStatus: newGraduationStatus } : member
    );
  };

  return (
    <main className="flex flex-col w-full h-full pb-[70px]">
      <div className="flex justify-between items-center mt-[-10px] mb-[30px]">
        <div className="flex items-center gap-[15px]">
          <h1 className="typo-head-md-b">총 회원 수</h1>
          <p className="typo-title-lg-b text-primary-04">30명</p>
        </div>
        <button
          className="w-[218px] h-[60px] rounded-[12px] bg-primary-04 typo-title-md-b text-white cursor-pointer"
          onClick={() => setOpenAddMemberDialog(true)}
        >
          새로운 회원 추가
        </button>
      </div>

      <MembersInviteDialog
        open={openAddMemberDialog}
        onClose={() => setOpenAddMemberDialog(false)}
      />

      <MembersInput placeholder="동아리 내 회원 검색 (이름, 전화번호, 이메일 검색)" />

      <div className="w-full h-[1px] bg-gray-02 my-[40px]" />

      <section className="flex flex-col gap-[70px]">
        <MembersTable
          title="운영진 목록"
          members={officers}
          setMembers={setOfficers}
          onChangePositionsOptions={handleOfficersPositionChange}
          onChangeGraduationOptions={onChangeGraduationOptions}
        />
        <Dialog
          open={openOfficersDialog}
          onClose={cancelOfficersPositionChange}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "20px",
              },
            },
          }}
        >
          <section className="flex flex-col justify-center items-center gap-[45px] pt-[55px] pb-[50px] w-[530px] h-[278px]">
            <div className="flex flex-col gap-[20px]">
              <p className="typo-head-sm-b text-gray-09 text-center">
                일반 회원으로 직급을 변경하시겠습니까?
              </p>
              <p className="typo-text-lg-m text-[#53575B] text-center">
                변경 즉시 운영진 목록에서 제외되고 일반 회원으로 전환됩니다.
              </p>
            </div>

            <div className="flex justify-center gap-[10px]">
              <button
                className="w-[148px] h-[56px] bg-gray-00 rounded-[12px] typo-title-md-b text-gray-04 cursor-pointer"
                onClick={cancelOfficersPositionChange}
              >
                취소
              </button>
              <button
                className="w-[148px] h-[56px] bg-primary-04 rounded-[12px] typo-title-md-b text-white cursor-pointer"
                onClick={confirmOfficersPositionChange}
              >
                변경
              </button>
            </div>
          </section>
        </Dialog>

        <MembersTable
          title="일반 회원 목록"
          members={generalMembers}
          setMembers={setGeneralMembers}
          onChangePositionsOptions={onChangePositionsOptions}
          onChangeGraduationOptions={onChangeGraduationOptions}
        />
        <MembersTable
          title="졸업 회원 목록"
          members={graduatedMembers}
          setMembers={setGraduatedMembers}
          onChangePositionsOptions={onChangePositionsOptions}
          onChangeGraduationOptions={onChangeGraduationOptions}
        />
      </section>
    </main>
  );
};

export default ClubMembers;
