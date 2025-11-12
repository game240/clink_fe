import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const DefaultLayout = () => {
  return (
    <main className="w-screen min-h-screen mx-auto bg-[#F5F5F5]">
      <NavBar />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </main>
  );
};

export default DefaultLayout;
