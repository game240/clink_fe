import rightArrow from "../assets/ic_right.svg";
import { useEffect, useState } from "react";
import axiosClient from "../apis/axiosClient";
import { useLocation, useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";

interface RecentChangedPage {
  page_id: string;
  title: string;
  updated_at: string;
}

const RightPageBlockContent = () => {
  const [recentChangedPages, setRecentChangedPages] = useState<
    RecentChangedPage[]
  >([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchRecentChange = async () => {
      const { data } = await axiosClient.get("/recent-change/pages");
      setRecentChangedPages(data.items);
    };
    fetchRecentChange();
  }, [location.pathname]);

  return (
    <section className="w-full h-full">
      <div className="flex justify-between items-center mb-[22px] w-full">
        <p className="font-18-600">최근 변경</p>
        <button
          className="cursor-pointer"
          onClick={() => navigate("/recent-change")}
        >
          <img
            className="w-[10px] h-[17px]"
            src={rightArrow}
            alt="rightArrow"
          />
        </button>
      </div>
      <ul className="flex flex-col gap-[8px]">
        {recentChangedPages.map((page) => (
          <div
            key={page.page_id}
            className="flex justify-between items-center w-full"
          >
            <li
              className="font-15-400 break-words text-[var(--blue)] cursor-pointer hover:text-[#0263b8] hover:underline line-clamp-1"
              onClick={() => navigate(`/page/${encodeURI(page.title)}`)}
            >
              {page.title}
            </li>
            <p className="font-12-400 whitespace-nowrap">
              {timeAgo(page.updated_at)}
            </p>
          </div>
        ))}
      </ul>
    </section>
  );
};

export default RightPageBlockContent;
