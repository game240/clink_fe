import rightArrow from "../assets/ic_right.svg";
import { useEffect, useState } from "react";
import axiosClient from "../apis/axiosClient";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";

interface RecentChangedPage {
  page_id: string;
  title: string;
  updated_at: string;
  is_knowhow: boolean;
}

const RightPageBlockContent = () => {
  const [recentChangedPages, setRecentChangedPages] = useState<
    RecentChangedPage[]
  >([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  useEffect(() => {
    const fetchRecentChange = async () => {
      const { data } = await axiosClient.get("/recent-change/pages", {
        params: {
          clubId,
        },
      });
      setRecentChangedPages(data.items.slice(0, 3));
    };
    fetchRecentChange();
  }, [location.pathname, clubId]);

  return (
    <section className="w-full h-full">
      <div className="flex justify-between items-center px-[15px] w-full h-[58px] bg-card-2 rounded-[12px]">
        <p className="typo-text-lg-b">최근 변경</p>
        <button
          className="cursor-pointer"
          onClick={() => navigate(`/recent-change?clubId=${clubId}`)}
        >
          <img
            className="w-[10px] h-[17px]"
            src={rightArrow}
            alt="rightArrow"
          />
        </button>
      </div>
      <ul className="flex flex-col">
        {recentChangedPages.map((page, index) => (
          <>
            <div
              key={page.page_id}
              className="flex justify-between items-center w-full"
            >
              <li
                className="py-[20px] typo-text-lg-m break-words text-primary-04 cursor-pointer hover:text-(--blue) hover:underline line-clamp-1"
                onClick={() =>
                  navigate(
                    `/page/${encodeURI(page.title)}?clubId=${clubId}&wikiType=${
                      page.is_knowhow ? "knowhow" : "work"
                    }`
                  )
                }
              >
                {page.title}
              </li>
              <p className="typo-text-lg-r whitespace-nowrap">
                {timeAgo(page.updated_at)}
              </p>
            </div>
            {index < recentChangedPages.length - 1 && (
              <div className="w-full h-[1px] bg-gray-00" />
            )}
          </>
        ))}
      </ul>
    </section>
  );
};

export default RightPageBlockContent;
