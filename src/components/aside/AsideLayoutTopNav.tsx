import ic_arrow_right_blue from "../../assets/ic_arrow_right_blue.svg";
import { useLocation, useSearchParams } from "react-router-dom";

const AsideLayoutTopNav = () => {
  // 현재 주소가 /club/archive라면
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const wikiType = searchParams.get("wikiType") || "";

  return (
    <div className="flex items-center gap-[10px] my-[30px] typo-text-md-b text-primary-04">
      <a href="/">홈</a>
      <img src={ic_arrow_right_blue} alt="" />
      <a href="/my-clubs">나의 동아리</a>
      {(location.pathname.startsWith("/club") ||
        location.pathname.includes("/page")) && (
        <>
          <img src={ic_arrow_right_blue} alt="" />
          <a href={`/club/archive?clubId=${clubId ?? ""}`}>산악부</a>
        </>
      )}
      {(location.pathname.includes("/archive") ||
        location.pathname.includes("/page")) && (
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
    </div>
  );
};

export default AsideLayoutTopNav;
