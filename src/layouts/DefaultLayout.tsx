import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import NavBar from "../components/NavBar";

const DefaultLayout = () => {
  return (
    <main className="w-screen min-h-screen mx-auto bg-[#F5F5F5]">
      <NavBar />
      <ScrollToTop />
      <Outlet />
    </main>
  );
};

export default DefaultLayout;
