import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/Footer";

const DefaultLayoutV2 = () => {
  return (
    <main className="w-screen min-h-screen mx-auto bg-white">
      <NavBar />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </main>
  );
};

export default DefaultLayoutV2;
