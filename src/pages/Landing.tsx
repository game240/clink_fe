import landingVideo from "../assets/videos/landing.mp4";
import ClubListItem from "../components/landing/ClubListItem";
import ClubStartBlock from "../components/landing/ClubStartBlock";
import pencil from "../assets/landing/pencil.png";
import magnifier from "../assets/landing/magnifier.png";

const Landing = () => {
  return (
    <main className="flex flex-col gap-[70px]">
      <video
        src={landingVideo}
        autoPlay
        loop
        muted
        className="w-full h-[720px] object-cover"
      />

      <section className="flex flex-col gap-[70px] px-[12.083333333333333333333333333333%]">
        <section className="flex flex-col gap-[50px]">
          <h1 className="text-head-lg-b text-gray-08">
            내가 속한 동아리 바로가기
          </h1>
          <section className="grid grid-cols-4 gap-x-[32px] gap-y-[50px]">
            <ClubListItem
              name="광운대학교 산악부"
              location="광운대학교"
              members={100}
              description='"자연 속에서 함께 오르는 즐거움을 선사해드립니다!"'
            />
            <ClubListItem
              name="광운대학교 산악부"
              location="광운대학교"
              members={100}
              description='"자연 속에서 함께 오르는 즐거움을 선사해드립니다!"'
            />
            <ClubListItem
              name="광운대학교 산악부"
              location="광운대학교"
              members={100}
              description='"자연 속에서 함께 오르는 즐거움을 선사해드립니다!"'
            />
            <ClubListItem
              name="광운대학교 산악부"
              location="광운대학교"
              members={100}
              description='"자연 속에서 함께 오르는 즐거움을 선사해드립니다!"'
            />
            <ClubListItem
              name="광운대학교 산악부"
              location="광운대학교"
              members={100}
              description='"자연 속에서 함께 오르는 즐거움을 선사해드립니다!"'
            />
          </section>
        </section>

        <section className="flex flex-col gap-[50px]">
          <h1 className="text-head-lg-b text-gray-08">
            동아리 활동을 시작하는 두 가지 방법
          </h1>
          <div className="flex justify-between">
            <ClubStartBlock
              className="bg-primary-02"
              title="동아리 생성"
              description="새로운 동아리를 만들고 싶다면?"
              src={pencil}
              onClick={() => {}}
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
