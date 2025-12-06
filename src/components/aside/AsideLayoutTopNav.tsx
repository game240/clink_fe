import ic_arrow_right_blue from "../../assets/ic_arrow_right_blue.svg";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface AsideLayoutTopNavProps {
  clubName: string;
}

const AsideLayoutTopNav = ({ clubName }: AsideLayoutTopNavProps) => {
  // 현재 주소가 /club/archive라면
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const wikiType = searchParams.get("wikiType") || "";

  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-[10px] my-[30px] typo-text-md-b text-primary-04">
      {!location.pathname.includes("/edit") ? (
        <>
          <a href="/">홈</a>
          <img src={ic_arrow_right_blue} alt="" />
          <a href="/my-clubs">나의 동아리</a>
          {(location.pathname.startsWith("/club") || location.pathname.includes("/page")) && (
            <>
              <img src={ic_arrow_right_blue} alt="" />
              <a href={`/club/archive?clubId=${clubId ?? ""}`}>{clubName}</a>
            </>
          )}
          {(location.pathname.includes("/archive") || location.pathname.includes("/page")) && (
            <>
              <img src={ic_arrow_right_blue} alt="" />
              <a href={`/club/archive?clubId=${clubId ?? ""}`}>동아리 아카이브</a>
            </>
          )}
          {location.pathname.includes("/page") && (
            <>
              <img src={ic_arrow_right_blue} alt="" />
              <a href={`/club/archive?clubId=${clubId ?? ""}&wikiType=${wikiType}`}>
                {wikiType === "knowhow" ? "노하우" : "업무별"} 위키
              </a>
            </>
          )}
          {location.pathname.includes("/members") && (
            <>
              <img src={ic_arrow_right_blue} alt="" />
              <a href={`/club/members?clubId=${clubId ?? ""}`}>동아리 구성원 관리</a>
            </>
          )}
          {location.pathname.includes("/members") && (
            <>
              <img src={ic_arrow_right_blue} alt="" />
              <a href={`/club/members?clubId=${clubId ?? ""}`}>구성원 명단</a>
            </>
          )}
        </>
      ) : (
        <button
          className="flex items-center gap-[10px] cursor-pointer"
          onClick={() => navigate("-1")}
        >
          <img src={ic_arrow_right_blue} alt="" className="rotate-180" />
          이전으로
        </button>
      )}
    </div>
  );
};

export default AsideLayoutTopNav;
