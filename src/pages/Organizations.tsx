import React from "react";
import type { SectionItem } from "../constants/organizations";
import { organizations } from "../constants/organizations";
import clsx from "clsx";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Organizations = () => (
  <main>
    <h1 className="font-36-700">연극 단체</h1>
    <p className="mt-[8px] mb-[24px] font-14-400 text-[#212529BF]">
      현재 시각:&nbsp;
      {format(new Date(), "yyyy-MM-dd HH:mm:ss")}
    </p>
    <section className="flex flex-col gap-[17px] mb-[14.4px]">
      <div className="flex items-center pl-[8px] w-full h-[23px] rounded-[6px] border-1 border-[#CCC] font-14-400">
        분류:&nbsp;
        <span className="text-[var(--blue)] font-14-400">포도위키</span>
      </div>
    </section>
    <hr className="border-[#CCC]" />

    <SectionList items={organizations} />
  </main>
);

export default Organizations;

interface SectionListProps {
  items: SectionItem[];
  prefix?: string; // 재귀 호출 때만 넘겨줌
}

const SectionList: React.FC<SectionListProps> = ({ items, prefix = "" }) => {
  const navigate = useNavigate();

  const isRoot = prefix === "";

  // 1) depth 계산: 최상위는 1, 자식은 2, 손자는 3…
  const depth = prefix === "" ? 1 : prefix.split(".").length + 1;

  // 2) depth별 글자 크기 매핑
  const sizeMap: Record<number, { summary: string }> = {
    1: { summary: "font-27-700" },
    2: { summary: "font-24-700" },
    3: { summary: "font-21-700" },
    4: { summary: "font-18-700" },
    5: { summary: "font-15-700" },
  };
  const { summary: summarySize } = sizeMap[depth] || sizeMap[3];

  // TOC 렌더러 (재귀적으로 nested UL)
  const renderToc = (list: SectionItem[], pref: string) => (
    <ul className={pref === "" ? "mx-[20px]" : "ml-[20px]"}>
      {list.map((item, idx) => {
        const num = pref ? `${pref}.${idx + 1}` : `${idx + 1}`;
        return (
          <li key={num}>
            <div className="flex items-center font-15-400 py-[2px]">
              <a
                href={`#section-${num}`}
                className="text-[var(--blue)] hover:underline hover:text-[#0263b8]"
              >
                {num}
              </a>
              .&nbsp;
              {item.title}
            </div>
            {item.children && renderToc(item.children, num)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <section>
      {isRoot && (
        <div className="mt-[17px] mb-[32px] px-[14px] pt-[12px] pb-[18px] w-fit rounded-[6px] border-1 border-[#CCC]">
          <p className="mb-[12px] font-18-400">목차</p>
          {renderToc(items, "")}
        </div>
      )}

      {items.map((item, idx) => {
        const num = prefix ? `${prefix}.${idx + 1}` : `${idx + 1}`;
        return (
          <details
            key={num}
            id={`section-${num}`}
            className="wiki-viewer__section mt-[32.4px]"
            open
          >
            <summary className={clsx(summarySize, "flex cursor-pointer")}>
              <span className="text-[var(--blue)]">{num}.</span>&nbsp;
              {item.title}
            </summary>
            <hr className="border-[#CCC] mt-[5px] mb-[21px]" />
            <div className="wiki-viewer__section-body">
              <p
                className="font-15-400 text-[var(--blue)] cursor-pointer hover:underline hover:text-[#0263b8]"
                onClick={() =>
                  navigate(`/page/${encodeURI(item.content || "")}`)
                }
              >
                {item.content}
              </p>
              {item.children && (
                // 하위 섹션은 prefix=num 으로 재귀 호출
                <SectionList items={item.children} prefix={num} />
              )}
            </div>
          </details>
        );
      })}
    </section>
  );
};
