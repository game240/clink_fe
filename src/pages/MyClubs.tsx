import { useEffect, useState } from "react";
import axiosClient from "../apis/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import type { ClubResponse } from "../types/landing/club";
import MyClubsList from "../components/landing/MyClubsList";

const MyClubs = () => {
  const [clubList, setCLubList] = useState<ClubResponse[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const { data } = await axiosClient.get("/club");
        console.log(data);
        setCLubList(data);
      };
      fetchData();
    } catch (error) {
      console.error("GET /api/club Error:", error);
    }
  }, [user]);

  return (
    <main>
      <div className="flex flex-col justify-center gap-[25px] px-[12.083333333333333333333333333333%] w-full h-[295px] bg-primary-04 text-white">
        <h1 className="text-[60px] font-bold">나의 동아리</h1>
        <p className="typo-head-lg-m">현재 가입 중인 동아리 목록입니다.</p>
      </div>
      <section className="flex flex-col gap-[70px] pt-[70px] pb-[100px] px-[12.083333333333333333333333333333%]">
        <MyClubsList clubList={clubList} />
      </section>
    </main>
  );
};

export default MyClubs;
