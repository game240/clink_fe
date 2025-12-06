import { timeAgo } from "../../utils/timeAgo";
import type { Notice } from "./NavBar";

interface NoticeItemProps {
  notice: Notice;
  onAccept: () => void;
  onReject: () => void;
}

const NoticeItem = ({ notice, onAccept, onReject }: NoticeItemProps) => {
  return (
    <div className="flex flex-col gap-[7px]">
      <p className="text-text-sm-m text-gray-04">{timeAgo(notice.invitedAt)}</p>
      <div className="flex gap-[25px]">
        <p className="max-w-[258px] text-text-md-m text-gray-07">
          {notice.clubName}에서 멤버로 초대했습니다. 수락하시겠습니까?
        </p>
        <div className="flex items-center gap-[8px]">
          <button
            className="w-[66px] h-[34px] bg-gray-00 rounded-[12px] text-text-sm-m text-gray-04 cursor-pointer"
            onClick={onReject}
          >
            삭제
          </button>
          <button
            className="w-[66px] h-[34px] bg-primary-04 rounded-[12px] text-text-sm-m text-white cursor-pointer"
            onClick={onAccept}
          >
            수락
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeItem;
