import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/Footer";

const PaddingLayout = () => {
  return (
    <main className="w-screen min-h-screen mx-auto">
      <NavBar />
      <ScrollToTop />
      <section className="px-[12.083333333333333333333333333333%] w-full">
        <Outlet />
      </section>
      <Footer />
    </main>
  );
};

export default PaddingLayout;
