import { format } from "date-fns";
import newIcon from "../assets/landing/ic_new.svg";
import groupIcon from "../assets/landing/ic_people.svg";
import questionIcon from "../assets/landing/ic_question.svg";

const Landing = () => {
  return (
    <main>
      <h1 className="font-36-700">포도위키:대문</h1>
      <p className="mt-[8px] mb-[24px] font-14-400 text-[#212529BF]">
        현재 시각:&nbsp;
        {format(new Date(), "yyyy-MM-dd HH:mm:ss")}
      </p>
      <section className="flex flex-col gap-[17px] mb-[14.4px]">
        <div className="flex items-center pl-[8px] w-full h-[23px] rounded-[6px] border-1 border-[#CCC] font-14-400">
          분류:&nbsp;
          <span className="text-[var(--blue)] font-14-400">포도위키</span>
        </div>
      </section>
      <hr className="border-[#CCC]" />

      <section className="flex flex-col items-center pb-[8px] mb-[8px] border-b-[1px] border-[#ccc]">
        <h3 className="mt-[8px] mb-[5px] font-21-700">
          연극인들의 <span className="text-[#6A39C0]">새로운 공간</span>
        </h3>
        <p className="font-15-400 mb-[15px]">
          포도위키에 오신 여러분을 환영합니다!
        </p>
        <p className="font-15-400 mb-[5px]">
          포도위키는 누구나 작성할 수 있는 공간입니다.
        </p>
        <p className="font-15-400">
          검증되지 않았거나 편향된 내용이 있을 수 있습니다.
        </p>
      </section>

      <div className="border-2 border-[#6A39C0] overflow-hidden">
        {/* 1st row */}
        <div className="flex items-center border-b border-[#6A39C0]">
          <div className="flex justify-center items-center w-[98px] h-[71px] bg-[#6A39C0]">
            <img
              src={newIcon}
              alt="new icon"
              className="w-[60px] h-[60px] flex-shrink-0"
            />
          </div>
          <div className="ml-[12px]">
            <p className="font-21-700">포도위키가 처음이신가요?</p>
            <p className="mt-1 font-15-400">
              먼저{" "}
              <a
                // href="/rules"
                className="text-[var(--blue)] hover:underline hover:text-[#0263b8]"
              >
                포도위키의 규정
              </a>
              과{" "}
              <a
                // href="/how-to-use"
                className="text-[var(--blue)] hover:underline hover:text-[#0263b8]"
              >
                포도위키의 사용 방법
              </a>
              을 확인해보세요.
            </p>
          </div>
        </div>

        {/* 2nd row */}
        <div className="flex items-center border-b border-[#6A39C0]">
          <div className="flex justify-center items-center w-[98px] h-[71px] bg-[#6A39C0]">
            <img
              src={groupIcon}
              alt="group icon"
              className="w-[60px] h-[60px] flex-shrink-0"
            />
          </div>
          <div className="ml-[12px]">
            <p className="font-21-700">연극 단체에 대해 알고 싶으신가요?</p>
            <p className="mt-1 font-15-400">
              활동 지역으로 구분된{" "}
              <a
                href="/organizations"
                className="text-[var(--blue)] hover:underline hover:text-[#0263b8]"
              >
                연극 단체
              </a>
              를 확인해보세요.
            </p>
          </div>
        </div>

        {/* 3rd row */}
        <div className="flex items-center border-b border-[#6A39C0]">
          <div className="flex justify-center items-center w-[98px] h-[71px] bg-[#6A39C0]">
            <img
              src={questionIcon}
              alt="question icon"
              className="w-[60px] h-[60px] flex-shrink-0"
            />
          </div>
          <div className="ml-[12px]">
            <p className="font-21-700">문의사항</p>
            <p className="mt-1 font-15-400">podostore1111@gmail.com</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;
