import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../libs/supabaseClient";
import logo from "./../assets/logo.svg";
import human from "./../assets/human.svg";
import search from "./../assets/navbar/ic_search.svg";
import rightArrow from "./../assets/navbar/ic_right_arrow.svg";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../apis/axiosClient";
import useOutsideClick from "../hooks/useOutsideClick";

const NavBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // 검색
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 로그인
  const userRef = useRef(null);
  const { isOutside } = useOutsideClick({ ref: userRef });

  const fetchSuggestions = async (q: string) => {
    if (!q) {
      return setSuggestions([]);
    }

    try {
      const { data } = await axiosClient.get("/search-autocomplete", {
        params: { q },
      });
      setSuggestions(data);
    } catch (error) {
      console.error("Autocomplete axios error:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchValue.trim());
    }, 200);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue]);

  useEffect(() => {
    setShowSuggestions(true);
  }, [suggestions]);

  // 연관검색어 리스트 ref
  const suggRef = useRef<HTMLUListElement>(null);

  // onBlur 시, 다음 포커스 대상이 리스트 내부면 닫지 않도록
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const next = e.relatedTarget as HTMLElement | null;
    if (next && suggRef.current?.contains(next)) {
      return;
    }
    setShowSuggestions(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/signin");
  };

  useEffect(() => {
    if (isOutside) {
      setOpenDialog(false);
    }
  }, [isOutside]);

  return (
    <nav
      className="flex justify-between items-center pl-[13.802083333333333333333333333333%] pr-[13.541666666666666666666666666667%] w-full h-[56px]"
      style={{
        background:
          "linear-gradient(90deg, #6A39C0 0%, #6A39C0 50%, #3C6FE5 100%)",
      }}
    >
      <div
        className="flex items-center gap-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="logo" />
        <h1 className="text-white font-25-700">포도위키</h1>
      </div>

      <div className="flex items-center gap-[20px] relative">
        <div className="flex justify-between px-[12px] py-[11px] w-[217px] h-[40px] rounded-[6px] border-[1px] border-[#ccc] bg-[#fff]">
          <input
            className="w-[159px] font-15-400 focus:outline-none"
            placeholder="여기에서 검색"
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
          <div className="flex items-center gap-[8px]">
            <button
              className="size-[15px] cursor-pointer"
              onClick={() => navigate(`/search?query=${searchValue}`)}
            >
              <img className="size-[15px]" src={search} alt="" />
            </button>
            <button
              className="w-[11px] h-[10px] cursor-pointer"
              onClick={() => navigate(`/page/${searchValue}`)}
            >
              <img className="w-[11px] h-[10px]" src={rightArrow} alt="" />
            </button>
          </div>
        </div>

        {user ? (
          <div className="relative" ref={userRef}>
            <button
              onClick={() => {
                setOpenDialog(true);
              }}
              className="flex justify-center items-center w-[98px] h-[40px] rounded-[6px] border-1 border-[#CCC] bg-white cursor-pointer font-15-400"
            >
              <img src={human} alt="human" className="size-[16px]" />
            </button>
            {openDialog && (
              <div className="absolute right-0 w-[217px]  py-[8px] rounded-[6px] border-1 border-[#CCC] bg-white">
                <div className="flex flex-col gap-[6px] px-[20px]">
                  <p className="font-12-400">이메일</p>
                  <p className="font-18-500">{user.nickname}</p>
                </div>
                <hr className="my-[8px] border-[#CCC]" />
                <div className="flex flex-col gap-[8px] px-[20px]">
                  <button className="font-15-500 text-start cursor-pointer">
                    이름 변경
                  </button>
                  <button
                    onClick={handleLogout}
                    className="font-15-500 text-start cursor-pointer"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="w-[98px] h-[40px] rounded-[6px] border-1 border-[#CCC] bg-white cursor-pointer font-15-400"
          >
            로그인
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
