import landingVideo from "../assets/videos/landing.mp4";
import ClubStartBlock from "../components/landing/ClubStartBlock";
import pencil from "../assets/landing/pencil.png";
import magnifier from "../assets/landing/magnifier.png";
import { useEffect, useState } from "react";
import axiosClient from "../apis/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { ClubResponse } from "../types/landing/club";
import MyClubsList from "../components/landing/MyClubsList";

const Landing = () => {
  const [clubList, setCLubList] = useState<ClubResponse[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const { data } = await axiosClient.get("/club");
        setCLubList(data);
      };
      fetchData();
    } catch (error) {
      console.error("GET /api/club Error:", error);
    }
  }, [user]);

  return (
    <main className="flex flex-col gap-[70px] pb-[100px]">
      <video src={landingVideo} autoPlay loop muted className="w-full h-[720px] object-cover" />

      <section className="flex flex-col gap-[70px] px-[12.083333333333333333333333333333%]">
        <MyClubsList clubList={clubList}>나의 동아리 바로가기</MyClubsList>

        <section className="flex flex-col gap-[50px]">
          <h1 className="text-head-lg-b text-gray-08">동아리 활동을 시작하는 두 가지 방법</h1>
          <div className="flex justify-between">
            <ClubStartBlock
              className="bg-primary-02"
              title="동아리 생성"
              description="새로운 동아리를 만들고 싶다면?"
              src={pencil}
              onClick={() => {
                navigate("/create");
              }}
            />
            <ClubStartBlock
              className="bg-secondary-02"
              title="동아리 가입"
              description="함께할 동아리를 찾고 있다면?"
              src={magnifier}
              onClick={() => {}}
            />
          </div>
        </section>
      </section>
    </main>
  );
};

export default Landing;
