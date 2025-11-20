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
      <div className="flex flex-col justify-center items-center gap-[25px] w-full h-[240px] bg-primary-01">
        <h1 className="text-[32px] font-bold text-gray-08">나의 동아리</h1>
        <p className="text-text-lg-m text-gray-07">
          현재 가입 중인 동아리 목록입니다.
        </p>
      </div>
      <section className="flex flex-col gap-[70px] pt-[70px] pb-[100px] px-[12.083333333333333333333333333333%]">
        <MyClubsList clubList={clubList} />
      </section>
    </main>
  );
};

export default MyClubs;
