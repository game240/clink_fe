import { Outlet, useSearchParams } from "react-router-dom";
import PageBlock from "../components/PageBlock";
import RightPageBlockContent from "../components/RightPageBlockContent";
import AsideLayoutTopNav from "../components/aside/AsideLayoutTopNav";
import type React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../apis/axiosClient";

interface PageLayoutV2Props {
  TopItem: React.FC;
}

const PageLayoutV2 = ({ TopItem }: PageLayoutV2Props) => {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  const [clubName, setClubName] = useState<string>("");

  useEffect(() => {
    const fetchClubInfo = async () => {
      const { data } = await axiosClient.get(`/club/info?clubId=${clubId}`);
      setClubName(data.name);
    };
    fetchClubInfo();
  }, [clubId]);

  return (
    <section className="mx-auto w-[75.833333333333333333333333333333%]">
      <div className="px-[10px]">
        <AsideLayoutTopNav clubName={clubName} />
        <TopItem />
      </div>
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

export default PageLayoutV2;
