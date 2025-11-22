import { useEffect, useState } from "react";
import AsideBarBtn from "./AsideBarBtn";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const AsideBar = () => {
  const [selectedBtn, setSelectedBtn] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  useEffect(() => {
    if (location.pathname.endsWith("/archive")) {
      setSelectedBtn(0);
    } else if (location.pathname.endsWith("/members")) {
      setSelectedBtn(1);
    } else if (location.pathname.endsWith("/status")) {
      setSelectedBtn(2);
    }
  }, [location]);

  return (
    <aside className="flex flex-col gap-[40px] pt-[40px] w-[340px] min-h-[calc(100vh-84px)]">
      <section className="flex flex-col items-center gap-[13px]">
        <div className="size-[150px] rounded-full bg-gray-200 bg-contain bg-center bg-no-repeat" />
        <p className="typo-primary-04 text-head-sm-b">산악부</p>
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
            navigate(`/club/${clubId}/members`);
          }}
        >
          동아리 구성원 관리
        </AsideBarBtn>
        <AsideBarBtn
          isSelected={selectedBtn === 2}
          onClick={() => {
            setSelectedBtn(2);
            navigate(`/club/${clubId}/status`);
          }}
        >
          동아리 현황
        </AsideBarBtn>
      </section>
    </aside>
  );
};

export default AsideBar;
