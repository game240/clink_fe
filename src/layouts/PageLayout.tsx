import { Outlet } from "react-router-dom";
import PageBlock from "../components/PageBlock";
import RightPageBlockContent from "../components/RightPageBlockContent";

const PageLayout = () => {
  return (
    <section className="mx-auto pt-[30px] w-[75.833333333333333333333333333333%]">
      <main className="flex justify-center gap-[20px]">
        <PageBlock className="flex-1 mb-[200px] min-h-[984px] p-[30px]">
          <Outlet />
        </PageBlock>
        <PageBlock className="w-[340px] h-[274px] p-[20px]">
          <RightPageBlockContent />
        </PageBlock>
      </main>
    </section>
  );
};

export default PageLayout;
