import { useEffect, useState, useCallback, type Dispatch, type SetStateAction } from "react";
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
  const clubId = searchParams.get("clubId") || "";

  const [officers, setOfficers] = useState<Member[]>([]);
  const [generalMembers, setGeneralMembers] = useState<Member[]>([]);
  const [graduatedMembers, setGraduatedMembers] = useState<Member[]>([]);

  const [officerPositionsOptions, setOfficerPositionsOptions] = useState<string[]>([]);

  const fetchClubMembers = useCallback(async () => {
    try {
      const { data } = await axiosClient.get(`/club/members?clubId=${clubId}`);
      setOfficers(data.officers);
      setGeneralMembers(data.generalMembers);
      setGraduatedMembers(data.graduatedMembers);
    } catch (error) {
      console.error(error);
    }
  }, [clubId]);

  useEffect(() => {
    const fetchOfficerPositionsOptions = async () => {
      try {
        const { data } = await axiosClient.get(`/club/officers?clubId=${clubId}`);
        setOfficerPositionsOptions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClubMembers();
    fetchOfficerPositionsOptions();
  }, [clubId, fetchClubMembers]);

  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);

  const [openOfficersDialog, setOpenOfficersDialog] = useState(false);
  const [pendingPositionChange, setPendingPositionChange] = useState<{
    id: string;
    newPosition: string;
  } | null>(null);

  const updateClubMemberPositionsGraduation = async (
    clubId: string,
    profileId: string,
    position: string,
    graduationStatus: string
  ) => {
    try {
      await axiosClient.patch(`/club/positions-graduation`, {
        clubId,
        profileId,
        position,
        graduationStatus,
      });

      await fetchClubMembers();
    } catch (error) {
      console.error(error);
    }
  };

  // 운영진/일반 멤버 변경 시 및 (운영진, 일반)/졸업 멤버 변경 시 테이블 멤버 변경
  const onChangeInstantlyTableMembers = (
    fromMembers: Member[],
    toMembers: Member[],
    fromSetState: Dispatch<SetStateAction<Member[]>>,
    toSetState: Dispatch<SetStateAction<Member[]>>,
    id: string,
    newPosition: string,
    newGraduationStatus: string
  ) => {
    const movedMember = fromMembers.find((member) => member.id === id);
    if (!movedMember) return;

    const updatedFromMembers = fromMembers.filter((member) => member.id !== id);
    const updatedToMembers = toMembers.concat({
      ...movedMember,
      position: newPosition,
      graduationStatus: newGraduationStatus,
      // isMe와 isPresident는 원래 멤버 정보에서 유지
      isMe: movedMember.isMe,
      isPresident: movedMember.isPresident,
    });
    fromSetState(updatedFromMembers);
    toSetState(updatedToMembers);
  };

  const onChangePositionsOptions = (members: Member[], id: string, newPosition: string) => {
    const currentMember = members.find((member) => member.id === id);
    if (!currentMember) return members;

    const currentGraduationStatus = currentMember.graduationStatus;
    const isCurrentlyOfficer = officers.some((m) => m.id === id);
    const isCurrentlyGeneral = generalMembers.some((m) => m.id === id);

    // API 호출
    updateClubMemberPositionsGraduation(clubId, id, newPosition, currentGraduationStatus);

    // "일반"으로 변경하는 경우
    if (newPosition === "일반") {
      if (isCurrentlyOfficer) {
        // 운영진 → 일반 (테이블 간 이동)
        onChangeInstantlyTableMembers(
          officers,
          generalMembers,
          setOfficers,
          setGeneralMembers,
          id,
          newPosition,
          currentGraduationStatus
        );
        // 테이블 간 이동 시에는 현재 테이블에서 제거된 상태를 반환
        return members.filter((member) => member.id !== id);
      }
      // 이미 일반이면 같은 테이블 내에서만 업데이트
      else if (isCurrentlyGeneral) {
        const updatedMembers = members.map((member) =>
          member.id === id ? { ...member, position: newPosition } : member
        );
        return updatedMembers;
      }
    }
    // 운영진 역할로 변경하는 경우
    else {
      if (isCurrentlyGeneral) {
        // 일반 → 운영진 (테이블 간 이동)
        onChangeInstantlyTableMembers(
          generalMembers,
          officers,
          setGeneralMembers,
          setOfficers,
          id,
          newPosition,
          currentGraduationStatus
        );
        // 테이블 간 이동 시에는 현재 테이블에서 제거된 상태를 반환
        return members.filter((member) => member.id !== id);
      }
      // 이미 운영진이면 같은 테이블 내에서만 업데이트
      else if (isCurrentlyOfficer) {
        const updatedMembers = members.map((member) =>
          member.id === id ? { ...member, position: newPosition } : member
        );
        return updatedMembers;
      }
    }

    return members;
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
      onChangePositionsOptions(
        officers,
        pendingPositionChange.id,
        pendingPositionChange.newPosition
      );
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
    const currentMember = members.find((member) => member.id === id);
    if (!currentMember) return members;

    const currentPosition = currentMember.position;
    const isCurrentlyOfficer = officers.some((m) => m.id === id);
    const isCurrentlyGeneral = generalMembers.some((m) => m.id === id);
    const isCurrentlyGraduated = graduatedMembers.some((m) => m.id === id);

    // API 호출
    updateClubMemberPositionsGraduation(clubId, id, currentPosition, newGraduationStatus);

    // 졸업으로 변경하는 경우
    if (newGraduationStatus === "졸업") {
      if (isCurrentlyOfficer) {
        // 운영진 → 졸업
        onChangeInstantlyTableMembers(
          officers,
          graduatedMembers,
          setOfficers,
          setGraduatedMembers,
          id,
          currentPosition,
          newGraduationStatus
        );
        // 현재 테이블에서 해당 멤버 제거
        return members.filter((member) => member.id !== id);
      } else if (isCurrentlyGeneral) {
        // 일반 → 졸업
        onChangeInstantlyTableMembers(
          generalMembers,
          graduatedMembers,
          setGeneralMembers,
          setGraduatedMembers,
          id,
          currentPosition,
          newGraduationStatus
        );
        // 현재 테이블에서 해당 멤버 제거
        return members.filter((member) => member.id !== id);
      }
    }
    // 재학으로 변경하는 경우
    else if (newGraduationStatus === "재학") {
      if (isCurrentlyGraduated) {
        // 졸업 → 재학 (직급에 따라 운영진 또는 일반으로)
        if (currentPosition === "일반" || !officerPositionsOptions.includes(currentPosition)) {
          // 일반 회원으로
          onChangeInstantlyTableMembers(
            graduatedMembers,
            generalMembers,
            setGraduatedMembers,
            setGeneralMembers,
            id,
            currentPosition,
            newGraduationStatus
          );
        } else {
          // 운영진으로
          onChangeInstantlyTableMembers(
            graduatedMembers,
            officers,
            setGraduatedMembers,
            setOfficers,
            id,
            currentPosition,
            newGraduationStatus
          );
        }
        // 현재 테이블(졸업)에서 해당 멤버 제거
        return members.filter((member) => member.id !== id);
      }
      // 이미 재학이면 같은 테이블 내에서만 업데이트
      else if (isCurrentlyOfficer || isCurrentlyGeneral) {
        const updatedMembers = members.map((member) =>
          member.id === id ? { ...member, graduationStatus: newGraduationStatus } : member
        );
        return updatedMembers;
      }
    }

    return members;
  };

  return (
    <main className="flex flex-col w-full h-full pb-[70px]">
      <div className="flex justify-between items-center mt-[-10px] mb-[30px]">
        <div className="flex items-center gap-[15px]">
          <h1 className="typo-head-md-b">총 회원 수</h1>
          <p className="typo-title-lg-b text-primary-04">
            {officers.length + generalMembers.length + graduatedMembers.length}명
          </p>
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
          officerPositionsOptions={officerPositionsOptions}
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
          officerPositionsOptions={officerPositionsOptions}
          onChangePositionsOptions={onChangePositionsOptions}
          onChangeGraduationOptions={onChangeGraduationOptions}
        />
        <MembersTable
          title="졸업 회원 목록"
          members={graduatedMembers}
          setMembers={setGraduatedMembers}
          officerPositionsOptions={officerPositionsOptions}
          onChangePositionsOptions={onChangePositionsOptions}
          onChangeGraduationOptions={onChangeGraduationOptions}
        />
      </section>
    </main>
  );
};

export default ClubMembers;
