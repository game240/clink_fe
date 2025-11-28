import { useState, useEffect } from "react";

import PaginationBar from "../../components/pagination/PaginationBar";
import NewPageDialog from "../../components/club/archive/NewPageDialog";
import axiosClient from "../../apis/axiosClient";
import { useSearchParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";

interface ClubArchiveList {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  club_id: string;
  is_public: boolean;
  is_knowhow: boolean;
}

interface ClubArchiveListsResponse {
  knowhow: ClubArchiveList[];
  work: ClubArchiveList[];
  stats: {
    knowhowTotal: number;
    workTotal: number;
    total: number;
    pageSize: number;
    knowhowTotalPages: number;
    workTotalPages: number;
  };
}

const ClubArchive = () => {
  const [knowhowWikiList, setKnowhowWikiList] = useState<ClubArchiveList[]>([]);
  const [workWikiList, setWorkWikiList] = useState<ClubArchiveList[]>([]);

  const [currentKnowhowPage, setCurrentKnowhowPage] = useState(1);
  const [knowhowTotal, setKnowhowTotal] = useState(1);
  const [knowhowTotalPages, setKnowhowTotalPages] = useState(1);
  const [currentWorkPage, setCurrentWorkPage] = useState(1);
  const [workTotal, setWorkTotal] = useState(1);
  const [workTotalPages, setWorkTotalPages] = useState(1);

  const pageSize = 5;

  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get<ClubArchiveListsResponse>(
          "/page/club/summary",
          {
            params: { clubId },
          }
        );
        setKnowhowWikiList(data.knowhow);
        setWorkWikiList(data.work);
        setKnowhowTotal(data.stats.knowhowTotal);
        setWorkTotal(data.stats.workTotal);
        setKnowhowTotalPages(data.stats.knowhowTotalPages);
        setWorkTotalPages(data.stats.workTotalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [clubId]);

  const pagedKnowhowList = knowhowWikiList.slice(
    (currentKnowhowPage - 1) * pageSize,
    currentKnowhowPage * pageSize
  );

  const pagedWorkList = workWikiList.slice(
    (currentWorkPage - 1) * pageSize,
    currentWorkPage * pageSize
  );

  // 페이지 작성
  const [openNewKnowhow, setOpenNewKnowhow] = useState(false);
  const [openNewWork, setOpenNewWork] = useState(false);

  return (
    <main className="flex flex-col gap-[70px] pb-[46px] w-full h-full">
      <section className="flex flex-col gap-[40px] w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col gap-[16px]">
            <h1 className="typo-head-md-b text-gray-09">노하우 위키</h1>
            <p className="typo-title-md-m text-gray-05">
              글 작성 시 운영진/전체 공개 설정이 가능합니다.
            </p>
          </div>
          <button
            className="w-[140px] h-[60px] rounded-[12px] bg-primary-04 typo-title-md-b text-white cursor-pointer"
            onClick={() => setOpenNewKnowhow(true)}
          >
            글쓰기
          </button>
        </div>

        <NewPageDialog
          open={openNewKnowhow}
          setOpen={setOpenNewKnowhow}
          wikiType="knowhow"
        />

        <div className="flex flex-col gap-[26px]">
          <section className="pt-[20px] px-[20px] w-full h-[398px] rounded-[20px] border border-gray-01">
            <div className="grid grid-cols-[70px_1fr_100px_214px] gap-x-[50px] items-center justify-items-center flex-1 h-[58px] rounded-[12px] bg-card-2">
              <p className="typo-text-lg-b text-gray-07">No.</p>
              <p className="typo-text-lg-b text-gray-07">제목</p>
              <p className="typo-text-lg-b text-gray-07">작성일</p>
              <p className="typo-text-lg-b text-gray-07">수정시각</p>
            </div>
            {pagedKnowhowList.map((item, index) => (
              <>
                <section className="grid grid-cols-[70px_1fr_100px_214px] grid-rows-[62px] gap-x-[50px] items-center justify-items-center">
                  <p className="typo-text-lg-r text-gray-09">
                    {knowhowTotal -
                      ((currentKnowhowPage - 1) * pageSize + index)}
                  </p>
                  <Link
                    className="typo-text-lg-r text-gray-09 cursor-pointer hover:underline"
                    to={`/page/${item.title}?clubId=${clubId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </Link>
                  <p className="typo-text-lg-r text-gray-09">
                    {format(parseISO(item.created_at), "yyyy-MM-dd")}
                  </p>
                  <p className="typo-text-lg-r text-gray-09">
                    {format(parseISO(item.updated_at), "yyyy-MM-dd HH:mm:ss")}
                  </p>
                </section>
                <div className="flex-1 h-[1px] bg-gray-00" />
              </>
            ))}
          </section>
          <PaginationBar
            currentPage={currentKnowhowPage}
            setCurrentPage={setCurrentKnowhowPage}
            totalPages={knowhowTotalPages}
          />
        </div>
      </section>

      <section className="flex flex-col gap-[40px] w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col gap-[16px]">
            <h1 className="typo-head-md-b text-gray-09">업무별 위키</h1>
            <p className="typo-title-md-m text-gray-05">
              글 작성 시 운영진만 볼 수 있습니다.
            </p>
          </div>
          <button
            className="w-[140px] h-[60px] rounded-[12px] bg-primary-04 typo-title-md-b text-white cursor-pointer"
            onClick={() => setOpenNewWork(true)}
          >
            글쓰기
          </button>
        </div>

        <NewPageDialog
          open={openNewWork}
          setOpen={setOpenNewWork}
          wikiType="work"
        />

        <div className="flex flex-col gap-[26px]">
          <section className="pt-[20px] px-[20px] w-full h-[398px] rounded-[20px] border border-gray-01">
            <div className="grid grid-cols-[70px_1fr_100px_214px] gap-x-[50px] items-center justify-items-center flex-1 h-[58px] rounded-[12px] bg-card-2">
              <p className="typo-text-lg-b text-gray-07">No.</p>
              <p className="typo-text-lg-b text-gray-07">제목</p>
              <p className="typo-text-lg-b text-gray-07">작성일</p>
              <p className="typo-text-lg-b text-gray-07">수정시각</p>
            </div>
            {pagedWorkList.map((item, index) => (
              <>
                <section className="grid grid-cols-[70px_1fr_100px_214px] grid-rows-[62px] gap-x-[50px] items-center justify-items-center">
                  <p className="typo-text-lg-r text-gray-09">
                    {workTotal - ((currentWorkPage - 1) * pageSize + index)}
                  </p>
                  <Link
                    className="typo-text-lg-r text-gray-09 cursor-pointer hover:underline"
                    to={`/page/${item.title}?clubId=${clubId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </Link>
                  <p className="typo-text-lg-r text-gray-09">
                    {format(parseISO(item.created_at), "yyyy-MM-dd")}
                  </p>
                  <p className="typo-text-lg-r text-gray-09">
                    {format(parseISO(item.updated_at), "yyyy-MM-dd HH:mm:ss")}
                  </p>
                </section>
                <div className="flex-1 h-[1px] bg-gray-00" />
              </>
            ))}
          </section>
          <PaginationBar
            currentPage={currentWorkPage}
            setCurrentPage={setCurrentWorkPage}
            totalPages={workTotalPages}
          />
        </div>
      </section>
    </main>
  );
};

export default ClubArchive;
