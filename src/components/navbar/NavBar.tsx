import { useNavigate, useLocation } from "react-router-dom";
import ic_clink from "../../assets/ic_clink.svg";
import { useEffect, useRef, useState } from "react";
// import axiosClient from "../../apis/axiosClient";
import ic_notification from "../../assets/navbar/ic_notification.svg";
import ic_circle_user from "../../assets/navbar/ic_circle_user.svg";
import ic_logout from "../../assets/navbar/ic_logout.svg";
// import ic_search from "../../assets/navbar/ic_search.svg";
import ic_login from "../../assets/navbar/ic_login.svg";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useAuth } from "../../contexts/AuthContext";
import { twMerge } from "tailwind-merge";
import { supabase } from "../../libs/supabaseClient";
import NoticeItem from "./NoticeItem";
import axiosClient from "../../apis/axiosClient";

export interface Notice {
  id: string;
  clubId: string;
  clubName: string;
  invitedAt: string;
}

const NavBar = () => {
  // const [searchValue, setSearchValue] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 검색
  // const [suggestions, setSuggestions] = useState<string[]>([]);
  // const [showSuggestions, setShowSuggestions] = useState(false);
  // const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);
  const noticeBtnRef = useRef<HTMLButtonElement>(null);
  const { isOutside: isNoticeOutside } = useOutsideClick({
    ref: noticeRef,
    additionalRefs: [noticeBtnRef],
  });

  useEffect(() => {
    if (isNoticeOutside) {
      setIsNoticeOpen(false);
    }
  }, [isNoticeOutside]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await axiosClient.get("/club/invitations");
        setNotices(data);
      } catch (error) {
        console.error("GET /api/club/invitations Error:", error);
      }
    };
    fetchNotices();
  }, []);

  const handleInvitation = async (invitationId: string, action: "accept" | "reject") => {
    try {
      setNotices((prev) => prev.filter((notice) => notice.id !== invitationId));
      await axiosClient.patch(`/club/invitations/${invitationId}`, { action });
    } catch (error) {
      console.error("PATCH /api/club/invitations/:invitationId Error:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/signin");
  };

  const isSelectedClassName = "text-primary-04 underline underline-offset-[9px] decoration-[3px]";
  const hoverClassName =
    "hover:text-primary-04 hover:underline hover:underline-offset-[9px] hover:decoration-[3px]";

  return (
    <nav className="flex justify-between items-center px-[12.083333333333333333333333333333%] w-full h-[84px] bg-white border-b border-gray-01">
      <section className="flex items-center gap-[80px]">
        <button
          className="cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <img className="w-[112px]" src={ic_clink} alt="clink" />
        </button>
        <div className="flex items-center gap-[51px]">
          <button
            className="flex items-center gap-[7px] cursor-pointer"
            onClick={() => {
              navigate("/my-clubs");
            }}
          >
            <p
              className={twMerge(
                "typo-head-sm-b",
                location.pathname === "/my-clubs" ? isSelectedClassName : "",
                hoverClassName
              )}
            >
              나의 동아리
            </p>
          </button>
          <button
            className="flex items-center gap-[7px] cursor-pointer"
            onClick={() => {
              navigate("/create");
            }}
          >
            <p
              className={twMerge(
                "typo-head-sm-b",
                location.pathname === "/create" ? isSelectedClassName : "",
                hoverClassName
              )}
            >
              동아리 만들기
            </p>
          </button>
          <button className="flex items-center gap-[7px] cursor-pointer">
            <p className={twMerge("typo-head-sm-b", hoverClassName)}>동아리 검색</p>
          </button>
        </div>
      </section>

      <section className="flex relative">
        <div className="flex items-center gap-[20px] relative mr-[88px]">
          {/* <div className="flex gap-[15px] px-[24px] py-[11px] w-[588px] h-[46px] rounded-[30px] border-[1px] border-gray-01 bg-card">
            <img src={ic_search} alt="" />
            <input
              className="flex flex-1 text-text-md-r placeholder:text-gray-04 focus:outline-none"
              placeholder="페이지, 게시글 검색"
              value={searchValue}
              onBlur={handleInputBlur}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                const q = e.target.value;
                setSearchValue(q);
                if (!q.trim()) {
                  setSuggestions([]);
                }
              }}
            ></input>
            {showSuggestions && suggestions.length > 0 && (
              <ul
                className="absolute top-full left-0 mt-1 w-[217px] bg-white border border-[#ccc] rounded-[6px] shadow-lg z-10"
                ref={suggRef}
              >
                {suggestions.map((title, idx) => (
                  <li
                    key={idx}
                    tabIndex={0}
                    className="px-[12px] py-[8px] cursor-pointer hover:bg-gray-100"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigate(`/page/${encodeURI(title)}`);
                      setSearchValue("");
                      setSuggestions([]);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        navigate(`/page/${encodeURI(title)}`);
                        setSearchValue("");
                        setSuggestions([]);
                      }
                    }}
                  >
                    {title}
                  </li>
                ))}
              </ul>
            )}
          </div> */}
        </div>

        <div className="flex items-center gap-[35px]">
          <button
            className={twMerge("relative cursor-pointer", !user && "opacity-0")}
            ref={noticeBtnRef}
            onClick={() => {
              setIsNoticeOpen(!isNoticeOpen);
            }}
          >
            <img src={ic_notification} alt="" />
            {notices.length > 0 && (
              <span className="absolute top-0 right-0 w-[8px] h-[8px] bg-[#FF383C] rounded-full" />
            )}
          </button>
          <button className={twMerge("cursor-pointer", !user && "opacity-0")}>
            <img src={ic_circle_user} alt="" />
          </button>
          {user ? (
            <button className="cursor-pointer" onClick={handleLogout}>
              <img src={ic_logout} alt="" />
            </button>
          ) : (
            <button className="cursor-pointer" onClick={handleLogin}>
              <img src={ic_login} alt="" />
            </button>
          )}
        </div>
        {isNoticeOpen && (
          <div
            className="absolute top-0 right-[78px] translate-y-[46px] flex flex-col gap-[20px] p-[25px] w-[473px] bg-white rounded-[12px] z-10"
            ref={noticeRef}
          >
            <p className="text-title-md-b text-gray-07">알림</p>
            {notices.length > 0 ? (
              notices.map((notice) => (
                <NoticeItem
                  key={notice.clubId}
                  notice={notice}
                  onAccept={() => handleInvitation(notice.id, "accept")}
                  onReject={() => handleInvitation(notice.id, "reject")}
                />
              ))
            ) : (
              <p className="text-text-md-m text-gray-07">알림이 없습니다.</p>
            )}
          </div>
        )}
      </section>
    </nav>
  );
};

export default NavBar;
