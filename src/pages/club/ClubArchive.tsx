import { useSearchParams } from "react-router-dom";

import PaginationBar from "../../components/pagination/PaginationBar";

const ClubArchive = () => {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  void clubId;
  const nohowWikiList = [
    {
      no: 1,
      title: "제목제목",
      createdAt: "2025.01.01",
      updatedAt: "2025.01.01 00:00:00",
    },
    {
      no: 2,
      title: "제목제목",
      createdAt: "2025.01.01",
      updatedAt: "2025.01.01 00:00:00",
    },
    {
      no: 3,
      title: "제목제목",
      createdAt: "2025.01.01",
      updatedAt: "2025.01.01 00:00:00",
    },
    {
      no: 4,
      title: "제목제목",
      createdAt: "2025.01.01",
      updatedAt: "2025.01.01 00:00:00",
    },
    {
      no: 5,
      title: "제목제목",
      createdAt: "2025.01.01",
      updatedAt: "2025.01.01 00:00:00",
    },
  ];

  const workWikiList = nohowWikiList.slice(0, 3);

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
          <button className="w-[140px] h-[60px] rounded-[12px] bg-primary-04 typo-title-md-b text-white">
            글 작성
          </button>
        </div>

        <div className="flex flex-col gap-[26px]">
          <section className="pt-[20px] px-[20px] w-full h-[398px] rounded-[20px] border border-gray-01">
            <div className="grid grid-cols-[70px_1fr_100px_214px] gap-x-[50px] items-center justify-items-center flex-1 h-[58px] rounded-[12px] bg-card-2">
              <p className="typo-text-lg-b text-gray-07">No.</p>
              <p className="typo-text-lg-b text-gray-07">제목</p>
              <p className="typo-text-lg-b text-gray-07">작성일</p>
              <p className="typo-text-lg-b text-gray-07">수정시각</p>
            </div>
            {nohowWikiList.map((item) => (
              <>
                <section className="grid grid-cols-[70px_1fr_100px_214px] grid-rows-[62px] gap-x-[50px] items-center justify-items-center">
                  <p className="typo-text-lg-r text-gray-09">{item.no}</p>
                  <p className="typo-text-lg-r text-gray-09">{item.title}</p>
                  <p className="typo-text-lg-r text-gray-09">
                    {item.createdAt}
                  </p>
                  <p className="typo-text-lg-r text-gray-09">
                    {item.updatedAt}
                  </p>
                </section>
                <div className="flex-1 h-[1px] bg-gray-00" />
              </>
            ))}
          </section>
          <PaginationBar />
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
          <button className="w-[140px] h-[60px] rounded-[12px] bg-primary-04 typo-title-md-b text-white">
            글 작성
          </button>
        </div>

        <div className="flex flex-col gap-[26px]">
          <section className="pt-[20px] px-[20px] w-full h-[398px] rounded-[20px] border border-gray-01">
            <div className="grid grid-cols-[70px_1fr_100px_214px] gap-x-[50px] items-center justify-items-center flex-1 h-[58px] rounded-[12px] bg-card-2">
              <p className="typo-text-lg-b text-gray-07">No.</p>
              <p className="typo-text-lg-b text-gray-07">제목</p>
              <p className="typo-text-lg-b text-gray-07">작성일</p>
              <p className="typo-text-lg-b text-gray-07">수정시각</p>
            </div>
            {workWikiList.map((item) => (
              <>
                <section className="grid grid-cols-[70px_1fr_100px_214px] grid-rows-[62px] gap-x-[50px] items-center justify-items-center">
                  <p className="typo-text-lg-r text-gray-09">{item.no}</p>
                  <p className="typo-text-lg-r text-gray-09">{item.title}</p>
                  <p className="typo-text-lg-r text-gray-09">
                    {item.createdAt}
                  </p>
                  <p className="typo-text-lg-r text-gray-09">
                    {item.updatedAt}
                  </p>
                </section>
                <div className="flex-1 h-[1px] bg-gray-00" />
              </>
            ))}
          </section>
          <PaginationBar />
        </div>
      </section>
    </main>
  );
};

export default ClubArchive;
