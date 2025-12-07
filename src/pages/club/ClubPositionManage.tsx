import MembersSelect from "../../components/club/members/MembersSelect";
import ic_trash from "../../assets/club/members/ic_trash.svg";
import { useEffect, useState } from "react";
import axiosClient from "../../apis/axiosClient";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface Position {
  id: string;
  ord: number;
  name: string;
  canModify: boolean;
}

const ClubPositionManage = () => {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId") || "";

  const [positionList, setPositionList] = useState<Position[]>([]);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!clubId) return;

      try {
        const { data } = await axiosClient.get(`/club/positions?clubId=${clubId}`);
        setPositionList(data);
      } catch (error) {
        console.error("직급 목록 로드 실패:", error);
      }
    };

    fetchPositions();
  }, [clubId]);

  const handleAddPosition = async () => {
    if (!clubId) return;

    const newPosition: Position = {
      id: uuidv4(),
      ord: positionList.length + 1,
      name: "",
      canModify: true,
    };

    setPositionList((prev) => [...prev, newPosition]);

    try {
      await axiosClient.post(`/club/positions`, {
        clubId,
        id: newPosition.id,
        name: newPosition.name,
        ord: newPosition.ord,
        canModify: newPosition.canModify,
      });
    } catch (error) {
      console.error("직급 추가 실패:", error);
      alert("직급 추가에 실패했습니다.");
    }
  };

  const handleUpdatePosition = async (
    id: string,
    updates: { name?: string; canModify?: boolean }
  ) => {
    if (!clubId) return;

    setPositionList(positionList.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      const { data } = await axiosClient.patch(`/club/positions/${id}`, updates);

      setPositionList(positionList.map((p) => (p.id === id ? { ...p, ...data } : p)));
    } catch (error) {
      console.error("직급 변경 실패:", error);
      alert("직급 변경에 실패했습니다.");
    }
  };

  const handleDeletePosition = async (id: string) => {
    if (!clubId) return;

    if (!confirm("정말 이 직급을 삭제하시겠습니까?")) {
      return;
    }

    // 삭제 및 ord 재정렬을 한 번에 처리
    setPositionList((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      return filtered.map((p, index) => ({ ...p, ord: index + 1 }));
    });

    try {
      await axiosClient.delete(`/club/positions/${id}`);
      const { data } = await axiosClient.get(`/club/positions?clubId=${clubId}`);
      setPositionList(data);
    } catch (error) {
      console.error("직급 삭제 실패:", error);
      alert("직급 삭제에 실패했습니다.");
      // 실패 시 다시 로드
      const { data } = await axiosClient.get(`/club/positions?clubId=${clubId}`);
      setPositionList(data);
    }
  };

  return (
    <main className="flex flex-col w-full h-full pb-[70px]">
      <div className="flex justify-between items-center mt-[-10px] mb-[30px]">
        <div className="flex flex-col gap-[16px]">
          <h1 className="typo-head-md-b">운영진 직급 관리</h1>
          <p className="typo-title-md-m text-gray-05">
            우리 동아리에 맞는 운영 구조를 만들어보세요.
          </p>
        </div>
        <button
          className="w-[218px] h-[60px] rounded-[12px] bg-primary-04 typo-title-md-b text-white cursor-pointer"
          onClick={handleAddPosition}
        >
          새로운 직급 추가
        </button>
      </div>

      <section className="pt-[20px] px-[20px] w-full rounded-[20px] border border-gray-01 bg-white">
        <div className="grid grid-cols-[180px_180px_180px_180px] gap-x-[20px] justify-between items-center justify-items-center px-[20px] h-[58px] rounded-[12px] bg-card-2">
          <p className="typo-text-lg-b text-gray-07">직급 순위</p>
          <p className="typo-text-lg-b text-gray-07">직급 명칭</p>
          <p className="typo-text-lg-b text-gray-07">타회원 직급 권한 수정</p>
          <p className="typo-text-lg-b text-gray-07">직급 삭제</p>
        </div>

        {positionList.map((position) => (
          <div key={position.id}>
            <div className="grid grid-cols-[180px_180px_180px_180px] gap-x-[20px] justify-between items-center justify-items-center px-[20px] py-[20px]">
              <div className={"flex items-center gap-[8px]"}>
                <p className="typo-text-lg-r text-gray-09">{position.ord}</p>
              </div>

              <>
                {position.ord === 1 ? (
                  <p className="typo-text-lg-r text-gray-09">회장</p>
                ) : (
                  <input
                    type="text"
                    className="typo-text-lg-r text-gray-09 text-center outline-none focus:border-b"
                    placeholder="입력해주세요"
                    value={position.name}
                    onChange={(e) => {
                      setPositionList(
                        positionList.map((p) =>
                          p.id === position.id ? { ...p, name: e.target.value } : p
                        )
                      );
                    }}
                    onBlur={(e) => {
                      handleUpdatePosition(position.id, { name: e.target.value });
                    }}
                  />
                )}
              </>
              <>
                {position.ord === 1 ? (
                  <p className="typo-text-lg-r text-gray-09">수정 가능</p>
                ) : (
                  <MembersSelect
                    value={position.canModify ? "수정 가능" : "수정 불가"}
                    onChange={(newCanModify) => {
                      const newCanModifyValue = newCanModify === "수정 가능";
                      setPositionList(
                        positionList.map((p) =>
                          p.id === position.id ? { ...p, canModify: newCanModifyValue } : p
                        )
                      );
                      handleUpdatePosition(position.id, { canModify: newCanModifyValue });
                    }}
                    options={["수정 가능", "수정 불가"]}
                  />
                )}
              </>
              {position.ord !== 1 && (
                <button
                  className="cursor-pointer"
                  onClick={() => handleDeletePosition(position.id)}
                >
                  <img src={ic_trash} alt="삭제" />
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default ClubPositionManage;
