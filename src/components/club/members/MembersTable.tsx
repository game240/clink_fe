import type { Member } from "../../../pages/club/ClubMembers";
import ic_trash from "../../../assets/club/members/ic_trash.svg";
import MembersSelect from "./MembersSelect";
import type { Dispatch, SetStateAction } from "react";

interface MembersTableProps {
  title: string;
  members: Member[];
  setMembers: Dispatch<SetStateAction<Member[]>>;
  onChangePositionsOptions: (members: Member[], id: string, newPosition: string) => Member[];
  onChangeGraduationOptions: (
    members: Member[],
    id: string,
    newGraduationStatus: string
  ) => Member[];
}

const MembersTable = ({
  title,
  members,
  setMembers,
  onChangePositionsOptions,
  onChangeGraduationOptions,
}: MembersTableProps) => {
  const positionOptions = ["홍보부", "시설관리부", "회계부", "일반"];
  const graduationOptions = ["재학", "졸업"];

  const handleDelete = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <section className="flex flex-col gap-[40px]">
      <div className="flex items-center gap-[15px]">
        <h1 className="typo-head-md-b">{title}</h1>
        <p className="typo-title-lg-b text-primary-04">{members.length}명</p>
      </div>

      <section className="pt-[20px] px-[20px] w-full rounded-[20px] border border-gray-01 bg-white">
        <div className="grid grid-cols-[138px_138px_138px_180px_250px_100px] gap-x-[20px] items-center justify-items-center px-[20px] h-[58px] rounded-[12px] bg-card-2">
          <p className="typo-text-lg-b text-gray-07">이름</p>
          <p className="typo-text-lg-b text-gray-07">직급</p>
          <p className="typo-text-lg-b text-gray-07">졸업 여부</p>
          <p className="typo-text-lg-b text-gray-07">전화번호</p>
          <p className="typo-text-lg-b text-gray-07">이메일</p>
          <p className="typo-text-lg-b text-gray-07">회원 삭제</p>
        </div>
        {members.map((member, index) => (
          <div key={member.id}>
            <div className="grid grid-cols-[138px_138px_138px_180px_250px_100px] gap-x-[20px] items-center justify-items-center px-[20px] py-[20px]">
              <div
                className={
                  member.isMe
                    ? "flex items-center gap-[8px] translate-x-[16px]"
                    : "flex items-center gap-[8px]"
                }
              >
                <p className="typo-text-lg-r text-gray-09">{member.name}</p>
                {member.isMe && (
                  <div className="flex items-center justify-center w-[24px] h-[24px] rounded-full bg-primary-01 border border-primary-05">
                    <span className="text-[12px] font-bold text-primary-05">나</span>
                  </div>
                )}
              </div>
              <>
                {member.isPresident ? (
                  <p className="typo-text-lg-r text-gray-09">{member.position}</p>
                ) : (
                  <MembersSelect
                    value={member.position}
                    onChange={(newPosition) => {
                      const updated = onChangePositionsOptions(members, member.id, newPosition);
                      setMembers(updated);
                    }}
                    options={positionOptions}
                  />
                )}
              </>
              <div className="relative w-full">
                <MembersSelect
                  value={member.graduationStatus}
                  onChange={(newStatus) => {
                    const updated = onChangeGraduationOptions(members, member.id, newStatus);
                    setMembers(updated);
                  }}
                  options={graduationOptions}
                />
              </div>
              <p className="typo-text-lg-r text-gray-09">{member.phone}</p>
              <p className="typo-text-lg-r text-gray-09">{member.email}</p>
              <div className="w-full flex justify-center">
                {!member.isPresident && (
                  <button className="cursor-pointer" onClick={() => handleDelete(member.id)}>
                    <img src={ic_trash} alt="삭제" />
                  </button>
                )}
              </div>
            </div>
            {index < members.length - 1 && <div className="h-[1px] bg-gray-00 mx-[20px]"></div>}
          </div>
        ))}
      </section>
    </section>
  );
};

export default MembersTable;
