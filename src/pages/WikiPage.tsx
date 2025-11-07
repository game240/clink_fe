import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import WikiViewer from "../components/WikiViewer";
import type { JSONContent } from "@tiptap/react";
import axiosClient from "../apis/axiosClient";
import { parseISO, format } from "date-fns";
import ParentLink from "../components/ParentLink";
import DiffViewer from "../components/DiffViewer";
import {
  flattenServerOpsToDiffOps,
  type ServerGitOp,
  type DiffOp,
} from "../utils/diff";

interface WikiDoc {
  meta: {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    author_id: string;
    current_rev: string;
    current_rev_number: number;
    categories: [
      {
        category_id: string;
        name: string;
      }
    ];
  };
  content: {
    type: "doc";
    content: JSONContent[];
  };
}

const WikiPage = () => {
  const { pathname } = useLocation(); // ex: "/page/수도권/동북권/광운대학교"
  const raw = pathname.replace(/^\/page\//, ""); // "수도권/동북권/광운대학교"
  const title = decodeURI(raw); // 디코딩

  // query param: ?revision_id=[uuid]&show_diff=true
  const [searchParams] = useSearchParams();
  const revision_id = searchParams.get("revision_id");
  const showDiff = searchParams.get("show_diff") === "true" || false;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(true);
  const [doc, setDoc] = useState<WikiDoc | null>(null);
  const [currentDoc, setCurrentDoc] = useState<WikiDoc | null>(null);

  // const [diffVariant, setDiffVariant] = useState<"inline" | "split">("inline");
  const [leftDoc, setLeftDoc] = useState<WikiDoc | null>(null);
  const [rightDoc, setRightDoc] = useState<WikiDoc | null>(null);
  const [leftRev, setLeftRev] = useState<number | "current">("current");
  const [rightRev, setRightRev] = useState<number | "current">("current");
  const [serverOps, setServerOps] = useState<DiffOp[] | null>(null);

  const fetchRecentPage = useCallback(async () => {
    const encoded = encodeURI(title || "");
    const { data } = await axiosClient.get(`/page?title=${encoded}`);
    return data as WikiDoc;
  }, [title]);

  const fetchRevision = useCallback(async () => {
    const { data } = await axiosClient.get(`/revision/${revision_id}`, {
      // params: { with_prev_diff: 1 }, // TOOD: 구현 후 주석 해제
    });
    return data as WikiDoc;
  }, [revision_id]);

  const fetchRevisionByNumber = useCallback(
    async (n: number) => {
      const { data } = await axiosClient.get(`/revision/revision_number`, {
        params: { title, rev_number: n },
      });
      return data as WikiDoc;
    },
    [title]
  );

  useEffect(() => {
    if (doc && currentDoc) {
      if (revision_id) {
        setLeftDoc(doc);
        setRightDoc(currentDoc);
        setLeftRev(doc.meta.current_rev_number);
        setRightRev("current");
      } else {
        setLeftDoc(currentDoc);
        setRightDoc(currentDoc);
        setLeftRev("current");
        setRightRev("current");
      }
    }
  }, [revision_id, doc, currentDoc]);

  const CONTEXT_NUMBER = 3;

  useEffect(() => {
    const fetchDiff = async () => {
      if (!showDiff) {
        setServerOps(null);
        return;
      }

      // 문서 상태가 준비되기 전에 호출 시 둘 다 current로 실행되는 버그 해결
      if (!leftDoc || !rightDoc) {
        return;
      }

      try {
        const { data } = await axiosClient.get("/diff", {
          params: {
            title,
            left_rev: leftRev === "current" ? "current" : leftRev,
            right_rev: rightRev === "current" ? "current" : rightRev,
            context: CONTEXT_NUMBER,
          },
        });
        const ops = flattenServerOpsToDiffOps(
          (data?.ops || []) as ServerGitOp[]
        );
        setServerOps(ops);
      } catch (e) {
        console.error(e);
        setServerOps(null);
      }
    };
    fetchDiff();
  }, [title, leftRev, rightRev, showDiff, leftDoc, rightDoc]);

  const selectRevision = useCallback(
    async (
      value: string,
      setRev: (v: number | "current") => void,
      setDoc: (d: WikiDoc | null) => void
    ) => {
      if (value === "current") {
        setRev("current");
        setDoc(currentDoc);
        return;
      }
      const n = parseInt(value, 10);
      if (!Number.isFinite(n) || n < 1) return;
      try {
        const d = await fetchRevisionByNumber(n);
        setRev(n);
        setDoc(d);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            alert("해당 번호의 리비전을 찾을 수 없습니다.");
          } else {
            console.error(error);
            alert("리비전 조회 중 오류가 발생했습니다.");
          }
        } else {
          console.error(error);
          alert("리비전 조회 중 오류가 발생했습니다.");
        }
      }
    },
    [currentDoc, fetchRevisionByNumber]
  );

  const handleSelectLeft = useCallback(
    (value: string) => {
      selectRevision(value, setLeftRev, setLeftDoc);
    },
    [selectRevision]
  );

  const handleSelectRight = useCallback(
    (value: string) => {
      selectRevision(value, setRightRev, setRightDoc);
    },
    [selectRevision]
  );

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      try {
        if (revision_id) {
          // 특정 revision과 현재 버전 동시 조회 후 상태 저장
          const [rev, current] = await Promise.all([
            fetchRevision(),
            fetchRecentPage(),
          ]);
          setDoc(rev);
          setCurrentDoc(current);
        } else {
          // 최근 페이지 조회
          const current = await fetchRecentPage();
          setDoc(current);
          setCurrentDoc(current);
        }
        setExists(true);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            setExists(false);
          } else {
            console.error(error);
            alert("페이지 로드 중 오류가 발생했습니다.");
          }
        } else {
          console.error(error);
          alert("페이지 로드 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [title, revision_id, fetchRecentPage, fetchRevision]);

  if (loading) {
    return <p>로딩 중…</p>;
  }

  return (
    <main className="size-full">
      <div className="flex justify-between items-center">
        <h1 className="font-36-700">
          {title} {revision_id && doc && `(v${doc?.meta?.current_rev_number})`}
        </h1>
        {exists && (
          <button
            className="w-[74px] h-[36px] font-15-400 rounded-[6px] border-1 border-[#CCC] bg-white cursor-pointer"
            // 편집 버튼도 제목을 넘겨서 이동
            onClick={() => navigate(`/edit/${encodeURI(title || "")}`)}
          >
            편집
          </button>
        )}
      </div>

      {exists ? (
        <>
          <p className="mt-[8px] mb-[24px] font-14-400 text-[#212529BF]">
            최근 수정 시각:{" "}
            {doc?.meta?.updated_at
              ? format(parseISO(doc?.meta?.updated_at), "yyyy-MM-dd HH:mm:ss")
              : "알 수 없음"}
          </p>
          {revision_id && doc && currentDoc && showDiff && (
            <section className="flex flex-col gap-2 p-[12px] mb-[16px] rounded-[6px] border-1 border-[#EEE] bg-[#FAFAFA]">
              <div className="flex items-center gap-2 font-14-600">
                <span>비교 대상:</span>
                <select
                  className="px-2 py-1 border-1 border-[#CCC] rounded-[6px]"
                  value={leftRev === "current" ? "current" : String(leftRev)}
                  onChange={(e) => handleSelectLeft(e.target.value)}
                >
                  {(() => {
                    const currentNum =
                      currentDoc?.meta?.current_rev_number ||
                      doc?.meta?.current_rev_number ||
                      1;
                    const maxNum = currentNum;
                    return [
                      <option
                        key="current"
                        value="current"
                      >{`현재(v${currentNum})`}</option>,
                      ...Array.from({ length: maxNum }, (_, i) => maxNum - i)
                        .filter((n) => n !== currentNum)
                        .map((n) => (
                          <option key={n} value={n}>{`v${n}`}</option>
                        )),
                    ];
                  })()}
                </select>
                <span>↔</span>
                <select
                  className="px-2 py-1 border-1 border-[#CCC] rounded-[6px]"
                  value={rightRev === "current" ? "current" : String(rightRev)}
                  onChange={(e) => handleSelectRight(e.target.value)}
                >
                  {(() => {
                    const currentNum =
                      currentDoc?.meta?.current_rev_number ||
                      doc?.meta?.current_rev_number ||
                      1;
                    const maxNum = currentNum;
                    return [
                      <option
                        key="current"
                        value="current"
                      >{`현재(v${currentNum})`}</option>,
                      ...Array.from({ length: maxNum }, (_, i) => maxNum - i)
                        .filter((n) => n !== currentNum)
                        .map((n) => (
                          <option key={n} value={n}>{`v${n}`}</option>
                        )),
                    ];
                  })()}
                </select>
              </div>
              {/* <div className="flex items-center gap-2">
                <label className="font-14-400">보기 방식</label>
                <select
                  className="px-2 py-1 border-1 border-[#CCC] rounded-[6px]"
                  value={diffVariant}
                  onChange={(e) =>
                    setDiffVariant(
                      (e.target.value as "inline" | "split") || "inline"
                    )
                  }
                >
                  <option value="inline">인라인</option>
                  <option value="split">양쪽</option>
                </select>
              </div> */}

              <div className="mt-2">
                <DiffViewer
                  leftTitle={
                    leftRev === "current"
                      ? `현재(v${
                          currentDoc?.meta?.current_rev_number ||
                          doc?.meta?.current_rev_number ||
                          1
                        })`
                      : `v${leftRev}`
                  }
                  rightTitle={
                    rightRev === "current"
                      ? `현재(v${
                          currentDoc?.meta?.current_rev_number ||
                          doc?.meta?.current_rev_number ||
                          1
                        })`
                      : `v${rightRev}`
                  }
                  // variant={diffVariant}
                  ops={serverOps ?? undefined}
                />
              </div>
            </section>
          )}
          <section className="flex flex-col gap-[17px] mb-[14.4px]">
            <div className="flex items-center pl-[8px] w-full h-[23px] rounded-[6px] border-1 border-[#CCC] font-14-400">
              분류:&nbsp;
              {doc?.meta?.categories?.map((category, i) => (
                <span
                  key={category.name}
                  className="text-[var(--blue)] font-14-400"
                  style={{
                    marginRight:
                      i < (doc?.meta?.categories?.length ?? 0) - 1 ? 8 : 0,
                  }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          </section>

          <ParentLink />

          {/* 실제 내용 렌더러에 doc.content 전달 (Diff 보기 중에는 원문도 함께 볼 수 있도록 유지) */}
          {!doc ? null : (
            <WikiViewer initialContent={doc.content?.content || []} />
          )}
        </>
      ) : (
        <div className="mt-8">
          <p>"{title}" 페이지가 존재하지 않습니다.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
            onClick={() => navigate(`/edit/${encodeURI(title || "")}`)}
          >
            새 문서 생성
          </button>
        </div>
      )}
    </main>
  );
};

export default WikiPage;
