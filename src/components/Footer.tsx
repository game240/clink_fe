import ic_gray_logo from "../assets/footer/ic_gray_logo.svg";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center gap-[15px] py-[40px] w-full h-[274px] bg-gray-00">
      <img src={ic_gray_logo} alt="" />
      <div className="flex flex-col gap-[30px]">
        <p className="text-text-md-m text-gray-03 text-center">
          경험과 운영을 하나로, <br />
          동아리 운영의 새로운 길
        </p>

        <div className="flex items-center gap-[40px]">
          <button className="text-text-sm-m text-gray-03">
            서비스 이용 가이드
          </button>
          <div className="w-[1px] h-[12px] bg-neutral-gray-06"></div>
          <button className="text-text-sm-m text-gray-03">이용약관</button>
          <div className="w-[1px] h-[12px] bg-neutral-gray-06"></div>
          <button className="text-text-sm-m text-gray-03">
            개인정보 처리방침
          </button>
        </div>

        <div className="flex flex-col gap-[4px] text-center">
          <p className="text-text-sm-m text-gray-03">
            마케팅 제휴 문의: cjh64866@naver.com
          </p>
          <p className="text-text-sm-m text-gray-03">ⓒ 2025 CLINK.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
