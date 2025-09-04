import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import parentLink from "../assets/viewer/ic_parent_link.svg";

function ParentLink() {
  const { pathname } = useLocation(); // "/page/수도권/동북권/광운대학교"
  const raw = pathname.replace(/^\/page\//, ""); // "수도권/동북권/광운대학교"
  const fullTitle = decodeURI(raw); // "수도권/동북권/광운대학교"

  const parts = useMemo(() => fullTitle.split("/"), [fullTitle]);
  const navigate = useNavigate();

  // 루트(segments<2)면 부모 링크 없음
  if (parts.length < 2) return null;

  // 즉시 부모 전체 경로: ["수도권","동북권"]
  const parentParts = parts.slice(0, -1);
  const parentTitle = parentParts.join("/"); // "수도권/동북권"
  const parentSlug = encodeURI(parentTitle); // 퍼센트 인코딩 (slash 보존)

  return (
    <div className="flex items-center font-15-400">
      <img className="size-[21px]" src={parentLink} alt="" />
      &nbsp;상위 문서:&nbsp;
      <button
        className="text-[var(--blue)] hover:text-[#0263b8] cursor-pointer"
        onClick={() => navigate(`/page/${parentSlug}`)}
      >
        {parentTitle}
      </button>
    </div>
  );
}

export default ParentLink;
