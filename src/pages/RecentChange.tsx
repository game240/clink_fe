import { useEffect, useState } from "react";
import axiosClient from "../apis/axiosClient";
import { timeAgo } from "../utils/timeAgo";
import { useNavigate } from "react-router-dom";

export interface Revision {
  revision_id: string;
  page_id: string;
  title: string;
  modifier: string;
  edited_at: string;
  rev_number: number;
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
}

interface Pagination {
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

const PAGE_SIZE = 15;

const RecentChange = () => {
  const [recentChange, setRecentChange] = useState<Revision[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    totalCount: 0,
    totalPages: 0,
    hasMore: true,
  });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPage(page);
  }, [page]);

  const fetchPage = async (pageNum: number) => {
    const { data } = await axiosClient.get("/recent-change", {
      params: {
        limit: PAGE_SIZE,
        offset: (pageNum - 1) * PAGE_SIZE, // 레코드 오프셋
      },
    });
    // setRecentChange((prev) => [...prev, ...changes]);
    // for avoid strict mode
    setRecentChange((prev) => {
      const merged = [...prev, ...data.changes];
      const seen = new Set<string>();
      return merged.filter((item) => {
        if (seen.has(item.revision_id)) return false;
        seen.add(item.revision_id);
        return true;
      });
    });
    setPagination(data.pagination);
  };

  const loadMore = () => {
    if (!pagination.hasMore) return;
    setPage((prev) => prev + 1);
  };

  return (
    <main className="flex flex-col size-full">
      <div className="flex justify-between items-center mb-[24px]">
        <h1 className="font-36-700">최근 변경내역</h1>
      </div>

      <div className="grid grid-cols-[1fr_13rem_13rem] pb-[8px] border-b-[1px] border-[#C9C9C9]">
        <p className="font-15-600">문서</p>
        <p className="font-15-600">수정자</p>
        <p className="font-15-600">수정 시간</p>
      </div>

      {recentChange.length === 0 ? (
        <p className="p-4 text-center text-gray-500">변경 내역이 없습니다.</p>
      ) : (
        recentChange.map((item) => (
          <div
            key={item.revision_id}
            className="grid grid-cols-[1fr_13rem_13rem] py-[12px] border-b-[1px] border-[#F0F0F0] hover:bg-[#FAFAFA]"
          >
            <div className="flex items-center gap-2">
              <span
                className="font-15-400 break-words text-[var(--blue)] cursor-pointer hover:text-[#0263b8] hover:underline"
                onClick={() => navigate(`/page/${encodeURI(item.title)}`)}
              >
                {item.title}
              </span>
              <div className="flex items-center gap-1 text-sm font-500">
                {item.addedCount > 0 && (
                  <span className="text-green-600">+{item.addedCount}</span>
                )}
                {item.removedCount > 0 && (
                  <span className="text-red-600">-{item.removedCount}</span>
                )}
              </div>
            </div>
            <p className="font-15-400">{item.modifier}</p>
            <p className="font-15-400">{timeAgo(item.edited_at)}</p>
          </div>
        ))
      )}

      {pagination.hasMore && (
        <div className="flex justify-center mt-[24px]">
          <button
            className="px-[16px] py-[8px] border-[1px] border-[#C9C9C9] rounded-[4px] font-15-600 cursor-pointer"
            onClick={loadMore}
          >
            더보기
          </button>
        </div>
      )}
    </main>
  );
};

export default RecentChange;
