import { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/Footer";
import AsideBar from "../components/aside/AsideBar";
import AsideLayoutTopNav from "../components/aside/AsideLayoutTopNav";
import axiosClient from "../apis/axiosClient";

const AsideLayout = () => {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  const [thumbnail, setThumbnail] = useState<string>("");
  const [clubName, setClubName] = useState<string>("");

  useEffect(() => {
    const fetchClubInfo = async () => {
      const { data } = await axiosClient.get(`/club/info?clubId=${clubId}`);
      setClubName(data.name);
      setThumbnail(data.thumbnailUrl);
    };
    fetchClubInfo();
  }, [clubId]);

  return (
    <main className="w-screen min-h-screen mx-auto">
      <NavBar />
      <ScrollToTop />
      <section className="flex gap-[32px] px-[12.083333333333333333333333333333%] w-full">
        <AsideBar thumbnail={thumbnail} clubName={clubName} />
        <section className="flex-1">
          <AsideLayoutTopNav clubName={clubName} />
          <Outlet />
        </section>
      </section>
      <Footer />
    </main>
  );
};

export default AsideLayout;
