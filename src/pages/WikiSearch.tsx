import { useEffect, useState } from "react";
import axiosClient from "../apis/axiosClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import rightArrow from "../assets/ic_right.svg";
import pageIcon from "../assets/search/ic_page.svg";

interface SearchResult {
  revision_id: string;
  page_id: string;
  title: string;
  content: string;
  rank: number;
  total_count: number;
  snippet_title: string;
  snippet_body: string;
  plain_text: string;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const WikiSearch = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          page: String(page),
          pageSize: String(pageSize),
        });
        const { data } = await axiosClient.get(`/search?${params}`);
        setSearchResult(data.data);
        setPagination(data.pagination);
      } catch (error) {
        console.error(error);
        alert("검색 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query, page, pageSize]);

  if (loading) {
    return <p>로딩 중…</p>;
  }

  return (
    <main className="flex flex-col size-full gap-[24px]">
      <div className="flex justify-between items-center">
        <h1 className="font-36-700">검색</h1>
      </div>

      <div className="flex justify-between items-center p-[12px] w-full bg-[#F9F9F9] rounded-[0.25rem] border-1 border-[#C9C9C9]">
        <div className="flex items-center">
          <img className="w-[5.63px] h-[21.6px]" src={rightArrow} alt="" />
          &nbsp;
          <p className="font-15-400">
            찾는 문서가 없나요? 문서로 바로 갈 수 있습니다.
          </p>
        </div>
        <button
          className="px-[11.2px] py-[3.2px] border-[0.8px] border-[#CCC] bg-[#fff] font-15-500 cursor-pointer"
          onClick={() => navigate(`/page/${query}`)}
        >
          '{query}' 문서로 가기
        </button>
      </div>

      <p className="font-15-400 mb-[-10px]">전체 {pagination.total} 건</p>

      <hr className="border-[#C9C9C9]" />

      <section>
        {searchResult.map((item) => (
          <div key={item.page_id}>
            <div className="flex items-center gap-[4px] mb-[14.4px]">
              <div className="flex justify-center items-center size-[32px] rounded-full bg-[#555]">
                <img src={pageIcon} alt="" />
              </div>
              <p
                className="font-24-700 cursor-pointer"
                onClick={() => navigate(`/page/${encodeURI(item.title)}`)}
              >
                {item.title}
              </p>
            </div>
            <div className="flex">
              <p className="break-all line-clamp-3">
                {item.title}&nbsp;
                {Array.from(item.content.matchAll(/"text":"([^"]*)"/g)).map(
                  (m) => m[1]
                )}
              </p>
            </div>
            <hr className="mt-[17.6px] mb-[20.8px] border-[#C9C9C9]" />
          </div>
        ))}
      </section>
    </main>
  );
};

export default WikiSearch;
