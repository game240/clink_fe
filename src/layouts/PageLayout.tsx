import { Outlet } from "react-router-dom";
import PageBlock from "../components/PageBlock";
import RightPageBlockContent from "../components/RightPageBlockContent";

const PageLayout = () => {
  return (
    <main className="flex justify-center gap-[20px] pt-[20px]">
      <PageBlock className="mb-[200px] w-[54.427083333333333333333333333333%] min-h-[984px] p-[24px]">
        <Outlet />
      </PageBlock>
      <PageBlock className="w-[17.447916666666666666666666666667%] h-[350px] p-[20px]">
        <RightPageBlockContent />
      </PageBlock>
    </main>
  );
};

export default PageLayout;
