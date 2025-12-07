import { useEffect, useState } from "react";
import AsideBarBtn from "./AsideBarBtn";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AsideBarMembersBtn from "./AsideBarMembersBtn";

interface AsideBarProps {
  thumbnail: string;
  clubName: string;
}
const AsideBar = ({ thumbnail, clubName }: AsideBarProps) => {
  const [selectedBtn, setSelectedBtn] = useState<number>(0);
  const [selectedMembersBtn, setSelectedMembersBtn] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  useEffect(() => {
    if (location.pathname.includes("/archive")) {
      setSelectedBtn(0);
    } else if (
      location.pathname.includes("/members") ||
      location.pathname.includes("/position-manage")
    ) {
      setSelectedBtn(1);
    } else if (location.pathname.includes("/status")) {
      setSelectedBtn(2);
    }
  }, [location]);

  useEffect(() => {
    // selectedBtn 변경될 때마다 매번 초기화
    if (location.pathname.includes("/position-manage")) {
      setSelectedMembersBtn(1);
    } else {
      setSelectedMembersBtn(0);
    }
  }, [selectedBtn, location]);

  return (
    <aside className="flex flex-col gap-[40px] pt-[40px] w-[340px] min-h-[calc(100vh-84px)]">
      <section className="flex flex-col items-center gap-[13px]">
        <div
          className="size-[150px] rounded-full bg-gray-200 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
        <p className="typo-primary-04 text-head-sm-b">{clubName}</p>
      </section>

      <section>
        <AsideBarBtn
          isSelected={selectedBtn === 0}
          onClick={() => {
            setSelectedBtn(0);
            navigate(`/club/archive?clubId=${clubId ?? ""}`);
          }}
        >
          동아리 아카이브
        </AsideBarBtn>
        <AsideBarBtn
          isSelected={selectedBtn === 1}
          onClick={() => {
            setSelectedBtn(1);
            navigate(`/club/members?clubId=${clubId ?? ""}`);
          }}
        >
          동아리 구성원 관리
        </AsideBarBtn>
        {selectedBtn === 1 && (
          <>
            <AsideBarMembersBtn
              isSelected={selectedMembersBtn === 0}
              onClick={() => {
                setSelectedMembersBtn(0);
                navigate(`/club/members?clubId=${clubId ?? ""}`);
              }}
            >
              구성원 명단
            </AsideBarMembersBtn>
            <AsideBarMembersBtn
              isSelected={selectedMembersBtn === 1}
              onClick={() => {
                setSelectedMembersBtn(1);
                navigate(`/club/position-manage?clubId=${clubId ?? ""}`);
              }}
            >
              운영진 직급 관리
            </AsideBarMembersBtn>
          </>
        )}
        <AsideBarBtn
          isSelected={selectedBtn === 2}
          onClick={() => {
            setSelectedBtn(2);
            navigate(`/club/status?clubId=${clubId ?? ""}`);
          }}
        >
          동아리 현황
        </AsideBarBtn>
      </section>
    </aside>
  );
};

export default AsideBar;
