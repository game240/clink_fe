import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import WikiViewer from "../components/WikiViewer";
import type { JSONContent } from "@tiptap/react";
import axiosClient from "../apis/axiosClient";
import { parseISO, format } from "date-fns";
import ParentLink from "../components/ParentLink";

interface WikiDoc {
  meta: {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    author_id: string;
    current_rev: string;
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

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(true);
  const [doc, setDoc] = useState<WikiDoc | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      try {
        // 한글·공백 안전 인코딩
        const encoded = encodeURI(title || "");
        const { data } = await axiosClient.get(`/page?title=${encoded}`);
        setDoc(data);
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
  }, [title]);

  if (loading) {
    return <p>로딩 중…</p>;
  }

  return (
    <main className="size-full">
      <div className="flex justify-between items-center">
        <h1 className="font-36-700">{title}</h1>
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

          {/* 실제 내용 렌더러에 doc.content 전달 */}
          <WikiViewer initialContent={doc?.content?.content || []} />
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
