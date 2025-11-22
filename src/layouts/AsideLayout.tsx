import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/Footer";
import AsideBar from "../components/aside/AsideBar";
import AsideLayoutTopNav from "../components/aside/AsideLayoutTopNav";

const AsideLayout = () => {
  return (
    <main className="w-screen min-h-screen mx-auto">
      <NavBar />
      <ScrollToTop />
      <section className="flex gap-[32px] px-[12.083333333333333333333333333333%] w-full">
        <AsideBar />
        <section className="flex-1">
          <AsideLayoutTopNav />
          <Outlet />
        </section>
      </section>
      <Footer />
    </main>
  );
};

export default AsideLayout;
